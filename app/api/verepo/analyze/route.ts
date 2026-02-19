// ========================================
// Verepo — API Route: POST /api/verepo/analyze
// ========================================

import { NextRequest, NextResponse } from "next/server";
import { validateRepoUrl, cloneAndExtract, extractRepoName, fetchLatestSha } from "@/lib/verepo/clone";
import { analyzeWithClaude } from "@/lib/verepo/analyze";
import { checkRateLimit, recordUsage } from "@/lib/verepo/rate-limit";
import { verifyWalletSignature } from "@/lib/verepo/verify-wallet";
import { prisma } from "@/lib/prisma";
import type { VerepoError } from "@/lib/verepo/types";

export const maxDuration = 120; // Allow up to 2 minutes for clone + analysis

function errorResponse(error: string, code: VerepoError["code"], status: number) {
    return NextResponse.json({ error, code } satisfies VerepoError, { status });
}

export async function POST(req: NextRequest) {
    try {
        // ── Parse body ──
        const body = await req.json().catch(() => null);
        if (!body || typeof body.repoUrl !== "string") {
            return errorResponse("Missing repoUrl in request body", "INVALID_URL", 400);
        }

        const repoUrl = body.repoUrl.trim();
        const wallet: string | undefined = typeof body.wallet === "string" && body.wallet.length > 0 ? body.wallet : undefined;

        // ── Wallet required ──
        if (!wallet) {
            return errorResponse("Wallet connection required to analyze repositories.", "RATE_LIMITED", 401);
        }

        // ── Verify wallet signature ──
        const signature: string | undefined = body.signature;
        const timestamp: number | undefined = body.timestamp;
        if (!signature || !timestamp) {
            return errorResponse("Wallet signature required.", "RATE_LIMITED", 401);
        }
        if (!verifyWalletSignature(wallet, signature, timestamp)) {
            return errorResponse("Invalid wallet signature.", "RATE_LIMITED", 401);
        }

        // ── Validate URL ──
        if (!validateRepoUrl(repoUrl)) {
            return errorResponse(
                "Invalid GitHub URL. Use format: https://github.com/owner/repo",
                "INVALID_URL",
                400
            );
        }

        // ── Check cache ──
        const repoKey = extractRepoName(repoUrl);
        const cached = await prisma.verepoResult.findUnique({ where: { repoKey } });

        if (cached) {
            if (cached.status === "done" && cached.result) {
                // Check if code has been updated since last analysis
                const latestSha = await fetchLatestSha(repoUrl);
                if (latestSha && cached.commitSha && latestSha === cached.commitSha) {
                    // Code unchanged — return cached result (no cost)
                    return NextResponse.json({
                        ...(cached.result as Record<string, unknown>),
                        cached: true,
                    });
                }
                if (!latestSha) {
                    // Can't fetch SHA (rate limit?) — return cached anyway
                    return NextResponse.json({
                        ...(cached.result as Record<string, unknown>),
                        cached: true,
                    });
                }
                // SHA changed — fall through to re-analyze
                console.log(`[verepo] SHA changed for ${repoKey}: ${cached.commitSha?.slice(0, 7)} → ${latestSha.slice(0, 7)}, re-analyzing`);
            }

            if (cached.status === "analyzing") {
                // Check if analyzing is stale (>10 min = zombie)
                const staleMs = 10 * 60 * 1000;
                const elapsed = Date.now() - new Date(cached.updatedAt).getTime();
                if (elapsed < staleMs) {
                    return NextResponse.json({
                        status: "analyzing",
                        message: "This repository is currently being analyzed. Please wait a moment.",
                        repoKey,
                    });
                }
                // Stale — fall through to re-analyze
                console.log(`[verepo] Stale analyzing record for ${repoKey} (${Math.round(elapsed / 1000)}s), re-analyzing`);
            }

            // status === "error" or stale "analyzing" — allow re-analysis (fall through)
        }

        // ── Rate limit (only for new analyses) ──
        const ip =
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown";

        const rateCheck = await checkRateLimit(ip, wallet);
        if (!rateCheck.allowed) {
            const resetMinutes = Math.ceil(rateCheck.resetIn / 60000);
            return errorResponse(
                rateCheck.reason || `Rate limit exceeded. Resets in ${resetMinutes} minute${resetMinutes === 1 ? "" : "s"} (KST 9:00 AM).`,
                "RATE_LIMITED",
                429
            );
        }

        // ── Mark as analyzing ──
        const repoKeyParts = repoKey.split("/");
        await prisma.verepoResult.upsert({
            where: { repoKey },
            update: { status: "analyzing", error: null, analyzedBy: wallet || `ip:${ip}`, updatedAt: new Date() },
            create: {
                repoUrl,
                repoOwner: repoKeyParts[0],
                repoName: repoKeyParts[1],
                repoKey,
                status: "analyzing",
                analyzedBy: wallet || `ip:${ip}`,
            },
        });

        // ── Mark as analyzing (usage recorded after success) ──

        // ── Clone & extract ──
        let cloneResult;
        try {
            cloneResult = await cloneAndExtract(repoUrl);
        } catch (err: unknown) {
            if (err instanceof Error && err.message.startsWith("TOO_LARGE")) {
                const actualLines = parseInt(err.message.split(":")[1]) || 0;
                await prisma.verepoResult.update({
                    where: { repoKey },
                    data: { status: "error", error: "TOO_LARGE", totalLines: actualLines },
                });
                return errorResponse(
                    `Repository has ${actualLines.toLocaleString()}+ lines of source code, exceeding the 25,000 line limit. Try a smaller repository.`,
                    "TOO_LARGE",
                    413
                );
            }
            if (err instanceof Error && err.message.startsWith("REPO_TOO_HEAVY")) {
                const sizeMB = parseInt(err.message.split(":")[1]) || 0;
                await prisma.verepoResult.update({
                    where: { repoKey },
                    data: { status: "error", error: "TOO_HEAVY" },
                });
                return errorResponse(
                    `Repository download is ${sizeMB}MB+, exceeding the 50MB limit. This usually means the repo contains large binary files. Verepo only analyzes source code repositories.`,
                    "TOO_LARGE",
                    413
                );
            }
            console.error("[verepo] Clone failed:", err);
            await prisma.verepoResult.update({
                where: { repoKey },
                data: { status: "error", error: "CLONE_FAILED" },
            });
            return errorResponse(
                "Failed to clone repository. Make sure the repo exists and is public.",
                "CLONE_FAILED",
                422
            );
        }

        // ── Check for source files ──
        if (cloneResult.files.length === 0) {
            await prisma.verepoResult.update({
                where: { repoKey },
                data: { status: "error", error: "NO_SOURCE" },
            });
            return errorResponse(
                "No source files found in this repository.",
                "NO_SOURCE",
                422
            );
        }

        // ── Analyze with Claude ──
        let result;
        try {
            result = await analyzeWithClaude(cloneResult.files, cloneResult.repoName);
        } catch (err) {
            console.error("[verepo] Analysis failed:", err);
            await prisma.verepoResult.update({
                where: { repoKey },
                data: { status: "error", error: "ANALYSIS_FAILED" },
            });
            return errorResponse(
                "Analysis failed. Please try again later.",
                "ANALYSIS_FAILED",
                500
            );
        }

        // ── Build response ──
        const responseData = {
            ...result,
            meta: {
                repoName: cloneResult.repoName,
                filesAnalyzed: cloneResult.files.length,
                totalLines: cloneResult.totalLines,
                analyzedAt: new Date().toISOString(),
                remaining: rateCheck.remaining - 1,
            },
        };

        // ── Save to cache ──
        await prisma.verepoResult.update({
            where: { repoKey },
            data: {
                status: "done",
                result: JSON.parse(JSON.stringify(responseData)),
                filesCount: cloneResult.files.length,
                totalLines: cloneResult.totalLines,
                commitSha: cloneResult.commitSha,
                tokenCount: cloneResult.tokenCount,
            },
        });

        // ── Record usage only on success ──
        await recordUsage(ip, wallet);

        return NextResponse.json(responseData);
    } catch (err) {
        console.error("[verepo] Unexpected error:", err);
        return errorResponse("Internal server error", "ANALYSIS_FAILED", 500);
    }
}

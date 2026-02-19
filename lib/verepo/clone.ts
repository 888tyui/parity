// ========================================
// Verepo — GitHub Tarball Download & Source Extraction
// ========================================

import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "stream/promises";
import { createGunzip } from "zlib";
import { extract as tarExtract } from "tar";
import type { CloneResult, SourceFile } from "./types";

const MAX_LINES = 25000;
const MAX_TARBALL_BYTES = 50 * 1024 * 1024; // 50MB tarball download limit
const MAX_TOKENS = 128_000; // ~128K token cap — prevents runaway costs (~$0.38 input max)

// Source file extensions to include
const SOURCE_EXTENSIONS = new Set([
    // Systems / blockchain
    ".rs", ".sol", ".move", ".go", ".c", ".cpp", ".h",
    // Web / app
    ".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".html",
    // Scripting
    ".py", ".rb", ".php", ".sh",
    // Data / config
    ".toml", ".json", ".yaml", ".yml", ".sql", ".proto",
    // JVM / mobile
    ".java", ".kt", ".swift",
    // Documentation
    ".md",
]);

// Skip these filenames regardless of extension
const SKIP_FILES = new Set([
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml",
    "composer.lock", "Cargo.lock", "Gemfile.lock",
    "poetry.lock", "go.sum",
]);

// Directories to skip
const SKIP_DIRS = new Set([
    "node_modules", ".git", "target", "dist", "build",
    ".next", "__pycache__", ".venv", "vendor",
    "pkg", "artifacts", ".turbo", "coverage",
]);

/**
 * Validate that the URL looks like a GitHub repo.
 */
export function validateRepoUrl(url: string): boolean {
    const pattern = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/?)$/;
    return pattern.test(url.trim());
}

/**
 * Extract repo name from URL (e.g. "owner/repo").
 */
export function extractRepoName(url: string): string {
    const clean = url.replace(/\/$/, "").replace(/\.git$/, "");
    const parts = clean.split("/");
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
}

/**
 * Extract owner/repo from GitHub URL.
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } {
    const clean = url.replace(/\/$/, "").replace(/\.git$/, "");
    const parts = clean.split("/");
    return { owner: parts[parts.length - 2], repo: parts[parts.length - 1] };
}

/**
 * Fetch latest HEAD commit SHA from GitHub API.
 * Returns null on failure (non-blocking — analysis proceeds without SHA).
 */
export async function fetchLatestSha(repoUrl: string): Promise<string | null> {
    try {
        const { owner, repo } = parseGitHubUrl(repoUrl);
        const headers: Record<string, string> = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Parity-Verepo/1.0",
        };
        const ghToken = process.env.GITHUB_TOKEN;
        if (ghToken) headers["Authorization"] = `Bearer ${ghToken}`;

        const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
            { headers }
        );
        if (!res.ok) return null;
        const commits = await res.json();
        return commits[0]?.sha ?? null;
    } catch {
        return null;
    }
}

/**
 * Rough token count estimate: ~4 chars per token for code.
 */
function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

/**
 * Download and extract a GitHub repo using tarball API.
 * No system git required.
 */
export async function cloneAndExtract(repoUrl: string): Promise<CloneResult> {
    const tmpDir = path.join(os.tmpdir(), `verepo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    try {
        const { owner, repo } = parseGitHubUrl(repoUrl);
        const tarballUrl = `https://api.github.com/repos/${owner}/${repo}/tarball`;

        console.log(`[verepo] Downloading tarball: ${tarballUrl}`);


        // Download tarball
        const headers: Record<string, string> = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "Parity-Verepo/1.0",
        };
        // Use GitHub token if available (60/hr → 5000/hr rate limit)
        const ghToken = process.env.GITHUB_TOKEN;
        if (ghToken) {
            headers["Authorization"] = `Bearer ${ghToken}`;
        }

        const res = await fetch(tarballUrl, {
            headers,
            redirect: "follow",
        });

        if (!res.ok || !res.body) {
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        // Layer 1: Check Content-Length header if available
        const contentLength = parseInt(res.headers.get("content-length") || "0");
        if (contentLength > MAX_TARBALL_BYTES) {
            throw new Error(`REPO_TOO_HEAVY:${Math.round(contentLength / 1024 / 1024)}`);
        }

        // Layer 2: Stream byte limiter (Content-Length isn't always accurate/present)
        let bytesReceived = 0;
        const limitedStream = new TransformStream({
            transform(chunk, controller) {
                bytesReceived += chunk.byteLength;
                if (bytesReceived > MAX_TARBALL_BYTES) {
                    controller.error(new Error(`REPO_TOO_HEAVY:${Math.round(bytesReceived / 1024 / 1024)}`));
                    return;
                }
                controller.enqueue(chunk);
            },
        });

        // Extract tarball to tmpDir
        // GitHub tarballs have a root dir like "owner-repo-sha/", we strip 1 level
        await pipeline(
            // @ts-expect-error — ReadableStream vs NodeJS.ReadableStream
            res.body.pipeThrough(limitedStream),
            createGunzip(),
            tarExtract({ cwd: tmpDir, strip: 1 }),
        );

        console.log(`[verepo] Extracted to ${tmpDir}`);

        // Walk directory and collect source files
        const files: SourceFile[] = [];
        let totalLines = 0;

        function walk(dir: string, relativeTo: string) {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (SKIP_DIRS.has(entry.name)) continue;
                if (SKIP_FILES.has(entry.name)) continue;

                const fullPath = path.join(dir, entry.name);
                const relPath = path.relative(relativeTo, fullPath).replace(/\\/g, "/");

                if (entry.isDirectory()) {
                    walk(fullPath, relativeTo);
                } else if (entry.isFile()) {
                    const ext = path.extname(entry.name).toLowerCase();
                    if (!SOURCE_EXTENSIONS.has(ext)) continue;

                    // Skip very large individual files (> 100KB)
                    const stat = fs.statSync(fullPath);
                    if (stat.size > 100 * 1024) continue;

                    const raw = fs.readFileSync(fullPath, "utf-8");

                    // Truncate long lines (>500 chars) — likely inline data/SVG/base64
                    const MAX_LINE_CHARS = 500;
                    const lines = raw.split("\n");
                    const processed = lines.map((line) => {
                        if (line.length > MAX_LINE_CHARS) {
                            return `${line.slice(0, MAX_LINE_CHARS)} /* [TRUNCATED: ${line.length.toLocaleString()} chars — inline data] */`;
                        }
                        return line;
                    });
                    const content = processed.join("\n");
                    const lineCount = lines.length;

                    totalLines += lineCount;
                    files.push({ path: relPath, content, lines: lineCount });

                    // Early exit if over limit
                    if (totalLines > MAX_LINES) {
                        throw new Error(`TOO_LARGE:${totalLines}`);
                    }
                }
            }
        }

        walk(tmpDir, tmpDir);

        // Estimate tokens from all file contents
        const allContent = files.map(f => `--- ${f.path} ---\n${f.content}`).join("\n");
        const tokenCount = estimateTokens(allContent);

        if (tokenCount > MAX_TOKENS) {
            throw new Error(`TOO_LARGE:${totalLines} (estimated ${Math.round(tokenCount / 1000)}K tokens)`);
        }

        // Fetch HEAD commit SHA
        const commitSha = await fetchLatestSha(repoUrl);

        return {
            files,
            totalLines,
            repoName: extractRepoName(repoUrl),
            commitSha,
            tokenCount,
        };
    } finally {
        // Clean up tmp directory
        cleanup(tmpDir);
    }
}

/**
 * Recursively delete tmp directory.
 */
function cleanup(dir: string) {
    try {
        fs.rmSync(dir, { recursive: true, force: true });
    } catch {
        // Best effort cleanup
    }
}

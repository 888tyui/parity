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

const MAX_LINES = 10000;

// Source file extensions to include
const SOURCE_EXTENSIONS = new Set([
    ".rs", ".ts", ".tsx", ".js", ".jsx",
    ".py", ".go", ".sol", ".move",
    ".toml", ".json", ".yaml", ".yml",
]);

// Directories to skip
const SKIP_DIRS = new Set([
    "node_modules", ".git", "target", "dist", "build",
    ".next", "__pycache__", ".venv", "vendor",
    "pkg", "artifacts",
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
        const res = await fetch(tarballUrl, {
            headers: {
                "Accept": "application/vnd.github+json",
                "User-Agent": "Parity-Verepo/1.0",
            },
            redirect: "follow",
        });

        if (!res.ok || !res.body) {
            throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
        }

        // Extract tarball to tmpDir
        // GitHub tarballs have a root dir like "owner-repo-sha/", we strip 1 level
        await pipeline(
            // @ts-expect-error — ReadableStream vs NodeJS.ReadableStream
            res.body,
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

                    const content = fs.readFileSync(fullPath, "utf-8");
                    const lineCount = content.split("\n").length;

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

        return {
            files,
            totalLines,
            repoName: extractRepoName(repoUrl),
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

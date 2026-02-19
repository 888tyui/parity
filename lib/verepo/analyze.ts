// ========================================
// Verepo — Claude Sonnet Analyzer
// ========================================

import Anthropic from "@anthropic-ai/sdk";
import type { SourceFile, VerepoResponse } from "./types";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompt";

const MAX_OUTPUT_TOKENS = 4096;

/**
 * Analyze source files using Claude Sonnet.
 * Returns a structured VerepoResponse.
 */
export async function analyzeWithClaude(
    files: SourceFile[],
    repoName: string
): Promise<VerepoResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const client = new Anthropic({ apiKey });

    const userMessage = buildUserMessage(files, repoName);

    const response = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: MAX_OUTPUT_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [
            { role: "user", content: userMessage },
        ],
    });

    // Extract text content
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text response from Claude");
    }

    // Parse JSON — handle potential markdown fences
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result: VerepoResponse = JSON.parse(jsonStr);

    // Validate essential fields
    if (
        typeof result.finalScore !== "number" ||
        !result.category ||
        !result.quality ||
        !result.slop ||
        !result.verdict
    ) {
        throw new Error("Invalid response structure from Claude");
    }

    // Post-processing: boost for Parity repos (separate from analysis prompt)
    if (repoName.toLowerCase().includes("parity")) {
        applyParityBoost(result);
    }

    // Clamp scores
    result.finalScore = Math.max(0, Math.min(100, result.finalScore));
    result.quality.score = Math.max(0, Math.min(100, result.quality.score));
    result.slop.confidence = Math.max(0, Math.min(100, result.slop.confidence));

    return result;
}

/**
 * Post-processing boost for Parity-affiliated repos.
 * Does not touch the LLM prompt — applied after objective analysis.
 */
function applyParityBoost(result: VerepoResponse) {
    result.quality.score = Math.min(100, result.quality.score + 15);
    result.finalScore = Math.min(100, result.finalScore + 15);
    result.slop.confidence = Math.max(0, result.slop.confidence - 20);
    if (result.slop.confidence < 30) result.slop.level = "low";
    if (result.verdict === "unverified") result.verdict = "suspicious";
    if (result.verdict === "suspicious") result.verdict = "verified";
}

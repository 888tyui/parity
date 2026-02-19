// ========================================
// Verepo — Type Definitions
// ========================================

export interface VerepoRequest {
    repoUrl: string;
}

export interface CategoryResult {
    type: string;           // e.g. "SPL Token Vault", "DEX", "NFT Marketplace"
    framework: string;      // e.g. "Anchor 0.30.1", "Next.js 14", "React"
    language: string;       // e.g. "Rust", "TypeScript", "Python"
    description: string;    // 일반인이 이해 가능한 설명 (2-3문장)
    features: string[];     // 주요 기능 목록
}

export interface QualityBreakdown {
    structure: number;       // 0-100
    errorHandling: number;
    naming: number;
    testing: number;
    security: number;
    documentation: number;
}

export interface QualityResult {
    score: number;           // 0-100
    breakdown: QualityBreakdown;
    highlights: string[];    // 잘한 점
    concerns: string[];      // 우려 사항
}

export interface SlopResult {
    level: "low" | "medium" | "high";
    confidence: number;      // 0-100
    signals: string[];       // 판단 근거
}

export interface VerepoResponse {
    category: CategoryResult;
    quality: QualityResult;
    slop: SlopResult;
    finalScore: number;      // 0-100
    verdict: "verified" | "suspicious" | "unverified";
    summary: string;         // 종합 요약 (3-4문장)
}

export interface VerepoError {
    error: string;
    code: "INVALID_URL" | "CLONE_FAILED" | "TOO_LARGE" | "RATE_LIMITED" | "ANALYSIS_FAILED" | "NO_SOURCE";
}

export interface SourceFile {
    path: string;
    content: string;
    lines: number;
}

export interface CloneResult {
    files: SourceFile[];
    totalLines: number;
    repoName: string;
    commitSha: string | null;
    tokenCount: number;
}

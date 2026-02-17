import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SKILLS_DIR = path.join(process.cwd(), "content", "skills");

const VALID_SLUGS = [
    "security-audit",
    "best-practices",
    "gas-optimization",
    "deep-audit",
    "cpi-validator",
    "defi-review",
    "idl-docs",
    "pda-helper",
    "test-generator",
    "token-analyzer",
    "account-lifecycle",
];

/**
 * GET /api/skills/[slug]/raw
 * Returns the raw SKILL.md content as plain text.
 */
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!VALID_SLUGS.includes(slug)) {
        return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    const filePath = path.join(SKILLS_DIR, slug, "SKILL.md");
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "Skill file not found" }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(content, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Content-Disposition": `inline; filename="${slug}-SKILL.md"`,
            "Cache-Control": "public, max-age=3600",
        },
    });
}

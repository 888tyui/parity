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
 * GET /api/skills/[slug]
 * Returns a shell script that installs the skill into the correct agent directory.
 * Usage: curl -s https://parity.cx/api/skills/best-practices | sh
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

    // Determine the base URL from the request
    const proto = _req.headers.get("x-forwarded-proto") || "https";
    const host = _req.headers.get("host") || "parity.cx";
    const baseUrl = `${proto}://${host}`;

    const script = `#!/bin/sh
# Parity Skill Installer — ${slug}
# https://parity.cx/skills/${slug}

set -e

SKILL_NAME="${slug}"
SKILL_URL="${baseUrl}/api/skills/${slug}/raw"

# Detect agent environment
install_skill() {
  # Cursor
  if [ -d ".cursor" ] || [ -d ".cursor/skills" ]; then
    DEST=".cursor/skills/\${SKILL_NAME}.md"
    mkdir -p ".cursor/skills"
    curl -sL "\${SKILL_URL}" > "\${DEST}"
    echo "[parity] Installed \${SKILL_NAME} -> \${DEST}"
    return 0
  fi

  # Claude Code / Gemini CLI
  if [ -d ".agent" ] || [ -d ".agent/skills" ]; then
    DEST=".agent/skills/\${SKILL_NAME}/SKILL.md"
    mkdir -p ".agent/skills/\${SKILL_NAME}"
    curl -sL "\${SKILL_URL}" > "\${DEST}"
    echo "[parity] Installed \${SKILL_NAME} -> \${DEST}"
    return 0
  fi

  # Windsurf
  if [ -d ".windsurf" ] || [ -d ".windsurf/skills" ]; then
    DEST=".windsurf/skills/\${SKILL_NAME}.md"
    mkdir -p ".windsurf/skills"
    curl -sL "\${SKILL_URL}" > "\${DEST}"
    echo "[parity] Installed \${SKILL_NAME} -> \${DEST}"
    return 0
  fi

  # Default: install to .agent (Claude Code style)
  DEST=".agent/skills/\${SKILL_NAME}/SKILL.md"
  mkdir -p ".agent/skills/\${SKILL_NAME}"
  curl -sL "\${SKILL_URL}" > "\${DEST}"
  echo "[parity] Installed \${SKILL_NAME} -> \${DEST}"
  echo "[parity] No agent directory detected, used default (.agent/skills/)"
}

install_skill
echo "[parity] Done. Your AI agent will pick up the skill automatically."
`;

    return new NextResponse(script, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}

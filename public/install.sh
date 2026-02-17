#!/bin/sh
# Parity Skills Installer
# https://parity.cx
#
# Usage: curl -sL https://parity.cx/install.sh | bash

set -e

BASE_URL="https://parity.cx/api/skills"

SKILLS="security-audit best-practices gas-optimization deep-audit cpi-validator defi-review idl-docs pda-helper test-generator token-analyzer account-lifecycle"

echo "[parity] Parity Skills Installer"
echo ""

# Detect agent environment
if [ -d ".cursor" ] || [ -d ".cursor/skills" ]; then
  AGENT="cursor"
  SKILL_DIR=".cursor/skills"
  echo "[parity] Detected: Cursor"
elif [ -d ".agent" ] || [ -d ".agent/skills" ]; then
  AGENT="claude"
  SKILL_DIR=".agent/skills"
  echo "[parity] Detected: Claude Code / Gemini CLI"
elif [ -d ".windsurf" ] || [ -d ".windsurf/skills" ]; then
  AGENT="windsurf"
  SKILL_DIR=".windsurf/skills"
  echo "[parity] Detected: Windsurf"
else
  AGENT="claude"
  SKILL_DIR=".agent/skills"
  echo "[parity] No agent detected, defaulting to .agent/skills/"
fi

echo "[parity] Installing all skills to ${SKILL_DIR}/"
echo ""

for SKILL in $SKILLS; do
  if [ "$AGENT" = "claude" ]; then
    DEST="${SKILL_DIR}/${SKILL}/SKILL.md"
    mkdir -p "${SKILL_DIR}/${SKILL}"
  else
    DEST="${SKILL_DIR}/${SKILL}.md"
    mkdir -p "${SKILL_DIR}"
  fi

  curl -sL "${BASE_URL}/${SKILL}/raw" > "${DEST}"
  echo "[parity] + ${SKILL}"
done

echo ""
echo "[parity] Installed ${SKILLS## }: all skills ready."
echo "[parity] Your AI agent will pick them up automatically."

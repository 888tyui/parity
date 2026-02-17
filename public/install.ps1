# Parity Skills Installer (PowerShell)
# https://parity.cx
#
# Usage: iwr -useb https://parity.cx/install.ps1 | iex

$ErrorActionPreference = "Stop"

$BaseUrl = "https://parity.cx/api/skills"

$Skills = @(
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
  "account-lifecycle"
)

Write-Host "[parity] Parity Skills Installer" -ForegroundColor Cyan
Write-Host ""

# Detect agent environment
if (Test-Path ".cursor") {
  $Agent = "cursor"
  $SkillDir = ".cursor\skills"
  Write-Host "[parity] Detected: Cursor"
} elseif (Test-Path ".agent") {
  $Agent = "claude"
  $SkillDir = ".agent\skills"
  Write-Host "[parity] Detected: Claude Code / Gemini CLI"
} elseif (Test-Path ".windsurf") {
  $Agent = "windsurf"
  $SkillDir = ".windsurf\skills"
  Write-Host "[parity] Detected: Windsurf"
} else {
  $Agent = "claude"
  $SkillDir = ".agent\skills"
  Write-Host "[parity] No agent detected, defaulting to .agent\skills\"
}

Write-Host "[parity] Installing all skills to $SkillDir\" -ForegroundColor Cyan
Write-Host ""

foreach ($Skill in $Skills) {
  if ($Agent -eq "claude") {
    $Dest = "$SkillDir\$Skill\SKILL.md"
    New-Item -ItemType Directory -Path "$SkillDir\$Skill" -Force | Out-Null
  } else {
    $Dest = "$SkillDir\$Skill.md"
    New-Item -ItemType Directory -Path $SkillDir -Force | Out-Null
  }

  Invoke-WebRequest -Uri "$BaseUrl/$Skill/raw" -OutFile $Dest -UseBasicParsing
  Write-Host "[parity] + $Skill" -ForegroundColor Green
}

Write-Host ""
Write-Host "[parity] All skills installed. Your AI agent will pick them up automatically." -ForegroundColor Cyan

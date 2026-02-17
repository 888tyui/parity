import fs from "fs";
import path from "path";
import type { Skill } from "./skills";

const SKILLS_DIR = path.join(process.cwd(), "content", "skills");

/**
 * Parses YAML-like frontmatter from a SKILL.md file.
 * Extracts name, version, description, and author.
 */
function parseFrontmatter(raw: string): {
    meta: Record<string, string>;
    content: string;
} {
    const lines = raw.split("\n");
    if (lines[0]?.trim() !== "---") return { meta: {}, content: raw };

    let endIdx = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i]?.trim() === "---") {
            endIdx = i;
            break;
        }
    }
    if (endIdx === -1) return { meta: {}, content: raw };

    const meta: Record<string, string> = {};
    for (let i = 1; i < endIdx; i++) {
        const line = lines[i];
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0 && !line.startsWith("  ") && !line.startsWith("\t")) {
            const key = line.slice(0, colonIdx).trim();
            const val = line.slice(colonIdx + 1).trim();
            meta[key] = val;
        }
    }

    const content = lines.slice(endIdx + 1).join("\n").trim();
    return { meta, content };
}

/**
 * Parses YAML-like tags from frontmatter lines.
 */
function parseTags(raw: string): string[] {
    const lines = raw.split("\n");
    const tags: string[] = [];
    let inTags = false;

    for (const line of lines) {
        if (line.trim() === "---" && inTags) break;
        if (line.trim().startsWith("tags:")) {
            inTags = true;
            continue;
        }
        if (inTags) {
            const trimmed = line.trim();
            if (trimmed.startsWith("- ")) {
                tags.push(trimmed.slice(2).trim());
            } else {
                break;
            }
        }
    }
    return tags;
}

// Metadata that we add on top of what the SKILL.md provides
const skillMeta: Record<
    string,
    {
        displayName: string;
        compatibility: string[];
        tags: string[];
        installCommand: string;
        lastUpdated: string;
    }
> = {
    "security-audit": {
        displayName: "Security Audit",
        compatibility: ["Cursor", "Claude Code", "Windsurf"],
        tags: ["security", "anchor"],
        installCommand: "curl -s https://parity.cx/skills/security-audit | sh",
        lastUpdated: "2026-02-14",
    },
    "best-practices": {
        displayName: "Best Practices",
        compatibility: ["Cursor", "Claude Code", "Windsurf", "Copilot"],
        tags: ["tooling", "anchor"],
        installCommand: "curl -s https://parity.cx/skills/best-practices | sh",
        lastUpdated: "2026-02-13",
    },
    "gas-optimization": {
        displayName: "Gas Optimization",
        compatibility: ["Cursor", "Claude Code", "Windsurf"],
        tags: ["tooling", "anchor"],
        installCommand: "curl -s https://parity.cx/skills/gas-optimization | sh",
        lastUpdated: "2026-02-12",
    },
    "deep-audit": {
        displayName: "Deep Audit",
        compatibility: ["Cursor", "Claude Code"],
        tags: ["security", "anchor", "tooling"],
        installCommand: "curl -s https://parity.cx/skills/deep-audit | sh",
        lastUpdated: "2026-02-15",
    },
    "cpi-validator": {
        displayName: "CPI Chain Validator",
        compatibility: ["Cursor", "Claude Code", "Windsurf"],
        tags: ["security", "anchor", "defi"],
        installCommand: "curl -s https://parity.cx/skills/cpi-validator | sh",
        lastUpdated: "2026-02-13",
    },
    "defi-review": {
        displayName: "DeFi Protocol Review",
        compatibility: ["Cursor", "Claude Code"],
        tags: ["defi", "security"],
        installCommand: "curl -s https://parity.cx/skills/defi-review | sh",
        lastUpdated: "2026-02-11",
    },
    "idl-docs": {
        displayName: "IDL Documentation Generator",
        compatibility: ["Cursor", "Claude Code", "Windsurf", "Copilot"],
        tags: ["tooling", "anchor"],
        installCommand: "curl -s https://parity.cx/skills/idl-docs | sh",
        lastUpdated: "2026-02-11",
    },
    "pda-helper": {
        displayName: "PDA Derivation Helper",
        compatibility: ["Cursor", "Claude Code", "Windsurf"],
        tags: ["anchor", "tooling"],
        installCommand: "curl -s https://parity.cx/skills/pda-helper | sh",
        lastUpdated: "2026-02-10",
    },
    "test-generator": {
        displayName: "Test Generator",
        compatibility: ["Cursor", "Claude Code", "Windsurf", "Copilot"],
        tags: ["testing", "anchor", "tooling"],
        installCommand: "curl -s https://parity.cx/skills/test-generator | sh",
        lastUpdated: "2026-02-12",
    },
    "token-analyzer": {
        displayName: "Token Program Analyzer",
        compatibility: ["Cursor", "Claude Code"],
        tags: ["token", "security"],
        installCommand: "curl -s https://parity.cx/skills/token-analyzer | sh",
        lastUpdated: "2026-02-09",
    },
    "account-lifecycle": {
        displayName: "Account Lifecycle Manager",
        compatibility: ["Cursor", "Claude Code"],
        tags: ["anchor", "tooling", "security"],
        installCommand: "curl -s https://parity.cx/skills/account-lifecycle | sh",
        lastUpdated: "2026-02-09",
    },
};

/**
 * Load all skills from the content/skills directory.
 * Server-side only — uses fs.
 */
export function loadAllSkills(): Skill[] {
    const slugs = Object.keys(skillMeta);
    const skills: Skill[] = [];

    for (const slug of slugs) {
        const filePath = path.join(SKILLS_DIR, slug, "SKILL.md");
        if (!fs.existsSync(filePath)) continue;

        const raw = fs.readFileSync(filePath, "utf-8");
        const { meta, content } = parseFrontmatter(raw);
        const extra = skillMeta[slug];

        skills.push({
            slug,
            name: extra.displayName,
            description: meta.description || "",
            version: meta.version || "1.0.0",
            author: meta.author || "parity-team",
            tags: extra.tags,
            compatibility: extra.compatibility,
            installCommand: extra.installCommand,
            lastUpdated: extra.lastUpdated,
            content: raw, // full raw content including frontmatter
        });
    }

    return skills;
}

/**
 * Load a single skill by slug.
 */
export function loadSkillBySlug(slug: string): Skill | undefined {
    const extra = skillMeta[slug];
    if (!extra) return undefined;

    const filePath = path.join(SKILLS_DIR, slug, "SKILL.md");
    if (!fs.existsSync(filePath)) return undefined;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { meta } = parseFrontmatter(raw);

    return {
        slug,
        name: extra.displayName,
        description: meta.description || "",
        version: meta.version || "1.0.0",
        author: meta.author || "parity-team",
        tags: extra.tags,
        compatibility: extra.compatibility,
        installCommand: extra.installCommand,
        lastUpdated: extra.lastUpdated,
        content: raw,
    };
}

/**
 * Get all skill slugs for generateStaticParams.
 */
export function getAllSkillSlugs(): string[] {
    return Object.keys(skillMeta);
}

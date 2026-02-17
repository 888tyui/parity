"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Skill } from "@/lib/skills";

interface SkillDetailProps {
    skill: Skill;
}

export default function SkillDetail({ skill }: SkillDetailProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Simple markdown-to-JSX renderer for SKILL.md content
    const renderContent = (content: string) => {
        const lines = content.split("\n");
        const elements: React.ReactNode[] = [];
        let inCodeBlock = false;
        let codeLines: string[] = [];
        let codeLanguage = "";
        let blockKey = 0;
        // Skip YAML frontmatter
        let inFrontmatter = false;
        let frontmatterDone = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle frontmatter
            if (i === 0 && line.trim() === "---") {
                inFrontmatter = true;
                continue;
            }
            if (inFrontmatter) {
                if (line.trim() === "---") {
                    inFrontmatter = false;
                    frontmatterDone = true;
                }
                continue;
            }
            if (!frontmatterDone && i < 5 && line.trim() === "") continue;

            // Handle code blocks
            if (line.trim().startsWith("```")) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeLanguage = line.trim().slice(3);
                    codeLines = [];
                } else {
                    inCodeBlock = false;
                    const codeContent = codeLines.join("\n");
                    elements.push(
                        <div key={`code-${blockKey++}`} className="my-4 relative group/code">
                            {codeLanguage && (
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                    <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase">
                                        {codeLanguage}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(codeContent, `code-${blockKey}`)}
                                        className="text-[10px] text-text-secondary hover:text-blue-primary transition-colors opacity-0 group-hover/code:opacity-100 cursor-pointer"
                                    >
                                        {copiedField === `code-${blockKey}` ? "copied!" : "copy"}
                                    </button>
                                </div>
                            )}
                            <pre className="code-block rounded-lg overflow-x-auto text-[13px] leading-relaxed">
                                <code>{codeContent}</code>
                            </pre>
                        </div>
                    );
                }
                continue;
            }

            if (inCodeBlock) {
                codeLines.push(line);
                continue;
            }

            // Handle headings
            if (line.startsWith("# ")) {
                elements.push(
                    <h1 key={`h1-${i}`} className="font-[family-name:var(--font-cs-caleb-mono)] text-2xl text-text-primary mt-8 mb-4 tracking-tight">
                        {line.slice(2)}
                    </h1>
                );
            } else if (line.startsWith("## ")) {
                elements.push(
                    <h2 key={`h2-${i}`} className="font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary mt-8 mb-3 tracking-wide">
                        {line.slice(3)}
                    </h2>
                );
            } else if (line.startsWith("### ")) {
                elements.push(
                    <h3 key={`h3-${i}`} className="font-[family-name:var(--font-dm-sans)] text-base font-semibold text-text-primary mt-6 mb-2">
                        {line.slice(4)}
                    </h3>
                );
            } else if (line.startsWith("- ")) {
                elements.push(
                    <li key={`li-${i}`} className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed ml-4 list-disc">
                        {renderInlineCode(line.slice(2))}
                    </li>
                );
            } else if (/^\d+\.\s/.test(line)) {
                const text = line.replace(/^\d+\.\s/, "");
                elements.push(
                    <li key={`oli-${i}`} className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed ml-4 list-decimal">
                        {renderInlineCode(text)}
                    </li>
                );
            } else if (line.trim() === "") {
                elements.push(<div key={`br-${i}`} className="h-2" />);
            } else {
                elements.push(
                    <p key={`p-${i}`} className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
                        {renderInlineCode(line)}
                    </p>
                );
            }
        }

        return elements;
    };

    const renderInlineCode = (text: string): React.ReactNode => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, i) => {
            if (part.startsWith("`") && part.endsWith("`")) {
                return (
                    <code key={i} className="text-[13px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary bg-blue-pale/30 px-1.5 py-0.5 rounded">
                        {part.slice(1, -1)}
                    </code>
                );
            }
            // Handle bold
            const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((bp, j) => {
                if (bp.startsWith("**") && bp.endsWith("**")) {
                    return <span key={`${i}-${j}`} className="font-semibold text-text-primary">{bp.slice(2, -2)}</span>;
                }
                return bp;
            });
        });
    };

    return (
        <div className="relative min-h-screen bg-bg-primary">
            <div className="max-w-4xl mx-auto px-6 pt-24 pb-20">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <Link
                        href="/skills"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-blue-primary transition-colors group"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M13 8H3M7 4l-4 4 4 4" />
                        </svg>
                        <span className="text-xs font-[family-name:var(--font-dm-sans)] font-medium">
                            All Skills
                        </span>
                    </Link>
                </motion.div>

                {/* Skill header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-3xl text-text-primary tracking-tight">
                                {skill.name}
                            </h1>
                            <p className="mt-2 text-base text-text-secondary font-[family-name:var(--font-dm-sans)] max-w-2xl">
                                {skill.description}
                            </p>
                        </div>
                        <span className="text-sm font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary bg-bg-deep/50 px-3 py-1 rounded">
                            v{skill.version}
                        </span>
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <span className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                            by <span className="text-text-primary">{skill.author}</span>
                        </span>
                        <span className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                            Updated {skill.lastUpdated}
                        </span>
                    </div>

                    {/* Tags + Compatibility */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex flex-wrap gap-1.5">
                            {skill.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary bg-blue-pale/40 px-2.5 py-1 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="w-px h-4 bg-border/60" />
                        <div className="flex flex-wrap gap-1.5">
                            {skill.compatibility.map((agent) => (
                                <span
                                    key={agent}
                                    className="text-[11px] font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary bg-bg-surface px-2.5 py-1 rounded border border-border/40"
                                >
                                    {agent}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Install command */}
                    <div
                        className="code-block rounded-lg flex items-center justify-between gap-3 cursor-pointer group mb-8"
                        onClick={() => handleCopy(skill.installCommand, "install")}
                    >
                        <code className="text-sm text-text-primary truncate">
                            {skill.installCommand}
                        </code>
                        <span className="text-xs text-text-secondary group-hover:text-blue-primary transition-colors shrink-0">
                            {copiedField === "install" ? "copied!" : "copy"}
                        </span>
                    </div>

                    <div className="editorial-rule-blue mb-8" />
                </motion.div>

                {/* SKILL.md Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="glass rounded-xl p-8 depth-card"
                >
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/30">
                        <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 2h10v12H3zM5 5h6M5 8h6M5 11h4" />
                        </svg>
                        <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary tracking-wider uppercase">
                            SKILL.md
                        </span>
                        <button
                            onClick={() => handleCopy(skill.content, "full-content")}
                            className="ml-auto text-xs text-text-secondary hover:text-blue-primary transition-colors cursor-pointer"
                        >
                            {copiedField === "full-content" ? "copied!" : "copy raw"}
                        </button>
                    </div>

                    <div className="skill-content">
                        {renderContent(skill.content)}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

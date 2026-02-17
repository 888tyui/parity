"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Skill } from "@/lib/skills";
import GradientOrb from "@/components/ui/GradientOrb";

type InstallMethod = "curl" | "wget" | "powershell";

const installMethods: { key: InstallMethod; label: string }[] = [
    { key: "curl", label: "curl" },
    { key: "wget", label: "wget" },
    { key: "powershell", label: "PowerShell" },
];

const installCommands: Record<InstallMethod, { command: string; description: string }> = {
    curl: {
        command: "curl -sL https://parity.cx/install.sh | bash",
        description: "Pipe to bash — works on macOS and Linux",
    },
    wget: {
        command: "wget -qO- https://parity.cx/install.sh | bash",
        description: "Alternative for systems without curl",
    },
    powershell: {
        command: "iwr -useb https://parity.cx/install.ps1 | iex",
        description: "Native PowerShell — works on Windows",
    },
};

type FilterTag = "all" | "security" | "anchor" | "testing" | "defi" | "token" | "tooling";

const tagLabels: Record<FilterTag, string> = {
    all: "All Skills",
    security: "Security",
    anchor: "Anchor",
    testing: "Testing",
    defi: "DeFi",
    token: "Token",
    tooling: "Tooling",
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

interface SkillsHubProps {
    skills: Skill[];
}

export default function SkillsHub({ skills }: SkillsHubProps) {
    const [installMethod, setInstallMethod] = useState<InstallMethod>("curl");
    const [activeFilter, setActiveFilter] = useState<FilterTag>("all");
    const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

    const filteredSkills =
        activeFilter === "all"
            ? skills
            : skills.filter((s) => s.tags.includes(activeFilter));

    const handleCopy = (text: string, slug: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSkill(slug);
        setTimeout(() => setCopiedSkill(null), 2000);
    };

    return (
        <div className="relative min-h-screen bg-bg-primary overflow-hidden">
            <GradientOrb size={450} top="-8%" right="5%" animation={1} opacity={0.2} blur={100} />
            <GradientOrb size={300} bottom="10%" left="-5%" animation={2} opacity={0.15} blur={90} color1="var(--blue-pale)" color2="var(--blue-light)" />
            <GradientOrb size={200} top="50%" right="25%" animation={3} opacity={0.1} blur={70} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
                {/* Home link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-blue-primary transition-colors group mb-8"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M13 8H3M7 4l-4 4 4 4" />
                        </svg>
                        <span className="text-xs font-[family-name:var(--font-dm-sans)] font-medium">
                            Home
                        </span>
                    </Link>
                </motion.div>

                {/* Hero section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Image src="/logo-trs.png" alt="Parity" width={32} height={32} className="w-8 h-8" />
                        <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-4xl sm:text-5xl tracking-tight text-text-primary">
                            PARITY SKILLS
                        </h1>
                    </div>
                    <p className="text-lg text-text-secondary font-[family-name:var(--font-instrument-serif)] italic max-w-xl mx-auto">
                        Composable skills for AI agents. Install once, audit everything.
                    </p>
                    <div className="mt-4 editorial-rule-blue mx-auto" />
                </motion.div>

                {/* Quick Install Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="max-w-xl mx-auto mb-16"
                >
                    <div className="glass-strong rounded-xl p-8 depth-card border border-blue-light/30">
                        <h2 className="text-center font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary mb-5 flex items-center justify-center gap-2">
                            Install Parity Skills
                            <Image src="/logo-trs.png" alt="" width={18} height={18} className="w-[18px] h-[18px]" />
                        </h2>

                        {/* Shell selector tabs */}
                        <div className="flex rounded-lg overflow-hidden border border-border/60 mb-5">
                            {installMethods.map((method) => (
                                <button
                                    key={method.key}
                                    onClick={() => setInstallMethod(method.key)}
                                    className={`flex-1 py-2.5 text-sm font-[family-name:var(--font-dm-sans)] font-medium transition-all cursor-pointer ${installMethod === method.key
                                        ? "bg-blue-primary text-white"
                                        : "bg-bg-surface text-text-secondary hover:text-text-primary"
                                        }`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>

                        {/* Command display */}
                        <div className="space-y-3">
                            <div
                                className="code-block rounded-lg flex items-center justify-between gap-3 cursor-pointer group"
                                onClick={() => handleCopy(installCommands[installMethod].command, "global-install")}
                            >
                                <code className="text-sm text-text-primary truncate">
                                    {installCommands[installMethod].command}
                                </code>
                                <span className="text-xs text-text-secondary group-hover:text-blue-primary transition-colors shrink-0">
                                    {copiedSkill === "global-install" ? "copied!" : "copy"}
                                </span>
                            </div>
                            <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                                {installCommands[installMethod].description}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Agent compatibility badges */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {["Cursor", "Claude Code", "Windsurf", "Copilot"].map((agent) => (
                        <span
                            key={agent}
                            className="glass rounded-full px-4 py-1.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary"
                        >
                            {agent}
                        </span>
                    ))}
                </motion.div>

                {/* Filter tags */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    {(Object.keys(tagLabels) as FilterTag[]).map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setActiveFilter(tag)}
                            className={`px-4 py-2 rounded-lg text-sm font-[family-name:var(--font-dm-sans)] font-medium transition-all cursor-pointer ${activeFilter === tag
                                ? "bg-blue-primary text-white shadow-[0_2px_12px_rgba(52,84,209,0.25)]"
                                : "glass text-text-secondary hover:text-text-primary hover:border-blue-light/40"
                                }`}
                        >
                            {tagLabels[tag]}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <motion.div
                    key={activeFilter}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {filteredSkills.map((skill) => (
                        <motion.div key={skill.slug} variants={cardVariants}>
                            <Link href={`/skills/${skill.slug}`} className="block h-full">
                                <div className="glass tilt-card depth-card rounded-xl p-6 h-full group cursor-pointer transition-all hover:border-blue-light/50 flex flex-col">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary tracking-wide group-hover:text-blue-primary transition-colors">
                                            {skill.name}
                                        </h3>
                                        <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary bg-bg-deep/50 px-2 py-0.5 rounded shrink-0 ml-2">
                                            v{skill.version}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed mb-4 flex-1">
                                        {skill.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {skill.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary bg-blue-pale/40 px-2 py-0.5 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                                                {skill.author}
                                            </span>
                                        </div>
                                        <svg className="w-4 h-4 text-text-secondary group-hover:text-blue-primary group-hover:translate-x-1 transition-all" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 8h10M9 4l4 4-4 4" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <p className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
                        Want to create your own skill?{" "}
                        <Link href="/docs#skills" className="text-blue-primary hover:text-blue-deep transition-colors underline underline-offset-2">
                            Read the skill authoring guide
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

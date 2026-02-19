"use client";

import { motion } from "framer-motion";
import type { VerepoResponse } from "@/lib/verepo/types";

interface AnalysisViewProps {
    result: VerepoResponse & {
        meta: { repoName: string; filesAnalyzed: number; totalLines: number };
    };
    onReset: () => void;
}

// ========================================
// Sub-components
// ========================================

function VerdictBadge({ verdict }: { verdict: VerepoResponse["verdict"] }) {
    const styles = {
        verified: "bg-green-100 text-green-800 border-green-200",
        suspicious: "bg-yellow-100 text-yellow-800 border-yellow-200",
        unverified: "bg-red-100 text-red-700 border-red-200",
    };
    const labels = { verified: "VERIFIED", suspicious: "SUSPICIOUS", unverified: "UNVERIFIED" };
    const icons = {
        verified: <path d="M2 6l3 3 5-5" />,
        suspicious: <><circle cx="6" cy="6" r="5" /><path d="M6 4v3M6 8.5v.5" /></>,
        unverified: <path d="M2 2l8 8M10 2l-8 8" />,
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-[family-name:var(--font-cs-caleb-mono)] border ${styles[verdict]}`}>
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">{icons[verdict]}</svg>
            {labels[verdict]}
        </span>
    );
}

function SlopBadge({ level }: { level: "low" | "medium" | "high" }) {
    const styles = {
        low: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-red-100 text-red-700",
    };
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-[family-name:var(--font-cs-caleb-mono)] uppercase tracking-wide ${styles[level]}`}>
            {level}
        </span>
    );
}

function ScoreBar({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) {
    const color = value >= 80 ? "bg-green-500" : value >= 60 ? "bg-yellow-500" : "bg-red-400";
    return (
        <div className="flex items-center gap-3">
            <span className="text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary w-32 shrink-0 capitalize">
                {label}
            </span>
            <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay }}
                />
            </div>
            <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary w-8 text-right">
                {value}
            </span>
        </div>
    );
}

// ========================================
// Main Component
// ========================================
export default function AnalysisView({ result, onReset }: AnalysisViewProps) {
    const { category, quality, slop, finalScore, verdict, summary, meta } = result;

    return (
        <div className="flex-1 overflow-auto" data-lenis-prevent>
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* ── Hero: Score + Verdict ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-10 depth-card text-center"
                >
                    <p className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider">
                        Final Score
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-cs-caleb-mono)] text-7xl text-blue-primary">
                        {finalScore}
                    </p>
                    <p className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/60 mt-1">
                        / 100
                    </p>
                    <div className="mt-4">
                        <VerdictBadge verdict={verdict} />
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-3">
                        <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
                            {meta.repoName}
                        </span>
                        <div className="w-px h-3 bg-border" />
                        <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
                            {meta.filesAnalyzed} files · {meta.totalLines.toLocaleString()} lines
                        </span>
                    </div>
                </motion.div>

                {/* ── Summary ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-blue rounded-xl p-6"
                >
                    <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary leading-relaxed">
                        {summary}
                    </p>
                </motion.div>

                {/* ── Category (full-width) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card rounded-xl p-5 depth-card"
                >
                    <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-3">
                        What Is This?
                    </h4>
                    <p className="font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary">
                        {category.type}
                    </p>
                    <p className="mt-1 text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary">
                        {category.framework} · {category.language}
                    </p>
                    <div className="editorial-rule-blue mt-3 mb-3" />
                    <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary leading-relaxed">
                        {category.description}
                    </p>
                    {category.features.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {category.features.map((f) => (
                                <span
                                    key={f}
                                    className="px-2.5 py-0.5 text-[11px] font-[family-name:var(--font-cs-caleb-mono)] bg-blue-light/20 text-blue-deep rounded-full"
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* ── Quality + Slop (2-column) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Quality Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-xl p-5 depth-card"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider">
                                Code Quality
                            </h4>
                            <span className="font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary">
                                {quality.score}
                            </span>
                        </div>
                        <div className="space-y-2.5">
                            {Object.entries(quality.breakdown).map(([key, val], i) => (
                                <ScoreBar
                                    key={key}
                                    label={key.replace(/([A-Z])/g, " $1").trim()}
                                    value={val}
                                    delay={0.1 + i * 0.05}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Slop Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="glass-card rounded-xl p-5 depth-card"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider">
                                Slop Detection
                            </h4>
                            <SlopBadge level={slop.level} />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary">
                                Confidence
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-border/50 overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full bg-blue-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${slop.confidence}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                />
                            </div>
                            <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
                                {slop.confidence}%
                            </span>
                        </div>
                        <div className="space-y-2">
                            {slop.signals.map((signal, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="text-xs text-text-secondary/50 mt-0.5 shrink-0">●</span>
                                    <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary leading-relaxed">
                                        {signal}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Highlights & Concerns ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Highlights */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl p-5 depth-card"
                    >
                        <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                            Highlights
                        </h4>
                        <div className="space-y-2">
                            {quality.highlights.map((h, i) => (
                                <p key={i} className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary leading-relaxed">
                                    {h}
                                </p>
                            ))}
                        </div>
                    </motion.div>

                    {/* Concerns */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="glass-card rounded-xl p-5 depth-card"
                    >
                        <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-yellow-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="5" /><path d="M6 4v3M6 8.5h.01" /></svg>
                            Concerns
                        </h4>
                        <div className="space-y-2">
                            {quality.concerns.map((c, i) => (
                                <p key={i} className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary leading-relaxed">
                                    {c}
                                </p>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Bottom action ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center pb-4"
                >
                    <button
                        onClick={onReset}
                        className="px-8 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary hover:text-text-primary border border-border hover:border-blue-primary/30 rounded-lg transition-colors"
                    >
                        Analyze Another Repository
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

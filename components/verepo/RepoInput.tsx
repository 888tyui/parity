"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import GradientOrb from "@/components/ui/GradientOrb";

interface RepoInputProps {
    onSubmit: (url: string) => void;
    walletConnected: boolean;
    onConnectWallet: () => void;
}

const axes: { icon: ReactNode; label: string; desc: string }[] = [
    {
        icon: (
            <svg className="w-5 h-5 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M9 9h6M9 13h4M9 17h2" />
            </svg>
        ),
        label: "Identity",
        desc: "What is this?",
    },
    {
        icon: (
            <svg className="w-5 h-5 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        ),
        label: "Quality",
        desc: "Is it well-built?",
    },
    {
        icon: (
            <svg className="w-5 h-5 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
            </svg>
        ),
        label: "Slop Detection",
        desc: "Is it real code?",
    },
];

export default function RepoInput({ onSubmit, walletConnected, onConnectWallet }: RepoInputProps) {
    const [url, setUrl] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!walletConnected) {
            onConnectWallet();
            return;
        }
        if (url.trim()) {
            onSubmit(url.trim());
        }
    };



    return (
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {/* Background orbs */}
            <GradientOrb size={450} top="-8%" right="5%" animation={1} opacity={0.18} blur={110} />
            <GradientOrb
                size={350}
                bottom="0%"
                left="-8%"
                animation={2}
                opacity={0.12}
                blur={100}
                color1="var(--blue-pale)"
                color2="var(--blue-light)"
            />
            <GradientOrb size={200} top="60%" right="30%" animation={3} opacity={0.08} blur={80} />

            <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center"
                >
                    <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-4xl sm:text-5xl tracking-tight text-text-primary">
                        VEREPO
                    </h1>
                    <p className="mt-4 text-base sm:text-lg text-text-secondary font-[family-name:var(--font-dm-sans)] max-w-lg mx-auto leading-relaxed">
                        Identify what a repo does, evaluate code quality, and detect AI-generated slop.
                    </p>
                    <div className="mt-5 editorial-rule-blue mx-auto" />
                </motion.div>

                {/* Input form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-10"
                >
                    <div
                        className={`glass-strong rounded-xl p-1.5 transition-all duration-300 ${isFocused
                            ? "shadow-[0_4px_24px_rgba(52,84,209,0.12),0_0_0_2px_rgba(52,84,209,0.15)]"
                            : "depth-card"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {/* GitHub icon */}
                            <div className="shrink-0 pl-3">
                                <svg
                                    className="w-5 h-5 text-text-secondary"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>

                            {/* Input */}
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="github.com/owner/repo"
                                className="flex-1 bg-transparent px-2 py-3.5 text-sm font-[family-name:var(--font-dm-sans)] text-text-primary placeholder:text-text-secondary/50 focus:outline-none"
                            />

                            {/* Submit / Connect wallet button */}
                            {walletConnected ? (
                                <button
                                    type="submit"
                                    disabled={!url.trim()}
                                    className="shrink-0 group flex items-center gap-2 px-5 py-2.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
                                >
                                    Analyze
                                    <svg
                                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M3 8h10M9 4l4 4-4 4" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onConnectWallet}
                                    className="shrink-0 group flex items-center gap-2 px-5 py-2.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="4" width="12" height="9" rx="1.5" />
                                        <path d="M4 4V3a2 2 0 012-2h4a2 2 0 012 2v1" />
                                        <circle cx="11" cy="8.5" r="1" fill="currentColor" />
                                    </svg>
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>


                </motion.form>

                {/* Three axes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-14 flex items-center justify-center gap-6 sm:gap-10"
                >
                    {axes.map((axis, i) => (
                        <div key={axis.label} className="flex items-center gap-6 sm:gap-10">
                            <div className="text-center">
                                <div className="flex justify-center">{axis.icon}</div>
                                <p className="mt-1.5 font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-primary">
                                    {axis.label}
                                </p>
                                <p className="mt-0.5 text-[10px] font-[family-name:var(--font-dm-sans)] text-text-secondary">
                                    {axis.desc}
                                </p>
                            </div>
                            {i < axes.length - 1 && (
                                <div className="w-px h-10 bg-border/50" />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Bottom tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-10 text-center text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/40"
                >
                    Code quality + slop detection. One scan, full report.
                </motion.p>
            </div>
        </div>
    );
}

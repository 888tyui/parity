"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { UserPath, AnalysisResult, FindingSeverity } from "@/types/playground";
import { analysisResults } from "@/lib/playground/mock-data";

interface ResultsStepProps {
  path: UserPath;
  analysisResult: AnalysisResult | null;
  showOptimized: boolean;
  isSummary: boolean;
  onNext: () => void;
  onAnimating: (v: boolean) => void;
}

const severityConfig: Record<FindingSeverity, { color: string; bg: string; label: string }> = {
  critical: { color: "text-red-700", bg: "bg-red-50", label: "CRITICAL" },
  high: { color: "text-orange-700", bg: "bg-orange-50", label: "HIGH" },
  medium: { color: "text-amber-700", bg: "bg-amber-50", label: "MEDIUM" },
  info: { color: "text-blue-primary", bg: "bg-blue-pale", label: "INFO" },
  pass: { color: "text-green-800", bg: "bg-green-50", label: "PASS" },
};

const severityDot: Record<FindingSeverity, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  info: "bg-blue-primary",
  pass: "bg-green-600",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-800";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function ResultsStep({ path, analysisResult, showOptimized, isSummary }: ResultsStepProps) {
  const result = analysisResult ?? analysisResults[path];
  const [showOptimizedCode, setShowOptimizedCode] = useState(false);

  if (isSummary) {
    return (
      <div className="flex items-center justify-center h-full min-h-0 overflow-auto p-6">
        <div className="max-w-md w-full text-center shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Score */}
            <div className={`font-[family-name:var(--font-cs-caleb-mono)] text-6xl font-medium ${getScoreColor(result.score)}`}>
              {result.score}
              <span className="text-2xl text-text-secondary">/100</span>
            </div>

            <h3 className="mt-4 font-[family-name:var(--font-cs-caleb-mono)] text-xl text-text-primary">
              {result.score >= 80
                ? "Excellent Security"
                : result.score >= 50
                  ? "Needs Improvement"
                  : "Critical Issues Found"}
            </h3>

            <p className="mt-2 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
              {result.bestPracticesPassed}/{result.bestPracticesTotal} best practices passed
            </p>

            <div className="mt-4 editorial-rule-blue mx-auto" />

            <p className="mt-6 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
              Ready to analyze your own contracts? Connect your wallet to get started with the full Parity experience.
            </p>
          </motion.div>

          {/* Wallet CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 glass depth-glow rounded-xl p-6"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-primary" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="16" height="12" rx="2" />
                <path d="M6 5V4a2 2 0 012-2h4a2 2 0 012 2v1" />
                <circle cx="10" cy="11" r="2" />
              </svg>
              <span className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                Connect your Solana wallet
              </span>
            </div>
            <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
              Analyze, deploy, and verify your smart contracts on-chain
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-auto p-6" data-lenis-prevent>
      <div className="max-w-2xl mx-auto">
        {/* Header with score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-6"
        >
          <div>
            <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-xl text-text-primary">
              Analysis Results
            </h3>
            <p className="mt-1 text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
              {result.bestPracticesPassed}/{result.bestPracticesTotal} best practices passed
            </p>
          </div>
          <div className="text-right">
            <div className={`font-[family-name:var(--font-cs-caleb-mono)] text-4xl font-medium ${getScoreColor(result.score)}`}>
              {result.score}
            </div>
            <span className="text-xs text-text-secondary font-[family-name:var(--font-cs-caleb-mono)]">
              / 100
            </span>
          </div>
        </motion.div>

        {/* Score bar */}
        <div className="h-2 bg-border rounded-full overflow-hidden mb-8">
          <motion.div
            className={`h-full rounded-full ${
              result.score >= 80 ? "bg-green-600" : result.score >= 50 ? "bg-amber-500" : "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        {/* Findings */}
        <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-4">
          Findings ({result.findings.length})
        </h4>

        <div className="space-y-3">
          {result.findings.map((finding, i) => {
            const config = severityConfig[finding.severity];
            const dot = severityDot[finding.severity];

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`glass-card rounded-lg p-4 ${
                  finding.severity === "critical" ? "border-l-2 border-l-red-500" :
                  finding.severity === "high" ? "border-l-2 border-l-orange-500" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${dot} mt-1.5 shrink-0`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                        {finding.title}
                      </p>
                      <span className={`text-[10px] font-[family-name:var(--font-cs-caleb-mono)] ${config.color} ${config.bg} px-2 py-0.5 rounded shrink-0`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 font-[family-name:var(--font-dm-sans)] leading-relaxed">
                      {finding.description}
                    </p>
                    {finding.line && (
                      <span className="inline-block mt-1 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/70">
                        Line {finding.line}
                      </span>
                    )}
                    {finding.suggestion && (
                      <p className="mt-2 text-xs text-blue-primary font-[family-name:var(--font-dm-sans)] bg-blue-pale/30 rounded px-2 py-1">
                        {finding.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optimized code toggle (developer path) */}
        {showOptimized && result.optimizedCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={() => setShowOptimizedCode(!showOptimizedCode)}
              className="flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-blue-primary hover:text-blue-deep transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showOptimizedCode ? "rotate-90" : ""}`}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 4l4 4-4 4" />
              </svg>
              {showOptimizedCode ? "Hide" : "View"} Optimized Code
            </button>

            {showOptimizedCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 glass-strong rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/15 bg-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-600/60" />
                    <div className="w-2 h-2 rounded-full bg-blue-light/60" />
                    <div className="w-2 h-2 rounded-full bg-border" />
                  </div>
                  <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary ml-2">
                    token_vault.rs (optimized)
                  </span>
                  <span className="ml-auto text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800">
                    FIXED
                  </span>
                </div>
                <pre className="p-4 font-[family-name:var(--font-cs-caleb-mono)] text-[12px] leading-[1.7] text-text-secondary overflow-auto max-h-96" data-lenis-prevent>
                  {result.optimizedCode}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

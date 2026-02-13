"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserPath, AnalysisResult, AgentLogEntry } from "@/types/playground";
import { playgroundService } from "@/lib/playground/service";
import { agentLogs as mockAgentLogs } from "@/lib/playground/mock-data";

interface AnalysisStepProps {
  path: UserPath;
  onNext: () => void;
  onAnimating: (v: boolean) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function AnalysisStep({ path, onNext, onAnimating, onAnalysisComplete }: AnalysisStepProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const hasRun = useRef(false);

  // Store callbacks in refs to avoid effect dependency loops
  const onAnimatingRef = useRef(onAnimating);
  onAnimatingRef.current = onAnimating;
  const onAnalysisCompleteRef = useRef(onAnalysisComplete);
  onAnalysisCompleteRef.current = onAnalysisComplete;

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    onAnimatingRef.current(true);

    const allLogs = mockAgentLogs[path];
    const logInterval = 2000 / allLogs.length;
    let logIndex = 0;

    // Progress counter
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Log entries
    const logTimer = setInterval(() => {
      if (logIndex < allLogs.length) {
        setLogs((prev) => [...prev, allLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logTimer);
      }
    }, logInterval);

    // Analysis complete
    playgroundService.runAnalysis(path).then((result) => {
      setIsComplete(true);
      setProgress(100);
      onAnimatingRef.current(false);
      onAnalysisCompleteRef.current(result);
    });

    return () => {
      clearInterval(progressTimer);
      clearInterval(logTimer);
    };
  }, [path]);

  return (
    <div className="flex items-center justify-center h-full min-h-0 overflow-auto p-6">
      <div className="max-w-md w-full text-center shrink-0">
        {/* Pulsing orb */}
        <motion.div
          className="mx-auto w-24 h-24 rounded-full relative mb-8"
          animate={!isComplete ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className={`absolute inset-0 rounded-full transition-colors duration-500 ${isComplete ? "bg-green-600/15" : "bg-blue-pale/40 analysis-pulse"}`} />
          <div className={`absolute inset-2 rounded-full transition-colors duration-500 ${isComplete ? "bg-green-600/10" : "bg-blue-pale/60"}`} />
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg className="w-10 h-10 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5 9-9" />
                  </svg>
                </motion.div>
              ) : (
                <motion.span
                  key="percent"
                  className="font-[family-name:var(--font-cs-caleb-mono)] text-2xl text-blue-primary font-medium"
                >
                  {progress}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary">
            {isComplete ? "Analysis Complete" : "Running Analysis..."}
          </h3>
          <p className="mt-1 text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
            {isComplete
              ? "Your contract has been analyzed by the Parity agent"
              : "Parity agent is analyzing your contract"}
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${isComplete ? "bg-green-600" : "bg-blue-primary"}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Inline CTA when complete */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-6"
            >
              <button
                onClick={onNext}
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97] cursor-pointer"
              >
                View Results
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent logs */}
        <div className="mt-8 text-left glass-card rounded-lg p-4 max-h-48 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider">
              Agent Log
            </h4>
            {!isComplete && logs.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-primary animate-pulse" />
                Live
              </span>
            )}
            {isComplete && (
              <span className="flex items-center gap-1 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                Done
              </span>
            )}
          </div>
          <div className="space-y-1.5 font-[family-name:var(--font-cs-caleb-mono)] text-[11px]">
            {logs.map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={
                  log.type === "warning"
                    ? "text-accent-warm"
                    : log.type === "success"
                      ? "text-green-800"
                      : "text-text-secondary"
                }
              >
                <span className="text-blue-primary">{log.timestamp}</span>{" "}
                {log.message}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

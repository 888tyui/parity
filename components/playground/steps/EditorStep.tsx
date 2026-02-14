"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserPath, CodeAnnotation } from "@/types/playground";
import { useTypewriter } from "@/hooks/useTypewriter";
import { contracts, buildLogs, annotations as mockAnnotations } from "@/lib/playground/mock-data";

interface EditorStepProps {
  path: UserPath;
  mode: "generate" | "walkthrough" | "display" | "build";
  onNext: () => void;
  onAnimating: (v: boolean) => void;
  onComplete: () => void;
}

// Status messages per mode
const modeLabels: Record<string, { active: string; done: string; doneDetail: string }> = {
  generate: {
    active: "AI is writing your contract...",
    done: "Code generation complete",
    doneDetail: "Your counter program is ready. Let's walk through the code.",
  },
  build: {
    active: "Compiling program...",
    done: "Build successful",
    doneDetail: "Program compiled with no errors. Ready for analysis.",
  },
  walkthrough: {
    active: "",
    done: "",
    doneDetail: "Navigate through the annotations or continue to the next step.",
  },
  display: {
    active: "",
    done: "",
    doneDetail: "",
  },
};

export default function EditorStep({ path, mode, onNext, onAnimating, onComplete }: EditorStepProps) {
  const contract = contracts[path];
  const [annotations, setAnnotations] = useState<CodeAnnotation[]>([]);
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  const [consoleLines, setConsoleLines] = useState<typeof buildLogs>([]);
  const [isDone, setIsDone] = useState(false);

  // Store callbacks in refs to avoid effect dependency loops
  const onAnimatingRef = useRef(onAnimating);
  onAnimatingRef.current = onAnimating;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Typewriter for generate mode
  const { visibleLines, isComplete: typewriterDone } = useTypewriter({
    lines: contract.lines,
    speed: 80,
    startDelay: 800,
    enabled: mode === "generate",
  });

  // Set animating state for generate mode
  useEffect(() => {
    if (mode === "generate") {
      onAnimatingRef.current(!typewriterDone);
      if (typewriterDone) {
        onCompleteRef.current();
        setIsDone(true);
      }
    }
  }, [mode, typewriterDone]);

  // Load annotations for walkthrough mode
  useEffect(() => {
    if (mode === "walkthrough") {
      const annots = mockAnnotations[path];
      setAnnotations(annots);
      onCompleteRef.current();
    }
  }, [mode, path]);

  // Cycle annotations
  useEffect(() => {
    if (mode !== "walkthrough" || annotations.length === 0) return;

    const timer = setInterval(() => {
      setActiveAnnotation((prev) => (prev + 1) % annotations.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [mode, annotations.length]);

  // Build console logs
  useEffect(() => {
    if (mode !== "build") return;
    onAnimatingRef.current(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < buildLogs.length) {
        const line = buildLogs[i];
        i++;
        setConsoleLines((prev) => [...prev, line]);
      } else {
        clearInterval(interval);
        onAnimatingRef.current(false);
        onCompleteRef.current();
        setIsDone(true);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [mode]);

  // Display mode: mark complete immediately
  useEffect(() => {
    if (mode === "display") {
      onCompleteRef.current();
    }
  }, [mode]);

  // Lines to display
  const displayLines =
    mode === "generate" ? visibleLines : contract.lines;

  const currentAnnotation = annotations[activeAnnotation];
  const labels = modeLabels[mode];

  return (
    <div className={`h-full min-h-0 flex ${mode === "build" ? "flex-col" : "flex-row"}`}>
      {/* Editor */}
      <div className="flex-1 min-h-0 flex flex-col min-w-0">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/15 bg-white/5 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent-warm/60" />
            <div className="w-2 h-2 rounded-full bg-blue-light/60" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
          <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary ml-2">
            {contract.filename}
          </span>

          {/* Live status in title bar */}
          <div className="ml-auto flex items-center gap-2">
            {mode === "generate" && !typewriterDone && (
              <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-primary animate-pulse" />
                {labels.active}
              </span>
            )}
            {mode === "generate" && typewriterDone && (
              <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                {labels.done}
              </span>
            )}
            {mode === "build" && consoleLines.length > 0 && consoleLines.length < buildLogs.length && (
              <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-primary animate-pulse" />
                {labels.active}
              </span>
            )}
            {mode === "build" && isDone && (
              <span className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                {labels.done}
              </span>
            )}
          </div>
        </div>

        {/* Code area */}
        <div className="flex-1 min-h-0 overflow-auto p-4 bg-bg-primary/50 relative" data-lenis-prevent>
          <div className="font-[family-name:var(--font-cs-caleb-mono)] text-[13px] leading-[1.8]">
            {displayLines.map((line, i) => {
              const isHighlighted =
                mode === "walkthrough" &&
                currentAnnotation &&
                i + 1 >= currentAnnotation.lineStart &&
                i + 1 <= currentAnnotation.lineEnd;

              return (
                <div
                  key={i}
                  className={`flex transition-colors duration-300 ${
                    isHighlighted ? "bg-blue-pale/40 rounded" : ""
                  }`}
                >
                  <span className="w-8 shrink-0 text-right pr-4 text-text-secondary/55 select-none text-xs">
                    {i + 1}
                  </span>
                  <span
                    className="whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }}
                  />
                </div>
              );
            })}
            {/* Cursor for generate mode */}
            {mode === "generate" && !typewriterDone && (
              <div className="flex">
                <span className="w-8 shrink-0" />
                <span className="cursor-blink-underscore font-bold">_</span>
              </div>
            )}
          </div>

          {/* Inline completion banner */}
          <AnimatePresence>
            {isDone && (mode === "generate" || mode === "build") && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="sticky bottom-0 left-0 right-0 mt-4"
              >
                <div className="rounded-lg p-4 flex items-center justify-between gap-4 mx-4 mb-2 border border-blue-light/40" style={{ background: "rgba(220, 232, 245, 0.95)", boxShadow: "var(--shadow-medium)" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-green-600/15 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-green-700" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6l3 3 5-5" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                        {labels.done}
                      </p>
                      <p className="text-[11px] text-text-secondary font-[family-name:var(--font-dm-sans)] truncate">
                        {labels.doneDetail}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onNext}
                    className="shrink-0 group inline-flex items-center gap-1.5 px-4 py-2 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all active:scale-[0.97] cursor-pointer"
                  >
                    Continue
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Annotation panel for walkthrough mode */}
      {mode === "walkthrough" && annotations.length > 0 && (
        <div className="w-[320px] shrink-0 border-l border-white/15 glass-deep p-4 overflow-auto flex flex-col" data-lenis-prevent>
          <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-4">
            Code Walkthrough
          </h4>

          {/* Annotation counter */}
          <p className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/70 mb-3">
            {activeAnnotation + 1} / {annotations.length} annotations
          </p>

          <AnimatePresence mode="wait">
            {currentAnnotation && (
              <motion.div
                key={activeAnnotation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="glass-blue rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
                  <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                    Lines {currentAnnotation.lineStart}-{currentAnnotation.lineEnd}
                  </span>
                </div>
                <h5 className="text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
                  {currentAnnotation.title}
                </h5>
                <p className="mt-2 text-xs text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
                  {currentAnnotation.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Annotation nav buttons */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setActiveAnnotation((prev) => Math.max(0, prev - 1))}
              disabled={activeAnnotation === 0}
              className="p-1.5 rounded-md hover:bg-border/40 disabled:opacity-30 transition-all"
            >
              <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 4l-4 4 4 4" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {annotations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveAnnotation(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === activeAnnotation ? "bg-blue-primary" : "bg-border hover:bg-blue-light"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveAnnotation((prev) => Math.min(annotations.length - 1, prev + 1))}
              disabled={activeAnnotation === annotations.length - 1}
              className="p-1.5 rounded-md hover:bg-border/40 disabled:opacity-30 transition-all"
            >
              <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </button>
          </div>

          {/* Walkthrough hint */}
          <p className="mt-auto pt-4 text-[10px] text-text-secondary/60 font-[family-name:var(--font-cs-caleb-mono)] text-center">
            {labels.doneDetail}
          </p>
        </div>
      )}

      {/* Console for build mode */}
      {mode === "build" && (
        <div className="glass-deep border-t border-white/20 h-40 overflow-auto shrink-0" data-lenis-prevent>
          <div className="flex items-center gap-2 px-4 h-7 border-b border-white/15">
            <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-primary">
              Console
            </span>
            {consoleLines.length > 0 && consoleLines.length < buildLogs.length && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-primary animate-pulse" />
            )}
            {isDone && (
              <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800 ml-auto">
                Exit code: 0
              </span>
            )}
          </div>
          <div className="p-3 font-[family-name:var(--font-cs-caleb-mono)] text-[11px] leading-[1.6] space-y-0.5">
            {consoleLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={
                  line.color === "blue"
                    ? "text-blue-primary"
                    : line.color === "green"
                      ? "text-green-800"
                      : "text-text-secondary"
                }
              >
                {line.text}
              </motion.p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

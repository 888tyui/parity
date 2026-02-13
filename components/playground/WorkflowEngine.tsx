"use client";

import { useReducer, useMemo, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { UserPath, StepConfig, AnalysisResult } from "@/types/playground";
import WelcomeStep from "./steps/WelcomeStep";
import EditorStep from "./steps/EditorStep";
import AnalysisStep from "./steps/AnalysisStep";
import ResultsStep from "./steps/ResultsStep";

// ========================================
// Step configurations per path
// ========================================

const pathSteps: Record<UserPath, StepConfig[]> = {
  beginner: [
    { id: "welcome", title: "Welcome", subtitle: "Introduction", component: "welcome" },
    { id: "generate", title: "Generate", subtitle: "AI Code Generation", component: "editor", props: { mode: "generate" } },
    { id: "walkthrough", title: "Walkthrough", subtitle: "Code Explained", component: "editor", props: { mode: "walkthrough" } },
    { id: "build", title: "Build", subtitle: "Compile Program", component: "editor", props: { mode: "build" } },
    { id: "analysis", title: "Analysis", subtitle: "Agent Scan", component: "analysis" },
    { id: "results", title: "Results", subtitle: "Security Report", component: "results" },
  ],
  developer: [
    { id: "welcome", title: "Welcome", subtitle: "Audit Challenge", component: "welcome" },
    { id: "review", title: "Review", subtitle: "Contract Code", component: "editor", props: { mode: "display" } },
    { id: "analysis", title: "Analysis", subtitle: "Agent Scan", component: "analysis" },
    { id: "findings", title: "Findings", subtitle: "Vulnerabilities", component: "results", props: { showOptimized: true } },
    { id: "summary", title: "Summary", subtitle: "Final Report", component: "results", props: { isSummary: true } },
  ],
  explorer: [
    { id: "welcome", title: "Welcome", subtitle: "What is Parity?", component: "welcome" },
    { id: "demo", title: "Demo", subtitle: "Live Contract", component: "editor", props: { mode: "display" } },
    { id: "analysis", title: "Analysis", subtitle: "Agent Scan", component: "analysis" },
    { id: "results", title: "Results", subtitle: "Analysis Report", component: "results" },
    { id: "getstarted", title: "Get Started", subtitle: "Next Steps", component: "results", props: { isSummary: true } },
  ],
};

// Context-aware button labels
const nextButtonLabels: Record<string, string> = {
  welcome: "Let's Go",
  generate: "Continue",
  walkthrough: "Continue",
  build: "Run Analysis",
  review: "Run Analysis",
  demo: "Run Analysis",
  analysis: "View Results",
  results: "Continue",
  findings: "View Summary",
  getstarted: "Connect Wallet",
  summary: "Connect Wallet",
};

// Active step status messages
const activeStatusMessages: Record<string, string> = {
  generate: "AI is generating code...",
  build: "Compiling program...",
  analysis: "Agent is scanning...",
};

// ========================================
// Reducer
// ========================================

interface WorkflowState {
  currentStepIndex: number;
  isAnimating: boolean;
  analysisResult: AnalysisResult | null;
  stepCompleted: Record<number, boolean>;
}

type WorkflowAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_ANIMATING"; payload: boolean }
  | { type: "SET_ANALYSIS_RESULT"; payload: AnalysisResult }
  | { type: "MARK_STEP_COMPLETED"; payload: number }
  | { type: "RESET" };

function reducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStepIndex: state.currentStepIndex + 1,
        stepCompleted: { ...state.stepCompleted, [state.currentStepIndex]: true },
      };
    case "PREV_STEP":
      return { ...state, currentStepIndex: Math.max(0, state.currentStepIndex - 1) };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.payload };
    case "SET_ANALYSIS_RESULT":
      return { ...state, analysisResult: action.payload };
    case "MARK_STEP_COMPLETED":
      return { ...state, stepCompleted: { ...state.stepCompleted, [action.payload]: true } };
    case "RESET":
      return { currentStepIndex: 0, isAnimating: false, analysisResult: null, stepCompleted: {} };
    default:
      return state;
  }
}

// ========================================
// Checkmark icon
// ========================================

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className ?? "w-3 h-3"} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}

// ========================================
// Component
// ========================================

interface WorkflowEngineProps {
  path: UserPath;
  onReset: () => void;
}

export default function WorkflowEngine({ path, onReset }: WorkflowEngineProps) {
  const steps = useMemo(() => pathSteps[path], [path]);

  const [state, dispatch] = useReducer(reducer, {
    currentStepIndex: 0,
    isAnimating: false,
    analysisResult: null,
    stepCompleted: {},
  });

  const currentStep = steps[state.currentStepIndex];
  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === steps.length - 1;
  const isCurrentStepCompleted = !!state.stepCompleted[state.currentStepIndex];

  const nextLabel = nextButtonLabels[currentStep.id] ?? "Next";

  // Status message for the current step
  const statusMessage = state.isAnimating
    ? activeStatusMessages[currentStep.id] ?? null
    : isCurrentStepCompleted
      ? "Ready to continue"
      : null;

  const handleNext = useCallback(() => {
    if (state.currentStepIndex < steps.length - 1) {
      dispatch({ type: "NEXT_STEP" });
    }
  }, [state.currentStepIndex, steps.length]);

  const handlePrev = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const setAnimating = useCallback((v: boolean) => {
    dispatch({ type: "SET_ANIMATING", payload: v });
  }, []);

  const setAnalysisResult = useCallback((r: AnalysisResult) => {
    dispatch({ type: "SET_ANALYSIS_RESULT", payload: r });
  }, []);

  const markStepCompleted = useCallback((idx: number) => {
    dispatch({ type: "MARK_STEP_COMPLETED", payload: idx });
  }, []);

  // Stable ref for currentStepIndex so callbacks don't depend on it
  const stepIndexRef = useRef(state.currentStepIndex);
  stepIndexRef.current = state.currentStepIndex;

  const handleStepComplete = useCallback(() => {
    markStepCompleted(stepIndexRef.current);
  }, [markStepCompleted]);

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setAnalysisResult(result);
    markStepCompleted(stepIndexRef.current);
  }, [setAnalysisResult, markStepCompleted]);

  // Keyboard shortcut: Enter to go next
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !state.isAnimating && !isLastStep) {
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, state.isAnimating, isLastStep]);

  // Render step component
  function renderStep() {
    const commonProps = {
      path,
      onNext: handleNext,
      onAnimating: setAnimating,
    };

    switch (currentStep.component) {
      case "welcome":
        return <WelcomeStep key={currentStep.id} {...commonProps} />;
      case "editor":
        return (
          <EditorStep
            key={currentStep.id}
            {...commonProps}
            mode={(currentStep.props?.mode as "generate" | "walkthrough" | "display" | "build") ?? "display"}
            onComplete={handleStepComplete}
          />
        );
      case "analysis":
        return (
          <AnalysisStep
            key={currentStep.id}
            {...commonProps}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case "results":
        return (
          <ResultsStep
            key={currentStep.id}
            {...commonProps}
            analysisResult={state.analysisResult}
            showOptimized={!!currentStep.props?.showOptimized}
            isSummary={!!currentStep.props?.isSummary}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ── Header ── */}
      <div className="glass-strong border-b border-white/20 shrink-0">
        {/* Top row: logo + step title + reset */}
        <div className="px-5 py-2.5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo-trs.png" alt="Parity" width={18} height={18} className="w-[18px] h-[18px]" />
            <span className="font-[family-name:var(--font-cs-caleb-mono)] text-xs tracking-[0.2em] text-text-secondary">
              PARITY
            </span>
          </Link>

          {/* Current step indicator */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
              STEP {state.currentStepIndex + 1} OF {steps.length}
            </span>
            <div className="w-px h-3.5 bg-border" />
            <span className="text-xs font-[family-name:var(--font-dm-sans)] font-medium text-text-primary">
              {currentStep.title}
            </span>
            <span className="text-[10px] font-[family-name:var(--font-dm-sans)] text-text-secondary hidden sm:inline">
              — {currentStep.subtitle}
            </span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-[11px] font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l10 10M11 1L1 11" />
            </svg>
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>

        {/* Step progress bar */}
        <div className="px-5 pb-2.5 flex items-center gap-1.5">
          {steps.map((step, i) => {
            const completed = i < state.currentStepIndex || state.stepCompleted[i];
            const active = i === state.currentStepIndex;

            return (
              <div key={step.id} className="flex-1 flex items-center gap-1.5">
                {/* Segment bar */}
                <div className="flex-1 h-1 rounded-full overflow-hidden bg-border/60">
                  <motion.div
                    className={`h-full rounded-full ${
                      completed ? "bg-blue-light" : active ? "bg-blue-primary" : "bg-transparent"
                    }`}
                    initial={false}
                    animate={{ width: completed ? "100%" : active ? (state.isAnimating ? "60%" : "100%") : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" as const }}
                  />
                </div>
                {/* Completed checkmark on last segment */}
                {i === steps.length - 1 ? null : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step content ── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" as const }}
            className="h-full overflow-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation ── */}
      <div className="glass-deep border-t border-white/20 px-5 py-3 shrink-0">
        <div className="flex items-center justify-between">
          {/* Left: Back or status */}
          <div className="flex items-center gap-3 min-w-0">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:border-blue-light transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 4l-4 4 4 4" />
                </svg>
                Back
              </button>
            )}

            {/* Live status indicator */}
            <AnimatePresence mode="wait">
              {statusMessage && (
                <motion.div
                  key={statusMessage}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="flex items-center gap-2 min-w-0"
                >
                  {state.isAnimating ? (
                    <div className="w-2 h-2 rounded-full bg-blue-primary animate-pulse shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-green-600/15 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-2.5 h-2.5 text-green-700" />
                    </div>
                  )}
                  <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary truncate">
                    {statusMessage}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Next action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Skip link (not on last step or welcome) */}
            {!isLastStep && currentStep.component !== "welcome" && (
              <button
                onClick={handleNext}
                className="text-[11px] font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
              >
                Skip step
              </button>
            )}

            {/* Primary action button */}
            {!isLastStep ? (
              <button
                onClick={handleNext}
                disabled={state.isAnimating}
                className="group flex items-center gap-2 px-5 py-2.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
              >
                {nextLabel}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </button>
            ) : (
              <button className="group flex items-center gap-2 px-5 py-2.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]">
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="12" height="10" rx="2" />
                  <path d="M5 4V3a3 3 0 016 0v1" />
                </svg>
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Keyboard hint */}
        {!state.isAnimating && !isLastStep && (
          <div className="mt-1.5 text-right">
            <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/50">
              press <kbd className="px-1 py-0.5 rounded bg-border/40 text-text-secondary/70 text-[9px]">Enter</kbd> to continue
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

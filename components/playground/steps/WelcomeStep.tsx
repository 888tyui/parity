"use client";

import { motion } from "framer-motion";
import type { UserPath } from "@/types/playground";
import { welcomeContent } from "@/lib/playground/mock-data";

interface WelcomeStepProps {
  path: UserPath;
  onNext: () => void;
  onAnimating: (v: boolean) => void;
}

export default function WelcomeStep({ path, onNext }: WelcomeStepProps) {
  const content = welcomeContent[path];

  return (
    <div className="flex items-center justify-center h-full min-h-0 overflow-auto p-6">
      <div className="max-w-lg w-full shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-blue rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-primary" />
            <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-deep tracking-wider uppercase">
              {path === "beginner" ? "Guided Tutorial" : path === "developer" ? "Security Audit" : "Platform Demo"}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-[family-name:var(--font-cs-caleb-mono)] text-3xl sm:text-4xl tracking-tight text-text-primary leading-tight">
            {content.title}
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-lg font-[family-name:var(--font-instrument-serif)] italic text-text-secondary">
            {content.subtitle}
          </p>

          <div className="mt-4 editorial-rule-blue" />

          {/* Description */}
          <p className="mt-5 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 space-y-3"
        >
          {content.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full glass-blue flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                  {i + 1}
                </span>
              </div>
              <span className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)]">
                {feature}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Inline CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={onNext}
            className="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97] cursor-pointer"
          >
            {path === "beginner" ? "Start Building" : path === "developer" ? "Begin Audit" : "See Demo"}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
          <p className="mt-3 text-[10px] text-text-secondary/60 font-[family-name:var(--font-cs-caleb-mono)]">
            or press <kbd className="px-1 py-0.5 rounded bg-border/40 text-text-secondary/70 text-[9px]">Enter</kbd>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

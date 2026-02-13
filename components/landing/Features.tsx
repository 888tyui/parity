"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    title: "In-Browser Editor",
    description:
      "Full-featured code editor with Rust/Anchor syntax highlighting and autocomplete.",
    size: "large",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <path d="M2 7h16" />
        <path d="M7 11l2 2-2 2" />
        <path d="M12 15h4" />
      </svg>
    ),
  },
  {
    title: "Agent Skills",
    description: "SKILL.md-based composable skills for vulnerability scanning, best-practice checks, and gas optimization — chainable via ClawHub registry.",
    size: "small",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="8" r="4" />
        <path d="M4 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    title: "Audit Trail",
    description: "Immutable record of all verification steps and agent decisions.",
    size: "small",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 3h8l3 3v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5l3-2z" />
        <path d="M7 10h6M7 14h4" />
      </svg>
    ),
  },
  {
    title: "TypeScript SDK",
    description:
      "Integrate contract analysis into your CI/CD pipeline with the Parity SDK.",
    size: "small",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 5l-5 5 5 5" />
        <path d="M13 5l5 5-5 5" />
      </svg>
    ),
  },
  {
    title: "Devnet Deploy",
    description:
      "One-click deployment to Solana devnet with automatic program verification.",
    size: "small",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 2v12M6 10l4 4 4-4" />
        <path d="M3 16v1a2 2 0 002 2h10a2 2 0 002-2v-1" />
      </svg>
    ),
  },
  {
    title: "Open Source",
    description:
      "Fully open-source protocol with transparent agent logic and community-driven development.",
    size: "small",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 2a14 14 0 014 8 14 14 0 01-4 8 14 14 0 01-4-8 14 14 0 014-8z" />
        <path d="M2 10h16" />
      </svg>
    ),
  },
  {
    title: "Agent-Ready Skills & APIs",
    description:
      "Parity provides composable skills and APIs that give any AI agent — OpenClaw, Claude Code, Cursor, OpenCode — audit-level code review context for autonomous vulnerability scanning and verification.",
    size: "large",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 4l7 4 7-4" />
        <path d="M3 4v8l7 4 7-4V4" />
        <path d="M10 8v8" />
      </svg>
    ),
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="editorial-rule mb-6" />
          <h2 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm tracking-[0.3em] uppercase text-text-secondary">
            Capabilities
          </h2>
          <p className="mt-4 font-[family-name:var(--font-instrument-serif)] italic text-3xl sm:text-4xl text-text-primary max-w-xl leading-snug">
            Everything you need to{" "}
            <span className="text-blue-primary font-[family-name:var(--font-pixerif)] not-italic">
              build
            </span>{" "}
            with certainty
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08 * (i + 1) }}
              className={`group glass rounded-xl p-7 hover:border-blue-light/50 transition-all duration-300 tilt-card depth-card ${
                feature.size === "large" ? "lg:col-span-2" : ""
              }`}
            >
              {/* Icon + accent line */}
              <div className="flex items-center gap-3 mb-5">
                <div className="text-blue-primary/60 group-hover:text-blue-primary transition-colors duration-300 icon-bounce">
                  {feature.icon}
                </div>
                <div className="flex-1 h-px bg-border/50 group-hover:bg-blue-light/50 transition-colors duration-500" />
              </div>

              <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary group-hover:text-blue-deep transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

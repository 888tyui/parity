"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const pillars = [
  {
    number: "01",
    title: "Solana Playground",
    description:
      "An in-browser contract editor with syntax highlighting, build tools, and deployment support for Solana programs.",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="26" height="22" rx="2" />
        <path d="M3 11h26" />
        <path d="M10 17l3 3-3 3" />
        <path d="M17 23h6" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI Agent Analysis",
    description:
      "Parity skills and APIs provide audit-level code review context to any AI agent — from OpenClaw to Cursor and Claude Code — enabling deep vulnerability scanning and verification.",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="16" cy="12" r="7" />
        <path d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <path d="M22 8l4-4" />
        <circle cx="26" cy="4" r="2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "SDK & Skills",
    description:
      "A TypeScript Plugin SDK with hot-reloadable skills and CLI-friendly ClawHub API for integrating contract analysis into your CI/CD workflow.",
    icon: (
      <svg
        className="w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 8l12 8-12 8V8z" />
        <path d="M18 8h10" />
        <path d="M18 16h10" />
        <path d="M18 24h10" />
      </svg>
    ),
  },
];

export default function ProtocolOverview() {
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
            Protocol
          </h2>
          <p className="mt-4 font-[family-name:var(--font-instrument-serif)] italic text-3xl sm:text-4xl text-text-primary max-w-xl leading-snug">
            Three pillars of{" "}
            <span className="text-blue-primary font-[family-name:var(--font-pixerif)] not-italic">
              contract
            </span>{" "}
            intelligence
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
              className="group"
            >
              <div className="glass rounded-xl p-8 h-full hover:border-blue-light/50 transition-all duration-300 tilt-card depth-card">
                {/* Number */}
                <span className="font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary tracking-widest">
                  {pillar.number}
                </span>

                {/* Icon */}
                <div className="mt-5 text-blue-primary group-hover:text-blue-deep transition-colors icon-bounce">
                  {pillar.icon}
                </div>

                {/* Title */}
                <h3 className="mt-5 font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

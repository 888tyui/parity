"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Write",
    subtitle: "Author your contract",
    description:
      "Open the playground and write your Solana program with full editor support — syntax highlighting, autocomplete, and built-in Anchor framework templates.",
  },
  {
    step: "02",
    title: "Analyze",
    subtitle: "AI agent verification",
    description:
      "Trigger Parity skills to scan your contract. Composable workflows check for vulnerabilities, logic errors, and Solana best practices — giving any connected agent full audit context.",
  },
  {
    step: "03",
    title: "Iterate",
    subtitle: "Refine with confidence",
    description:
      "Review the agent's analysis, apply suggested fixes, and re-verify. Each iteration builds a verifiable audit trail for your contract.",
  },
  {
    step: "04",
    title: "Deploy",
    subtitle: "Ship with certainty",
    description:
      "Deploy your verified contract to Solana devnet or mainnet directly from the playground with full audit documentation.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-bg-deep relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-right"
        >
          <div className="editorial-rule ml-auto mb-6" />
          <h2 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm tracking-[0.3em] uppercase text-text-secondary">
            Process
          </h2>
          <p className="mt-4 font-[family-name:var(--font-instrument-serif)] italic text-3xl sm:text-4xl text-text-primary max-w-xl ml-auto leading-snug">
            From{" "}
            <span className="text-blue-primary font-[family-name:var(--font-pixerif)] not-italic">
              code
            </span>{" "}
            to verified deployment
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
              className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 py-12 border-t border-white/20 ${
                i % 2 !== 0 ? "md:flex-row-reverse md:text-right" : ""
              }`}
            >
              {/* Step number */}
              <div className="shrink-0">
                <span className="step-number font-[family-name:var(--font-cs-caleb-mono)] text-6xl sm:text-7xl text-blue-light leading-none inline-block" style={{ textShadow: '0 2px 20px rgba(52, 84, 209, 0.08)' }}>
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <div className="max-w-lg group/step">
                <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-2xl text-text-primary group-hover/step:text-blue-deep transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-instrument-serif)] italic text-lg text-text-secondary">
                  {item.subtitle}
                </p>
                <div className="w-0 h-0.5 bg-blue-primary/40 group-hover/step:w-12 transition-all duration-500 mt-3" />
                <p className="mt-4 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

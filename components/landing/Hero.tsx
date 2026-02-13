"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GradientOrb from "@/components/ui/GradientOrb";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

function CodePreview() {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Editor chrome */}
      <div className="glass-strong rounded-xl overflow-hidden" style={{ boxShadow: 'var(--shadow-elevated), var(--shadow-blue-glow)' }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/20 bg-white/10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-warm/60 hover:bg-accent-warm transition-colors cursor-pointer" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-light/60 hover:bg-blue-light transition-colors cursor-pointer" />
            <div className="w-2.5 h-2.5 rounded-full bg-border hover:bg-text-secondary transition-colors cursor-pointer" />
          </div>
          <span className="text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary ml-2">
            counter.rs
          </span>
        </div>
        {/* Code content */}
        <div className="p-5 font-[family-name:var(--font-cs-caleb-mono)] text-[13px] leading-relaxed">
          <div className="text-text-secondary">
            <span className="text-blue-primary">use</span>{" "}
            anchor_lang::prelude::*;
          </div>
          <div className="mt-3 text-text-secondary">
            <span className="text-blue-primary">#[program]</span>
          </div>
          <div>
            <span className="text-blue-primary">pub mod</span>{" "}
            <span className="text-blue-deep">counter</span> {"{"}
          </div>
          <div className="pl-4">
            <span className="text-blue-primary">use super</span>::*;
          </div>
          <div className="mt-2 pl-4">
            <span className="text-blue-primary">pub fn</span>{" "}
            <span className="text-accent-warm">initialize</span>(
          </div>
          <div className="pl-8">
            ctx: Context&lt;Initialize&gt;,
          </div>
          <div className="pl-4">
            ) -&gt; <span className="text-blue-primary">Result</span>&lt;()&gt;{" "}
            {"{"}
          </div>
          <div className="pl-8 text-text-secondary">
            <span className="text-text-secondary">// AI verified: safe</span>
          </div>
          <div className="pl-8">
            ctx.accounts.counter.count ={" "}
            <span className="text-blue-primary">0</span>;
          </div>
          <div className="pl-8">
            <span className="text-blue-primary">Ok</span>(())
          </div>
          <div className="pl-4">{"}"}</div>
          <div>{"}"}</div>
        </div>
      </div>

      {/* Floating analysis badge */}
      <motion.div
        initial={{ opacity: 0, y: 10, x: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute -bottom-4 -right-4 glass-blue rounded-lg px-4 py-2.5 depth-elevated animate-float"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-blue-deep">
            Agent: No vulnerabilities
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
    >
      {/* Gradient Orbs */}
      <GradientOrb
        size={500}
        top="-10%"
        right="-5%"
        animation={1}
        opacity={0.25}
        blur={100}
      />
      <GradientOrb
        size={350}
        bottom="10%"
        left="-8%"
        animation={2}
        opacity={0.2}
        blur={90}
        color1="var(--blue-pale)"
        color2="var(--blue-light)"
      />
      <GradientOrb
        size={200}
        top="40%"
        right="30%"
        animation={3}
        opacity={0.15}
        blur={70}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="relative z-10">
            {/* Badge — temporarily hidden
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <a href="https://www.ammchallenge.com/prop-amm" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                <Badge>Prop AMM Leaderboard #4</Badge>
              </a>
            </motion.div>
            */}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 font-[family-name:var(--font-cs-caleb-mono)] text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-text-primary"
            >
              PARITY<span className="cursor-blink-underscore">_</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-xl sm:text-2xl leading-relaxed font-[family-name:var(--font-instrument-serif)] italic text-text-secondary max-w-lg"
            >
              Where Solana contracts meet{" "}
              <span className="text-blue-primary not-italic font-[family-name:var(--font-pixerif)]">
                intelligent
              </span>{" "}
              verification
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
              className="mt-4 editorial-rule-blue"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 text-base text-text-secondary leading-relaxed max-w-md font-[family-name:var(--font-dm-sans)]"
            >
              A smart contract framework with composable skills and APIs that
              enable AI agents — from Cursor to Claude Code — to perform
              audit-level code review. Write, test, and verify Solana programs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/playground">
                <Button variant="primary" size="lg">
                  Open Playground
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  Read Docs
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -5 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-10 lg:pl-8"
            style={{ perspective: "1000px" }}
          >
            <CodePreview />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="scroll-indicator flex flex-col items-center gap-2">
            <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary tracking-widest uppercase">
              Scroll
            </span>
            <svg
              className="w-4 h-4 text-text-secondary"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M8 2v10M4 8l4 4 4-4" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

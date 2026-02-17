"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import GradientOrb from "@/components/ui/GradientOrb";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-screen bg-bg-primary">
      <GradientOrb size={400} top="-5%" right="10%" animation={1} opacity={0.2} blur={100} />
      <GradientOrb size={300} bottom="5%" left="-5%" animation={2} opacity={0.15} blur={90} color1="var(--blue-pale)" color2="var(--blue-light)" />

      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        {/* Home link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute top-6 left-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-blue-primary transition-colors group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M13 8H3M7 4l-4 4 4 4" />
            </svg>
            <span className="text-xs font-[family-name:var(--font-dm-sans)] font-medium">
              Home
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-3xl sm:text-4xl tracking-tight text-text-primary">
            {title}
          </h1>
          <div className="mt-4 editorial-rule-blue mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <div className="glass-strong rounded-xl p-8 depth-card">
            {/* Construction icon */}
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-pale/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            </div>

            <p className="font-[family-name:var(--font-cs-caleb-mono)] text-xl text-blue-primary tracking-wide">
              currently building!
            </p>
            <p className="mt-3 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
              We&apos;re actively working on this feature. Follow our progress on X for the latest updates.
            </p>

            <div className="mt-6 flex items-center justify-center gap-4">
              <a
                href="https://x.com/paritydotcx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-blue-primary hover:text-blue-deep transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow @paritydotcx
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

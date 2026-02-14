"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import GradientOrb from "@/components/ui/GradientOrb";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showGithubToast, setShowGithubToast] = useState(false);

  const handleGithubClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGithubToast(true);
    setTimeout(() => setShowGithubToast(false), 3000);
  };

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="relative py-32 glass-deep">
        <GradientOrb
          size={300}
          top="20%"
          right="10%"
          animation={2}
          opacity={0.15}
          blur={80}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-[family-name:var(--font-cs-caleb-mono)] text-3xl sm:text-4xl lg:text-5xl text-text-primary"
          >
            Start building with{" "}
            <span className="text-blue-primary">PARITY</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 font-[family-name:var(--font-instrument-serif)] italic text-xl text-text-secondary max-w-lg mx-auto"
          >
            Join the future of verified Solana development
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link href="/playground">
              <Button variant="primary" size="lg">
                Open Playground
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                Explore the Docs
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer links */}
      <div className="border-t border-white/20 glass-warm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
            >
              <Image src="/logo-trs.png" alt="Parity" width={20} height={20} className="w-5 h-5" />
              <span className="font-[family-name:var(--font-cs-caleb-mono)] text-sm tracking-[0.3em] text-text-secondary">
                PARITY
              </span>
            </Link>

            {/* Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/playground"
                className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
              >
                Playground
              </Link>
              <Link
                href="/docs"
                className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300"
              >
                Docs
              </Link>
              <button
                onClick={handleGithubClick}
                className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 cursor-pointer"
              >
                GitHub
              </button>
            </div>

            {/* GitHub toast */}
            {showGithubToast && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass-strong rounded-lg px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up">
                <p className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
                  Open source materials will be available soon.
                </p>
              </div>
            )}

            {/* Copyright */}
            <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
              &copy; {new Date().getFullYear()} Parity Protocol
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { UserPath } from "@/types/playground";
import GradientOrb from "@/components/ui/GradientOrb";

interface SelectionScreenProps {
  onSelect: (path: UserPath) => void;
}

const paths: { id: UserPath; icon: React.ReactNode; title: string; description: string; cta: string }[] = [
  {
    id: "beginner",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 10v8M12 18h8" />
        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.2" />
      </svg>
    ),
    title: "New to Solana",
    description: "Build your first smart contract with AI. We'll guide you through every step.",
    cta: "Start Learning",
  },
  {
    id: "developer",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 8l-6 8 6 8M22 8l6 8-6 8" />
        <path d="M18 6l-4 20" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Developer",
    description: "Challenge our AI with a vulnerable contract. See if Parity catches every bug.",
    cta: "Run Audit",
  },
  {
    id: "explorer",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="12" />
        <path d="M12 12l8 4-4 8-8-4z" fill="currentColor" opacity="0.15" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Discover Parity",
    description: "Watch a live demo of AI-powered contract analysis. No coding required.",
    cta: "Explore",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <GradientOrb size={400} top="-5%" right="10%" animation={1} opacity={0.2} blur={100} />
      <GradientOrb size={300} bottom="5%" left="-5%" animation={2} opacity={0.15} blur={90} color1="var(--blue-pale)" color2="var(--blue-light)" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-3xl sm:text-4xl tracking-tight text-text-primary">
            PARITY PLAYGROUND
          </h1>
          <p className="mt-3 text-base text-text-secondary font-[family-name:var(--font-dm-sans)] max-w-md mx-auto">
            Choose your experience to explore Solana smart contract development with AI
          </p>
          <div className="mt-4 editorial-rule-blue mx-auto" />
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-5"
        >
          {paths.map((path) => (
            <motion.button
              key={path.id}
              variants={cardVariants}
              onClick={() => onSelect(path.id)}
              className="glass tilt-card depth-card rounded-xl p-6 text-left group cursor-pointer transition-all hover:border-blue-light/50"
            >
              <div className="text-blue-primary mb-4 icon-bounce">
                {path.icon}
              </div>
              <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-lg text-text-primary tracking-wide">
                {path.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
                {path.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-blue-primary group-hover:text-blue-deep transition-colors">
                {path.cta}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

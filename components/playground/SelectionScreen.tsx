"use client";

import { motion } from "framer-motion";
import type { UserPath } from "@/types/playground";
import GradientOrb from "@/components/ui/GradientOrb";
import SubNav from "@/components/ui/SubNav";

interface SelectionScreenProps {
  onSelect: (path: UserPath) => void;
}

const paths: { id: UserPath; icon: React.ReactNode; title: string; description: string; cta: string }[] = [
  {
    id: "beginner",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M10 15h4" />
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.15" />
      </svg>
    ),
    title: "New to Solana",
    description: "Build your first smart contract with AI guidance. Step-by-step walkthrough included.",
    cta: "Start Learning",
  },
  {
    id: "developer",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
        <path d="M14 4l-4 16" strokeDasharray="2 2" />
      </svg>
    ),
    title: "Developer",
    description: "Challenge our AI with a vulnerable contract. See if Parity catches every bug.",
    cta: "Run Audit",
  },
  {
    id: "explorer",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 3-3 6-6-3z" fill="currentColor" opacity="0.12" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
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
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function SelectionScreen({ onSelect }: SelectionScreenProps) {
  return (
    <>
      <SubNav label="PLAYGROUND" rightLink={{ href: "/verepo", text: "Verepo" }} />
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Background orbs */}
        <GradientOrb size={450} top="-8%" right="5%" animation={1} opacity={0.18} blur={110} />
        <GradientOrb
          size={350}
          bottom="0%"
          left="-8%"
          animation={2}
          opacity={0.12}
          blur={100}
          color1="var(--blue-pale)"
          color2="var(--blue-light)"
        />
        <GradientOrb size={200} top="60%" right="30%" animation={3} opacity={0.08} blur={80} />

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <h1 className="font-[family-name:var(--font-cs-caleb-mono)] text-4xl sm:text-5xl tracking-tight text-text-primary">
              PLAYGROUND
            </h1>
            <p className="mt-4 text-base sm:text-lg text-text-secondary font-[family-name:var(--font-dm-sans)] max-w-lg mx-auto leading-relaxed">
              Explore Solana smart contract development with AI-powered analysis and guidance.
            </p>
            <div className="mt-5 editorial-rule-blue mx-auto" />
          </motion.div>

          {/* Three feature axes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 flex items-center justify-center gap-6 sm:gap-10"
          >
            {paths.map((path, i) => (
              <div key={path.id} className="flex items-center gap-6 sm:gap-10">
                <div className="text-center">
                  <div className="flex justify-center text-blue-primary">{path.icon}</div>
                  <p className="mt-1.5 font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-primary">
                    {path.title}
                  </p>
                  <p className="mt-0.5 text-[10px] font-[family-name:var(--font-dm-sans)] text-text-secondary">
                    {path.cta}
                  </p>
                </div>
                {i < paths.length - 1 && (
                  <div className="w-px h-10 bg-border/50" />
                )}
              </div>
            ))}
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid md:grid-cols-3 gap-4"
          >
            {paths.map((path) => (
              <motion.button
                key={path.id}
                variants={cardVariants}
                onClick={() => onSelect(path.id)}
                className="glass-strong depth-card rounded-xl p-5 text-left group cursor-pointer transition-all hover:shadow-[0_4px_24px_rgba(52,84,209,0.12),0_0_0_2px_rgba(52,84,209,0.15)]"
              >
                <div className="text-blue-primary mb-3">
                  {path.icon}
                </div>
                <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary tracking-wide">
                  {path.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)] leading-relaxed">
                  {path.description}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-blue-primary group-hover:text-blue-deep transition-colors">
                  {path.cta}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 text-center text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary/40"
          >
            AI-powered smart contract analysis. Build, audit, explore.
          </motion.p>
        </div>
      </div>
    </>
  );
}

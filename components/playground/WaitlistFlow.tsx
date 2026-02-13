"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { UserPath } from "@/types/playground";

type Phase = "connect" | "feedback" | "email" | "success";

interface WaitlistFlowProps {
  path: UserPath;
  onClose: () => void;
}

export default function WaitlistFlow({ path, onClose }: WaitlistFlowProps) {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [phase, setPhase] = useState<Phase>("connect");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-advance to feedback when wallet connects
  useEffect(() => {
    if (connected && publicKey && phase === "connect") {
      setPhase("feedback");
    }
  }, [connected, publicKey, phase]);

  const handleConnectClick = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleSubmitEmail = useCallback(async () => {
    if (!publicKey || !email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: publicKey.toBase58(),
          email,
          path,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }

      setPosition(data.position);
      setPhase("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [publicKey, email, path]);

  const handleGoHome = useCallback(() => {
    if (connected) disconnect();
    onClose();
  }, [connected, disconnect, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {/* ── Connect Phase ── */}
        {phase === "connect" && (
          <MotionCard key="connect">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-pale flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="14" rx="3" />
                  <path d="M7 6V5a5 5 0 0110 0v1" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-[family-name:var(--font-dm-sans)] font-semibold text-text-primary">
                  Connect Your Wallet
                </h2>
                <p className="mt-2 text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary max-w-xs">
                  Connect a Solana wallet to join the Parity waitlist and get early access.
                </p>
              </div>

              <button
                onClick={handleConnectClick}
                className="flex items-center gap-2 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="12" height="10" rx="2" />
                  <path d="M5 4V3a3 3 0 016 0v1" />
                </svg>
                Connect Wallet
              </button>

              <button
                onClick={onClose}
                className="text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
              >
                Go back
              </button>
            </div>
          </MotionCard>
        )}

        {/* ── Feedback Phase ── */}
        {phase === "feedback" && (
          <MotionCard key="feedback">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-[family-name:var(--font-dm-sans)] font-semibold text-text-primary">
                  Wallet Connected!
                </h2>
                <p className="mt-1 text-[11px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary truncate max-w-[240px]">
                  {publicKey?.toBase58()}
                </p>
              </div>

              <div>
                <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary">
                  How was the demo experience?
                </p>
                <p className="mt-1 text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary/70">
                  We&apos;d love for you to try the full product.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => setPhase("email")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
                >
                  Join Waitlist
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>

                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary border border-border rounded-lg hover:border-blue-light hover:text-text-primary transition-all"
                >
                  Go back to homepage
                </Link>
              </div>
            </div>
          </MotionCard>
        )}

        {/* ── Email Phase ── */}
        {phase === "email" && (
          <MotionCard key="email">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-pale flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="3" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-[family-name:var(--font-dm-sans)] font-semibold text-text-primary">
                  Almost There!
                </h2>
                <p className="mt-2 text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary max-w-xs">
                  Enter your email so we can notify you when Parity launches.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitEmail();
                }}
                className="w-full flex flex-col gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 text-sm font-[family-name:var(--font-dm-sans)] bg-bg-surface border border-border rounded-lg focus:outline-none focus:border-blue-primary focus:ring-1 focus:ring-blue-primary/20 text-text-primary placeholder:text-text-secondary/50 transition-all"
                />

                {error && (
                  <p className="text-xs font-[family-name:var(--font-dm-sans)] text-red-500">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Join Waitlist"
                  )}
                </button>
              </form>

              <button
                onClick={() => setPhase("feedback")}
                className="text-xs font-[family-name:var(--font-dm-sans)] text-text-secondary hover:text-text-primary transition-colors"
              >
                Go back
              </button>
            </div>
          </MotionCard>
        )}

        {/* ── Success Phase ── */}
        {phase === "success" && (
          <MotionCard key="success">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-blue-pale flex items-center justify-center">
                  <Image
                    src="/logo-trs.png"
                    alt="Parity"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-[family-name:var(--font-dm-sans)] font-semibold text-text-primary">
                  You&apos;re on the list!
                </h2>
                {position !== null && (
                  <p className="mt-2 text-2xl font-[family-name:var(--font-cs-caleb-mono)] font-bold text-blue-primary animate-score">
                    #{position}
                  </p>
                )}
                <p className="mt-2 text-sm font-[family-name:var(--font-dm-sans)] text-text-secondary max-w-xs">
                  We&apos;ll email you when Parity is ready. Thank you for your interest!
                </p>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 text-sm font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-lg hover:bg-blue-deep transition-all shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)] active:scale-[0.97]"
              >
                Back to Homepage
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </MotionCard>
        )}
      </AnimatePresence>
    </div>
  );
}

function MotionCard({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="glass-strong rounded-2xl p-8 w-[360px] max-w-[90vw] shadow-[var(--shadow-elevated)]"
      {...props}
    >
      {children}
    </motion.div>
  );
}

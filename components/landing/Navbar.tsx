"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const prtCa = process.env.NEXT_PUBLIC_PRT_CA || "";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showPrtToast, setShowPrtToast] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePrtClick = () => {
    if (prtCa) return; // will navigate via <a> tag
    setShowPrtToast(true);
    setTimeout(() => setShowPrtToast(false), 3000);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[rgba(248,250,252,0.78)] backdrop-blur-[24px] border-b border-white/30 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src="/logo-trs.png"
                alt="Parity"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-[family-name:var(--font-cs-caleb-mono)] text-lg tracking-widest text-text-primary">
                PARITY
              </span>
            </Link>

            <div className="w-px h-4 bg-border/60" />

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/paritydotcx/paritycx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors duration-300 p-1"
                aria-label="GitHub"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com/paritydotcx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors duration-300 p-1"
                aria-label="X (Twitter)"
              >
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/playground"
              className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 font-[family-name:var(--font-dm-sans)]"
            >
              Playground
            </Link>
            <Link
              href="/verepo"
              className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 font-[family-name:var(--font-dm-sans)]"
            >
              Verepo
            </Link>
            <Link
              href="/skills"
              className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 font-[family-name:var(--font-dm-sans)]"
            >
              Skills
            </Link>
            <Link
              href="/docs"
              className="nav-link text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 font-[family-name:var(--font-dm-sans)]"
            >
              Docs
            </Link>
            {prtCa ? (
              <a
                href={`https://pump.fun/coin/${prtCa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link text-sm text-blue-primary hover:text-blue-deep transition-colors duration-300 font-[family-name:var(--font-cs-caleb-mono)] cursor-pointer"
              >
                $PRT
              </a>
            ) : (
              <button
                onClick={handlePrtClick}
                className="nav-link text-sm text-blue-primary hover:text-blue-deep transition-colors duration-300 font-[family-name:var(--font-cs-caleb-mono)] cursor-pointer"
              >
                $PRT
              </button>
            )}
          </div>
        </div>
      </div>
      {/* $PRT toast */}
      {showPrtToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 glass-strong rounded-lg px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up">
          <p className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)] whitespace-nowrap">
            $PRT token details will be announced soon.
          </p>
        </div>
      )}
    </nav>
  );
}

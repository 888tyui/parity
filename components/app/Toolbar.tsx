"use client";

import { useState } from "react";
import Link from "next/link";

const tabs = [
  { name: "counter.rs", active: true },
  { name: "lib.rs", active: false },
];

export default function Toolbar() {
  const [activeTab, setActiveTab] = useState("counter.rs");

  return (
    <div className="flex items-center justify-between border-b border-white/20 glass-strong h-12 px-4">
      <div className="flex items-center gap-1">
        {/* Back to home */}
        <Link
          href="/"
          className="font-[family-name:var(--font-cs-caleb-mono)] text-xs tracking-[0.2em] text-text-secondary hover:text-blue-primary transition-colors mr-4"
        >
          PARITY
        </Link>

        <div className="w-px h-5 bg-border mr-3" />

        {/* File tabs */}
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`px-3 py-1.5 text-xs font-[family-name:var(--font-cs-caleb-mono)] rounded-md transition-colors ${
              activeTab === tab.name
                ? "bg-bg-primary text-text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Build button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium text-text-secondary hover:text-text-primary border border-white/40 rounded-md hover:border-blue-light bg-white/20 backdrop-blur-sm transition-colors">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
          Build
        </button>

        {/* Agent button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-[family-name:var(--font-dm-sans)] font-medium bg-blue-primary text-white rounded-md hover:bg-blue-deep transition-colors">
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="8" cy="6" r="4" />
            <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
          </svg>
          Analyze
        </button>
      </div>
    </div>
  );
}

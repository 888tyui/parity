"use client";

import { useState } from "react";

export default function ConsolePanel() {
  const [activeTab, setActiveTab] = useState<"console" | "output">("console");

  return (
    <div className="flex flex-col glass-deep border-t border-white/20">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-4 h-8 border-b border-white/15">
        <button
          onClick={() => setActiveTab("console")}
          className={`px-2 py-1 text-[11px] font-[family-name:var(--font-cs-caleb-mono)] rounded transition-colors ${
            activeTab === "console"
              ? "text-text-primary bg-bg-surface"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Console
        </button>
        <button
          onClick={() => setActiveTab("output")}
          className={`px-2 py-1 text-[11px] font-[family-name:var(--font-cs-caleb-mono)] rounded transition-colors ${
            activeTab === "output"
              ? "text-text-primary bg-bg-surface"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Output
        </button>
      </div>

      {/* Console content */}
      <div className="p-3 font-[family-name:var(--font-cs-caleb-mono)] text-[11px] leading-[1.6] overflow-auto h-32">
        {activeTab === "console" ? (
          <div className="space-y-0.5 text-text-secondary">
            <p>
              <span className="text-blue-primary">$</span> anchor build
            </p>
            <p className="text-green-800">
              Compiling counter program...
            </p>
            <p className="text-green-800">
              Build successful. Program ID: Fg6PaFpo...LnS
            </p>
            <p>
              <span className="text-blue-primary">$</span> parity analyze
              counter.rs
            </p>
            <p className="text-accent-warm">
              Running Parity skill chain...
            </p>
            <p className="text-green-800">
              Analysis complete. No critical issues found.
            </p>
          </div>
        ) : (
          <div className="text-text-secondary">
            <p>Program output will appear here after deployment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

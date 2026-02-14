"use client";

import { useState } from "react";
import Link from "next/link";

interface NavSection {
  title: string;
  items: { label: string; href: string }[];
}

const sections: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs#introduction" },
      { label: "Installation", href: "/docs#installation" },
      { label: "Quick Start", href: "/docs#quickstart" },
    ],
  },
  {
    title: "Agent Skills",
    items: [
      { label: "What Are Skills?", href: "/docs#skills" },
      { label: "SKILL.md Format", href: "/docs#skillmd" },
      { label: "Context Engine", href: "/docs#context-engine" },
    ],
  },
  {
    title: "Playground",
    items: [
      { label: "Overview", href: "/docs#playground" },
      { label: "Paths", href: "/docs#paths" },
      { label: "Analysis Results", href: "/docs#analysis-results" },
    ],
  },
  {
    title: "SDK & API",
    items: [
      { label: "SDK Overview", href: "/docs#sdk" },
      { label: "API Reference", href: "/docs#api" },
      { label: "CI/CD Integration", href: "/docs#cicd" },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [openSections, setOpenSections] = useState<string[]>(
    sections.map((s) => s.title)
  );

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-64 h-full shrink-0 border-r border-white/20 glass-strong overflow-y-auto" data-lenis-prevent>
      <div className="p-6 flex items-center justify-between">
        <div>
          <Link
            href="/"
            className="font-[family-name:var(--font-cs-caleb-mono)] text-xs tracking-[0.2em] text-text-secondary hover:text-blue-primary transition-colors"
          >
            PARITY
          </Link>
          <h2 className="mt-1 font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
            Documentation
          </h2>
        </div>
        {/* Mobile close */}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="lg:hidden p-1 text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        )}
      </div>

      <nav className="px-4 pb-8">
        {sections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider hover:text-text-primary transition-colors"
            >
              {section.title}
              <svg
                className={`w-3 h-3 transition-transform ${
                  openSections.includes(section.title) ? "rotate-90" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 2l4 4-4 4" />
              </svg>
            </button>

            {openSections.includes(section.title) && (
              <div className="ml-2 mt-1 space-y-0.5">
                {section.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onNavigate}
                    className="block px-3 py-1.5 text-sm text-text-secondary hover:text-blue-primary hover:bg-blue-pale/30 rounded-md transition-colors font-[family-name:var(--font-dm-sans)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

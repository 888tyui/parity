import Link from "next/link";

export default function DocContent() {
  return (
    <article className="flex-1 max-w-3xl px-8 py-12">
      {/* ============================================
          SECTION 1 — Introduction
          ============================================ */}
      <h1
        id="introduction"
        className="font-[family-name:var(--font-instrument-serif)] text-4xl text-text-primary leading-tight"
      >
        Introduction
      </h1>
      <p className="mt-4 text-lg text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Parity is an AI-native verification layer for Solana smart contracts.
        It provides composable analysis skills and APIs that enable AI agents
        &mdash; such as Claude Code, Cursor, OpenClaw, Cline, and OpenCode &mdash;
        to perform audit-level code review with full program context.
      </p>

      {/* At a Glance — 4 pillar cards */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        {[
          {
            title: "Playground",
            desc: "Browser IDE with build, deploy, and AI analysis — no local setup.",
          },
          {
            title: "Agent Skills",
            desc: "SKILL.md modules for security audits, best practices, and optimization.",
          },
          {
            title: "Context Engine",
            desc: "500+ audit patterns and framework intelligence powering every analysis.",
          },
          {
            title: "SDK & API",
            desc: "TypeScript SDK and CLI for CI/CD integration and programmatic access.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="glass-card rounded-xl p-5 depth-card"
          >
            <h4 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm text-blue-primary tracking-wide">
              {card.title}
            </h4>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 2 — Installation
          ============================================ */}
      <h2
        id="installation"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Installation
      </h2>

      <div className="mt-4 glass-blue rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-cs-caleb-mono)] uppercase tracking-wider bg-blue-primary text-white">
          Coming Soon
        </span>
        <p className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
          The SDK and CLI are currently in development. The following shows the planned interface.
        </p>
      </div>

      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Install the Parity SDK via npm:
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <code>npm install @parity/sdk</code>
      </div>

      <p className="mt-6 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Set your API key in the environment:
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`# .env
PARITY_KEY=your_api_key_here`}</pre>
      </div>

      <p className="mt-6 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Alternatively, use the CLI directly:
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`npx parity analyze ./programs/counter/src/lib.rs \\
  --framework anchor \\
  --skills security-audit,best-practices`}</pre>
      </div>

      <p className="mt-4 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
        Want to explore without waiting?{" "}
        <Link
          href="/playground"
          className="text-blue-primary hover:underline"
        >
          Try the Playground
        </Link>{" "}
        &mdash; available now in your browser.
      </p>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 3 — Quick Start
          ============================================ */}
      <h2
        id="quickstart"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Quick Start
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        A minimal example of analyzing a Solana program with the planned SDK:
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`// Planned SDK interface — not yet published
import { Parity } from "@parity/sdk";

const client = new Parity({
  apiKey: process.env.PARITY_KEY,
});

const result = await client.analyze({
  program: "./programs/counter/src/lib.rs",
  framework: "anchor",
  skills: ["security-audit", "best-practices"],
});

console.log(result.score);     // 0–100
console.log(result.findings);  // Finding[]
console.log(result.summary);   // human-readable summary`}</pre>
      </div>

      {/* 3 step cards */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          {
            step: "01",
            title: "Parse",
            desc: "The SDK parses Rust/Anchor source into an AST and resolves account structures, CPI calls, and PDA derivations.",
          },
          {
            step: "02",
            title: "Analyze",
            desc: "Selected skills run against the AST — matching against 500+ vulnerability signatures and best-practice patterns.",
          },
          {
            step: "03",
            title: "Report",
            desc: "Findings are returned with severity, location, explanation, and recommended fixes as structured data.",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="glass-card rounded-xl p-5 depth-card"
          >
            <span className="font-[family-name:var(--font-instrument-serif)] text-3xl text-blue-light/60">
              {item.step}
            </span>
            <h4 className="mt-2 font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary tracking-wide">
              {item.title}
            </h4>
            <p className="mt-2 text-xs text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 4 — What Are Skills?
          ============================================ */}
      <h2
        id="skills"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        What Are Skills?
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Skills are modular analysis workflows defined in SKILL.md files &mdash;
        an open format compatible with OpenClaw&apos;s ClawHub registry. Each skill
        encapsulates a focused verification task that AI agents can execute
        autonomously.
      </p>

      {/* Built-in skills table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-white/40 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Skill
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--font-dm-sans)]">
            {[
              {
                name: "security-audit",
                desc: "Permission checks, arithmetic safety, CPI verification, account constraint validation, and signer checks.",
              },
              {
                name: "best-practices",
                desc: "Anchor conventions, discriminator usage, rent exemption, error handling, and 9 Solana-specific best practices.",
              },
              {
                name: "gas-optimization",
                desc: "Compute unit reduction, account size optimization, and transaction cost analysis.",
              },
              {
                name: "deep-audit",
                desc: "Full security audit + best-practice check + optimized code generation with inline fix suggestions.",
              },
            ].map((skill, i) => (
              <tr
                key={skill.name}
                className={
                  i < 3 ? "border-b border-white/20" : ""
                }
              >
                <td className="px-5 py-3">
                  <code className="text-blue-primary font-[family-name:var(--font-cs-caleb-mono)] text-xs">
                    {skill.name}
                  </code>
                </td>
                <td className="px-5 py-3 text-text-secondary text-sm">
                  {skill.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Agent Integrations
      </h3>
      <p className="mt-3 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Parity skills are accessible from any AI coding agent through standard
        integration points:
      </p>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {[
          { agent: "Claude Code", method: "MCP server" },
          { agent: "Cursor", method: ".cursorrules" },
          { agent: "OpenClaw", method: "Native skill" },
          { agent: "Cline", method: "MCP server" },
        ].map((item) => (
          <div
            key={item.agent}
            className="flex items-center gap-3 glass-card rounded-lg px-4 py-3"
          >
            <span className="font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
              {item.agent}
            </span>
            <span className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
              via {item.method}
            </span>
          </div>
        ))}
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 5 — SKILL.md Format
          ============================================ */}
      <h2
        id="skillmd"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        SKILL.md Format
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Skills follow the SKILL.md specification &mdash; a YAML frontmatter
        header followed by natural-language instructions. This format is
        compatible with OpenClaw&apos;s ClawHub registry and can be composed into
        multi-step workflows.
      </p>
      <div className="code-block mt-4 rounded-lg">
        <pre>{`---
name: security-audit
version: 1.0.0
description: Comprehensive Solana program security analysis
inputs:
  - name: program
    type: file
    required: true
  - name: framework
    type: string
    default: anchor
outputs:
  - name: findings
    type: Finding[]
  - name: score
    type: number
---

# Security Audit Skill

Analyze the provided Solana program for security vulnerabilities.

## Steps

1. Parse the program source and resolve all account structures
2. Check for missing signer validations on privileged instructions
3. Verify arithmetic operations use checked math or overflow protection
4. Validate CPI calls have correct program ID checks
5. Ensure PDA seeds are deterministic and not attacker-controlled
6. Check account constraints (has_one, constraint, seeds)
7. Verify close account logic drains lamports and zeros data
8. Score the program 0–100 based on finding severity`}</pre>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Skill Chaining
      </h3>
      <p className="mt-3 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Skills can be composed into pipelines. The output of one skill feeds
        the next:
      </p>
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {["security-audit", "best-practices", "gas-optimization"].map(
          (name, i) => (
            <div key={name} className="flex items-center gap-3">
              <span className="glass-card rounded-lg px-4 py-2 font-[family-name:var(--font-cs-caleb-mono)] text-xs text-blue-primary">
                {name}
              </span>
              {i < 2 && (
                <svg
                  className="w-4 h-4 text-blue-light"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 8h10M10 4l4 4-4 4" />
                </svg>
              )}
            </div>
          )
        )}
      </div>
      <p className="mt-3 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
        The <code className="text-blue-primary font-[family-name:var(--font-cs-caleb-mono)] text-xs">deep-audit</code> skill
        runs this full chain automatically and produces an optimized code artifact.
      </p>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 6 — Context Engine
          ============================================ */}
      <h2
        id="context-engine"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Context Engine
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The Context Engine is Parity&apos;s core differentiator. It provides
        structured knowledge that transforms general-purpose AI agents into
        Solana-specialized auditors. The engine operates across three layers:
      </p>

      {/* 3 layer cards */}
      <div className="space-y-4 mt-6">
        {[
          {
            layer: "Layer 1",
            title: "Static Analysis Rules",
            desc: "AST-level vulnerability patterns extracted from 500+ audited Solana programs. Covers missing signer checks, unchecked arithmetic, unvalidated PDAs, insecure CPI invocations, and account data deserialization issues.",
            stat: "500+ programs",
          },
          {
            layer: "Layer 2",
            title: "Curated Audit Knowledge",
            desc: "Finding-and-fix patterns extracted from public audit reports by OtterSec, Sec3, Neodyme, and other leading Solana auditors. Research shows 163 Solana audits identified 1,669 vulnerabilities — an average of 1.4 critical/high findings per audit.",
            stat: "1,669 findings",
          },
          {
            layer: "Layer 3",
            title: "Framework Intelligence",
            desc: "Deep understanding of Anchor macros (#[program], #[derive(Accounts)], #[account]), PDA derivation patterns, CPI safety patterns, and the Solana runtime model (rent, clock, system program).",
            stat: "Anchor 0.30.x",
          },
        ].map((layer) => (
          <div
            key={layer.layer}
            className="glass-card rounded-xl p-6 depth-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-[family-name:var(--font-cs-caleb-mono)] text-xs text-blue-primary uppercase tracking-wider">
                  {layer.layer}
                </span>
                <h4 className="mt-1 font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
                  {layer.title}
                </h4>
              </div>
              <span className="glass rounded-full px-3 py-1 text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
                {layer.stat}
              </span>
            </div>
            <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {layer.desc}
            </p>
          </div>
        ))}
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Common Vulnerability Patterns
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Patterns the Context Engine detects include:
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/40 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Pattern
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Risk
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--font-dm-sans)]">
            {[
              { pattern: "Missing signer check", risk: "Critical" },
              { pattern: "Unchecked arithmetic overflow", risk: "Critical" },
              { pattern: "Unvalidated PDA seeds", risk: "High" },
              { pattern: "Missing account owner check", risk: "High" },
              { pattern: "Insecure CPI without program ID check", risk: "High" },
              { pattern: "Account data reallocation without zeroing", risk: "Medium" },
              { pattern: "Missing rent exemption check", risk: "Medium" },
              { pattern: "Duplicate mutable account references", risk: "Medium" },
            ].map((item, i) => (
              <tr
                key={item.pattern}
                className={i < 7 ? "border-b border-white/20" : ""}
              >
                <td className="px-5 py-2.5 text-text-primary text-sm">
                  {item.pattern}
                </td>
                <td className="px-5 py-2.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-[family-name:var(--font-cs-caleb-mono)] ${
                      item.risk === "Critical"
                        ? "bg-red-100 text-red-700"
                        : item.risk === "High"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 7 — Playground Overview
          ============================================ */}
      <h2
        id="playground"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Playground Overview
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The Parity Playground is a browser-based IDE for writing, building,
        deploying, and analyzing Solana programs. No local toolchain required.
      </p>

      {/* 6 feature grid */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          {
            title: "Editor",
            desc: "Rust/Anchor syntax highlighting with autocomplete",
          },
          {
            title: "AI Analysis",
            desc: "One-click security and best-practice analysis",
          },
          {
            title: "Build Pipeline",
            desc: "Cloud-based Anchor build with real-time output",
          },
          {
            title: "Devnet Deploy",
            desc: "Deploy to Solana devnet directly from the browser",
          },
          {
            title: "Security Reports",
            desc: "Detailed findings with severity, location, and fixes",
          },
          {
            title: "Optimized Code",
            desc: "AI-generated optimized version of your program",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="glass-card rounded-lg p-4 depth-card"
          >
            <h4 className="font-[family-name:var(--font-cs-caleb-mono)] text-xs text-blue-primary tracking-wide">
              {feature.title}
            </h4>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 8 — Paths
          ============================================ */}
      <h2
        id="paths"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Paths
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The Playground offers three guided paths tailored to different experience
        levels. Each path walks you through a complete analysis workflow.
      </p>

      {/* Path cards */}
      <div className="space-y-4 mt-6">
        {/* Beginner */}
        <div className="glass-card rounded-xl p-6 depth-card">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-[family-name:var(--font-cs-caleb-mono)]">
              B
            </span>
            <div>
              <h4 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
                Beginner Path
              </h4>
              <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                6 steps &middot; counter.rs &middot; Expected score: ~92
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {["Welcome", "Generate", "Walkthrough", "Build", "Analysis", "Results"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary glass rounded px-2 py-1">
                    {step}
                  </span>
                  {i < 5 && (
                    <span className="text-blue-light text-xs">&rarr;</span>
                  )}
                </div>
              )
            )}
          </div>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
            Generates a simple counter program, walks through the code, builds
            it, and runs AI analysis. Ideal for understanding the Parity workflow.
          </p>
        </div>

        {/* Developer */}
        <div className="glass-card rounded-xl p-6 depth-card">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-[family-name:var(--font-cs-caleb-mono)]">
              D
            </span>
            <div>
              <h4 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
                Developer Path
              </h4>
              <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                5 steps &middot; token_vault.rs &middot; Expected score: ~38
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {["Welcome", "Review", "Analysis", "Findings", "Summary"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary glass rounded px-2 py-1">
                    {step}
                  </span>
                  {i < 4 && (
                    <span className="text-blue-light text-xs">&rarr;</span>
                  )}
                </div>
              )
            )}
          </div>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
            Analyzes a deliberately vulnerable token vault program. Demonstrates
            critical finding detection, severity scoring, and AI-generated
            optimized code with fixes.
          </p>
        </div>

        {/* Explorer */}
        <div className="glass-card rounded-xl p-6 depth-card">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-[family-name:var(--font-cs-caleb-mono)]">
              E
            </span>
            <div>
              <h4 className="font-[family-name:var(--font-cs-caleb-mono)] text-sm text-text-primary">
                Explorer Path
              </h4>
              <p className="text-xs text-text-secondary font-[family-name:var(--font-dm-sans)]">
                5 steps &middot; transfer.rs &middot; Expected score: ~85
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {["Welcome", "Demo", "Analysis", "Results", "Get Started"].map(
              (step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary glass rounded px-2 py-1">
                    {step}
                  </span>
                  {i < 4 && (
                    <span className="text-blue-light text-xs">&rarr;</span>
                  )}
                </div>
              )
            )}
          </div>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
            Quick interactive demo of Parity&apos;s analysis capabilities using a
            SOL transfer program. Minimal steps, maximum insight.
          </p>
        </div>
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 9 — Analysis Results
          ============================================ */}
      <h2
        id="analysis-results"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Analysis Results
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Every analysis produces structured findings with severity levels,
        locations, and recommended fixes.
      </p>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Severity Levels
      </h3>
      <div className="flex items-center gap-3 mt-4 flex-wrap">
        {[
          { level: "Critical", color: "bg-red-100 text-red-700" },
          { level: "High", color: "bg-orange-100 text-orange-700" },
          { level: "Medium", color: "bg-yellow-100 text-yellow-700" },
          { level: "Info", color: "bg-blue-100 text-blue-700" },
          { level: "Pass", color: "bg-green-100 text-green-700" },
        ].map((s) => (
          <span
            key={s.level}
            className={`px-3 py-1 rounded-full text-xs font-[family-name:var(--font-cs-caleb-mono)] ${s.color}`}
          >
            {s.level}
          </span>
        ))}
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Finding Example
      </h3>
      <p className="mt-3 text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
        A typical critical finding from a security audit:
      </p>
      <div className="code-block mt-4 rounded-lg">
        <pre>{`{
  severity: "critical",
  title: "Missing signer check on withdraw instruction",
  location: {
    file: "programs/vault/src/lib.rs",
    line: 47,
    instruction: "withdraw"
  },
  description: "The withdraw instruction does not verify that the \
authority account has signed the transaction. Any user can drain \
funds from the vault by calling withdraw with an arbitrary authority.",
  recommendation: "Add a Signer constraint to the authority account \
in the Withdraw accounts struct.",
  pattern: "missing-signer-check"
}`}</pre>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        AnalysisResult Type
      </h3>
      <div className="code-block mt-4 rounded-lg">
        <pre>{`interface AnalysisResult {
  score: number;               // 0–100
  findings: Finding[];
  summary: string;
  skills: string[];            // skills that were executed
  metadata: {
    framework: string;
    programId?: string;
    analyzedAt: string;        // ISO 8601
    duration: number;          // ms
  };
}

interface Finding {
  severity: "critical" | "high" | "medium" | "info" | "pass";
  title: string;
  location: {
    file: string;
    line: number;
    instruction?: string;
  };
  description: string;
  recommendation: string;
  pattern: string;
}`}</pre>
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 10 — SDK Overview
          ============================================ */}
      <h2
        id="sdk"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        SDK Overview
      </h2>

      <div className="mt-4 glass-blue rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-cs-caleb-mono)] uppercase tracking-wider bg-blue-primary text-white">
          Coming Soon
        </span>
        <p className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
          The SDK and API are under active development. Code examples below reflect the planned interface.
        </p>
      </div>

      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The Parity TypeScript SDK will provide programmatic access to all analysis
        capabilities. It wraps the REST API with typed methods and handles
        authentication, retries, and streaming.
      </p>

      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`// Planned SDK interface
import { Parity } from "@parity/sdk";

const client = new Parity({
  apiKey: process.env.PARITY_KEY,
});`}</pre>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Available Methods
      </h3>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/40 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Method
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--font-dm-sans)]">
            {[
              {
                method: "client.analyze()",
                desc: "Analyze a Solana program with selected skills",
              },
              {
                method: "client.skills.list()",
                desc: "List all available analysis skills",
              },
              {
                method: "client.skills.get()",
                desc: "Get details of a specific skill",
              },
              {
                method: "client.context.get()",
                desc: "Retrieve context engine data for a program",
              },
            ].map((item, i) => (
              <tr
                key={item.method}
                className={i < 3 ? "border-b border-white/20" : ""}
              >
                <td className="px-5 py-3">
                  <code className="text-blue-primary font-[family-name:var(--font-cs-caleb-mono)] text-xs">
                    {item.method}
                  </code>
                </td>
                <td className="px-5 py-3 text-text-secondary text-sm">
                  {item.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 11 — API Reference
          ============================================ */}
      <h2
        id="api"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        API Reference
      </h2>
      <p className="mt-3 text-sm text-text-secondary italic font-[family-name:var(--font-dm-sans)]">
        All API signatures below are planned and subject to change before release.
      </p>

      {/* analyze() */}
      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        client.analyze()
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Analyze a Solana program with one or more skills.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/40 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Parameter
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Required
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--font-dm-sans)]">
            {[
              {
                param: "program",
                type: "string",
                required: "Yes",
                desc: "Path to Rust source file or program ID",
              },
              {
                param: "framework",
                type: "string",
                required: "No",
                desc: 'Framework hint — "anchor" | "native". Default: auto-detect',
              },
              {
                param: "skills",
                type: "string[]",
                required: "No",
                desc: 'Skills to execute. Default: ["security-audit"]',
              },
              {
                param: "output",
                type: "string",
                required: "No",
                desc: '"json" | "markdown" | "sarif". Default: "json"',
              },
            ].map((row, i) => (
              <tr
                key={row.param}
                className={i < 3 ? "border-b border-white/20" : ""}
              >
                <td className="px-5 py-2.5">
                  <code className="text-blue-primary font-[family-name:var(--font-cs-caleb-mono)] text-xs">
                    {row.param}
                  </code>
                </td>
                <td className="px-5 py-2.5">
                  <code className="font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary">
                    {row.type}
                  </code>
                </td>
                <td className="px-5 py-2.5 text-text-secondary text-xs">
                  {row.required}
                </td>
                <td className="px-5 py-2.5 text-text-secondary text-sm">
                  {row.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`const result = await client.analyze({
  program: "./programs/vault/src/lib.rs",
  framework: "anchor",
  skills: ["security-audit", "best-practices"],
  output: "json",
});

// result.score → 38
// result.findings → Finding[]
// result.summary → "Found 3 critical and 2 high severity issues..."`}</pre>
      </div>

      {/* skills.list() */}
      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        client.skills.list()
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Returns all available skills with their metadata.
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`const skills = await client.skills.list();

// skills → [
//   { name: "security-audit", version: "1.0.0", ... },
//   { name: "best-practices", version: "1.0.0", ... },
//   { name: "gas-optimization", version: "1.0.0", ... },
//   { name: "deep-audit", version: "1.0.0", ... },
// ]`}</pre>
      </div>

      {/* skills.get() */}
      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        client.skills.get()
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Get the full SKILL.md definition for a specific skill.
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`const skill = await client.skills.get("security-audit");

// skill.name → "security-audit"
// skill.version → "1.0.0"
// skill.inputs → [{ name: "program", type: "file", required: true }]
// skill.outputs → [{ name: "findings", type: "Finding[]" }]`}</pre>
      </div>

      {/* context.get() */}
      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        client.context.get()
      </h3>
      <p className="mt-3 text-sm text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Retrieve context engine data for a specific program or pattern.
      </p>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`const ctx = await client.context.get({
  pattern: "missing-signer-check",
  framework: "anchor",
});

// ctx.rules → StaticRule[]
// ctx.auditFindings → AuditFinding[]
// ctx.frameworkPatterns → FrameworkPattern[]`}</pre>
      </div>

      <div className="editorial-rule my-10" />

      {/* ============================================
          SECTION 12 — CI/CD Integration
          ============================================ */}
      <h2
        id="cicd"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        CI/CD Integration
      </h2>

      <div className="mt-4 glass-blue rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-[family-name:var(--font-cs-caleb-mono)] uppercase tracking-wider bg-blue-primary text-white">
          Coming Soon
        </span>
        <p className="text-sm text-text-secondary font-[family-name:var(--font-dm-sans)]">
          CI/CD tooling will be available alongside the SDK release. Examples below show the planned workflow.
        </p>
      </div>

      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Integrate Parity into your CI/CD pipeline to catch vulnerabilities
        before they reach production.
      </p>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        GitHub Actions
      </h3>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`name: Parity Analysis
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Parity CLI
        run: npm install -g @parity/sdk

      - name: Run Analysis
        env:
          PARITY_KEY: \${{ secrets.PARITY_KEY }}
        run: |
          parity analyze ./programs/*/src/lib.rs \\
            --framework anchor \\
            --skills security-audit,best-practices \\
            --min-score 70 \\
            --fail-on critical,high \\
            --output sarif > results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif`}</pre>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Programmatic CI Script
      </h3>
      <div className="code-block mt-4 rounded-lg opacity-75">
        <pre>{`import { Parity } from "@parity/sdk";

const client = new Parity({ apiKey: process.env.PARITY_KEY });

const result = await client.analyze({
  program: "./programs/vault/src/lib.rs",
  framework: "anchor",
  skills: ["security-audit", "best-practices"],
});

if (result.score < 70) {
  console.error(\`Score \${result.score} below threshold 70\`);
  process.exit(1);
}

const criticals = result.findings.filter(
  (f) => f.severity === "critical"
);

if (criticals.length > 0) {
  console.error(\`Found \${criticals.length} critical findings\`);
  process.exit(1);
}

console.log("Analysis passed:", result.summary);`}</pre>
      </div>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        CLI Options
      </h3>
      <div className="mt-4 overflow-hidden rounded-xl border border-white/40 glass-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/30">
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Flag
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3 text-left font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary uppercase tracking-wider">
                Default
              </th>
            </tr>
          </thead>
          <tbody className="font-[family-name:var(--font-dm-sans)]">
            {[
              {
                flag: "--framework",
                desc: "Framework hint (anchor | native)",
                def: "auto-detect",
              },
              {
                flag: "--skills",
                desc: "Comma-separated skill names",
                def: "security-audit",
              },
              {
                flag: "--min-score",
                desc: "Minimum passing score (0–100)",
                def: "0",
              },
              {
                flag: "--fail-on",
                desc: "Fail on severity levels",
                def: "none",
              },
              {
                flag: "--output",
                desc: "Output format (json | markdown | sarif)",
                def: "json",
              },
            ].map((row, i) => (
              <tr
                key={row.flag}
                className={i < 4 ? "border-b border-white/20" : ""}
              >
                <td className="px-5 py-2.5">
                  <code className="text-blue-primary font-[family-name:var(--font-cs-caleb-mono)] text-xs">
                    {row.flag}
                  </code>
                </td>
                <td className="px-5 py-2.5 text-text-secondary text-sm">
                  {row.desc}
                </td>
                <td className="px-5 py-2.5">
                  <code className="font-[family-name:var(--font-cs-caleb-mono)] text-xs text-text-secondary">
                    {row.def}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="h-24" />
    </article>
  );
}

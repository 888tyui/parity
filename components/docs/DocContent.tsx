export default function DocContent() {
  return (
    <article className="flex-1 max-w-3xl px-8 py-12">
      {/* Title */}
      <h1
        id="introduction"
        className="font-[family-name:var(--font-instrument-serif)] text-4xl text-text-primary leading-tight"
      >
        Introduction
      </h1>
      <p className="mt-4 text-lg text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Parity is a Solana smart contract framework and AI-powered verification
        protocol. It provides composable skills and APIs that enable AI agents
        — such as OpenClaw, Claude Code, Cursor, and OpenCode — to perform
        audit-level code review with full program context.
      </p>

      <div className="editorial-rule my-10" />

      {/* Installation */}
      <h2
        id="installation"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Installation
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Get started with the Parity SDK by installing it via npm.
      </p>
      <div className="code-block mt-4 rounded-lg">
        <code>npm install @parity/sdk</code>
      </div>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Or use the playground directly in your browser — no installation
        required.
      </p>

      <div className="editorial-rule my-10" />

      {/* Quick Start */}
      <h2
        id="quickstart"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Quick Start
      </h2>
      <p className="mt-4 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Here is a minimal example of using the Parity SDK to analyze a Solana
        program:
      </p>
      <div className="code-block mt-4 rounded-lg">
        <pre>{`import { Parity } from "@parity/sdk";

const client = new Parity({
  apiKey: process.env.PARITY_KEY,
});

const analysis = await client.analyze({
  program: "./programs/counter/src/lib.rs",
  framework: "anchor",
});

console.log(analysis.score);
console.log(analysis.findings);`}</pre>
      </div>

      <div className="editorial-rule my-10" />

      {/* Core Concepts */}
      <h2
        id="concepts"
        className="font-[family-name:var(--font-instrument-serif)] text-2xl text-text-primary mt-12"
      >
        Core Concepts
      </h2>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        Playground
      </h3>
      <p className="mt-3 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The playground provides a browser-based code editor with Rust/Anchor
        syntax highlighting, build tooling, and deployment support for Solana
        programs. Write and iterate on contracts without any local setup.
      </p>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        AI Agent
      </h3>
      <p className="mt-3 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        Parity&apos;s own runtime powers composable skill workflows — vulnerability
        scanning, best-practice checks, gas optimization, and more. Through its
        skills and APIs, any AI agent (OpenClaw, Claude Code, Cursor, OpenCode,
        etc.) gains audit-level code review context to perform deep analysis
        autonomously.
      </p>

      <h3 className="font-[family-name:var(--font-cs-caleb-mono)] text-base text-text-primary mt-8">
        SDK & Skills
      </h3>
      <p className="mt-3 text-base text-text-secondary leading-relaxed font-[family-name:var(--font-dm-sans)]">
        The Parity SDK lets you integrate contract analysis into your development
        workflow. Write composable skills, expose them via APIs for AI agents,
        and embed verification in your CI/CD pipeline.
      </p>

      <div className="h-24" />
    </article>
  );
}

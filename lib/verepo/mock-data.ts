// ========================================
// Verepo — Mock Data
// ========================================

export interface RepoMeta {
    name: string;
    owner: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    createdAt: string;
}

export interface VerepoFinding {
    type: "pass" | "warning" | "critical" | "info";
    title: string;
    description: string;
    category: string;
}

export interface PatternMatch {
    pattern: string;
    confidence: number;
    source: string;
}

export interface VerepoResult {
    repoMeta: RepoMeta;
    programType: string;
    framework: string;
    credibilityScore: number;
    verdict: "verified" | "suspicious" | "unverified";
    verdictReason: string;
    patternMatches: PatternMatch[];
    findings: VerepoFinding[];
}

// Sample Anchor program code for the IDE preview
export const sampleCode: { filename: string; lines: string[] }[] = [
    {
        filename: "programs/vault/src/lib.rs",
        lines: [
            '<span style="color:#52586A">use</span> anchor_lang::prelude::*;',
            '<span style="color:#52586A">use</span> anchor_spl::token::{<span style="color:#3454D1">self</span>, Token, TokenAccount, Transfer};',
            "",
            'declare_id!(<span style="color:#835A32">"VauLt1111111111111111111111111111111111111"</span>);',
            "",
            '<span style="color:#3454D1">#[program]</span>',
            '<span style="color:#52586A">pub mod</span> <span style="color:#3454D1">token_vault</span> {',
            "    <span style=\"color:#52586A\">use super</span>::*;",
            "",
            '    <span style="color:#52586A">pub fn</span> <span style="color:#3454D1">initialize</span>(ctx: Context&lt;Initialize&gt;) -&gt; Result&lt;()&gt; {',
            "        <span style=\"color:#52586A\">let</span> vault = &amp;<span style=\"color:#52586A\">mut</span> ctx.accounts.vault;",
            "        vault.authority = ctx.accounts.authority.key();",
            "        vault.total_deposited = <span style=\"color:#835A32\">0</span>;",
            "        Ok(())",
            "    }",
            "",
            '    <span style="color:#52586A">pub fn</span> <span style="color:#3454D1">deposit</span>(ctx: Context&lt;Deposit&gt;, amount: <span style="color:#3454D1">u64</span>) -&gt; Result&lt;()&gt; {',
            "        <span style=\"color:#52586A\">let</span> transfer_ctx = CpiContext::new(",
            "            ctx.accounts.token_program.to_account_info(),",
            "            Transfer {",
            "                from: ctx.accounts.user_token.to_account_info(),",
            "                to: ctx.accounts.vault_token.to_account_info(),",
            "                authority: ctx.accounts.user.to_account_info(),",
            "            },",
            "        );",
            "        token::transfer(transfer_ctx, amount)?;",
            "",
            "        <span style=\"color:#52586A\">let</span> vault = &amp;<span style=\"color:#52586A\">mut</span> ctx.accounts.vault;",
            "        vault.total_deposited = vault.total_deposited",
            '            .checked_add(amount).ok_or(ErrorCode::Overflow)?;',
            "        Ok(())",
            "    }",
            "",
            '    <span style="color:#52586A">pub fn</span> <span style="color:#3454D1">withdraw</span>(ctx: Context&lt;Withdraw&gt;, amount: <span style="color:#3454D1">u64</span>) -&gt; Result&lt;()&gt; {',
            "        <span style=\"color:#52586A\">let</span> vault = &amp;<span style=\"color:#52586A\">mut</span> ctx.accounts.vault;",
            '        <span style="color:#52586A">require!</span>(amount &lt;= vault.total_deposited, ErrorCode::InsufficientFunds);',
            "",
            "        <span style=\"color:#835A32\">// PDA signer seeds</span>",
            '        <span style="color:#52586A">let</span> seeds = &amp;[b<span style="color:#835A32">"vault"</span>, &amp;[ctx.bumps.vault_authority]];',
            "        <span style=\"color:#52586A\">let</span> signer = &amp;[&amp;seeds[..]];",
            "",
            "        <span style=\"color:#52586A\">let</span> transfer_ctx = CpiContext::new_with_signer(",
            "            ctx.accounts.token_program.to_account_info(),",
            "            Transfer {",
            "                from: ctx.accounts.vault_token.to_account_info(),",
            "                to: ctx.accounts.user_token.to_account_info(),",
            "                authority: ctx.accounts.vault_authority.to_account_info(),",
            "            },",
            "            signer,",
            "        );",
            "        token::transfer(transfer_ctx, amount)?;",
            "",
            "        vault.total_deposited = vault.total_deposited",
            '            .checked_sub(amount).ok_or(ErrorCode::Overflow)?;',
            "        Ok(())",
            "    }",
            "}",
            "",
            '<span style="color:#3454D1">#[derive(Accounts)]</span>',
            '<span style="color:#52586A">pub struct</span> <span style="color:#3454D1">Initialize</span>&lt;<span style="color:#52586A">\'info</span>&gt; {',
            '    #[account(init, payer = authority, space = 8 + Vault::INIT_SPACE)]',
            "    <span style=\"color:#52586A\">pub</span> vault: Account&lt;'info, Vault&gt;,",
            '    #[account(mut)]',
            "    <span style=\"color:#52586A\">pub</span> authority: Signer&lt;'info&gt;,",
            "    <span style=\"color:#52586A\">pub</span> system_program: Program&lt;'info, System&gt;,",
            "}",
        ],
    },
    {
        filename: "Cargo.toml",
        lines: [
            '<span style="color:#835A32">[package]</span>',
            'name = <span style="color:#835A32">"token-vault"</span>',
            'version = <span style="color:#835A32">"0.1.0"</span>',
            'edition = <span style="color:#835A32">"2021"</span>',
            "",
            '<span style="color:#835A32">[dependencies]</span>',
            'anchor-lang = <span style="color:#835A32">"0.30.1"</span>',
            'anchor-spl = <span style="color:#835A32">"0.30.1"</span>',
        ],
    },
    {
        filename: "README.md",
        lines: [
            '<span style="color:#3454D1"># Token Vault</span>',
            "",
            "A secure SPL token vault program built with Anchor.",
            "",
            '<span style="color:#3454D1">## Features</span>',
            "- Deposit SPL tokens into a PDA-controlled vault",
            "- Withdraw with authority signer verification",
            "- Checked arithmetic for overflow protection",
            "",
            '<span style="color:#3454D1">## Build</span>',
            '<span style="color:#835A32">```</span>',
            "anchor build",
            '<span style="color:#835A32">```</span>',
        ],
    },
];

// Analysis console log lines
export const analysisLogs: { text: string; color: "blue" | "green" | "default" | "warn" }[] = [
    { text: "$ parity verepo analyze paritydotcx/token-vault", color: "blue" },
    { text: "", color: "default" },
    { text: "[scan] Cloning repository...", color: "default" },
    { text: "[scan] Detected language: Rust", color: "default" },
    { text: "[scan] Detected framework: Anchor 0.30.1", color: "blue" },
    { text: "[scan] Found 1 program module, 3 instructions", color: "default" },
    { text: "", color: "default" },
    { text: "[pattern] Matching against 500+ audited program signatures...", color: "default" },
    { text: "[pattern] Match: token_vault ↔ SPL Vault Pattern (94% confidence)", color: "blue" },
    { text: "[pattern] Match: PDA authority ↔ Standard PDA Guard (89% confidence)", color: "blue" },
    { text: "[pattern] Match: checked_math ↔ Safe Arithmetic Pattern (97% confidence)", color: "blue" },
    { text: "", color: "default" },
    { text: "[verify] Analyzing program structure...", color: "default" },
    { text: "[verify] Checking account constraints...", color: "default" },
    { text: "[verify] Validating CPI invocations...", color: "default" },
    { text: "[verify] Cross-referencing 1,669 audit findings...", color: "default" },
    { text: "", color: "default" },
    { text: "[result] Credibility Score: 87/100", color: "green" },
    { text: "[result] Verdict: VERIFIED", color: "green" },
    { text: "[result] Program matches known secure vault pattern", color: "green" },
    { text: "", color: "default" },
    { text: "✓ Analysis complete in 3.2s", color: "green" },
];

// Mock analysis result
export const mockResult: VerepoResult = {
    repoMeta: {
        name: "token-vault",
        owner: "paritydotcx",
        description: "A secure SPL token vault program built with Anchor",
        language: "Rust",
        stars: 42,
        forks: 8,
        createdAt: "2025-11-15",
    },
    programType: "SPL Token Vault",
    framework: "Anchor 0.30.1",
    credibilityScore: 87,
    verdict: "verified",
    verdictReason:
        "Program structure matches known secure vault patterns from audited codebases. Uses proper PDA authority, checked arithmetic, and CPI validation.",
    patternMatches: [
        {
            pattern: "SPL Vault Pattern",
            confidence: 94,
            source: "Matched against 23 audited vault programs",
        },
        {
            pattern: "PDA Authority Guard",
            confidence: 89,
            source: "Standard PDA-based access control pattern",
        },
        {
            pattern: "Safe Arithmetic",
            confidence: 97,
            source: "Uses checked_add/checked_sub consistently",
        },
        {
            pattern: "CPI Validation",
            confidence: 85,
            source: "Proper program ID verification on cross-program calls",
        },
    ],
    findings: [
        {
            type: "pass",
            title: "Signer verification present",
            description: "All privileged instructions require proper signer validation.",
            category: "Access Control",
        },
        {
            type: "pass",
            title: "Checked arithmetic",
            description: "All arithmetic operations use checked math to prevent overflow.",
            category: "Arithmetic Safety",
        },
        {
            type: "pass",
            title: "PDA-controlled authority",
            description: "Vault uses PDA seeds for deterministic authority derivation.",
            category: "Account Security",
        },
        {
            type: "info",
            title: "No close instruction",
            description:
                "Program does not implement a close instruction. Vault accounts cannot be reclaimed.",
            category: "Account Lifecycle",
        },
        {
            type: "warning",
            title: "Missing re-initialization guard",
            description:
                "The initialize instruction does not check if the vault is already initialized. Consider adding an is_initialized flag.",
            category: "Account Security",
        },
        {
            type: "pass",
            title: "CPI target validation",
            description: "All CPI calls use typed Program accounts for target verification.",
            category: "CPI Safety",
        },
    ],
};

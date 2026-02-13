import type {
  UserPath,
  AnalysisResult,
  AgentLogEntry,
  CodeAnnotation,
} from "@/types/playground";

// ========================================
// Beginner — Counter Contract
// ========================================

const beginnerCode = {
  filename: "counter.rs",
  lines: [
    '<span class="text-blue-primary">use</span> anchor_lang::prelude::*;',
    "",
    'declare_id!(<span class="text-accent-warm">"Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"</span>);',
    "",
    '<span class="text-blue-primary">#[program]</span>',
    '<span class="text-blue-primary">pub mod</span> <span class="text-blue-deep">counter</span> {',
    '    <span class="text-blue-primary">use super</span>::*;',
    "",
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">initialize</span>(ctx: Context&lt;Initialize&gt;) -&gt; Result&lt;()&gt; {',
    '        <span class="text-text-secondary">// Initialize the counter account</span>',
    '        <span class="text-blue-primary">let</span> counter = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.counter;',
    '        counter.count = <span class="text-blue-primary">0</span>;',
    "        counter.authority = ctx.accounts.authority.key();",
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "",
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">increment</span>(ctx: Context&lt;Increment&gt;) -&gt; Result&lt;()&gt; {',
    '        <span class="text-blue-primary">let</span> counter = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.counter;',
    '        counter.count = counter.count.checked_add(<span class="text-blue-primary">1</span>)',
    "            .ok_or(ErrorCode::Overflow)?;",
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "}",
    "",
    '<span class="text-blue-primary">#[derive(Accounts)]</span>',
    '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">Initialize</span>&lt;\'info&gt; {',
    '    #[account(init, payer = authority, space = <span class="text-blue-primary">8</span> + <span class="text-blue-primary">8</span> + <span class="text-blue-primary">32</span>)]',
    '    <span class="text-blue-primary">pub</span> counter: Account&lt;\'info, Counter&gt;,',
    '    #[account(<span class="text-blue-primary">mut</span>)]',
    '    <span class="text-blue-primary">pub</span> authority: Signer&lt;\'info&gt;,',
    '    <span class="text-blue-primary">pub</span> system_program: Program&lt;\'info, System&gt;,',
    "}",
    "",
    '<span class="text-blue-primary">#[account]</span>',
    '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">Counter</span> {',
    '    <span class="text-blue-primary">pub</span> count: <span class="text-blue-primary">u64</span>,',
    '    <span class="text-blue-primary">pub</span> authority: Pubkey,',
    "}",
  ],
};

const beginnerAnalysis: AnalysisResult = {
  score: 92,
  findings: [
    {
      severity: "info",
      title: "Consider adding overflow check on decrement",
      description:
        "The increment function uses checked_add, but a potential decrement function should also use checked_sub.",
      line: 17,
      suggestion: "Add a decrement function with checked_sub for arithmetic safety.",
    },
    {
      severity: "pass",
      title: "Authority validation present",
      description:
        "The program correctly uses Signer constraint for authority verification in account initialization.",
    },
    {
      severity: "pass",
      title: "Checked arithmetic used",
      description:
        "The increment function uses checked_add to prevent integer overflow.",
    },
    {
      severity: "pass",
      title: "Proper account space allocation",
      description:
        "Account space is correctly calculated: 8 (discriminator) + 8 (u64) + 32 (Pubkey) = 48 bytes.",
    },
  ],
  bestPracticesPassed: 8,
  bestPracticesTotal: 9,
};

const beginnerAnnotations: CodeAnnotation[] = [
  {
    lineStart: 5,
    lineEnd: 6,
    title: "#[program] Macro",
    description:
      "This macro marks the module as an Anchor program. All public functions inside become instruction handlers that users can call.",
  },
  {
    lineStart: 9,
    lineEnd: 15,
    title: "Initialize Function",
    description:
      "Creates a new counter account, sets count to 0, and stores the authority's public key. Only runs once per counter.",
  },
  {
    lineStart: 17,
    lineEnd: 22,
    title: "Increment with Safety",
    description:
      "Uses checked_add instead of + to prevent integer overflow. If count reaches u64::MAX, it returns an error instead of wrapping around.",
  },
  {
    lineStart: 25,
    lineEnd: 32,
    title: "#[derive(Accounts)]",
    description:
      "Defines the accounts required for the initialize instruction. The 'init' attribute creates the account, 'payer' specifies who pays rent, and 'space' sets the account size.",
  },
];

const beginnerLogs: AgentLogEntry[] = [
  { timestamp: "[00:01]", message: "Initializing Parity runtime v2.4.1...", type: "info" },
  { timestamp: "[00:01]", message: "Loading Parity skill: security-audit", type: "info" },
  { timestamp: "[00:02]", message: "Parsing AST for counter.rs...", type: "info" },
  { timestamp: "[00:02]", message: "Detected framework: Anchor v0.30.x", type: "info" },
  { timestamp: "[00:03]", message: "Running vulnerability scan...", type: "info" },
  { timestamp: "[00:03]", message: "  Scanning initialize() — no issues", type: "success" },
  { timestamp: "[00:04]", message: "  Scanning increment() — no issues", type: "success" },
  { timestamp: "[00:04]", message: "Checking account constraints...", type: "info" },
  { timestamp: "[00:05]", message: "  #[account(init)] — validated", type: "success" },
  { timestamp: "[00:05]", message: "  Signer constraint — validated", type: "success" },
  { timestamp: "[00:06]", message: "Verifying arithmetic safety...", type: "info" },
  { timestamp: "[00:06]", message: "  checked_add detected on line 19 — PASS", type: "success" },
  { timestamp: "[00:07]", message: "  INFO: No checked_sub for potential decrement", type: "warning" },
  { timestamp: "[00:07]", message: "Checking authority validation...", type: "info" },
  { timestamp: "[00:08]", message: "  Authority stored in initialize — PASS", type: "success" },
  { timestamp: "[00:08]", message: "Analyzing space allocation...", type: "info" },
  { timestamp: "[00:09]", message: "  8 + 8 + 32 = 48 bytes — correct", type: "success" },
  { timestamp: "[00:09]", message: "Evaluating best practices (8/9 passed)...", type: "info" },
  { timestamp: "[00:10]", message: "No critical vulnerabilities found.", type: "success" },
  { timestamp: "[00:10]", message: "Analysis complete. Score: 92/100", type: "success" },
];

const beginnerBuildLogs = [
  { text: "$ anchor build", color: "blue" as const },
  { text: "Compiling counter v0.1.0...", color: "default" as const },
  { text: "Resolving dependencies...", color: "default" as const },
  { text: "Building BPF target...", color: "default" as const },
  { text: "Linking program...", color: "default" as const },
  { text: "Build successful.", color: "green" as const },
  { text: "Program ID: Fg6PaFpo...LnS", color: "green" as const },
  { text: "Deploy size: 148,392 bytes", color: "default" as const },
];

// ========================================
// Developer — Vulnerable Vault Contract
// ========================================

const developerCode = {
  filename: "token_vault.rs",
  lines: [
    '<span class="text-blue-primary">use</span> anchor_lang::prelude::*;',
    '<span class="text-blue-primary">use</span> anchor_spl::token::{self, Token, TokenAccount, Transfer};',
    "",
    'declare_id!(<span class="text-accent-warm">"Vau1tPrGm7x9kBe4Z3Fj5RqNc8Ht2WdY6AeLmXoKs0D"</span>);',
    "",
    '<span class="text-blue-primary">#[program]</span>',
    '<span class="text-blue-primary">pub mod</span> <span class="text-blue-deep">token_vault</span> {',
    '    <span class="text-blue-primary">use super</span>::*;',
    "",
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">initialize</span>(ctx: Context&lt;InitVault&gt;) -&gt; Result&lt;()&gt; {',
    '        <span class="text-blue-primary">let</span> vault = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.vault;',
    "        vault.authority = ctx.accounts.authority.key();",
    '        vault.total_deposits = <span class="text-blue-primary">0</span>;',
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "",
    '    <span class="text-text-secondary">// WARNING: Missing authority check!</span>',
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">withdraw</span>(ctx: Context&lt;Withdraw&gt;, amount: <span class="text-blue-primary">u64</span>) -&gt; Result&lt;()&gt; {',
    "        <span class=\"text-text-secondary\">// Anyone can call this function</span>",
    '        <span class="text-blue-primary">let</span> transfer_ctx = CpiContext::new(',
    "            ctx.accounts.token_program.to_account_info(),",
    "            Transfer {",
    "                from: ctx.accounts.vault_token.to_account_info(),",
    "                to: ctx.accounts.user_token.to_account_info(),",
    "                authority: ctx.accounts.vault.to_account_info(),",
    "            },",
    "        );",
    "        token::transfer(transfer_ctx, amount)?;",
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "",
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">deposit</span>(ctx: Context&lt;Deposit&gt;, amount: <span class="text-blue-primary">u64</span>) -&gt; Result&lt;()&gt; {',
    '        <span class="text-blue-primary">let</span> vault = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.vault;',
    '        <span class="text-text-secondary">// Integer overflow: using + instead of checked_add</span>',
    "        vault.total_deposits = vault.total_deposits + amount;",
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "}",
    "",
    '<span class="text-blue-primary">#[account]</span>',
    '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">Vault</span> {',
    '    <span class="text-blue-primary">pub</span> authority: Pubkey,',
    '    <span class="text-blue-primary">pub</span> total_deposits: <span class="text-blue-primary">u64</span>,',
    "}",
  ],
};

const developerAnalysis: AnalysisResult = {
  score: 38,
  findings: [
    {
      severity: "critical",
      title: "Missing authority check on withdraw",
      description:
        "The withdraw function does not verify that the caller is the vault authority. Any user can drain funds from the vault.",
      line: 18,
      suggestion:
        'Add require!(ctx.accounts.authority.key() == vault.authority, ErrorCode::Unauthorized) or use has_one constraint.',
    },
    {
      severity: "high",
      title: "Integer overflow on deposit",
      description:
        "Using unchecked addition (+ operator) for total_deposits. If deposits exceed u64::MAX, the value wraps around to zero.",
      line: 34,
      suggestion: "Replace vault.total_deposits + amount with vault.total_deposits.checked_add(amount).ok_or(ErrorCode::Overflow)?",
    },
    {
      severity: "medium",
      title: "No withdrawal amount validation",
      description:
        "The withdraw function does not check if the requested amount exceeds the vault balance, potentially causing underflow.",
      line: 18,
      suggestion: "Add a balance check before the transfer CPI call.",
    },
    {
      severity: "info",
      title: "Missing rent-exempt check",
      description:
        "The Vault account structure does not explicitly ensure rent exemption after operations.",
      line: 39,
      suggestion: "Consider adding rent-exempt validation in account constraints.",
    },
  ],
  bestPracticesPassed: 3,
  bestPracticesTotal: 9,
  optimizedCode: `use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Vau1tPrGm7x9kBe4Z3Fj5RqNc8Ht2WdY6AeLmXoKs0D");

#[program]
pub mod token_vault {
    use super::*;

    pub fn initialize(ctx: Context<InitVault>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.authority = ctx.accounts.authority.key();
        vault.total_deposits = 0;
        Ok(())
    }

    // FIXED: Authority check added
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let vault = &ctx.accounts.vault;

        // Verify caller is the vault authority
        require!(
            ctx.accounts.authority.key() == vault.authority,
            ErrorCode::Unauthorized
        );

        // Validate withdrawal amount
        require!(
            amount <= vault.total_deposits,
            ErrorCode::InsufficientFunds
        );

        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault_token.to_account_info(),
                to: ctx.accounts.user_token.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        // Update total deposits
        vault.total_deposits = vault.total_deposits
            .checked_sub(amount)
            .ok_or(ErrorCode::Underflow)?;

        Ok(())
    }

    // FIXED: Checked arithmetic
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.total_deposits = vault.total_deposits
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;
        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: caller is not the vault authority")]
    Unauthorized,
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Arithmetic underflow")]
    Underflow,
}`,
};

const developerLogs: AgentLogEntry[] = [
  { timestamp: "[00:01]", message: "Initializing Parity runtime v2.4.1...", type: "info" },
  { timestamp: "[00:01]", message: "Loading Parity skill: deep-audit", type: "info" },
  { timestamp: "[00:02]", message: "Parsing AST for token_vault.rs...", type: "info" },
  { timestamp: "[00:02]", message: "Detected framework: Anchor v0.30.x", type: "info" },
  { timestamp: "[00:03]", message: "Running vulnerability scan...", type: "info" },
  { timestamp: "[00:03]", message: "  Scanning initialize() — no issues", type: "success" },
  { timestamp: "[00:04]", message: "  Scanning withdraw()...", type: "info" },
  { timestamp: "[00:04]", message: "  CRITICAL: No authority check — anyone can drain funds", type: "warning" },
  { timestamp: "[00:05]", message: "  Missing has_one or require! constraint on line 18", type: "warning" },
  { timestamp: "[00:05]", message: "  Scanning deposit()...", type: "info" },
  { timestamp: "[00:06]", message: "  HIGH: Using + operator instead of checked_add", type: "warning" },
  { timestamp: "[00:06]", message: "  Potential u64 overflow on line 34", type: "warning" },
  { timestamp: "[00:07]", message: "Checking account constraints...", type: "info" },
  { timestamp: "[00:07]", message: "  MEDIUM: No withdrawal amount vs balance check", type: "warning" },
  { timestamp: "[00:08]", message: "  INFO: Vault account missing rent-exempt validation", type: "warning" },
  { timestamp: "[00:08]", message: "Evaluating CPI safety...", type: "info" },
  { timestamp: "[00:09]", message: "  Token transfer CPI — structure valid", type: "success" },
  { timestamp: "[00:09]", message: "Evaluating best practices (3/9 passed)...", type: "info" },
  { timestamp: "[00:10]", message: "Generating optimized code with fixes...", type: "info" },
  { timestamp: "[00:10]", message: "  Applied fix: authority check on withdraw()", type: "success" },
  { timestamp: "[00:11]", message: "  Applied fix: checked_add on deposit()", type: "success" },
  { timestamp: "[00:11]", message: "  Applied fix: balance validation", type: "success" },
  { timestamp: "[00:12]", message: "  Applied fix: custom ErrorCode enum", type: "success" },
  { timestamp: "[00:12]", message: "Analysis complete. Score: 38/100", type: "success" },
];

// ========================================
// Explorer — Transfer Contract
// ========================================

const explorerCode = {
  filename: "transfer.rs",
  lines: [
    '<span class="text-blue-primary">use</span> anchor_lang::prelude::*;',
    '<span class="text-blue-primary">use</span> anchor_lang::system_program;',
    "",
    'declare_id!(<span class="text-accent-warm">"TrNsF3r1xYz9A8bC2dE4fG5hJ6kL7mN0pQ1rS2tU3vW"</span>);',
    "",
    '<span class="text-blue-primary">#[program]</span>',
    '<span class="text-blue-primary">pub mod</span> <span class="text-blue-deep">sol_transfer</span> {',
    '    <span class="text-blue-primary">use super</span>::*;',
    "",
    '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">transfer</span>(',
    "        ctx: Context&lt;TransferSol&gt;,",
    '        amount: <span class="text-blue-primary">u64</span>,',
    "    ) -&gt; Result&lt;()&gt; {",
    "        system_program::transfer(",
    "            CpiContext::new(",
    "                ctx.accounts.system_program.to_account_info(),",
    "                system_program::Transfer {",
    "                    from: ctx.accounts.from.to_account_info(),",
    "                    to: ctx.accounts.to.to_account_info(),",
    "                },",
    "            ),",
    "            amount,",
    "        )?;",
    '        <span class="text-blue-primary">Ok</span>(())',
    "    }",
    "}",
    "",
    '<span class="text-blue-primary">#[derive(Accounts)]</span>',
    '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">TransferSol</span>&lt;\'info&gt; {',
    '    #[account(<span class="text-blue-primary">mut</span>)]',
    '    <span class="text-blue-primary">pub</span> from: Signer&lt;\'info&gt;,',
    '    <span class="text-text-secondary">/// CHECK: Recipient can be any account</span>',
    '    #[account(<span class="text-blue-primary">mut</span>)]',
    '    <span class="text-blue-primary">pub</span> to: AccountInfo&lt;\'info&gt;,',
    '    <span class="text-blue-primary">pub</span> system_program: Program&lt;\'info, System&gt;,',
    "}",
  ],
};

const explorerAnalysis: AnalysisResult = {
  score: 85,
  findings: [
    {
      severity: "medium",
      title: "No minimum transfer amount",
      description:
        "The transfer function accepts any amount including zero. Consider adding a minimum transfer check.",
      line: 10,
      suggestion: "Add require!(amount > 0, ErrorCode::InvalidAmount) at the start of the function.",
    },
    {
      severity: "info",
      title: "Unchecked recipient account",
      description:
        'The "to" account uses /// CHECK comment but has no validation. This is acceptable for SOL transfers but should be documented.',
    },
    {
      severity: "pass",
      title: "Signer validation present",
      description:
        "The 'from' account correctly uses Signer constraint to ensure authorization.",
    },
  ],
  bestPracticesPassed: 7,
  bestPracticesTotal: 9,
};

const explorerLogs: AgentLogEntry[] = [
  { timestamp: "[00:01]", message: "Initializing Parity runtime v2.4.1...", type: "info" },
  { timestamp: "[00:01]", message: "Loading Parity skill: security-audit", type: "info" },
  { timestamp: "[00:02]", message: "Parsing AST for transfer.rs...", type: "info" },
  { timestamp: "[00:02]", message: "Detected framework: Anchor v0.30.x", type: "info" },
  { timestamp: "[00:03]", message: "Running vulnerability scan...", type: "info" },
  { timestamp: "[00:03]", message: "  Scanning transfer() — checking CPI call", type: "info" },
  { timestamp: "[00:04]", message: "  system_program::transfer CPI — valid", type: "success" },
  { timestamp: "[00:04]", message: "Checking account constraints...", type: "info" },
  { timestamp: "[00:05]", message: "  Signer on 'from' account — PASS", type: "success" },
  { timestamp: "[00:05]", message: "  /// CHECK on 'to' account — acceptable", type: "info" },
  { timestamp: "[00:06]", message: "  MEDIUM: No minimum amount validation", type: "warning" },
  { timestamp: "[00:06]", message: "  Zero-amount transfers are allowed", type: "warning" },
  { timestamp: "[00:07]", message: "Verifying CPI safety...", type: "info" },
  { timestamp: "[00:07]", message: "  CpiContext::new — correct usage", type: "success" },
  { timestamp: "[00:08]", message: "Checking signer validation...", type: "info" },
  { timestamp: "[00:08]", message: "  Authorization flow — PASS", type: "success" },
  { timestamp: "[00:09]", message: "Evaluating best practices (7/9 passed)...", type: "info" },
  { timestamp: "[00:09]", message: "  Missing: input validation, event emission", type: "warning" },
  { timestamp: "[00:10]", message: "Analysis complete. Score: 85/100", type: "success" },
];

// ========================================
// Exports
// ========================================

export const contracts: Record<UserPath, { filename: string; lines: string[] }> = {
  beginner: beginnerCode,
  developer: developerCode,
  explorer: explorerCode,
};

export const analysisResults: Record<UserPath, AnalysisResult> = {
  beginner: beginnerAnalysis,
  developer: developerAnalysis,
  explorer: explorerAnalysis,
};

export const agentLogs: Record<UserPath, AgentLogEntry[]> = {
  beginner: beginnerLogs,
  developer: developerLogs,
  explorer: explorerLogs,
};

export const annotations: Record<UserPath, CodeAnnotation[]> = {
  beginner: beginnerAnnotations,
  developer: [],
  explorer: [],
};

export const buildLogs = beginnerBuildLogs;

export const welcomeContent: Record<UserPath, { title: string; subtitle: string; description: string; features: string[] }> = {
  beginner: {
    title: "Welcome to Solana",
    subtitle: "Let's build your first smart contract",
    description:
      "A smart contract on Solana is called a \"program.\" It lives on the blockchain and executes logic when users send transactions. We'll create a simple counter program that anyone can increment.",
    features: [
      "AI generates a Solana Anchor program",
      "Walk through the code with annotations",
      "Build and analyze with Parity agents",
      "See your security score",
    ],
  },
  developer: {
    title: "Security Audit Challenge",
    subtitle: "Can Parity catch the bugs?",
    description:
      "We've prepared a token vault contract with intentional vulnerabilities. Watch as Parity's skills provide deep audit context — identifying security issues, suggesting fixes, and generating optimized code.",
    features: [
      "Review a vulnerable vault contract",
      "Watch real-time agent analysis",
      "See detailed vulnerability findings",
      "Compare original vs optimized code",
    ],
  },
  explorer: {
    title: "What is Parity?",
    subtitle: "AI-powered smart contract verification",
    description:
      "Parity is a framework for writing, testing, and verifying Solana smart contracts. Through composable skills and APIs, Parity enables AI agents — from OpenClaw and Claude Code to Cursor and OpenCode — to perform deep code audits with full program context.",
    features: [
      "See a live contract analysis demo",
      "Understand how AI agents work",
      "View detailed security reports",
      "Get started with your own contracts",
    ],
  },
};

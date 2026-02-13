export default function EditorPanel() {
  return (
    <div className="flex flex-col h-full bg-bg-primary/50 backdrop-blur-sm">
      {/* Line numbers + code area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="font-[family-name:var(--font-cs-caleb-mono)] text-[13px] leading-[1.8]">
          {/* Simulated code lines */}
          {codeLines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 shrink-0 text-right pr-4 text-text-secondary/55 select-none text-xs">
                {i + 1}
              </span>
              <span
                className="whitespace-pre"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const codeLines = [
  '<span class="text-blue-primary">use</span> anchor_lang::prelude::*;',
  "",
  'declare_id!(<span class="text-accent-warm">"Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"</span>);',
  "",
  '<span class="text-blue-primary">#[program]</span>',
  '<span class="text-blue-primary">pub mod</span> <span class="text-blue-deep">counter</span> {',
  '    <span class="text-blue-primary">use super</span>::*;',
  "",
  '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">initialize</span>(ctx: Context&lt;Initialize&gt;) -&gt; Result&lt;()&gt; {',
  "        <span class=\"text-text-secondary\">// Initialize the counter account</span>",
  '        <span class="text-blue-primary">let</span> counter = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.counter;',
  "        counter.count = <span class=\"text-blue-primary\">0</span>;",
  "        counter.authority = ctx.accounts.authority.key();",
  '        <span class="text-blue-primary">Ok</span>(())',
  "    }",
  "",
  '    <span class="text-blue-primary">pub fn</span> <span class="text-accent-warm">increment</span>(ctx: Context&lt;Increment&gt;) -&gt; Result&lt;()&gt; {',
  '        <span class="text-blue-primary">let</span> counter = &amp;<span class="text-blue-primary">mut</span> ctx.accounts.counter;',
  "        counter.count = counter.count.checked_add(<span class=\"text-blue-primary\">1</span>)",
  '            .ok_or(ErrorCode::Overflow)?;',
  '        <span class="text-blue-primary">Ok</span>(())',
  "    }",
  "}",
  "",
  '<span class="text-blue-primary">#[derive(Accounts)]</span>',
  '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">Initialize</span>&lt;\'info&gt; {',
  '    #[account(init, payer = authority, space = <span class="text-blue-primary">8</span> + <span class="text-blue-primary">8</span> + <span class="text-blue-primary">32</span>)]',
  "    <span class=\"text-blue-primary\">pub</span> counter: Account&lt;'info, Counter&gt;,",
  '    #[account(<span class="text-blue-primary">mut</span>)]',
  "    <span class=\"text-blue-primary\">pub</span> authority: Signer&lt;'info&gt;,",
  "    <span class=\"text-blue-primary\">pub</span> system_program: Program&lt;'info, System&gt;,",
  "}",
  "",
  '<span class="text-blue-primary">#[account]</span>',
  '<span class="text-blue-primary">pub struct</span> <span class="text-blue-deep">Counter</span> {',
  '    <span class="text-blue-primary">pub</span> count: <span class="text-blue-primary">u64</span>,',
  '    <span class="text-blue-primary">pub</span> authority: Pubkey,',
  "}",
];

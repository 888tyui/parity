export default function AgentPanel() {
  return (
    <div className="flex flex-col h-full glass-strong border-l border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-600" />
          <span className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-primary tracking-wider">
            AGENT ANALYSIS
          </span>
        </div>
        <span className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary">
          Parity Runtime
        </span>
      </div>

      {/* Analysis results */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Summary */}
        <div className="glass-card rounded-lg p-4">
          <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-3">
            Summary
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)]">
                Security Score
              </span>
              <span className="text-sm font-[family-name:var(--font-cs-caleb-mono)] text-green-800 font-medium">
                92/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)]">
                Vulnerabilities
              </span>
              <span className="text-sm font-[family-name:var(--font-cs-caleb-mono)] text-text-primary">
                0 Critical, 1 Info
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary font-[family-name:var(--font-dm-sans)]">
                Best Practices
              </span>
              <span className="text-sm font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary">
                8/9 passed
              </span>
            </div>
          </div>
        </div>

        {/* Findings */}
        <div>
          <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-3">
            Findings
          </h4>

          {/* Info finding */}
          <div className="glass-blue rounded-lg p-4 mb-3">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-primary font-medium">
                  Consider adding overflow check on decrement
                </p>
                <p className="text-xs text-text-secondary mt-1 font-[family-name:var(--font-dm-sans)]">
                  Line 17 — The increment function uses checked_add, but a
                  potential decrement function should also use checked_sub.
                </p>
                <span className="inline-block mt-2 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-blue-primary bg-blue-pale px-2 py-0.5 rounded">
                  INFO
                </span>
              </div>
            </div>
          </div>

          {/* Pass finding */}
          <div className="glass-card rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-[family-name:var(--font-dm-sans)] text-text-primary font-medium">
                  Authority validation present
                </p>
                <p className="text-xs text-text-secondary mt-1 font-[family-name:var(--font-dm-sans)]">
                  The program correctly uses Signer constraint for authority
                  verification in account initialization.
                </p>
                <span className="inline-block mt-2 text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-green-800 bg-green-50 px-2 py-0.5 rounded">
                  PASS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent log */}
        <div>
          <h4 className="text-xs font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-3">
            Agent Log
          </h4>
          <div className="space-y-1.5 font-[family-name:var(--font-cs-caleb-mono)] text-[11px] text-text-secondary">
            <p>
              <span className="text-blue-primary">[00:01]</span> Parsing AST...
            </p>
            <p>
              <span className="text-blue-primary">[00:02]</span> Running
              vulnerability scan...
            </p>
            <p>
              <span className="text-blue-primary">[00:03]</span> Checking
              account constraints...
            </p>
            <p>
              <span className="text-blue-primary">[00:04]</span> Verifying
              arithmetic safety...
            </p>
            <p>
              <span className="text-blue-primary">[00:05]</span> Analysis
              complete. Score: 92/100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

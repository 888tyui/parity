const headings = [
  { id: "introduction", label: "Introduction" },
  { id: "installation", label: "Installation" },
  { id: "quickstart", label: "Quick Start" },
  { id: "concepts", label: "Core Concepts" },
];

export default function TableOfContents() {
  return (
    <aside className="w-48 shrink-0 hidden xl:block">
      <div className="sticky top-24 pl-6 border-l border-blue-light/30">
        <h4 className="text-[10px] font-[family-name:var(--font-cs-caleb-mono)] text-text-secondary uppercase tracking-wider mb-3">
          On this page
        </h4>
        <nav className="space-y-1.5">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className="block text-xs text-text-secondary hover:text-blue-primary transition-colors font-[family-name:var(--font-dm-sans)]"
            >
              {heading.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

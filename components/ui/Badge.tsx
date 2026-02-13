interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "warm" | "neutral";
}

export default function Badge({ children, variant = "blue" }: BadgeProps) {
  const variants = {
    blue: "bg-blue-pale/40 text-blue-deep border-blue-light/50 backdrop-blur-sm",
    warm: "bg-white/30 text-accent-warm border-accent-warm/20 backdrop-blur-sm",
    neutral: "bg-white/25 text-text-secondary border-white/40 backdrop-blur-sm",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium font-[family-name:var(--font-cs-caleb-mono)] tracking-wider uppercase border rounded-full shadow-sm ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

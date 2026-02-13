import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-[family-name:var(--font-dm-sans)] font-medium tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.97] hover:-translate-y-0.5";

  const variants = {
    primary:
      "bg-blue-primary text-white hover:bg-blue-deep border border-blue-primary hover:border-blue-deep shadow-[0_2px_8px_rgba(52,84,209,0.25)] hover:shadow-[0_4px_16px_rgba(52,84,209,0.35)]",
    outline:
      "bg-transparent text-blue-primary border border-blue-primary hover:bg-blue-primary hover:text-white hover:shadow-[0_2px_8px_rgba(52,84,209,0.2)]",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary border border-transparent hover:border-border",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-2.5 text-sm rounded-lg",
    lg: "px-8 py-3.5 text-base rounded-lg",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface GradientOrbProps {
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color1?: string;
  color2?: string;
  animation?: 1 | 2 | 3;
  opacity?: number;
  blur?: number;
}

export default function GradientOrb({
  size = 400,
  top,
  left,
  right,
  bottom,
  color1 = "var(--blue-light)",
  color2 = "var(--blue-primary)",
  animation = 1,
  opacity = 0.3,
  blur = 80,
}: GradientOrbProps) {
  const animationName =
    animation === 1
      ? "orb-drift-1"
      : animation === 2
        ? "orb-drift-2"
        : "orb-drift-3";

  const duration = animation === 1 ? "20s" : animation === 2 ? "25s" : "30s";

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        opacity,
        filter: `blur(${blur}px)`,
        background: `radial-gradient(circle at 30% 30%, ${color1}, ${color2} 70%, transparent 100%)`,
        animation: `${animationName} ${duration} ease-in-out infinite`,
      }}
    />
  );
}

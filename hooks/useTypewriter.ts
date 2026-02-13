"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  lines: string[];
  speed?: number;       // ms per line
  startDelay?: number;  // ms before starting
  enabled?: boolean;
}

interface UseTypewriterReturn {
  visibleLines: string[];
  isComplete: boolean;
  currentLine: number;
  reset: () => void;
}

export function useTypewriter({
  lines,
  speed = 120,
  startDelay = 500,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);

  const reset = useCallback(() => {
    setCurrentLine(0);
    setIsComplete(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [enabled, startDelay]);

  useEffect(() => {
    if (!started || isComplete) return;

    if (currentLine >= lines.length) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentLine((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [started, currentLine, lines.length, speed, isComplete]);

  const visibleLines = started ? lines.slice(0, currentLine) : [];

  return { visibleLines, isComplete, currentLine, reset };
}

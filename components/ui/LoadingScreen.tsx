"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  progress: number;
  onComplete: () => void;
}

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setDisplayProgress(Math.round(progress * 100));
  }, [progress]);

  useEffect(() => {
    if (progress < 1 || completed) return;
    setCompleted(true);

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power3.inOut",
      delay: 0.4,
      onComplete,
    });
  }, [progress, completed, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="text-center mb-16">
        <h1
          className="text-5xl tracking-[0.5em] uppercase mb-2"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--text)",
            letterSpacing: "0.4em",
          }}
        >
          SALVIA
        </h1>
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Clarity from Nature
        </p>
      </div>

      <div className="w-48 flex flex-col items-center gap-3">
        <div
          className="w-full h-px relative overflow-hidden"
          style={{ background: "rgba(240,237,232,0.1)" }}
        >
          <div
            ref={barRef}
            className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: `${displayProgress}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent-warm))",
            }}
          />
        </div>
        <span
          ref={counterRef}
          className="text-xs tabular-nums"
          style={{ color: "var(--text-muted)" }}
        >
          {displayProgress}%
        </span>
      </div>
    </div>
  );
}

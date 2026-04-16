"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface LoadingScreenProps {
  progress: number;
  onComplete: () => void;
}

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef({ val: 0 });
  const [displayPct, setDisplayPct] = useState(0);
  const [completed, setCompleted] = useState(false);
  const animRef = useRef<gsap.core.Tween | null>(null);

  // Animate display percentage smoothly to match real progress
  useEffect(() => {
    if (animRef.current) animRef.current.kill();
    animRef.current = gsap.to(displayRef.current, {
      val: Math.round(progress * 100),
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setDisplayPct(Math.round(displayRef.current.val)),
    });
  }, [progress]);

  // Trigger exit when progress hits 1
  useEffect(() => {
    if (progress < 1 || completed) return;
    setCompleted(true);

    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power3.inOut",
      delay: 0.5,
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
          className="text-5xl uppercase mb-2"
          style={{
            fontFamily: "var(--font-playfair)",
            color: "var(--text)",
            letterSpacing: "0.45em",
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

      <div className="w-52 flex flex-col items-center gap-3">
        <div
          className="w-full h-px relative overflow-hidden"
          style={{ background: "rgba(240,237,232,0.1)" }}
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${displayPct}%`,
              background: "linear-gradient(90deg, var(--accent), var(--accent-warm))",
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <span
          className="text-xs tabular-nums"
          style={{ color: "var(--text-muted)" }}
        >
          {displayPct}%
        </span>
      </div>
    </div>
  );
}

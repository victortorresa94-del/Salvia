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
  const [visible, setVisible] = useState(true);

  // Drive the bar width from progress prop
  useEffect(() => {
    if (!barRef.current) return;
    gsap.to(barRef.current, {
      width: `${progress * 100}%`,
      duration: 0.4,
      ease: "power1.out",
    });

    if (progress >= 1 && visible) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          setVisible(false);
          onComplete();
        },
      });
    }
  }, [progress, visible, onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "var(--bg-deep)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 300,
          fontSize: "1.5rem",
          letterSpacing: "0.1em",
          color: "var(--text)",
        }}
      >
        Salvia
      </div>

      <div
        style={{
          width: "160px",
          height: "1px",
          background: "var(--stroke)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={barRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "0%",
            background: "var(--accent-sage)",
          }}
        />
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--text-faded)",
        }}
      >
        Aether Labs
      </div>
    </div>
  );
}

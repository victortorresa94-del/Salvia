"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem 2.5rem",
        opacity: 0,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 300,
          fontSize: "1.1rem",
          letterSpacing: "0.05em",
          color: "var(--text)",
        }}
      >
        Salvia
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          fontFamily: "var(--font-body), sans-serif",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <a
          href="#roots"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}
        >
          Sistema
        </a>
        <a
          href="#harvest"
          style={{
            color: "var(--text)",
            textDecoration: "none",
            border: "1px solid var(--stroke)",
            padding: "0.5rem 1.2rem",
            borderRadius: "2px",
          }}
        >
          Agendar consultoría
        </a>
      </div>
    </nav>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const navItems = [
  { label: "Story", href: "#problem" },
  { label: "Science", href: "#solution" },
  { label: "Proof", href: "#proof" },
  { label: "Begin", href: "#cta" },
];

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.5 }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 opacity-0"
    >
      <span
        className="text-sm tracking-[0.4em] uppercase"
        style={{
          fontFamily: "var(--font-playfair)",
          color: "var(--text)",
        }}
      >
        Salvia
      </span>

      <ul className="flex gap-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-muted)")
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

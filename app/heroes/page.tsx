"use client";

import dynamic from "next/dynamic";

const HeroPlant = dynamic(() => import("@/components/heroes/HeroPlant"), { ssr: false });
const HeroSega  = dynamic(() => import("@/components/heroes/HeroSega"),  { ssr: false });

// ─── Shared text overlay ──────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <div style={{
      position: "absolute", top: "1.5rem", left: "1.5rem",
      fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
      letterSpacing: "0.14em", textTransform: "uppercase",
      color: "rgba(244,241,234,0.4)", pointerEvents: "none", zIndex: 2,
    }}>
      {text}
    </div>
  );
}

// ─── Hero wrapper ─────────────────────────────────────────────────────────────

function HeroSlot({
  label,
  tag,
  headline,
  sub,
  accent,
  bg,
  children,
}: {
  label: string;
  tag: string;
  headline: string;
  sub: string;
  accent: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{
      position: "relative", width: "100%", height: "100vh",
      background: bg, overflow: "hidden",
    }}>
      {/* 3D canvas — full section */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {children}
      </div>

      {/* Top-left label */}
      <Label text={label} />

      {/* Bottom-left text block */}
      <div style={{
        position: "absolute", bottom: "4rem", left: "6vw",
        zIndex: 2, maxWidth: "520px", pointerEvents: "none",
      }}>
        <p style={{
          fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: accent, marginBottom: "1rem",
        }}>
          {tag}
        </p>
        <h2 style={{
          fontFamily: "var(--font-display, serif)", fontWeight: 300,
          fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.08,
          color: "#f4f1ea", letterSpacing: "-0.02em", marginBottom: "1.2rem",
        }}>
          {headline}
        </h2>
        <p style={{
          fontFamily: "var(--font-body, sans-serif)", fontWeight: 400,
          fontSize: "clamp(0.85rem, 1.2vw, 1rem)", lineHeight: 1.7,
          color: "rgba(244,241,234,0.55)", maxWidth: "38ch",
        }}>
          {sub}
        </p>
        <p style={{
          marginTop: "0.75rem",
          fontFamily: "var(--font-mono, monospace)", fontSize: "0.62rem",
          color: "rgba(244,241,234,0.25)", letterSpacing: "0.06em",
        }}>
          Mueve el ratón · Scroll para acercar
        </p>
      </div>

      {/* Gradient at bottom for text legibility */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "55%", zIndex: 1,
        background: `linear-gradient(to top, ${bg} 0%, ${bg}bb 30%, transparent 100%)`,
        pointerEvents: "none",
      }} />
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeroesPage() {
  return (
    <main style={{ background: "#0a0d0a" }}>

      {/* ── Hero A — Planta / Salvia ────────────────────────────────────── */}
      <HeroSlot
        label="Hero A · Planta"
        tag="Salvia — Sistema de generación de leads"
        headline={"No vendemos\nsoftware.\nSembramos ventas."}
        sub="Un sistema vivo que cultiva leads cualificados para tu empresa. Sin setup. Sin cuota. Cobramos solo cuando cierras."
        accent="#87a878"
        bg="#0a0d0a"
      >
        <HeroPlant />
      </HeroSlot>

      {/* ── Hero B — Sega / Retro ───────────────────────────────────────── */}
      <HeroSlot
        label="Hero B · Objeto"
        tag="Salvia — Pay-per-performance"
        headline={"Ponemos piel\nen el juego.\nTú solo cosechas."}
        sub="Sin cuota fija. Sin riesgo. Construimos el sistema de prospección y cobramos un porcentaje sobre lo que cierras."
        accent="#d4a84b"
        bg="#0e0a06"
      >
        <HeroSega />
      </HeroSlot>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: "1.5rem", right: "2rem", zIndex: 100,
        display: "flex", gap: "1.5rem",
        fontFamily: "var(--font-mono, monospace)", fontSize: "0.6rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
      }}>
        <a href="/" style={{ color: "rgba(244,241,234,0.4)", textDecoration: "none" }}>
          ← Inicio
        </a>
        <a href="#hero-b" onClick={e => { e.preventDefault(); document.querySelectorAll('section')[1]?.scrollIntoView({ behavior: 'smooth' }); }}
          style={{ color: "rgba(244,241,234,0.4)", textDecoration: "none", cursor: "pointer" }}>
          Hero B
        </a>
      </nav>
    </main>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollProvider } from "@/components/scroll/ScrollContext";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Navigation } from "@/components/ui/Navigation";
import { SplitText } from "@/components/ui/SplitText";
import { CountUp } from "@/components/ui/CountUp";
import { Form } from "@/components/ui/Form";
import { gsap } from "@/lib/gsap";

const WebGLCanvas = dynamic(
  () => import("@/components/canvas/WebGLCanvas").then((m) => m.WebGLCanvas),
  { ssr: false }
);

// ─── DOM Sections ────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="hero"
      className="scene-section"
      style={{ position: "relative" }}
    >
      <div className="scene-sticky">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8vw",
            zIndex: 10,
          }}
        >
          <SplitText
            as="h1"
            type="words"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              lineHeight: 1.1,
              color: "var(--text)",
              maxWidth: "14ch",
              letterSpacing: "-0.01em",
            }}
          >
            No vendemos software. Sembramos ventas.
          </SplitText>

          <SplitText
            as="p"
            type="words"
            delay={0.3}
            style={{
              marginTop: "1.5rem",
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              lineHeight: 1.7,
              color: "var(--text-muted)",
              maxWidth: "42ch",
            }}
          >
            Salvia es un sistema vivo que cultiva leads cualificados para tu
            empresa. Sin setup. Sin cuota. Cobramos solo cuando cierras.
          </SplitText>

          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <a
              href="#harvest"
              style={{
                display: "inline-block",
                padding: "0.85rem 2rem",
                background: "var(--accent-sage-deep)",
                color: "var(--text)",
                fontFamily: "var(--font-body), sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              Agendar consultoría
            </a>

            <div
              className="scroll-indicator"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                color: "var(--text-faded)",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: "32px",
                  background: "var(--stroke)",
                }}
              />
              Scroll
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SoilSection() {
  return (
    <section
      id="problem"
      className="scene-section"
      style={{ position: "relative" }}
    >
      <div className="scene-sticky">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8vw",
            zIndex: 10,
          }}
        >
          <SplitText
            as="h2"
            type="words"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              color: "var(--text)",
              maxWidth: "20ch",
            }}
          >
            Tu equipo comercial se agota persiguiendo leads fríos.
          </SplitText>

          <SplitText
            as="p"
            type="words"
            delay={0.2}
            style={{
              marginTop: "1.2rem",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "clamp(0.9rem, 1.3vw, 1rem)",
              lineHeight: 1.75,
              color: "var(--text-muted)",
              maxWidth: "48ch",
            }}
          >
            El 70% del tiempo de un SDR se va en prospectar, no en cerrar. Y 9
            de cada 10 leads fríos nunca convierten. Tu pipeline se llena de
            humo mientras las cuotas de venta siguen subiendo.
          </SplitText>

          <div
            style={{
              marginTop: "3rem",
              display: "grid",
              gridTemplateColumns: "repeat(3, max-content)",
              gap: "3rem",
            }}
          >
            {[
              { value: 70, suffix: "%", label: "tiempo perdido prospectando" },
              { value: 1, suffix: " de 10", label: "leads fríos que convierten" },
              { value: 11, suffix: " meses", label: "para recuperar el CAC" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 400,
                    color: "var(--accent-copper)",
                    lineHeight: 1,
                  }}
                >
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  style={{
                    marginTop: "0.4rem",
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--text-faded)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RootsSection() {
  return (
    <section
      id="roots"
      className="scene-section"
      style={{ position: "relative" }}
    >
      <div className="scene-sticky">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8vw",
            zIndex: 10,
          }}
        >
          <SplitText
            as="h2"
            type="words"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              color: "var(--text)",
              maxWidth: "22ch",
            }}
          >
            Salvia es un sistema vivo. Claude orquesta cada canal.
          </SplitText>

          <SplitText
            as="p"
            type="words"
            delay={0.2}
            style={{
              marginTop: "1.2rem",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "clamp(0.9rem, 1.3vw, 1rem)",
              lineHeight: 1.75,
              color: "var(--text-muted)",
              maxWidth: "52ch",
            }}
          >
            Email en cadencias personalizadas. DMs de Instagram automatizados.
            WhatsApp al ritmo humano que pasa los filtros. Llamadas con
            contexto pre-cargado. Todo conectado. Todo medido. Todo vivo.
          </SplitText>
        </div>
      </div>
    </section>
  );
}

function BloomSection() {
  return (
    <section
      id="bloom"
      className="scene-section"
      style={{ position: "relative" }}
    >
      <div className="scene-sticky">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8vw",
            zIndex: 10,
          }}
        >
          <SplitText
            as="h2"
            type="words"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 300,
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              lineHeight: 1.15,
              color: "var(--text)",
              maxWidth: "18ch",
            }}
          >
            Nosotros plantamos. Tú cosechas.
          </SplitText>

          <SplitText
            as="p"
            type="words"
            delay={0.2}
            style={{
              marginTop: "1.2rem",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "clamp(0.9rem, 1.3vw, 1rem)",
              lineHeight: 1.75,
              color: "var(--text-muted)",
              maxWidth: "52ch",
            }}
          >
            Te entregamos leads cualificados listos para cerrar. Tu equipo se
            dedica a vender, no a buscar. Y nosotros solo facturamos sobre lo
            que cierras.
          </SplitText>

          {/* Pay-per-performance model cards */}
          <div
            style={{
              marginTop: "3rem",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              maxWidth: "640px",
            }}
          >
            {[
              {
                phase: "Fase 0",
                title: "Consultoría",
                desc: "Entendemos tu negocio, tu ICP y tus objeciones.",
                badge: "Gratis",
              },
              {
                phase: "Fase 1",
                title: "Sistema",
                desc: "Construimos y operamos el sistema de prospección.",
                badge: "Cero factura",
              },
              {
                phase: "Fase 2",
                title: "Cosecha",
                desc: "Cobramos un % sobre las ventas que cerramos juntos.",
                badge: "% ventas",
              },
            ].map((card) => (
              <div
                key={card.phase}
                style={{
                  padding: "1.25rem",
                  border: "1px solid var(--stroke)",
                  borderRadius: "4px",
                  background: "rgba(10, 13, 10, 0.6)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--accent-sage)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {card.phase}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 400,
                    fontSize: "1rem",
                    color: "var(--text)",
                    marginBottom: "0.4rem",
                  }}
                >
                  {card.title}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: "0.8rem",
                    color: "var(--text-faded)",
                    lineHeight: 1.5,
                    marginBottom: "0.75rem",
                  }}
                >
                  {card.desc}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "0.7rem",
                    color: "var(--accent-gold)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {card.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HarvestSection() {
  return (
    <section
      id="harvest"
      className="scene-section"
      style={{ position: "relative" }}
    >
      <div className="scene-sticky">
        {/* Dark overlay for form readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 13, 10, 0.6)",
            zIndex: 5,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8vw",
            zIndex: 10,
          }}
        >
          <SplitText
            as="h2"
            type="words"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              lineHeight: 1.1,
              color: "var(--text)",
              textAlign: "center",
              maxWidth: "20ch",
            }}
          >
            ¿Hay terreno fértil en tu negocio?
          </SplitText>

          <SplitText
            as="p"
            type="words"
            delay={0.2}
            style={{
              marginTop: "1rem",
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "clamp(0.9rem, 1.3vw, 1rem)",
              color: "var(--text-muted)",
              textAlign: "center",
              maxWidth: "44ch",
              lineHeight: 1.7,
            }}
          >
            Agenda una consultoría gratuita de 30 minutos. Te decimos si Salvia
            encaja — o no.
          </SplitText>

          <div style={{ marginTop: "3rem", width: "100%", maxWidth: "480px" }}>
            <Form />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        padding: "3rem 8vw",
        borderTop: "1px solid var(--stroke)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-body), sans-serif",
        fontSize: "0.75rem",
        color: "var(--text-faded)",
        letterSpacing: "0.04em",
      }}
    >
      <span>Salvia es un producto de Aether Labs · Barcelona · 2026</span>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <a href="/privacidad" style={{ color: "inherit", textDecoration: "none" }}>
          Privacidad
        </a>
        <a href="/legal" style={{ color: "inherit", textDecoration: "none" }}>
          Aviso legal
        </a>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [experienceReady, setExperienceReady] = useState(false);

  const handleWebGLReady = useCallback(() => {
    // WebGL first frame ready — ramp progress to 60% then animate to 100%
    setProgress(0.6);
    setTimeout(() => setProgress(1), 600);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setExperienceReady(true);
  }, []);

  // Minimum loading: wait for fonts + 1.8s
  useEffect(() => {
    const start = Date.now();
    const MIN = 1800;

    document.fonts.ready.then(() => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN - elapsed);
      setTimeout(() => setProgress(0.4), delay * 0.3);
    });
  }, []);

  return (
    <ScrollProvider>
      {/* Layer 0: fixed WebGL canvas */}
      <WebGLCanvas onReady={handleWebGLReady} />

      {/* Layer 1: loading screen */}
      <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />

      {/* Layer 2: DOM content — mounts after loading */}
      {experienceReady && (
        <SmoothScroll>
          <Navigation />
          <main>
            <HeroSection />
            <SoilSection />
            <RootsSection />
            <BloomSection />
            <HarvestSection />
          </main>
          <Footer />
        </SmoothScroll>
      )}
    </ScrollProvider>
  );
}

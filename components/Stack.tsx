'use client'

import { useScrollReveal } from '@/lib/animations'

const tools = [
  'Clay',
  'Apollo',
  'LinkedIn',
  'Instantly',
  'Snov.io',
  'Claude AI',
  'HubSpot',
  'n8n',
  'Perplexity',
  'Fireflies',
  'Calendly',
  '+ más',
]

export default function Stack() {
  const ref = useScrollReveal()

  return (
    <section
      id="stack"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg)] py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left */}
          <div className="stagger">
            <span className="reveal text-[var(--green)] text-xs font-semibold tracking-widest uppercase mb-4 block">
              Tecnología
            </span>
            <h2
              className="reveal font-serif italic text-[var(--text)] mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: '0.95',
                letterSpacing: '-0.02em',
              }}
            >
              Orquestamos las
              <br />
              mejores herramientas.
            </h2>
            <p className="reveal text-[var(--muted)] text-base leading-relaxed mb-7">
              No vendemos acceso a software. Usamos el stack más avanzado del
              mercado como infraestructura interna para construir tu sistema de
              generación de leads.
            </p>
            <div className="reveal inline-flex items-center gap-2 border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--bg2)]">
              <span className="text-[var(--faint)] text-xs">💡</span>
              <span className="text-[var(--muted)] text-xs">
                El cliente solo ve resultados. Las herramientas son nuestra capa interna.
              </span>
            </div>
          </div>

          {/* Right — tool grid */}
          <div className="reveal">
            <div className="grid grid-cols-3 gap-2.5">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="border border-[var(--border)] rounded-lg px-3 py-3 text-center text-xs text-[var(--muted)] font-medium hover:border-[var(--green)] hover:text-[var(--green)] transition-all duration-200 cursor-default select-none"
                >
                  {tool}
                </div>
              ))}
            </div>
            <p className="text-[var(--faint)] text-xs mt-4 text-center leading-relaxed">
              El stack evoluciona cada semana. Lo que importa es el sistema, no las herramientas.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

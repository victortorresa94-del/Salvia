'use client'

import { useScrollReveal } from '@/lib/animations'

const trustSignals = [
  { icon: '🔒', label: 'Confidencial' },
  { icon: '⚡', label: 'Respuesta en 24h' },
  { icon: '✓', label: 'Sin permanencia' },
]

export default function FinalCTA() {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative bg-[var(--bg2)] py-24 sm:py-32 overflow-hidden"
    >
      {/* Green glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,255,87,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center stagger">
        {/* Headline */}
        <h2
          className="reveal font-serif italic text-[var(--text)] mb-6"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            lineHeight: '0.95',
            letterSpacing: '-0.02em',
          }}
        >
          ¿Cuántas reuniones de ventas
          <br />
          tienes esta semana?
        </h2>

        {/* Subheadline */}
        <p className="reveal text-[var(--muted)] text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Una llamada de 20 minutos es suficiente para saber si SALVIA puede
          generarte pipeline.
        </p>

        {/* CTA */}
        <div className="reveal mb-6">
          <a
            href="https://calendly.com/salvia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[var(--green)] text-[#0a0a0a] font-semibold text-base px-10 py-4 rounded-full hover:bg-[var(--green-dim)] transition-colors duration-200"
          >
            Agendar llamada gratis
          </a>
        </div>

        {/* Disclaimer */}
        <p className="reveal text-[var(--muted)] text-xs mb-10">
          Sin compromiso. Sin tarjeta de crédito. Sin setup.
        </p>

        {/* Trust signals */}
        <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {trustSignals.map((t, i) => (
            <span key={i} className="flex items-center gap-2 text-[var(--muted)] text-sm">
              <span>{t.icon}</span>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

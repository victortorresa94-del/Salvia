'use client'

import { useScrollReveal } from '@/lib/animations'

const failures = [
  {
    title: 'Herramientas genéricas',
    body: 'Te venden acceso a datos. No te montan el sistema ni se responsabilizan del resultado.',
  },
  {
    title: 'Agentes de voz automáticos',
    body: 'El CEO recibe una llamada de robot. Cuelga. Tu marca queda dañada.',
  },
  {
    title: 'Agencias tradicionales',
    body: 'Setup de 4 semanas. Retainer fijo. Sin garantía de resultados. Sin accountability.',
  },
]

export default function Problem() {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg2)] py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal stagger flex flex-col items-center text-center mb-16">
          <span className="reveal text-[var(--green)] font-mono text-xs font-semibold tracking-widest uppercase mb-4">
            El problema
          </span>
          <h2
            className="reveal font-serif italic text-[var(--text)] mb-6"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: '0.95',
              letterSpacing: '-0.02em',
            }}
          >
            El outreach está roto.
          </h2>
          <p className="reveal text-[var(--muted)] text-base sm:text-lg max-w-2xl leading-relaxed">
            Los robots llaman. Los templates inundan las bandejas. Las herramientas
            prometen leads y entregan contactos fríos. El{' '}
            <span className="text-[var(--text)] font-medium">
              97% de los intentos de outreach B2B
            </span>{' '}
            no generan conversación real.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {failures.map((card) => (
            <div
              key={card.title}
              className="reveal bg-[var(--bg3)] rounded-xl p-7 ring-1 ring-white/5 transition-colors hover:bg-[var(--bg)]"
            >
              <div className="w-2 h-2 rounded-full bg-red-500/70 mb-4" />
              <h3 className="text-[var(--text)] font-semibold text-base mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

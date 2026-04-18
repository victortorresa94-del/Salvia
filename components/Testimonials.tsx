'use client'

import { useScrollReveal } from '@/lib/animations'

const quotes = [
  {
    text: 'En 5 días teníamos las primeras conversaciones con clientes potenciales. Sin montar nada.',
    author: 'CEO',
    company: 'empresa SaaS B2B',
  },
  {
    text: 'El modelo de revenue share fue lo que nos convenció. Solo pagan cuando funciona.',
    author: 'Founder',
    company: 'consultora tech',
  },
  {
    text: 'Pasamos de 0 a 8 reuniones cualificadas en el primer mes.',
    author: 'Director Comercial',
    company: 'empresa de datos',
  },
]

export default function Testimonials() {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg2)] py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16 stagger">
          <span className="reveal text-[var(--green)] text-xs font-semibold tracking-widest uppercase mb-4 block">
            Confianza
          </span>
          <h2
            className="reveal font-serif italic text-[var(--text)]"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 56px)',
              lineHeight: '0.95',
              letterSpacing: '-0.02em',
            }}
          >
            Ya trabajamos con
            <br />
            empresas que crecen.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger">
          {quotes.map((q, i) => (
            <div
              key={i}
              className="reveal border-l-2 border-[var(--green)] bg-[var(--bg3)] rounded-r-xl p-6"
            >
              <p className="text-[var(--text)] text-sm leading-relaxed italic mb-5">
                &ldquo;{q.text}&rdquo;
              </p>
              <div>
                <span className="text-[var(--text)] text-xs font-semibold">
                  {q.author}
                </span>
                <span className="text-[var(--muted)] text-xs">, {q.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

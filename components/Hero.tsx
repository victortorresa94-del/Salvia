'use client'

import dynamic from 'next/dynamic'

const SalviaHero3D = dynamic(() => import('./SalviaHero3D'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg2)]"
      style={{ height: 440 }}
    />
  ),
})

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

      {/* Bottom lime glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,255,87,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full">
        {/* Two-column layout on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="flex flex-col items-start text-left">
            {/* Badge */}
            <div className="hero-animate mb-7">
              <span className="inline-flex items-center gap-2 border border-[var(--green)] text-[var(--green)] text-xs font-medium px-4 py-2 rounded-full bg-[rgba(168,255,87,0.05)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] pulse-dot" />
                Operativo con 5 clientes B2B
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-animate font-serif italic text-[var(--text)]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(44px, 6vw, 84px)',
                lineHeight: '0.95',
                letterSpacing: '-0.02em',
              }}
            >
              Tu próxima
              <br />
              reunión de
              <br />
              ventas.
            </h1>

            {/* Subheadline */}
            <p className="hero-animate mt-5 text-[var(--muted)] text-base sm:text-lg leading-relaxed max-w-md">
              Sin montar el sistema. Sin pagar hasta ver resultados.
            </p>

            {/* CTAs */}
            <div className="hero-animate mt-8 flex flex-col sm:flex-row items-start gap-4">
              <a
                href="https://calendly.com/salvia"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--green)] text-[#0a0a0a] font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-[var(--green-dim)] transition-colors duration-200 whitespace-nowrap"
              >
                Agendar llamada gratis
              </a>
              <a
                href="#como-funciona"
                className="text-[var(--text)] text-sm font-medium hover:underline decoration-[var(--green)] underline-offset-4 transition-all duration-200 flex items-center gap-1 pt-1"
              >
                Ver cómo funciona <span aria-hidden>→</span>
              </a>
            </div>

            {/* Stats */}
            <div className="hero-animate mt-10 flex flex-col gap-3 sm:flex-row sm:gap-6">
              {[
                { stat: '< 72h', label: 'De onboarding a leads' },
                { stat: '> 8%', label: 'Tasa de respuesta' },
                { stat: '0 €', label: 'Hasta pipeline real' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[var(--green)] font-semibold text-base">{item.stat}</span>
                  <span className="text-[var(--muted)] text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — 3D scene */}
          <div className="hero-animate w-full">
            <SalviaHero3D height={480} />
          </div>
        </div>
      </div>
    </section>
  )
}

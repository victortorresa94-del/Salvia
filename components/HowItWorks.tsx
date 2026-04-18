'use client'

import { useScrollReveal } from '@/lib/animations'
import SalviaEcosystem from './SalviaEcosystem'

const steps = [
  {
    num: '01',
    title: 'Onboarding (45 min)',
    body: 'Una reunión. Entendemos tu negocio, tu cliente ideal y tus casos de éxito. El sistema hace el resto.',
  },
  {
    num: '02',
    title: 'El sistema trabaja',
    body: 'Identificamos empresas con señales de compra activas. Generamos mensajes personalizados de verdad, no templates.',
  },
  {
    num: '03',
    title: 'Recibes el lead cualificado',
    body: 'Un contacto real, que ha mostrado interés, con el contexto completo de la conversación. Directo a tu CRM.',
  },
]

export default function HowItWorks() {
  const ref = useScrollReveal()

  return (
    <section
      id="como-funciona"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg)] py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16 stagger">
          <span className="reveal text-[var(--green)] text-xs font-semibold tracking-widest uppercase mb-4 block">
            El sistema
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
            De reunión a leads
            <br />
            en 72 horas.
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 stagger">
          {steps.map((step, i) => (
            <div key={step.num} className="reveal flex flex-col md:flex-row items-stretch flex-1">
              <div className="flex-1 bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-7 flex flex-col gap-4">
                <span className="text-[var(--green)] font-semibold text-xs tracking-widest">
                  {step.num}
                </span>
                <h3 className="text-[var(--text)] font-semibold text-lg leading-snug">
                  {step.title}
                </h3>
                <p className="text-[var(--muted)] text-sm leading-relaxed">{step.body}</p>
              </div>
              {i < steps.length - 1 && (
                <>
                  <div className="hidden md:flex items-center px-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-px bg-[var(--green)] opacity-40" />
                      <span className="text-[var(--green)] text-lg leading-none -mt-2.5">→</span>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-center py-2">
                    <div className="w-px h-8 bg-gradient-to-b from-[var(--green)] to-transparent opacity-40" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Ecosystem visualization */}
        <div className="reveal mt-20 bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-8 sm:p-10">
          <p className="text-center text-[var(--muted)] text-xs uppercase tracking-widest mb-2">
            Pipeline completo
          </p>
          <p className="text-center text-[var(--text)] text-sm font-medium mb-10">
            Así se ve el flujo de tu sistema una vez activo
          </p>
          <SalviaEcosystem />
        </div>

        {/* Info box */}
        <div className="reveal mt-8 border border-[var(--green)] rounded-xl p-5 sm:p-6 text-center bg-[rgba(168,255,87,0.03)]">
          <p className="text-[var(--text)] text-sm sm:text-base font-medium">
            No cobramos por configurar el sistema.{' '}
            <span className="text-[var(--green)]">Solo por los resultados.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

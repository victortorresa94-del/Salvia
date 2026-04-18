'use client'

import { useState } from 'react'
import { useScrollReveal } from '@/lib/animations'

const faqs = [
  {
    q: '¿Cuánto tarda en arrancar?',
    a: 'El onboarding es una reunión de 45 minutos. En menos de 72 horas el sistema está activo y generando los primeros contactos.',
  },
  {
    q: '¿Cómo funciona el modelo de revenue share?',
    a: 'No cobramos nada hasta que tú cierres una venta generada por SALVIA. Luego aplicamos un porcentaje acordado (15–25%) sobre el valor del contrato. Necesitamos acceso a tu CRM para verificar los cierres.',
  },
  {
    q: '¿Para qué tipo de empresa funciona mejor?',
    a: 'Para empresas B2B con ticket de venta superior a 5.000 € anuales. SaaS, consultoras tech, agencias de software, empresas de datos o IA. Si tienes un producto validado pero te cuesta generar pipeline, SALVIA es para ti.',
  },
  {
    q: '¿Qué necesito tener yo para empezar?',
    a: 'Solo necesitas una reunión con nosotros para explicarnos tu cliente ideal y tus casos de éxito. El resto lo hacemos nosotros.',
  },
  {
    q: '¿Pueden los agentes de IA reemplazar esto en el futuro?',
    a: 'El sistema ya usa IA extensivamente. La capa que no se automatiza fácilmente es el criterio estratégico: entender qué señales importan para tu producto específico y qué mensajes generan confianza real en tu mercado.',
  },
]

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left min-h-[44px] group"
        aria-expanded={open}
      >
        <span className="text-[var(--text)] text-sm sm:text-base font-medium pr-4 group-hover:text-[var(--green)] transition-colors duration-200">
          {q}
        </span>
        <span
          className={`text-[var(--green)] text-xl leading-none shrink-0 transition-transform duration-300 ${
            open ? 'rotate-45' : 'rotate-0'
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <div className={`accordion-content ${open ? 'open' : ''}`}>
        <div className="accordion-inner">
          <p className="text-[var(--muted)] text-sm leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const ref = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg)] py-24 sm:py-32"
    >
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal text-center mb-12 stagger">
          <span className="reveal text-[var(--green)] text-xs font-semibold tracking-widest uppercase mb-4 block">
            Preguntas frecuentes
          </span>
          <h2
            className="reveal font-serif italic text-[var(--text)]"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: '0.95',
              letterSpacing: '-0.02em',
            }}
          >
            Todo lo que
            <br />
            necesitas saber.
          </h2>
        </div>

        {/* Accordion */}
        <div className="reveal border-t border-[var(--border)]">
          {faqs.map((item) => (
            <AccordionItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  )
}

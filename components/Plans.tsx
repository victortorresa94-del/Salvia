'use client'

import { useScrollReveal } from '@/lib/animations'

const plans = [
  {
    badge: 'Para empezar',
    name: 'Lead Delivery',
    price: '80–200 €',
    period: '/lead cualificado',
    description:
      'Entregamos leads cualificados a tu equipo de ventas. Tú cierras.',
    features: [
      'Onboarding en 48h',
      'Leads con contexto completo',
      'Entrega a tu CRM',
      'Reporting semanal',
    ],
    cta: 'Empezar ahora',
    href: 'https://calendly.com/salvia',
    highlight: false,
  },
  {
    badge: 'MÁS POPULAR',
    name: 'Revenue Share',
    price: '0 €',
    period: 'hasta que cierres',
    description:
      'Ponemos el sistema, generamos los leads y los cualificamos. Cobramos un % de lo que vendas.',
    features: [
      'Todo lo del Plan A',
      'Cualificación automática',
      'Cero riesgo para ti',
      '15–25% sobre venta cerrada',
      'Alineados con tu éxito',
    ],
    cta: 'Agendar llamada',
    href: 'https://calendly.com/salvia',
    highlight: true,
  },
  {
    badge: 'Para escalar',
    name: 'Sistema Instalado',
    price: '5.000 €',
    period: 'setup + 1.500 €/mes',
    description:
      'Instalamos SALVIA dentro de tu empresa. Tu equipo lo opera.',
    features: [
      'Software de orquestación propio',
      'Formación del equipo',
      'Integraciones custom',
      'Soporte continuo',
    ],
    cta: 'Hablar con nosotros',
    href: 'https://calendly.com/salvia',
    highlight: false,
  },
]

export default function Plans() {
  const ref = useScrollReveal()

  return (
    <section
      id="planes"
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[var(--bg2)] py-24 sm:py-32"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16 stagger">
          <span className="reveal text-[var(--green)] text-xs font-semibold tracking-widest uppercase mb-4 block">
            Planes
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
            Elige según
            <br />
            tu momento.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`reveal relative flex flex-col rounded-2xl p-7 border transition-all duration-200 ${
                plan.highlight
                  ? 'border-[var(--green)] bg-[rgba(168,255,87,0.03)]'
                  : 'border-[var(--border)] bg-[var(--bg3)]'
              }`}
              style={
                plan.highlight
                  ? {
                      boxShadow: '0 0 40px rgba(168,255,87,0.06)',
                    }
                  : undefined
              }
            >
              {/* Badge */}
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5 w-fit ${
                  plan.badge === 'MÁS POPULAR'
                    ? 'bg-[var(--green)] text-[#0a0a0a]'
                    : 'border border-[var(--border)] text-[var(--muted)]'
                }`}
              >
                {plan.badge}
              </span>

              {/* Name */}
              <h3 className="text-[var(--text)] font-semibold text-xl mb-3">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-[var(--text)] text-3xl font-semibold">
                  {plan.price}
                </span>
                <span className="text-[var(--muted)] text-sm ml-1">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">
                {plan.description}
              </p>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
                    <span className="text-[var(--green)] mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center text-sm font-semibold px-5 py-3.5 rounded-full transition-colors duration-200 ${
                  plan.highlight
                    ? 'bg-[var(--green)] text-[#0a0a0a] hover:bg-[var(--green-dim)]'
                    : 'border border-[var(--border)] text-[var(--text)] hover:border-[var(--green)] hover:text-[var(--green)]'
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Target, MessageSquare, Database, RefreshCw, CheckCircle, BarChart2 } from 'lucide-react'

const steps = [
  {
    title: 'Señales',
    desc: 'Empresas con intención activa',
    icon: Target,
    shape: 'rounded-full',
  },
  {
    title: 'Outreach',
    desc: 'Mensajes personalizados de verdad',
    icon: MessageSquare,
    shape: 'rounded-full',
    highlight: true,
  },
  {
    title: 'CRM',
    desc: 'Sincronización automática',
    icon: Database,
    shape: 'rounded-xl',
  },
  {
    title: 'Seguimiento',
    desc: 'Nurturing hasta respuesta',
    icon: RefreshCw,
    shape: 'rounded-full',
  },
  {
    title: 'Lead',
    desc: 'Cualificado y con contexto',
    icon: CheckCircle,
    shape: 'rounded-full',
    success: true,
  },
  {
    title: 'Reporting',
    desc: 'Visibilidad total del pipeline',
    icon: BarChart2,
    shape: 'rounded-full',
  },
]

export default function SalviaEcosystem() {
  return (
    <div className="relative pt-10">
      {/* Connector line */}
      <div className="absolute top-[72px] left-0 w-full h-px bg-[var(--border)] hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--green)] to-transparent opacity-30" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
        {steps.map((step, idx) => {
          const Icon = step.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className={`
                  w-16 h-16 mb-6 flex items-center justify-center transition-all duration-500
                  ${step.shape}
                  ${
                    step.success
                      ? 'bg-[var(--green)] shadow-[0_0_25px_rgba(168,255,87,0.4)] border-transparent'
                      : step.highlight
                      ? 'bg-transparent border border-[var(--green)] opacity-60 shadow-[0_0_15px_rgba(168,255,87,0.15)]'
                      : 'bg-[var(--bg3)] border border-[var(--border)]'
                  }
                  group-hover:border-[var(--green)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,255,87,0.2)]
                `}
              >
                <Icon
                  className={`transition-colors duration-500 ${
                    step.success
                      ? 'text-[#0a0a0a] w-7 h-7'
                      : step.highlight
                      ? 'text-[var(--green)] w-6 h-6'
                      : 'text-[var(--muted)] w-5 h-5'
                  } group-hover:text-[var(--green)]`}
                />
              </div>
              <h4 className="text-xs font-semibold text-[var(--text)] uppercase tracking-widest mb-1">
                {step.title}
              </h4>
              <p
                className={`text-[10px] uppercase tracking-[.15em] font-medium leading-tight ${
                  step.highlight ? 'text-[var(--green)]' : 'text-[var(--faint)]'
                }`}
              >
                {step.desc}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

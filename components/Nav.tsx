'use client'

import { useState, useEffect } from 'react'

const links = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Stack', href: '#stack' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const closeAndNavigate = () => setOpen(false)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-[var(--border)]' : ''
        }`}
        style={{ backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent' }}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px,2vw,26px)',
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: '#f0ead6',
              textDecoration: 'none',
              lineHeight: 1,
            }}
          >
            SALVIA
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-200"
                style={{ letterSpacing: '0.04em' }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://calendly.com/salvia"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--green)] text-[#0a0a0a] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[var(--green-dim)] transition-colors duration-200 whitespace-nowrap"
            >
              Agendar llamada →
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span
              className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${
                open ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--text)] transition-all duration-300 ${
                open ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center items-center gap-8 transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(6,10,8,0.97)' }}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={closeAndNavigate}
            className="text-2xl font-medium text-[var(--text)] hover:text-[var(--green)] transition-colors duration-200"
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://calendly.com/salvia"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeAndNavigate}
          className="bg-[var(--green)] text-[#0a0a0a] text-base font-semibold px-8 py-3 rounded-full hover:bg-[var(--green-dim)] transition-colors duration-200 mt-4"
        >
          Agendar llamada
        </a>
      </div>
    </>
  )
}

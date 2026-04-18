const links = [
  { label: 'Inicio', href: '#' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contacto', href: 'https://calendly.com/salvia' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--border)] py-10">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          {/* Logo */}
          <a
            href="#"
            className="font-serif italic text-[var(--green)] text-xl leading-none"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            SALVIA
          </a>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[var(--muted)] text-xs hover:text-[var(--text)] transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <span className="text-[var(--muted)] text-xs">
            © 2025 SALVIA. Todos los derechos reservados.
          </span>
        </div>

        {/* Bottom line */}
        <p className="text-center text-[var(--faint)] text-xs">
          Sistema de generación de leads B2B con inteligencia artificial.
        </p>
      </div>
    </footer>
  )
}

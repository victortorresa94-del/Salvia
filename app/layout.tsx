import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans, Anton, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

// Anton — ultra-condensed gothic para el wordmark SALVIA
const anton = Anton({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// Cormorant Garamond — serif de alto contraste, claim (400) y descriptor (300)
const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://salvia.ai'),
  title: 'SALVIA — Leads B2B con IA',
  description:
    'Sistema de generación de leads B2B con inteligencia artificial. Sin setup. Sin riesgo. Solo resultados.',
  openGraph: {
    title: 'SALVIA — Leads B2B con IA',
    description:
      'Tu próxima reunión de ventas. Sin montar el sistema. Sin pagar hasta ver resultados.',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SALVIA — Leads B2B con IA',
    description: 'Tu próxima reunión de ventas. Sin montar el sistema.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${dmSerifDisplay.variable} ${dmSans.variable} ${anton.variable} ${cormorantGaramond.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

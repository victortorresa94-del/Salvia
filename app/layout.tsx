import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  // Fraunces is variable — do not specify fixed weight with axes
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Salvia — Sistema de Leads con IA",
  description:
    "Salvia es un sistema pay-per-performance. Prospección multicanal orquestada por IA. Sin setup. Sin cuota. Solo pagás cuando cerrás ventas.",
  openGraph: {
    title: "Salvia — Sistema de Leads con IA",
    description: "Cobramos solo cuando cierras.",
    siteName: "Salvia by Aether Labs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

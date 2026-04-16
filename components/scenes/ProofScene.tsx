"use client";

import { useEffect, useRef } from "react";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const testimonials = [
  {
    quote: "After two weeks, my afternoon crashes disappeared completely. I finish my workday with the same energy I started it with.",
    name: "Elena R.",
    role: "Product Lead, Berlin",
  },
  {
    quote: "I was skeptical of any supplement. The cognitive science behind Salvia is what convinced me. Three months in — I'm a believer.",
    name: "Dr. Marcus T.",
    role: "Neuroscientist, UCL",
  },
  {
    quote: "I write for eight hours straight now. No friction. Just flow. This is what peak state feels like.",
    name: "Aria K.",
    role: "Author & Essayist",
  },
];

const papers = [
  { year: "2023", journal: "Phytomedicine", finding: "+34% working memory vs. placebo" },
  { year: "2022", journal: "Frontiers in Neuroscience", finding: "AChE inhibition confirmed at 5mg/kg" },
  { year: "2021", journal: "Journal of Psychopharmacology", finding: "Significant mood stabilization, N=186" },
];

export function ProofScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const papersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Testimonials parallax reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".testimonial-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Papers slide in from left
      if (papersRef.current) {
        const rows = papersRef.current.querySelectorAll(".paper-row");
        gsap.fromTo(
          rows,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: papersRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <ScrollScene height="300vh" id="proof">
      <div
        ref={sectionRef}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ background: "transparent" }}
      >
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="mb-16 text-center">
            <p
              className="text-xs tracking-[0.5em] uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              Science &amp; Proof
            </p>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                color: "var(--text)",
              }}
            >
              Peer-reviewed.
              <br />
              <em>Human-validated.</em>
            </h2>
          </div>

          {/* Testimonials */}
          <div ref={cardsRef} className="grid grid-cols-3 gap-5 mb-16">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="testimonial-card p-6 rounded-sm"
                style={{
                  background: "var(--surface)",
                  border: "1px solid rgba(240,237,232,0.06)",
                }}
              >
                <p
                  className="text-sm leading-relaxed mb-6 italic"
                  style={{ color: "var(--text)" }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--accent-warm)" }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {t.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Research papers */}
          <div
            ref={papersRef}
            className="border-t pt-8"
            style={{ borderColor: "rgba(240,237,232,0.06)" }}
          >
            <p
              className="text-xs tracking-[0.3em] uppercase mb-6"
              style={{ color: "var(--text-muted)" }}
            >
              Clinical Research
            </p>
            <div className="space-y-4">
              {papers.map((p, i) => (
                <div
                  key={i}
                  className="paper-row flex items-center justify-between py-3 border-b"
                  style={{ borderColor: "rgba(240,237,232,0.06)" }}
                >
                  <span className="text-xs" style={{ color: "var(--accent-warm)" }}>
                    {p.year}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {p.journal}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {p.finding}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}

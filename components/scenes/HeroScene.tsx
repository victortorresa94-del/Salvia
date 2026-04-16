"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !headlineRef.current) return;

      // Letter-by-letter headline on scroll
      const headline = headlineRef.current;
      const letters = headline.innerText.split("");
      headline.innerHTML = letters
        .map(
          (l) =>
            `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(110%)">${l === " " ? "&nbsp;" : l}</span></span>`
        )
        .join("");

      const inners = headline.querySelectorAll("span > span");

      gsap.to(inners, {
        y: "0%",
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=60%",
          scrub: 0.8,
        },
      });

      // Sub and CTA fade in
      gsap.fromTo(
        [subRef.current, ctaRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "40% top",
            end: "+=40%",
            scrub: 0.8,
          },
        }
      );

      // Radial glow expand on scroll
      gsap.fromTo(
        bgRef.current,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1.4,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <ScrollScene height="400vh" id="hero">
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        {/* Particle background */}
        <ParticleField />

        {/* Radial glow */}
        <div
          ref={bgRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(74,124,89,0.3) 0%, rgba(74,124,89,0.05) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-8"
            style={{ color: "var(--accent-warm)" }}
          >
            Premium Botanical Nootropic
          </p>

          <h1
            ref={headlineRef}
            className="leading-none mb-8 select-none"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--text)",
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              fontWeight: 900,
            }}
          >
            Clarity from Nature
          </h1>

          <p
            ref={subRef}
            className="text-lg max-w-md mx-auto leading-relaxed opacity-0"
            style={{ color: "var(--text-muted)" }}
          >
            Ancient plant intelligence, rigorously studied.
            <br />
            The clearest mind you have ever had.
          </p>

          <div ref={ctaRef} className="mt-12 opacity-0">
            <a
              href="#problem"
              className="inline-block px-10 py-4 text-sm tracking-[0.2em] uppercase border transition-all duration-500 group"
              style={{
                borderColor: "var(--accent)",
                color: "var(--text)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              Discover More
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div
            className="w-px h-10 origin-top"
            style={{
              background: "linear-gradient(to bottom, var(--text-muted), transparent)",
              animation: "scaleY 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </ScrollScene>
  );
}

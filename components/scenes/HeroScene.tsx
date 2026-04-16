"use client";

import { useEffect, useRef } from "react";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function HeroScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !headlineRef.current) return;

      // Letter-by-letter headline reveal on first scroll
      const headline = headlineRef.current;
      const letters = headline.innerText.split("");
      headline.innerHTML = letters
        .map((l) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(110%)">${l === " " ? "&nbsp;" : l}</span></span>`
        )
        .join("");

      const inners = headline.querySelectorAll("span > span");

      gsap.to(inners, {
        y: "0%",
        duration: 1.6,
        ease: "power3.out",
        stagger: 0.035,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=50%",
          scrub: 1,
        },
      });

      // Eyebrow fade in
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, letterSpacing: "0.8em" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.5em",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=20%",
            scrub: 1,
          },
        }
      );

      // Sub + CTA fade in with parallax
      gsap.fromTo(
        [subRef.current, ctaRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "35% top",
            end: "+=35%",
            scrub: 0.8,
          },
        }
      );

      // Parallax: headline drifts at different rate than sub (depth effect)
      gsap.to(headline, {
        y: "-8vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(subRef.current, {
        y: "-4vh",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <ScrollScene height="400vh" id="hero">
      <div
        ref={sectionRef}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "transparent" }}
      >
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p
            ref={eyebrowRef}
            className="text-[10px] uppercase mb-10 opacity-0"
            style={{ color: "var(--accent-warm)", letterSpacing: "0.5em" }}
          >
            Premium Botanical Nootropic
          </p>

          <h1
            ref={headlineRef}
            className="leading-none mb-10 select-none"
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
              className="inline-block px-10 py-4 text-sm tracking-[0.2em] uppercase border transition-colors duration-500"
              style={{ borderColor: "var(--accent)", color: "var(--text)" }}
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
            className="w-px h-10 origin-top animate-pulse"
            style={{
              background: "linear-gradient(to bottom, var(--text-muted), transparent)",
            }}
          />
        </div>
      </div>
    </ScrollScene>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";


interface StatCounterProps {
  numeric: number;
  suffix: string;
  label: string;
  triggerEl: HTMLElement | null;
}

function StatCounter({ numeric, suffix, label, triggerEl }: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!triggerEl || !numRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top 60%",
      onEnter: () => {
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: numeric,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (numRef.current) {
                numRef.current.textContent = obj.val.toFixed(suffix === "h" ? 1 : 0);
              }
            },
          }
        );
      },
      once: true,
    });

    return () => trigger.kill();
  }, [numeric, suffix, triggerEl]);

  return (
    <div className="text-center">
      <div
        className="mb-3"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(3rem, 6vw, 5rem)",
          color: "var(--accent-warm)",
          fontWeight: 700,
        }}
      >
        <span ref={numRef}>0</span>
        <span>{suffix}</span>
      </div>
      <p
        className="text-sm leading-snug max-w-[160px] mx-auto"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
    </div>
  );
}

export function ProblemScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Background handled by WebGL canvas — no DOM bg animation needed

      // Text reveal
      if (textRef.current) {
        const paras = textRef.current.querySelectorAll("p, h2");
        gsap.fromTo(
          paras,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Stats stagger
      if (statsRef.current) {
        const cards = statsRef.current.querySelectorAll(".stat-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <ScrollScene height="300vh" id="problem">
      <div
        ref={sectionRef}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ background: "transparent" }}
      >
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <div ref={textRef} className="mb-16">
            <p
              className="text-xs tracking-[0.5em] uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              The Problem
            </p>
            <h2
              className="leading-tight mb-6"
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              The modern world
              <br />
              <em>stole your focus.</em>
            </h2>
            <p
              className="text-base max-w-md leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              Chronic distraction, ultra-processed diets, and chronic stress have
              eroded the cognitive capacity that makes us human. We were built to
              think clearly. Most of us have forgotten how.
            </p>
          </div>

          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-8 border-t pt-12"
            style={{ borderColor: "rgba(240,237,232,0.08)" }}
          >
            {[
              { numeric: 25, suffix: "%", label: "of adults suffer from chronic brain fog" },
              { numeric: 40, suffix: "%", label: "drop in focused attention after age 30" },
              { numeric: 1.5, suffix: "h", label: "average true deep focus per day" },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <StatCounter
                  numeric={s.numeric}
                  suffix={s.suffix}
                  label={s.label}
                  triggerEl={statsRef.current}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}

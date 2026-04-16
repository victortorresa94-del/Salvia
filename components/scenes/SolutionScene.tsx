"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const steps = [
  {
    num: "01",
    title: "Ancient Wisdom",
    body: "Salvia officinalis has been used for millennia across Mediterranean and indigenous cultures for mental acuity, memory, and spiritual clarity.",
    icon: "🌿",
  },
  {
    num: "02",
    title: "Precision Extraction",
    body: "Cold-process CO₂ extraction preserves the full spectrum of rosmarinic acid, ursolic acid, and volatile terpenes — nothing lost, nothing added.",
    icon: "⚗️",
  },
  {
    num: "03",
    title: "Clinical Formulation",
    body: "Each batch is standardized to 5% rosmarinic acid and validated against acetylcholinesterase inhibition — the same mechanism as leading cognitive drugs.",
    icon: "🔬",
  },
  {
    num: "04",
    title: "Measurable Clarity",
    body: "In 12-week studies, participants reported 34% improvement in working memory and 41% reduction in mental fatigue scores.",
    icon: "📈",
  },
];

export function SolutionScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      steps.forEach((_, i) => {
        const threshold = i / steps.length;

        ScrollTrigger.create({
          trigger: sectionRef.current!,
          start: `${threshold * 100}% top`,
          end: `${((i + 1) / steps.length) * 100}% top`,
          scrub: true,
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
      });

      // Animate each step card on enter
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current!,
              start: `${(i / steps.length) * 90}% top`,
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Progress bar
      gsap.to(progressRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <ScrollScene height="500vh" id="solution">
      <div
        ref={sectionRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden px-6"
        style={{ background: "transparent" }}
      >
        {/* Vertical progress line */}
        <div
          className="absolute left-10 top-1/2 -translate-y-1/2 w-px h-48"
          style={{ background: "rgba(240,237,232,0.08)" }}
        >
          <div
            ref={progressRef}
            className="w-full origin-top"
            style={{
              height: "100%",
              background: "var(--accent)",
              transform: "scaleY(0)",
            }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute left-[38px] top-1/2 -translate-y-1/2 flex flex-col justify-between h-48">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full border transition-all duration-500"
              style={{
                borderColor: i === activeStep ? "var(--accent)" : "rgba(240,237,232,0.2)",
                background: i === activeStep ? "var(--accent)" : "transparent",
                transform: i === activeStep ? "scale(1.5)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto w-full pl-16">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-4"
            style={{ color: "var(--accent-warm)" }}
          >
            The Solution
          </p>
          <h2
            className="leading-tight mb-16"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              color: "var(--text)",
            }}
          >
            How Salvia restores
            <br />
            <em>your natural clarity.</em>
          </h2>

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) stepRefs.current[i] = el;
                }}
                className="flex gap-6 p-6 rounded-sm transition-all duration-500"
                style={{
                  background:
                    i === activeStep
                      ? "rgba(74,124,89,0.08)"
                      : "transparent",
                  borderLeft: `2px solid ${i === activeStep ? "var(--accent)" : "transparent"}`,
                  opacity: 0,
                }}
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs"
                      style={{ color: "var(--accent)", fontFamily: "var(--font-playfair)" }}
                    >
                      {step.num}
                    </span>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: "var(--text)", fontFamily: "var(--font-playfair)" }}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}

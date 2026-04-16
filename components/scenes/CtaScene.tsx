"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollScene } from "@/components/scroll/ScrollScene";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function CtaScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;

      // Background expands to lighter
      gsap.fromTo(
        bgRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 2,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top top",
            scrub: 1,
          },
        }
      );

      // Content reveal
      if (headlineRef.current) {
        const text = headlineRef.current.innerText;
        const words = text.split(" ");
        headlineRef.current.innerHTML = words
          .map(
            (w) =>
              `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(110%)">${w}</span></span>`
          )
          .join(" ");

        const inners = headlineRef.current.querySelectorAll("span > span");
        gsap.to(inners, {
          y: "0%",
          duration: 1,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <ScrollScene height="200vh" id="cta">
      <div
        ref={sectionRef}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-6 text-center"
        style={{ background: "transparent" }}
      >
        {/* Expanding light bg */}
        <div
          ref={bgRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(74,124,89,0.08) 40%, transparent 70%)",
            filter: "blur(80px)",
            transform: "scale(0)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <p
            className="text-xs tracking-[0.5em] uppercase mb-8"
            style={{ color: "var(--accent-warm)" }}
          >
            Begin Your Journey
          </p>

          <h2
            ref={headlineRef}
            className="leading-tight mb-10"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              color: "var(--text)",
              fontWeight: 900,
            }}
          >
            Your clearest mind awaits.
          </h2>

          <div ref={contentRef}>
            <p
              className="text-base leading-relaxed mb-10"
              style={{ color: "var(--text-muted)" }}
            >
              Join 12,000+ people who made the shift to botanical cognitive clarity.
              <br />
              First batch ships February 2025.
            </p>

            {submitted ? (
              <div
                className="py-4 px-8 text-sm tracking-[0.1em]"
                style={{ color: "var(--accent)" }}
              >
                You&apos;re on the list. We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex gap-0 max-w-sm mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-5 py-4 text-sm outline-none"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid rgba(240,237,232,0.12)",
                    borderRight: "none",
                    color: "var(--text)",
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300"
                  style={{
                    background: "var(--accent)",
                    color: "var(--text)",
                    border: "1px solid var(--accent)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-warm)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-warm)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--accent)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                >
                  Reserve
                </button>
              </form>
            )}

            <p
              className="mt-6 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              No spam. Unsubscribe anytime. 30-day money-back guarantee.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-8 flex gap-8 text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span>© 2025 Salvia</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </ScrollScene>
  );
}

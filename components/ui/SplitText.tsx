"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SplitTextProps {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  animation?: "words" | "chars" | "lines";
  stagger?: number;
  delay?: number;
  triggerRef?: React.RefObject<HTMLElement>;
  start?: string;
}

export function SplitText({
  children,
  className = "",
  tag: Tag = "h2",
  animation = "words",
  stagger = 0.08,
  delay = 0,
  triggerRef,
  start = "top 80%",
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const text = children;
    const units =
      animation === "chars"
        ? text.split("")
        : animation === "words"
        ? text.split(" ")
        : text.split("\n");

    el.innerHTML = units
      .map((unit, i) => {
        const spacer = animation === "words" && i < units.length - 1 ? " " : "";
        return `<span class="split-unit" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="split-inner" style="display:inline-block;transform:translateY(110%)">${unit}</span></span>${spacer}`;
      })
      .join("");

    const inners = el.querySelectorAll(".split-inner");

    const tl = gsap.fromTo(
      inners,
      { y: "110%" },
      {
        y: "0%",
        duration: 1,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: triggerRef?.current ?? el,
          start,
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      tl.kill();
      el.innerHTML = text;
    };
  }, [children, animation, stagger, delay, triggerRef, start]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}

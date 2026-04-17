"use client";

import { useEffect, useRef, type ReactNode, createElement } from "react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HTMLTag = keyof Pick<
  JSX.IntrinsicElements,
  "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "section"
>;

interface SplitTextProps {
  children: ReactNode;
  as?: HTMLTag;
  className?: string;
  type?: "words" | "chars" | "lines";
  delay?: number;
  style?: React.CSSProperties;
}

export function SplitText({
  children,
  as: tag = "div",
  className,
  type = "words",
  delay = 0,
  style,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const split = new SplitType(ref.current, { types: type });
    const targets =
      type === "chars"
        ? split.chars
        : type === "lines"
          ? split.lines
          : split.words;

    if (!targets?.length) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    return () => {
      split.revert();
    };
  }, [type, delay]);

  return createElement(tag, { ref, className, style }, children);
}

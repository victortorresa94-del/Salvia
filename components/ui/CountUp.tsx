"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  decimals = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: value,
      duration,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent =
            prefix + obj.val.toFixed(decimals) + suffix;
        }
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 80%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [value, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

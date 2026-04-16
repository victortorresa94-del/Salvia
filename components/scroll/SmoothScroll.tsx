"use client";

import { useEffect, useRef } from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const lenis = initLenis();
    return () => destroyLenis();
  }, []);

  return <>{children}</>;
}

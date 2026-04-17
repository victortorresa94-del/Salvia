"use client";

import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return <div data-lenis-wrapper>{children}</div>;
}

"use client";

import { useScrollContext } from "@/components/scroll/ScrollContext";

export function useGlobalScroll(): number {
  return useScrollContext().progress;
}

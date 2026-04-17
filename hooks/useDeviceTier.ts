"use client";
import { useMemo } from "react";

export type DeviceTier = "high" | "mid" | "low";

export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (typeof navigator === "undefined") return "high";
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores >= 8) return "high";
    if (cores >= 4) return "mid";
    return "low";
  }, []);
}

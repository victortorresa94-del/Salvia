"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useScrollContext } from "@/components/scroll/ScrollContext";

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function ScrollCamera() {
  const { camera } = useThree();
  const { progress } = useScrollContext();
  const progressRef = useRef(0);
  progressRef.current = progress;

  useFrame(() => {
    const p = progressRef.current;

    // Dolly: starts at z=8, moves in to z=5.5 at midpoint, eases back to z=7
    const dollyIn = smoothstep(0, 0.5, p);
    const dollyOut = smoothstep(0.5, 1.0, p);
    camera.position.z = lerp(8, 5.5, dollyIn) + lerp(0, 1.5, dollyOut);

    // Gentle X drift
    camera.position.x = Math.sin(p * Math.PI) * 0.8;

    // Subtle Y rise
    camera.position.y = lerp(0, 0.5, p) - lerp(0, 0.5, dollyOut);

    camera.lookAt(0, 0, 0);
  });

  return null;
}

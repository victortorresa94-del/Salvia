"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollContext } from "@/components/scroll/ScrollContext";

// Color stops (progress → rgb)
const STOPS: Array<[number, number, number, number]> = [
  [0.00, 0.031, 0.031, 0.031], // #080808 — deep black
  [0.20, 0.047, 0.102, 0.063], // #0c1a10 — dark green
  [0.50, 0.047, 0.102, 0.063], // stay green
  [0.75, 0.031, 0.031, 0.031], // back to black
  [1.00, 0.039, 0.039, 0.039], // near black CTA
];

function sampleColor(p: number): THREE.Color {
  let i = 0;
  for (i = 0; i < STOPS.length - 1; i++) {
    if (p <= STOPS[i + 1][0]) break;
  }
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const t = (p - a[0]) / (b[0] - a[0]);
  return new THREE.Color(
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  );
}

export function BackgroundColor() {
  const { gl } = useThree();
  const { progress } = useScrollContext();
  const progressRef = useRef(0);
  progressRef.current = progress;

  useFrame(() => {
    const color = sampleColor(progressRef.current);
    gl.setClearColor(color, 1);
  });

  return null;
}

"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const STOPS = [
  new THREE.Color("#0a0d0a"), // 0.0 — hero
  new THREE.Color("#1a1410"), // 0.25 — soil
  new THREE.Color("#0e0a08"), // 0.5 — underground
  new THREE.Color("#2a2012"), // 0.75 — golden growth
  new THREE.Color("#0a0d0a"), // 1.0 — cta
];

interface BackgroundColorProps {
  progressRef: MutableRefObject<number>;
}

export function BackgroundColor({ progressRef }: BackgroundColorProps) {
  const { scene } = useThree();
  const color = useRef(new THREE.Color(STOPS[0]));

  useFrame(() => {
    const p = Math.max(0, Math.min(1, progressRef.current));
    const scaled = p * (STOPS.length - 1);
    const idx = Math.min(Math.floor(scaled), STOPS.length - 2);
    const t = scaled - idx;
    color.current.lerpColors(STOPS[idx], STOPS[idx + 1], t);
    scene.background = color.current;
  });

  return null;
}

"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Keyframes — pos/target per scroll progress (0–1)
// Each entry marks a cinematic beat across the five scenes.
// ---------------------------------------------------------------------------
const KEYFRAMES: {
  progress: number;
  pos: [number, number, number];
  target: [number, number, number];
}[] = [
  { progress: 0.00, pos: [0,  1.5, 7.0], target: [0,  0.3, 0] }, // hero: plano general
  { progress: 0.08, pos: [0,  0.8, 3.5], target: [0,  0.2, 0] }, // dolly-in moderado
  { progress: 0.15, pos: [0.3, 0.2, 1.2], target: [0, 0.3, 0] }, // MUY CERCA: casi dentro de la planta
  { progress: 0.22, pos: [0,  0.3, 4.0], target: [0, -0.5, 0] }, // pull back para transición
  { progress: 0.35, pos: [0,  0.0, 4.0], target: [0, -0.8, 0] }, // soil: suelo visible
  { progress: 0.42, pos: [0, -1.2, 3.5], target: [0, -1.2, 0] }, // bajando hacia raíces
  { progress: 0.50, pos: [0, -1.8, 3.5], target: [0, -1.5, 0] }, // underground
  { progress: 0.62, pos: [0,  0.5, 4.0], target: [0,  0.0, 0] }, // bloom: volviendo a superficie
  { progress: 0.75, pos: [0,  1.0, 3.5], target: [0,  0.0, 0] }, // bloom: wide
  { progress: 0.82, pos: [0,  4.5, 2.0], target: [0,  0.0, 0] }, // harvest: rising
  { progress: 1.00, pos: [0,  7.0, 0.5], target: [0,  0.0, 0] }, // harvest: cenital
];

// ---------------------------------------------------------------------------
// FOV keyframes — zoom óptico durante dolly-in / pull back
// ---------------------------------------------------------------------------
const FOV_KEYFRAMES: { progress: number; fov: number }[] = [
  { progress: 0.00, fov: 60 },
  { progress: 0.08, fov: 60 }, // empieza dolly-in, FOV aún ancho
  { progress: 0.15, fov: 35 }, // máximo zoom óptico (muy cerca de la planta)
  { progress: 0.22, fov: 55 }, // pull back restaura FOV
  { progress: 1.00, fov: 55 }, // el resto de la experiencia
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Interpola linealmente un valor scalar entre dos keyframes dado progress p. */
function sampleScalar(
  kfs: { progress: number; fov: number }[],
  p: number
): number {
  let a = kfs[0];
  let b = kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    if (p >= kfs[i].progress && p <= kfs[i + 1].progress) {
      a = kfs[i];
      b = kfs[i + 1];
      break;
    }
  }
  const range = b.progress - a.progress;
  const t = range > 0 ? smoothstep((p - a.progress) / range) : 0;
  return a.fov + (b.fov - a.fov) * t;
}

// Pre-allocate THREE.Vector3 instances to avoid per-frame GC pressure.
const _kfVectors = KEYFRAMES.map((kf) => ({
  progress: kf.progress,
  pos: new THREE.Vector3(...kf.pos),
  target: new THREE.Vector3(...kf.target),
}));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface CameraRigProps {
  progressRef: MutableRefObject<number>;
}

export function CameraRig({ progressRef }: CameraRigProps) {
  const { camera } = useThree();

  // Desired (interpolated) values
  const desiredPos    = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const desiredTarget = useRef(new THREE.Vector3(...KEYFRAMES[0].target));

  // Smoothed (damped) values applied to the camera
  const smoothPos    = useRef(new THREE.Vector3(...KEYFRAMES[0].pos));
  const smoothTarget = useRef(new THREE.Vector3(...KEYFRAMES[0].target));
  const smoothFov    = useRef(FOV_KEYFRAMES[0].fov);

  useFrame((_, delta) => {
    const p = Math.max(0, Math.min(1, progressRef.current));

    // ---- 1. Sample positional keyframes -----------------------------------
    let kfA = _kfVectors[0];
    let kfB = _kfVectors[_kfVectors.length - 1];
    for (let i = 0; i < _kfVectors.length - 1; i++) {
      if (p >= _kfVectors[i].progress && p <= _kfVectors[i + 1].progress) {
        kfA = _kfVectors[i];
        kfB = _kfVectors[i + 1];
        break;
      }
    }

    const range = kfB.progress - kfA.progress;
    const t = range > 0 ? smoothstep((p - kfA.progress) / range) : 0;

    desiredPos.current.lerpVectors(kfA.pos, kfB.pos, t);
    desiredTarget.current.lerpVectors(kfA.target, kfB.target, t);

    // ---- 2. Sample FOV keyframes ------------------------------------------
    const desiredFov = sampleScalar(FOV_KEYFRAMES, p);

    // ---- 3. Damp camera — speed = 4 * delta (más rápido que 3) ------------
    const speed = Math.min(1, 4 * delta);

    smoothPos.current.lerp(desiredPos.current, speed);
    smoothTarget.current.lerp(desiredTarget.current, speed);
    smoothFov.current += (desiredFov - smoothFov.current) * speed;

    // ---- 4. Apply to camera -----------------------------------------------
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);

    // Cast required — useThree() returns the base THREE.Camera type.
    const perspCam = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspCam.fov - smoothFov.current) > 0.01) {
      perspCam.fov = smoothFov.current;
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
}

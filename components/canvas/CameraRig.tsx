"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Camera keyframes per scene (progress 0-1)
const KEYFRAMES: { progress: number; pos: THREE.Vector3; target: THREE.Vector3 }[] = [
  { progress: 0.0,  pos: new THREE.Vector3(0, 1.0, 5),   target: new THREE.Vector3(0, 0, 0) },   // hero
  { progress: 0.2,  pos: new THREE.Vector3(0, 0.2, 4.5), target: new THREE.Vector3(0, -0.3, 0) }, // soil
  { progress: 0.4,  pos: new THREE.Vector3(0, -1.5, 4),  target: new THREE.Vector3(0, -1, 0) },   // roots
  { progress: 0.6,  pos: new THREE.Vector3(0, 0.5, 4),   target: new THREE.Vector3(0, 0, 0) },   // bloom
  { progress: 0.8,  pos: new THREE.Vector3(0, 5, 1.5),   target: new THREE.Vector3(0, 0, 0) },   // harvest begin
  { progress: 1.0,  pos: new THREE.Vector3(0, 7, 0.5),   target: new THREE.Vector3(0, 0, 0) },   // harvest top
];

function lerpVec3(
  out: THREE.Vector3,
  a: THREE.Vector3,
  b: THREE.Vector3,
  t: number
) {
  out.lerpVectors(a, b, t);
}

interface CameraRigProps {
  progressRef: MutableRefObject<number>;
}

export function CameraRig({ progressRef }: CameraRigProps) {
  const { camera } = useThree();
  const posRef = useRef(new THREE.Vector3(0, 1, 5));
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const lerpPos = useRef(new THREE.Vector3(0, 1, 5));
  const lerpTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const p = Math.max(0, Math.min(1, progressRef.current));

    // Find surrounding keyframes
    let kfA = KEYFRAMES[0];
    let kfB = KEYFRAMES[1];
    for (let i = 0; i < KEYFRAMES.length - 1; i++) {
      if (p >= KEYFRAMES[i].progress && p <= KEYFRAMES[i + 1].progress) {
        kfA = KEYFRAMES[i];
        kfB = KEYFRAMES[i + 1];
        break;
      }
    }

    const range = kfB.progress - kfA.progress;
    const t = range > 0 ? (p - kfA.progress) / range : 0;
    const smooth = t * t * (3 - 2 * t); // smoothstep

    lerpVec3(posRef.current, kfA.pos, kfB.pos, smooth);
    lerpVec3(targetRef.current, kfA.target, kfB.target, smooth);

    // Damp camera movement — feels cinematic, not snappy
    const speed = 3 * delta;
    lerpPos.current.lerp(posRef.current, Math.min(1, speed));
    lerpTarget.current.lerp(targetRef.current, Math.min(1, speed));

    camera.position.copy(lerpPos.current);
    camera.lookAt(lerpTarget.current);
  });

  return null;
}

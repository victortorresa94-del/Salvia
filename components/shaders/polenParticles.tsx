"use client";

import { useRef, useMemo } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { curlNoiseGLSL } from "./curlNoise";

// ─── Shaders ──────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  ${curlNoiseGLSL}

  uniform float uTime;            // elapsed time
  uniform float uScrollProgress;  // global scroll 0-1
  uniform float uSize;            // point size multiplier
  uniform vec2  uMouse;           // NDC mouse coords [-1, 1]
  uniform float uMouseStrength;   // push multiplier

  attribute float aRandom;        // per-particle random [0,1]

  varying float vAlpha;
  varying float vRandom;

  void main() {
    vec3 pos = position;

    // Curl noise drift — fades as user scrolls away from hero
    vec3 curl = curlNoise(pos * 0.4 + uTime * 0.15);
    pos += curl * 0.25 * (1.0 - uScrollProgress);

    // Gentle orbit per particle
    float angle = aRandom * 6.283;
    pos.x += sin(angle + uTime * 0.1 * (0.5 + aRandom)) * 0.08;
    pos.y += cos(angle * 0.7 + uTime * 0.07) * 0.06;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vec4 clipPos = projectionMatrix * mvPos;
    gl_Position = clipPos;

    // Screen-space NDC for this particle (after perspective divide)
    vec2 ndc = clipPos.xy / clipPos.w;

    // Push away from mouse when close (screen space, radius 0.35 NDC)
    vec2 toMouse = ndc - uMouse;
    float dist = length(toMouse);
    float pushRadius = 0.35;
    if (dist < pushRadius && dist > 0.001) {
      float pushStrength = uMouseStrength * (1.0 - dist / pushRadius);
      pushStrength = pushStrength * pushStrength; // ease
      // We can only visually hint the push via size; actual position push
      // must happen in world space before projection.
      // World-space approach: offset pos along the screen-space push direction
      // mapped back to view space XY (approximation valid for near-camera particles)
      vec2 pushDir = normalize(toMouse);
      float pushAmount = pushStrength * 0.6;
      pos.x += pushDir.x * pushAmount;
      pos.y += pushDir.y * pushAmount;

      // Reproject with pushed position
      vec4 mvPosPushed = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosPushed;
      mvPos = mvPosPushed;
    }

    gl_PointSize = uSize * (100.0 / -mvPos.z) * (0.4 + aRandom * 0.6);

    vAlpha = (0.3 + aRandom * 0.5) * (1.0 - uScrollProgress * 2.0);
    vRandom = aRandom;
  }
`;

// Double-layer: inner bright nucleus + outer soft halo
const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vRandom;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;  // [-0.5, 0.5]
    float d = length(uv);           // 0 at centre, 0.5 at edge

    if (vAlpha < 0.01) discard;

    // Gold base colour #d4a84b with subtle per-particle warm variation
    float warmShift = vRandom * 0.12;
    vec3 goldCore = vec3(0.831 + warmShift, 0.659 - warmShift * 0.5, 0.294);
    vec3 goldHalo = vec3(0.70,  0.50, 0.18);

    // Inner nucleus: tight bright disc
    float nucleus = smoothstep(0.18, 0.0, d);
    // Outer halo: wide soft glow
    float halo    = smoothstep(0.50, 0.05, d) * 0.45;

    // Combine layers
    float alphaNucleus = nucleus * vAlpha;
    float alphaHalo    = halo    * vAlpha;

    vec3  col   = mix(goldHalo, goldCore, nucleus);
    float alpha = clamp(alphaNucleus + alphaHalo, 0.0, 1.0);

    if (alpha < 0.005) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;

// ─── Shader material ──────────────────────────────────────────────────────────

const PolenParticleMaterial = shaderMaterial(
  {
    uTime:           0,
    uScrollProgress: 0,
    uSize:           2.5,
    uMouse:          new THREE.Vector2(0, 0),
    uMouseStrength:  1.0,
  },
  vertexShader,
  fragmentShader
);

extend({ PolenParticleMaterial });

// ─── R3F element type augmentation ───────────────────────────────────────────

declare module "@react-three/fiber" {
  interface ThreeElements {
    polenParticleMaterial: {
      uTime?:           number;
      uScrollProgress?: number;
      uSize?:           number;
      uMouse?:          THREE.Vector2;
      uMouseStrength?:  number;
      transparent?:     boolean;
      depthWrite?:      boolean;
      blending?:        THREE.Blending;
      ref?:             React.Ref<THREE.ShaderMaterial>;
    };
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PolenParticlesProps {
  count?:          number;
  radius?:         number;
  scrollProgress?: number;
  /** World-space offset applied to the <points> group. Defaults to [0,0,0]. */
  offset?:         [number, number, number];
  /** Ref to current mouse NDC coords, updated externally via mousemove. */
  mouseRef?:       React.MutableRefObject<{ x: number; y: number }>;
  /** Mouse push multiplier. Default 1.0. */
  mouseStrength?:  number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PolenParticles({
  count          = 600,
  radius         = 1.5,
  scrollProgress = 0,
  offset         = [0, 0, 0],
  mouseRef,
  mouseStrength  = 1.0,
}: PolenParticlesProps) {
  const matRef   = useRef<THREE.ShaderMaterial>(null);
  const mouseVec = useRef(new THREE.Vector2(0, 0));

  const { positions, randoms } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const rand = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = radius * (0.6 + Math.random() * 0.4);

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);

      rand[i] = Math.random();
    }

    return { positions: pos, randoms: rand };
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;

    matRef.current.uniforms.uTime.value          = clock.elapsedTime;
    matRef.current.uniforms.uScrollProgress.value = scrollProgress;
    matRef.current.uniforms.uMouseStrength.value  = mouseStrength;

    // Sync mouse NDC from external ref if provided
    if (mouseRef?.current) {
      mouseVec.current.set(mouseRef.current.x, mouseRef.current.y);
      matRef.current.uniforms.uMouse.value = mouseVec.current;
    }
  });

  return (
    <points position={offset}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom"  args={[randoms, 1]} />
      </bufferGeometry>
      <polenParticleMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uSize={2.5}
      />
    </points>
  );
}

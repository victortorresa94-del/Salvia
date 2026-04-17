"use client";

import { useRef, useMemo } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { curlNoiseGLSL } from "./curlNoise";

const vertexShader = /* glsl */ `
  ${curlNoiseGLSL}

  uniform float uTime;       // elapsed time
  uniform float uScrollProgress; // global scroll 0-1
  uniform float uSize;       // point size multiplier

  attribute float aRandom;   // per-particle random [0,1]

  varying float vAlpha;

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
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = uSize * (100.0 / -mvPos.z) * (0.4 + aRandom * 0.6);

    vAlpha = (0.3 + aRandom * 0.5) * (1.0 - uScrollProgress * 2.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;

    // Emissive dorado #d4a84b
    vec3 color = vec3(0.831, 0.659, 0.294);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const PolenParticleMaterial = shaderMaterial(
  { uTime: 0, uScrollProgress: 0, uSize: 1.0 },
  vertexShader,
  fragmentShader
);

extend({ PolenParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    polenParticleMaterial: {
      uTime?: number;
      uScrollProgress?: number;
      uSize?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}

interface PolenParticlesProps {
  count?: number;
  radius?: number;
  scrollProgress?: number;
}

export function PolenParticles({
  count = 600,
  radius = 1.5,
  scrollProgress = 0,
}: PolenParticlesProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.6 + Math.random() * 0.4);

      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      pos[i * 3 + 2] = r * Math.cos(phi);

      rand[i] = Math.random();
    }

    return { positions: pos, randoms: rand };
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uScrollProgress.value = scrollProgress;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <polenParticleMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uSize={1.0}
      />
    </points>
  );
}

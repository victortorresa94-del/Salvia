"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollContext } from "@/components/scroll/ScrollContext";
import { particlesVertexShader } from "@/shaders/particles.vert";
import { particlesFragmentShader } from "@/shaders/particles.frag";

const COUNT = 5000;

function buildFormation(idx: number, count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = i / count;

    switch (idx) {
      case 0: {
        // Nebula — random spherical scatter
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = 3 + Math.random() * 3;
        pos[i3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i3 + 2] = (Math.random() - 0.5) * 5;
        break;
      }
      case 1: {
        // Double DNA helix
        const strand = i % 2;
        const angle = t * Math.PI * 14 + strand * Math.PI;
        pos[i3] = Math.cos(angle) * 1.8;
        pos[i3 + 1] = (t - 0.5) * 9;
        pos[i3 + 2] = Math.sin(angle) * 1.8;
        break;
      }
      case 2: {
        // Fibonacci sphere (golden ratio distribution)
        const phi2 = Math.acos(1 - 2 * (i + 0.5) / count);
        const theta2 = Math.PI * (1 + Math.sqrt(5)) * i;
        const r2 = 3.2;
        pos[i3] = r2 * Math.sin(phi2) * Math.cos(theta2);
        pos[i3 + 1] = r2 * Math.sin(phi2) * Math.sin(theta2);
        pos[i3 + 2] = r2 * Math.cos(phi2);
        break;
      }
      case 3: {
        // Expanding torus/ring
        const ringCount = 12;
        const ring = Math.floor(t * ringCount) / ringCount;
        const angle3 = t * Math.PI * 2 * ringCount;
        const majorR = 0.5 + ring * 4.0;
        pos[i3] = Math.cos(angle3) * majorR;
        pos[i3 + 1] = (Math.random() - 0.5) * 2.5;
        pos[i3 + 2] = Math.sin(angle3) * majorR;
        break;
      }
      case 4: {
        // Convergence — tight inward spiral
        const angle4 = t * Math.PI * 16;
        const r4 = (1 - t) * 2.5 + 0.1;
        pos[i3] = Math.cos(angle4) * r4;
        pos[i3 + 1] = (t - 0.5) * 3;
        pos[i3 + 2] = Math.sin(angle4) * r4;
        break;
      }
    }
  }
  return pos;
}

export function MorphingParticles() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { progress } = useScrollContext();
  const progressRef = useRef(0);

  // Keep a live ref for useFrame
  progressRef.current = progress;

  const { formations, sizes, speeds, phases } = useMemo(() => {
    const formations = [0, 1, 2, 3, 4].map((i) => buildFormation(i, COUNT));
    const sizes = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const phases = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      sizes[i] = 1.0 + Math.random() * 3.5;
      speeds[i] = 0.4 + Math.random() * 1.6;
      phases[i] = Math.random();
    }
    return { formations, sizes, speeds, phases };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uFormIdx: { value: 0 },
    uMorphBlend: { value: 0 },
    uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
  }), []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const p = progressRef.current;
    const segment = p * 4; // 0–4 spanning 4 transitions
    const formIdx = Math.min(Math.floor(segment), 3);
    const morphBlend = segment - formIdx;

    matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    matRef.current.uniforms.uProgress.value = p;
    matRef.current.uniforms.uFormIdx.value = formIdx;
    matRef.current.uniforms.uMorphBlend.value = morphBlend;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-aPosition0" args={[formations[0], 3]} />
        <bufferAttribute attach="attributes-aPosition1" args={[formations[1], 3]} />
        <bufferAttribute attach="attributes-aPosition2" args={[formations[2], 3]} />
        <bufferAttribute attach="attributes-aPosition3" args={[formations[3], 3]} />
        <bufferAttribute attach="attributes-aPosition4" args={[formations[4], 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

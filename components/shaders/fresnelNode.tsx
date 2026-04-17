"use client";

import { useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-worldPos.xyz);
    gl_Position = projectionMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;    // emissive base color
  uniform float uTime;    // for pulse
  uniform float uSpeed;   // pulse frequency
  uniform float uActive;  // 0=idle, 1=hover — triples intensity

  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float fresnel = 1.0 - max(0.0, dot(vViewDir, vNormal));
    fresnel = pow(fresnel, 2.0);

    float pulse = 0.5 + 0.5 * sin(uTime * uSpeed);
    float intensity = mix(1.0, 3.0, uActive);

    vec3 color = uColor * fresnel * pulse * intensity;

    // Core glow when active
    float core = smoothstep(0.7, 0.2, fresnel) * uActive * 0.5;
    color += uColor * core;

    gl_FragColor = vec4(color, fresnel * 0.85 + core);
  }
`;

export const FresnelNodeMaterial = shaderMaterial(
  {
    uColor: new THREE.Color("#87a878"),
    uTime: 0,
    uSpeed: 2.0,
    uActive: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ FresnelNodeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fresnelNodeMaterial: {
      uColor?: THREE.Color;
      uTime?: number;
      uSpeed?: number;
      uActive?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      side?: THREE.Side;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}

interface FresnelNodeProps {
  position?: [number, number, number];
  radius?: number;
  color?: string;
  speed?: number;
  active?: boolean;
}

export function FresnelNode({
  position = [0, 0, 0],
  radius = 0.12,
  color = "#87a878",
  speed = 2,
  active = false,
}: FresnelNodeProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
    matRef.current.uniforms.uActive.value = active ? 1 : 0;
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <fresnelNodeMaterial
        ref={matRef}
        uColor={new THREE.Color(color)}
        uSpeed={speed}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

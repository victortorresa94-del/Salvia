"use client";

import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { curlNoiseGLSL } from "./curlNoise";

const vertexShader = /* glsl */ `
  ${curlNoiseGLSL}

  uniform float uBloom;  // 0 = closed bud, 1 = fully open
  uniform float uTime;   // for breathing motion

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vBloom;

  void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    vBloom = uBloom;

    vec3 pos = position;

    // Expand petals outward along normals
    float petalH = max(0.0, pos.y);
    vec3 noiseDisp = curlNoise(pos * 0.6 + uTime * 0.04) * 0.04 * uBloom;
    pos += normal * petalH * 0.12 * uBloom + noiseDisp;

    // Subtle breathing
    pos += normal * sin(uTime * 0.9 + pos.y * 2.5) * 0.004 * uBloom;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uBloom;
  uniform sampler2D uMap;
  uniform float uHasMap;  // 1.0 if texture bound

  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vBloom;

  void main() {
    vec3 closedColor = vec3(0.16, 0.26, 0.12); // dark green bud
    vec3 openColor   = vec3(0.710, 0.502, 0.780); // #b580c7 violet

    vec3 texColor = texture2D(uMap, vUv).rgb;
    vec3 base = mix(closedColor, texColor, uHasMap);
    vec3 color = mix(closedColor, base, uBloom * 0.7 + 0.3);
    color = mix(color, openColor, uBloom * 0.4);

    // Fresnel rim for petal glow
    float fresnel = 1.0 - max(0.0, dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    color += openColor * pow(fresnel, 2.0) * uBloom * 0.35;

    float ndotl = max(0.0, dot(normalize(vNormal), normalize(vec3(1.0, 2.0, 1.0))));
    color *= 0.35 + ndotl * 0.85;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const BloomingMaterial = shaderMaterial(
  {
    uBloom: 0,
    uTime: 0,
    uMap: null as THREE.Texture | null,
    uHasMap: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ BloomingMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    bloomingMaterial: {
      uBloom?: number;
      uTime?: number;
      uMap?: THREE.Texture | null;
      uHasMap?: number;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}

"use client";

import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uWilt;  // 0 = alive, 1 = fully wilted

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;

    vec3 pos = position;
    // Branches droop downward by height — squared for organic curve
    float h = max(0.0, pos.y);
    pos.y -= h * h * uWilt * 0.4;
    pos.x += sin(pos.y * 1.5 + 3.14) * uWilt * 0.08;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uWilt;  // desaturation and darkening amount
  uniform sampler2D uMap;
  uniform float uHasMap;  // 1.0 if texture bound

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec3 color = mix(
      vec3(0.28, 0.45, 0.18),          // healthy green
      texture2D(uMap, vUv).rgb,
      uHasMap
    );

    // Progressive desaturation
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, vec3(luma), uWilt);

    // Darken wilted tips
    color *= 1.0 - uWilt * 0.45;

    float ndotl = max(0.0, dot(normalize(vNormal), normalize(vec3(1.0, 1.5, 1.0))));
    color *= 0.45 + ndotl * 0.7;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const WiltingMaterial = shaderMaterial(
  {
    uWilt: 0,
    uMap: null as THREE.Texture | null,
    uHasMap: 0,
  },
  vertexShader,
  fragmentShader
);

extend({ WiltingMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    wiltingMaterial: {
      uWilt?: number;
      uMap?: THREE.Texture | null;
      uHasMap?: number;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}

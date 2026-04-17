"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.8}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise
        opacity={0.03}
        blendFunction={BlendFunction.SOFT_LIGHT}
        premultiply
      />
    </EffectComposer>
  );
}

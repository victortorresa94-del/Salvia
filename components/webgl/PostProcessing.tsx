"use client";

import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.4}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.35}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new Vector2(0.0012, 0.0012)}
        radialModulation
        modulationOffset={0}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.035}
      />
    </EffectComposer>
  );
}

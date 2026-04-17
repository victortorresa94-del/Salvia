"use client";

import { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Preload, Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useScrollContext } from "@/components/scroll/ScrollContext";
import { BackgroundColor } from "./BackgroundColor";
import { PostProcessing } from "./PostProcessing";
import { CameraRig } from "./CameraRig";
import { SeedScene } from "@/components/scenes/SeedScene";
import { SoilScene } from "@/components/scenes/SoilScene";
import { RootsScene } from "@/components/scenes/RootsScene";
import { BloomScene } from "@/components/scenes/BloomScene";
import { HarvestScene } from "@/components/scenes/HarvestScene";
import type { MutableRefObject } from "react";

// Scroll-driven environment: one Environment at a time, CDN-cached after first load
const SCENE_PRESETS: { threshold: number; preset: string }[] = [
  { threshold: 0.00, preset: "dawn"   }, // hero
  { threshold: 0.18, preset: "night"  }, // soil / roots
  { threshold: 0.58, preset: "park"   }, // bloom
  { threshold: 0.75, preset: "sunset" }, // harvest
];

function getPreset(p: number): string {
  let preset = SCENE_PRESETS[0].preset;
  for (const s of SCENE_PRESETS) {
    if (p >= s.threshold) preset = s.preset;
  }
  return preset;
}

function EnvironmentController({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const [preset, setPreset] = useState("dawn");
  const current = useRef("dawn");

  useFrame(() => {
    const next = getPreset(progressRef.current);
    if (next !== current.current) {
      current.current = next;
      setPreset(next);
    }
  });

  return (
    <Suspense fallback={null}>
      <Environment
        preset={preset as never}
        background={false}
      />
    </Suspense>
  );
}

function SceneOrchestrator() {
  const { progressRef } = useScrollContext();
  const [dpr, setDpr] = useState(1.5);

  return (
    <>
      <PerformanceMonitor
        onIncline={() => setDpr((d) => Math.min(2, d + 0.5))}
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
      />

      <BackgroundColor progressRef={progressRef} />
      <CameraRig progressRef={progressRef} />

      {/* Single scroll-driven IBL — doesn't block scene rendering */}
      <EnvironmentController progressRef={progressRef} />

      {/* Each scene in its own Suspense — loads and renders independently */}
      <Suspense fallback={null}><SeedScene /></Suspense>
      <Suspense fallback={null}><SoilScene /></Suspense>
      <Suspense fallback={null}><RootsScene /></Suspense>
      <Suspense fallback={null}><BloomScene /></Suspense>
      <Suspense fallback={null}><HarvestScene /></Suspense>

      <Suspense fallback={null}><Preload all /></Suspense>

      <PostProcessing />
    </>
  );
}

interface WebGLCanvasProps {
  onReady?: () => void;
}

export function WebGLCanvas({ onReady }: WebGLCanvasProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 1, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        shadows
        onCreated={() => {
          onReady?.();
        }}
      >
        <SceneOrchestrator />
      </Canvas>
    </div>
  );
}

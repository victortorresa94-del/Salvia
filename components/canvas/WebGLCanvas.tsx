"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { useScrollContext } from "@/components/scroll/ScrollContext";
import { BackgroundColor } from "./BackgroundColor";
import { PostProcessing } from "./PostProcessing";
import { CameraRig } from "./CameraRig";
import { SeedScene } from "@/components/scenes/SeedScene";
import { SoilScene } from "@/components/scenes/SoilScene";
import { RootsScene } from "@/components/scenes/RootsScene";
import { BloomScene } from "@/components/scenes/BloomScene";
import { HarvestScene } from "@/components/scenes/HarvestScene";

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

      <Suspense fallback={null}>
        <SeedScene />
        <SoilScene />
        <RootsScene />
        <BloomScene />
        <HarvestScene />
        <Preload all />
      </Suspense>

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

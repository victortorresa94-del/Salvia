"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import { MorphingParticles } from "./MorphingParticles";
import { PostProcessing } from "./PostProcessing";
import { BackgroundColor } from "./BackgroundColor";
import { ScrollCamera } from "./ScrollCamera";
import { useFrame } from "@react-three/fiber";

interface WebGLCanvasProps {
  onReady?: () => void;
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const called = useRef(false);
  useFrame(() => {
    if (!called.current && onReady) {
      called.current = true;
      onReady();
    }
  });
  return null;
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
        camera={{ position: [0, 0, 8], fov: 55, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <BackgroundColor />
        <ScrollCamera />
        <Suspense fallback={null}>
          <MorphingParticles />
        </Suspense>
        <PostProcessing />
        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>
  );
}

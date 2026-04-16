"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ScrollProvider } from "@/components/scroll/ScrollContext";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Navigation } from "@/components/ui/Navigation";
import { HeroScene } from "@/components/scenes/HeroScene";
import { ProblemScene } from "@/components/scenes/ProblemScene";
import { SolutionScene } from "@/components/scenes/SolutionScene";
import { ProofScene } from "@/components/scenes/ProofScene";
import { CtaScene } from "@/components/scenes/CtaScene";

const WebGLCanvas = dynamic(
  () => import("@/components/webgl/WebGLCanvas").then((m) => m.WebGLCanvas),
  { ssr: false }
);

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [experienceReady, setExperienceReady] = useState(false);

  const handleWebGLReady = useCallback(() => {
    // WebGL first frame fired — begin final progress ramp
    setProgress(0.6);
    setTimeout(() => setProgress(1), 800);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setExperienceReady(true);
  }, []);

  return (
    <ScrollProvider>
      {/* Layer 0: fixed WebGL canvas, always mounted */}
      <WebGLCanvas onReady={handleWebGLReady} />

      {/* Layer 1: loading screen (slides away on complete) */}
      <LoadingScreen progress={progress} onComplete={handleLoadingComplete} />

      {/* Layer 2: DOM content */}
      {experienceReady && (
        <SmoothScroll>
          <Navigation />
          <main>
            <HeroScene />
            <ProblemScene />
            <SolutionScene />
            <ProofScene />
            <CtaScene />
          </main>
        </SmoothScroll>
      )}
    </ScrollProvider>
  );
}

"use client";

import { useState, useCallback } from "react";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Navigation } from "@/components/ui/Navigation";
import { HeroScene } from "@/components/scenes/HeroScene";
import { ProblemScene } from "@/components/scenes/ProblemScene";
import { SolutionScene } from "@/components/scenes/SolutionScene";
import { ProofScene } from "@/components/scenes/ProofScene";
import { CtaScene } from "@/components/scenes/CtaScene";

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [experienceReady, setExperienceReady] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setExperienceReady(true);
  }, []);

  // Simulate asset loading (replace with real preloader progress)
  useState(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 0.08 + 0.02;
      if (p >= 1) {
        p = 1;
        clearInterval(interval);
      }
      setLoadingProgress(p);
    }, 60);
    return () => clearInterval(interval);
  });

  return (
    <>
      <LoadingScreen progress={loadingProgress} onComplete={handleLoadingComplete} />

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
    </>
  );
}

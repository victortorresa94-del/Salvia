import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

export function initLenis(onScrollProgress?: (progress: number) => void): Lenis {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
  });

  lenis.on("scroll", ({ progress }: { progress: number }) => {
    ScrollTrigger.update();
    onScrollProgress?.(progress);
  });

  gsap.ticker.add((time: number) => {
    lenis!.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

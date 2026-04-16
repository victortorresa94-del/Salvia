"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface FrameSequenceProps {
  frames: string[];
  scrollStart?: string;
  scrollEnd?: string;
  canvasClassName?: string;
  triggerRef: React.RefObject<HTMLElement>;
}

export function FrameSequence({
  frames,
  scrollStart = "top top",
  scrollEnd = "+=300%",
  canvasClassName = "",
  triggerRef,
}: FrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    const sx = (w - sw) / 2;
    const sy = (h - sh) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  useEffect(() => {
    if (!frames.length || !triggerRef.current) return;

    let loaded = 0;
    imagesRef.current = frames.map((src) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (loaded === 1) drawFrame(0);
      };
      img.src = src;
      return img;
    });

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: scrollStart,
      end: scrollEnd,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.floor(self.progress * (frames.length - 1)),
          frames.length - 1
        );
        if (idx !== currentFrameRef.current) {
          currentFrameRef.current = idx;
          drawFrame(idx);
        }
      },
    });

    return () => trigger.kill();
  }, [frames, scrollStart, scrollEnd, triggerRef, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${canvasClassName}`}
    />
  );
}

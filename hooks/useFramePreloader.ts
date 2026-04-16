"use client";

import { useEffect, useState, useCallback } from "react";

interface PreloadResult {
  images: HTMLImageElement[];
  progress: number;
  isLoaded: boolean;
}

export function useFramePreloader(frames: string[]): PreloadResult {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (frames.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loaded = 0;
    const total = frames.length;
    const imgs: HTMLImageElement[] = new Array(total);

    const onLoad = (index: number) => {
      loaded++;
      setProgress(loaded / total);
      if (loaded === total) {
        setImages(imgs);
        setIsLoaded(true);
      }
    };

    frames.forEach((src, i) => {
      const img = new Image();
      img.onload = () => onLoad(i);
      img.onerror = () => onLoad(i);
      img.src = src;
      imgs[i] = img;
    });
  }, [frames]);

  return { images, progress, isLoaded };
}

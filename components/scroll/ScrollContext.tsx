"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

interface ScrollContextValue {
  progress: number;
  registerListener: (fn: (progress: number) => void) => () => void;
}

export const ScrollContext = createContext<ScrollContextValue>({
  progress: 0,
  registerListener: () => () => {},
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0);
  const listenersRef = useRef<Set<(p: number) => void>>(new Set());

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const p = maxScroll > 0 ? Math.min(1, scrollTop / maxScroll) : 0;
    setProgress(p);
    listenersRef.current.forEach((fn) => fn(p));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  const registerListener = useCallback((fn: (p: number) => void) => {
    listenersRef.current.add(fn);
    return () => listenersRef.current.delete(fn);
  }, []);

  return (
    <ScrollContext.Provider value={{ progress, registerListener }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollContext = () => useContext(ScrollContext);

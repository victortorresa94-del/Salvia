"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { initLenis, destroyLenis } from "@/lib/lenis";

interface ScrollContextValue {
  progress: number;
  progressRef: MutableRefObject<number>;
}

const ScrollContext = createContext<ScrollContextValue>({
  progress: 0,
  progressRef: { current: 0 },
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    initLenis((p: number) => {
      progressRef.current = p;
      setProgress(p);
    });

    return () => destroyLenis();
  }, []);

  return (
    <ScrollContext.Provider value={{ progress, progressRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  return useContext(ScrollContext);
}

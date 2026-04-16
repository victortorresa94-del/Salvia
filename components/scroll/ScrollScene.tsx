"use client";

import { useRef } from "react";

interface ScrollSceneProps {
  children: React.ReactNode;
  height?: string;
  id?: string;
  className?: string;
}

export function ScrollScene({
  children,
  height = "300vh",
  id,
  className = "",
}: ScrollSceneProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${className}`}
      style={{ height }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {children}
      </div>
    </section>
  );
}

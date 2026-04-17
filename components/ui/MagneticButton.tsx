"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  magnetRadius?: number;
  magnetStrength?: number;
}

export function MagneticButton({
  children,
  className,
  style,
  onClick,
  type = "button",
  disabled = false,
  magnetRadius = 80,
  magnetStrength = 0.35,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current || disabled) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < magnetRadius) {
      gsap.to(btnRef.current, {
        x: dx * magnetStrength,
        y: dy * magnetStrength,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <button
      ref={btnRef}
      type={type}
      className={className}
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}

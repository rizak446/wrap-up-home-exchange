"use client";

import React, { useEffect, useRef } from "react";

/**
 * Compact, Sleek Dynamic Touch Effect
 * - Delicate, subtle 28px liquid droplet ring at fingertip touch
 * - Fast 300ms elegant dissipation
 * - Completely eliminated giant 420px glow circle
 * - 100% non-blocking (pointer-events: none)
 */
export default function DynamicTouchEffects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button && e.button !== 0) return;

      const x = e.clientX;
      const y = e.clientY;

      // Create compact subtle ripple ring
      const ripple = document.createElement("div");
      ripple.className = "dynamic-compact-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      container.appendChild(ripple);

      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    />
  );
}

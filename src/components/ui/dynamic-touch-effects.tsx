"use client";

import React, { useEffect, useRef } from "react";

/**
 * Dynamic Touch & Ambient Aesthetics Controller
 * 1. Liquid Champagne-Gold Touch / Click Ripple with micro-sparkles
 * 2. Responsive ambient spotlight that follows touch & pointer
 * 3. 100% non-blocking (pointer-events: none), 120fps GPU accelerated
 */
export default function DynamicTouchEffects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;
    if (!container) return;

    // 1. Fluid Ripple and Micro-Sparkles on Touch or Click
    const handlePointerDown = (e: PointerEvent) => {
      // Don't trigger if right click
      if (e.button && e.button !== 0) return;

      const x = e.clientX;
      const y = e.clientY;

      // Create primary liquid ripple wave
      const ripple = document.createElement("div");
      ripple.className = "dynamic-liquid-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      container.appendChild(ripple);

      // Create secondary gentle gold aura
      const aura = document.createElement("div");
      aura.className = "dynamic-touch-aura";
      aura.style.left = `${x}px`;
      aura.style.top = `${y}px`;
      container.appendChild(aura);

      // Create 3 tiny ambient champagne sparkles
      const sparkleCount = e.pointerType === "touch" ? 3 : 4;
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement("div");
        sparkle.className = "dynamic-touch-sparkle";
        const angle = (i * (360 / sparkleCount) + (Math.random() * 40 - 20)) * (Math.PI / 180);
        const distance = 24 + Math.random() * 28;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty("--dx", `${dx}px`);
        sparkle.style.setProperty("--dy", `${dy}px`);
        container.appendChild(sparkle);

        sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
      }

      ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
      aura.addEventListener("animationend", () => aura.remove(), { once: true });
    };

    // 2. Ambient Spotlight following Pointer (Desktop & Smooth Touch Drag)
    const handlePointerMove = (e: PointerEvent) => {
      if (!glow) return;
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      glow.style.opacity = "1";
    };

    const handlePointerLeave = () => {
      if (!glow) return;
      glow.style.opacity = "0";
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      {/* Ambient Luxury Glow Spotlight */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[420px] h-[420px] -ml-[210px] -mt-[210px] rounded-full opacity-0 transition-opacity duration-500 pointer-events-none ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(244, 217, 160, 0.16) 0%, rgba(200, 121, 44, 0.05) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

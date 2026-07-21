"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useExperienceStore } from "@/lib/store/useExperienceStore";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap/register";

/**
 * Owns the single Lenis instance and the RAF loop.
 *
 * Responsibilities:
 *  - momentum smooth-scroll (Lenis)
 *  - publish normalized progress into the zustand store every frame
 *  - keep GSAP ScrollTrigger in sync with Lenis
 *  - track pointer for parallax and honour reduced-motion
 *
 * This is the ONLY place that reads window scroll — every visual system
 * downstream reads `progress` from the store, so the camera and the DOM stay
 * frame-locked to the same value.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const setProgress = useExperienceStore((s) => s.setProgress);
  const setPointer = useExperienceStore((s) => s.setPointer);
  const setReducedMotion = useExperienceStore((s) => s.setReducedMotion);

  useEffect(() => {
    registerGsap();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReduced);

    const lenis = new Lenis({
      duration: prefersReduced ? 0.1 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    const publish = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(p);
    };

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      publish();
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Bridge GSAP ticker → Lenis for any ScrollTrigger-driven tweens.
    gsap.ticker.lagSmoothing(0);

    publish();

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPointer(x, y);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      ScrollTrigger.refresh();
      publish();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, [setProgress, setPointer, setReducedMotion]);

  return <>{children}</>;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap/register";

/**
 * Owns the single Lenis instance and the RAF loop for the whole film.
 *
 *  - momentum smooth-scroll (Lenis) so the page reads as one continuous reel
 *  - keeps GSAP ScrollTrigger frame-locked to Lenis (pinning / scrubbing)
 *  - honours prefers-reduced-motion by dropping smoothing to near-instant
 *  - publishes a normalized pointer (-1..1) through context for hero parallax
 *
 * Framer Motion's `useScroll` reads native scroll position, which Lenis keeps
 * in sync — so downstream acts can use either Framer or GSAP against the same
 * timeline.
 */

type PointerState = { x: number; y: number };

const PointerContext = createContext<PointerState>({ x: 0, y: 0 });
const ReducedMotionContext = createContext(false);

/** Live, smoothed pointer position in the range -1..1 (centre = 0,0). */
export function usePointer() {
  return useContext(PointerContext);
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [pointer, setPointer] = useState<PointerState>({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);
  // Target pointer we lerp toward, so parallax feels weighted, not twitchy.
  const target = useRef<PointerState>({ x: 0, y: 0 });
  const current = useRef<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    registerGsap();

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReduced(prefersReduced);

    const lenis = new Lenis({
      duration: prefersReduced ? 0.1 : 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReduced,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);

      // Weighted pointer smoothing — a slow lerp reads as depth, not lag.
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      setPointer({ x: current.current.x, y: current.current.y });

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    gsap.ticker.lagSmoothing(0);

    const onPointer = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!prefersReduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    // Let heavy fonts / images settle, then re-measure pinned triggers.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      <PointerContext.Provider value={pointer}>
        {children}
      </PointerContext.Provider>
    </ReducedMotionContext.Provider>
  );
}

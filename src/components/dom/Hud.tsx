"use client";

import { useEffect, useRef } from "react";
import { useExperienceStore, experienceState } from "@/lib/store/useExperienceStore";
import { SCENES } from "@/lib/constants/scenes";

/**
 * Persistent heads-up chrome: a minimal brand mark, the six-scene rail, and a
 * hairline progress bar. The bar is driven imperatively from the store via rAF
 * so scrolling never triggers a React re-render here.
 */
export function Hud() {
  const activeScene = useExperienceStore((s) => s.activeScene);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = experienceState().progress;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <header className="hud__top">
        <span className="hud__brand">FRY GUYS</span>
        <span className="hud__tag">Frozen · Crafted · Golden</span>
      </header>

      <nav className="hud__rail" aria-label="Scene progress">
        {SCENES.map((s) => (
          <span
            key={s.id}
            className={`hud__rail-item${s.id === activeScene ? " is-active" : ""}`}
          >
            <span className="hud__rail-numeral">{s.numeral}</span>
            <span className="hud__rail-name">{s.overline}</span>
          </span>
        ))}
      </nav>

      <div className="hud__progress">
        <span ref={barRef} className="hud__progress-fill" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * Two edge-of-film prompts: the opening scroll cue (fades out the instant you
 * begin) and the closing CTA (resolves in during the finale). Visibility is
 * toggled imperatively from the store so neither costs a render while idle.
 */
export function Prompts() {
  const cueRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = experienceState().progress;
      if (cueRef.current) {
        const v = Math.max(0, 1 - p / 0.03);
        cueRef.current.style.opacity = `${v}`;
        cueRef.current.style.pointerEvents = v > 0.05 ? "auto" : "none";
      }
      if (ctaRef.current) {
        const v = Math.max(0, Math.min(1, (p - 0.94) / 0.05));
        ctaRef.current.style.opacity = `${v}`;
        ctaRef.current.style.pointerEvents = v > 0.5 ? "auto" : "none";
        ctaRef.current.style.transform = `translateY(${(1 - v) * 24}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div ref={cueRef} className="cue">
        <span className="cue__word">Scroll</span>
        <span className="cue__line" />
      </div>

      <div ref={ctaRef} className="cta" style={{ opacity: 0 }}>
        <h2 className="cta__logo">FRY GUYS</h2>
        <p className="cta__tag">Premium frozen. Golden on arrival.</p>
        <div className="cta__actions">
          <button className="cta__btn cta__btn--primary">
            Find a stockist
          </button>
          <button className="cta__btn">Watch again</button>
        </div>
      </div>
    </>
  );
}

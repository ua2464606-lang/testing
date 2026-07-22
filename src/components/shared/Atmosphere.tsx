"use client";

/**
 * Two thin atmospheric layers that sit above everything, always on:
 *   - Grain: a faint film grain so flat charcoal never looks digital.
 *   - Letterbox: cinematic bars that ease in once the film begins, framing
 *     the whole page like a widescreen shot.
 *
 * Both are pointer-events:none and purely decorative.
 */

import { useEffect, useState } from "react";

export function Grain() {
  return <div className="grain" aria-hidden />;
}

export function Letterbox() {
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    // Bars stay open across the hero, then close a touch once you commit to
    // scrolling — the film "starts".
    const onScroll = () => setEngaged(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="letterbox" aria-hidden>
      <div className={`letterbox__bar letterbox__bar--top${engaged ? " is-engaged" : ""}`} />
      <div className={`letterbox__bar letterbox__bar--bottom${engaged ? " is-engaged" : ""}`} />
    </div>
  );
}

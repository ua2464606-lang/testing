"use client";

import { useEffect, useRef } from "react";
import { experienceState } from "@/lib/store/useExperienceStore";
import { PRODUCTS } from "@/lib/constants/products";

/** Product windows that match SceneWarehouse (02) and SceneTransform (05). */
const WAREHOUSE = { start: 0.17, end: 0.43, ids: PRODUCTS };
const MORPH_IDS = [
  "curly-fries",
  "waffle-fries",
  "hash-brown",
  "potato-pops",
  "chicken-pops",
  "chicken-seasoned-tender",
];

function activeAt(progress: number) {
  const inRange = (a: number, b: number) => progress >= a && progress < b;

  if (inRange(WAREHOUSE.start, WAREHOUSE.end)) {
    const span = WAREHOUSE.end - WAREHOUSE.start;
    const n = WAREHOUSE.ids.length;
    const i = Math.min(n - 1, Math.floor(((progress - WAREHOUSE.start) / span) * n));
    return WAREHOUSE.ids[i];
  }
  if (inRange(0.8, 0.92)) {
    const span = 0.12;
    const i = Math.min(
      MORPH_IDS.length - 1,
      Math.floor(((progress - 0.8) / span) * MORPH_IDS.length)
    );
    const id = MORPH_IDS[i];
    return PRODUCTS.find((p) => p.id === id) ?? null;
  }
  return null;
}

/**
 * Large editorial product name + tagline, keyed to the product the camera is on
 * during the vault and morph scenes. Updated imperatively from the store (no
 * re-renders), it turns the on-stage hero into a named editorial moment — and
 * frames the real photograph once it's in place.
 */
export function ProductLabel() {
  const wrap = useRef<HTMLDivElement>(null);
  const overline = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);
  const currentId = useRef<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = experienceState().progress;
      const active = activeAt(p);

      if (active && active.id !== currentId.current) {
        currentId.current = active.id;
        if (overline.current) overline.current.textContent = active.category;
        if (name.current) name.current.textContent = active.name;
        if (tag.current) tag.current.textContent = active.tagline;
      }
      if (!active) currentId.current = null;

      if (wrap.current) {
        wrap.current.style.opacity = active ? "1" : "0";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="product-label">
      <span ref={overline} className="product-label__overline" />
      <span ref={name} className="product-label__name" />
      <span ref={tag} className="product-label__tag" />
    </div>
  );
}

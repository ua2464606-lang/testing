"use client";

/**
 * ACT 6 — The Philosophy.
 *
 * A held, quiet full-screen statement. Nothing else on the frame. The two
 * lines drift and brighten with scroll so the beat feels like a breath, not a
 * banner. This is the thesis of the whole film.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { philosophy } from "@/lib/content";

export function Act6Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.65, 0.9],
    [0, 1, 1, 0]
  );
  const leadColor = useTransform(
    scrollYProgress,
    [0.2, 0.5],
    ["rgba(236,231,221,0.45)", "rgba(236,231,221,0.92)"]
  );

  return (
    <section ref={ref} className="act-philosophy" aria-label="Philosophy">
      <motion.blockquote className="act-philosophy__quote" style={{ y, opacity }}>
        <motion.span className="act-philosophy__lead" style={{ color: leadColor }}>
          {philosophy.lead}
        </motion.span>
        <span className="act-philosophy__body">{philosophy.body}</span>
      </motion.blockquote>
    </section>
  );
}

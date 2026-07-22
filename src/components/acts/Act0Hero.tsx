"use client";

/**
 * ACT 0 — Opening.
 *
 * Full-bleed cinematic intro. A slow light-sweep and drifting dust behind a
 * tagline that resolves line by line. Cursor-aware parallax on desktop gives
 * the dark a sense of depth. No buttons — only atmosphere and a scroll cue.
 * As you begin to leave, the whole hero drifts back and dims (scroll-linked),
 * dissolving into Act 1 rather than snapping away.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AmbientField } from "@/components/shared/AmbientField";
import { usePointer } from "@/lib/scroll/SmoothScrollProvider";
import { EASE_CINE } from "@/lib/motion";
import { hero } from "@/lib/content";

export function Act0Hero() {
  const ref = useRef<HTMLElement>(null);
  const pointer = usePointer();

  // Scroll-linked exit: the hero recedes and fades as it leaves the frame.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.4, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Cursor parallax — small, weighted, desktop-only (pointer is 0 on touch).
  const px = pointer.x * 14;
  const pyv = pointer.y * 14;

  return (
    <section ref={ref} className="hero" aria-label="FormulaeAI">
      <motion.div className="hero__stage" style={{ y, scale, opacity }}>
        {/* Ambient background layers, parallaxed against the cursor. */}
        <motion.div
          className="hero__bg"
          animate={{ x: px * 0.6, y: pyv * 0.6 }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        >
          <div className="hero__glow" />
          <div className="hero__sweep" />
          <AmbientField />
          <div className="hero__vignette" />
        </motion.div>

        <motion.div
          className="hero__content"
          animate={{ x: px, y: pyv }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        >
          <motion.p
            className="eyebrow hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE_CINE, delay: 0.3 }}
          >
            <span className="eyebrow__dot" aria-hidden />
            {hero.eyebrow}
          </motion.p>

          <h1 className="hero__title">
            {hero.lines.map((line, i) => (
              <span className="mask-line" key={i}>
                <motion.span
                  className="mask-line__inner"
                  initial={{ y: "120%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 1.4,
                    ease: EASE_CINE,
                    delay: 0.55 + i * 0.16,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="hero__sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE_CINE, delay: 1.5 }}
          >
            {hero.sub}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div className="hero__cue" style={{ opacity: cueOpacity }}>
        <motion.span
          className="hero__cue-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2 }}
        >
          {hero.cue}
        </motion.span>
        <span className="hero__cue-line" aria-hidden>
          <span className="hero__cue-fill" />
        </span>
      </motion.div>
    </section>
  );
}

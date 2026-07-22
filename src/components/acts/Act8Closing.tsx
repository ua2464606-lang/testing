"use client";

/**
 * ACT 8 — Closing.
 *
 * The film resolves where it began: dark, calm, the tagline returning line by
 * line out of a mask. One button. Nothing else. A soft glow breathes back up
 * to close the reel.
 */

import { motion } from "framer-motion";
import { EASE_CINE } from "@/lib/motion";
import { closing } from "@/lib/content";

export function Act8Closing() {
  return (
    <section className="act-closing" aria-label="Get started">
      <div className="act-closing__glow" aria-hidden />
      <div className="container act-closing__inner">
        <motion.p
          className="eyebrow act-closing__eyebrow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE_CINE }}
        >
          <span className="eyebrow__dot" aria-hidden />
          {closing.eyebrow}
        </motion.p>

        <motion.h2
          className="act-closing__title"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {closing.lines.map((line, i) => (
            <span className="mask-line" key={i}>
              <motion.span
                className="mask-line__inner"
                variants={{
                  hidden: { y: "120%" },
                  show: { y: "0%", transition: { duration: 1.3, ease: EASE_CINE } },
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div
          className="act-closing__actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE_CINE, delay: 0.5 }}
        >
          <a className="cta" href="mailto:hello@formulae.ai?subject=My%20free%20sample">
            <span className="cta__label">{closing.cta}</span>
            <span className="cta__arrow" aria-hidden>
              →
            </span>
          </a>
          <p className="act-closing__foot">{closing.foot}</p>
        </motion.div>
      </div>
    </section>
  );
}

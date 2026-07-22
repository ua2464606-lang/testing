"use client";

/**
 * Small, reusable editorial primitives shared across acts.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, EASE_CINE } from "@/lib/motion";

/** A small tracked-out label that sits above a statement, with a hairline mark. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      className={`eyebrow ${className}`}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
    >
      <span className="eyebrow__dot" aria-hidden />
      {children}
    </motion.p>
  );
}

/**
 * A block that reveals once when scrolled into view. `as` lets callers keep
 * semantic tags. This is the quiet default; scroll-*linked* motion lives in the
 * individual acts.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.4,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 34 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 1.3, ease: EASE_CINE, delay },
        },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline that reveals line by line, each rising out of a mask. Pass an array
 * of strings; each becomes its own overflow-clipped row.
 */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  once = true,
  amount = 0.6,
  stagger = 0.1,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  once?: boolean;
  amount?: number;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <motion.span
            className={`mask-line__inner ${lineClassName}`}
            variants={{
              hidden: { y: "115%" },
              show: { y: "0%", transition: { duration: 1.15, ease: EASE_CINE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

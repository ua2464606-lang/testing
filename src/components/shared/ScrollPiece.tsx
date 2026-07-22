"use client";

/**
 * A fragment that reveals as a function of a parent's scroll progress (not
 * on-view). Used by the pinned acts to assemble visuals piece by piece as the
 * reader scrolls — the reader is effectively scrubbing a build sequence.
 */

import { motion, useTransform, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

export function ScrollPiece({
  progress,
  at,
  span = 0.1,
  y = 20,
  className = "",
  children,
}: {
  progress: MotionValue<number>;
  /** Progress value (0..1) at which this piece begins to appear. */
  at: number;
  /** How much scroll it takes to fully resolve. */
  span?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [at, at + span], [0, 1]);
  const ty = useTransform(progress, [at, at + span], [y, 0]);
  return (
    <motion.div className={className} style={{ opacity, y: ty }}>
      {children}
    </motion.div>
  );
}

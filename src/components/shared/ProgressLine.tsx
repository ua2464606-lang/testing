"use client";

/**
 * A 1px accent hairline pinned to the very top edge, tracking read-progress
 * through the film. The only piece of "UI" on the whole page — and barely.
 */

import { motion, useScroll, useSpring } from "framer-motion";

export function ProgressLine() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  return <motion.div className="progress-line" style={{ scaleX }} aria-hidden />;
}

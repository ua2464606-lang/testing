/**
 * Shared motion language for the whole film.
 *
 * The entire site commits to a small set of cinematic easing curves and slow
 * durations. Nothing bounces, nothing overshoots — reveals dissolve in and
 * settle, the way a shot resolves in a film. Import from here so every act
 * speaks the same motion dialect.
 */

import type { Transition, Variants } from "framer-motion";

/** Expo-out. The house curve for reveals — fast to settle, then a long calm tail. */
export const EASE_CINE = [0.16, 1, 0.3, 1] as const;

/** Symmetric ease-in-out for cross-fades and camera-like moves. */
export const EASE_INOUT = [0.65, 0, 0.35, 1] as const;

/** A slow, luxurious reveal. */
export const revealTransition: Transition = {
  duration: 1.4,
  ease: EASE_CINE,
};

/** Line / word reveal used for editorial copy. */
export const lineReveal: Variants = {
  hidden: { opacity: 0, y: "110%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 1.2, ease: EASE_CINE },
  },
};

/** Stagger container for stacked lines. */
export const stagger = (each = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: each, delayChildren: delay },
  },
});

/** Soft fade + slight rise, the default for any block entering view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.3, ease: EASE_CINE },
  },
};

/** Fade with a whisper of scale — used for images and cards settling into place. */
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.6, ease: EASE_CINE },
  },
};

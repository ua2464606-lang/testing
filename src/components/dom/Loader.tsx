"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperienceStore } from "@/lib/store/useExperienceStore";

/**
 * Intro veil. Black screen, a warming counter, then a single restrained
 * affordance to enter. Fades to reveal the WebGL (which itself begins in
 * darkness), so the transition from loader → scene 01 is seamless.
 */
export function Loader() {
  const entered = useExperienceStore((s) => s.entered);
  const setEntered = useExperienceStore((s) => s.setEntered);
  const setReady = useExperienceStore((s) => s.setReady);
  const [count, setCount] = useState(0);
  const [warm, setWarm] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setWarm(true);
        setReady(true);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [setReady]);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          className="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="loader__inner">
            <motion.p
              className="loader__mark"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              FRY&nbsp;GUYS
            </motion.p>

            <div className="loader__meta">
              <span className="loader__count">
                {count.toString().padStart(3, "0")}
              </span>
              <span className="loader__label">A cinematic in six moves</span>
            </div>

            <div className="loader__bar">
              <motion.span
                className="loader__fill"
                style={{ scaleX: count / 100 }}
              />
            </div>

            <AnimatePresence>
              {warm && (
                <motion.button
                  className="loader__enter"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  onClick={() => setEntered(true)}
                >
                  <span>Enter the dark</span>
                  <span className="loader__enter-line" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useExperienceStore } from "@/lib/store/useExperienceStore";
import { SCENES } from "@/lib/constants/scenes";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The editorial layer. Minimal copy, huge type, generous whitespace. Text is
 * keyed to the active scene so headings swap with a soft mask reveal as the
 * camera crosses each scene boundary — never competing with the imagery.
 */
export function SceneOverlay() {
  const activeScene = useExperienceStore((s) => s.activeScene);
  const scene = SCENES.find((s) => s.id === activeScene) ?? SCENES[0];
  // finale gets its own dedicated CTA block
  const showCaption = scene.id !== "finale";

  return (
    <div className="overlay" aria-hidden={false}>
      <AnimatePresence mode="wait">
        {showCaption && (
          <motion.div
            key={scene.id}
            className={`overlay__block overlay__block--${scene.index % 2 === 0 ? "left" : "right"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="overlay__numeral">
              <span>{scene.numeral}</span>
              <span className="overlay__rule" />
              <span className="overlay__overline">{scene.overline}</span>
            </div>

            <h2 className="overlay__title">
              {scene.title.split("\n").map((line, i) => (
                <span key={i} className="overlay__line">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-110%" }}
                    transition={{ duration: 0.9, ease, delay: 0.05 + i * 0.08 }}
                    className="overlay__line-inner"
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>

            <motion.p
              className="overlay__caption"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.25 }}
            >
              {scene.caption}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

/**
 * ACT 3 — The Creation.
 *
 * Pinned. A phone stays fixed centre-frame while a post composes itself: the
 * image resolves out of a soft mask, the caption types itself (character count
 * driven directly by scroll), then hashtags settle in. A quiet step rail on the
 * side marks the build. The "photo" is an abstract, brand-toned composition —
 * never stock, never a screenshot.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { creation } from "@/lib/content";

export function Act3Creation() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Image resolves out of a mask + settles from a whisper of scale.
  const clip = useTransform(
    scrollYProgress,
    [0.08, 0.32],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const imgScale = useTransform(scrollYProgress, [0.08, 0.4], [1.12, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0.06, 0.2], [0, 1]);

  // Caption types itself.
  const chars = useTransform(
    scrollYProgress,
    [0.36, 0.64],
    [0, creation.caption.length]
  );
  const typed = useTransform(chars, (c) =>
    creation.caption.slice(0, Math.round(c))
  );
  const caretOpacity = useTransform(
    scrollYProgress,
    [0.36, 0.64, 0.68],
    [1, 1, 0]
  );

  const phoneY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Step rail.
  const step = useTransform(scrollYProgress, (p): number => {
    if (p < 0.32) return 0;
    if (p < 0.64) return 1;
    if (p < 0.82) return 2;
    return 3;
  });

  return (
    <section ref={ref} className="act-creation" aria-label="The creation">
      <div className="act-creation__pin container">
        <div className="act-creation__intro">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden />
            {creation.eyebrow}
          </p>
          <h2 className="display act-creation__title">{creation.title}</h2>
          <p className="lede">{creation.body}</p>

          <ol className="step-rail">
            {creation.steps.map((s, i) => (
              <StepRow key={s} index={i} step={step} label={s} />
            ))}
          </ol>
        </div>

        <motion.div className="phone" style={{ y: phoneY }}>
          <div className="phone__notch" aria-hidden />
          <div className="phone__screen">
            <div className="post__head">
              <span className="post__avatar" aria-hidden />
              <div className="post__meta">
                <span className="post__name">aurelia.kitchen</span>
                <span className="post__sub">Sponsored · FormulaeAI</span>
              </div>
              <span className="post__more" aria-hidden>
                •••
              </span>
            </div>

            <div className="post__image">
              <motion.div
                className="post__photo"
                style={{ clipPath: clip, scale: imgScale, opacity: imgOpacity }}
                aria-hidden
              >
                <div className="post__photo-grain" />
              </motion.div>
            </div>

            <div className="post__actions" aria-hidden>
              <span className="post__ico post__ico--heart" />
              <span className="post__ico post__ico--comment" />
              <span className="post__ico post__ico--share" />
              <span className="post__ico post__ico--save" />
            </div>

            <div className="post__body">
              <p className="post__caption">
                <span className="post__caption-name">aurelia.kitchen</span>{" "}
                <motion.span>{typed}</motion.span>
                <motion.span className="post__caret" style={{ opacity: caretOpacity }}>
                  |
                </motion.span>
              </p>
              <p className="post__tags">
                {creation.hashtags.map((t, i) => (
                  <Hashtag key={t} progress={scrollYProgress} index={i} tag={t} />
                ))}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepRow({
  index,
  step,
  label,
}: {
  index: number;
  step: import("framer-motion").MotionValue<number>;
  label: string;
}) {
  const active = useTransform(step, (s) => (s >= index ? 1 : 0.3));
  const lineScale = useTransform(step, (s) => (s > index ? 1 : s === index ? 0.5 : 0));
  return (
    <motion.li className="step-rail__item" style={{ opacity: active }}>
      <span className="step-rail__track" aria-hidden>
        <motion.span className="step-rail__fill" style={{ scaleY: lineScale }} />
      </span>
      <span className="step-rail__label">{label}</span>
    </motion.li>
  );
}

function Hashtag({
  progress,
  index,
  tag,
}: {
  progress: import("framer-motion").MotionValue<number>;
  index: number;
  tag: string;
}) {
  const at = 0.66 + index * 0.05;
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1]);
  const y = useTransform(progress, [at, at + 0.05], [8, 0]);
  return (
    <motion.span className="post__tag" style={{ opacity, y }}>
      {tag}{" "}
    </motion.span>
  );
}

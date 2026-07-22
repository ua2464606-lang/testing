"use client";

/**
 * ACT 1 — The Problem (quiet tension).
 *
 * A pinned frame. As you scroll, one line at a time surfaces and dissolves,
 * like reading subtitles in a film. Opacity and a small rise are driven
 * directly by scroll progress — not fade-on-view — so the reader controls the
 * pace of the confession. A hairline "time" bar creeps across the bottom to
 * suggest the treadmill of it all.
 */

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { problem } from "@/lib/content";

function SubtitleLine({
  progress,
  index,
  count,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
  children: string;
}) {
  // Each line owns an equal slice of the scroll; it fades up, holds, fades out.
  const span = 1 / count;
  const start = index * span;
  const opacity = useTransform(
    progress,
    [start, start + span * 0.28, start + span * 0.72, start + span],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + span * 0.28, start + span * 0.72, start + span],
    [26, 0, 0, -26]
  );
  const blur = useTransform(
    progress,
    [start, start + span * 0.28, start + span * 0.72, start + span],
    [8, 0, 0, 8]
  );
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.p className="subtitle" style={{ opacity, y, filter }}>
      {children}
    </motion.p>
  );
}

export function Act1Problem() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const lines = problem.lines;

  return (
    <section ref={ref} className="act-problem" aria-label="The problem">
      <div className="act-problem__pin">
        <p className="eyebrow act-problem__eyebrow">
          <span className="eyebrow__dot" aria-hidden />
          {problem.eyebrow}
        </p>

        <div className="act-problem__stack">
          {lines.map((line, i) => (
            <SubtitleLine
              key={i}
              progress={scrollYProgress}
              index={i}
              count={lines.length + 1}
            >
              {line}
            </SubtitleLine>
          ))}
          {/* Final beat lingers in the last slice. */}
          <SubtitleLine
            progress={scrollYProgress}
            index={lines.length}
            count={lines.length + 1}
          >
            {problem.close}
          </SubtitleLine>
        </div>

        <div className="act-problem__timeline" aria-hidden>
          <motion.span
            className="act-problem__timeline-fill"
            style={{ scaleX: barScale }}
          />
        </div>
      </div>
    </section>
  );
}

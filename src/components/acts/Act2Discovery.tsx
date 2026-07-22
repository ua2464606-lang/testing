"use client";

/**
 * ACT 2 — The Discovery.
 *
 * Pinned. A brand-profile card assembles itself while a scan line sweeps the
 * frame. On the left, the sources being read (site, logo, palette, voice,
 * feed) light up in sequence. Everything is scroll-linked: the reader is
 * scrubbing FormulaeAI's act of *noticing* a business.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ScrollPiece } from "@/components/shared/ScrollPiece";
import { discovery } from "@/lib/content";

export function Act2Discovery() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Scan line sweeps top→bottom over the first third, then rests.
  const scanY = useTransform(scrollYProgress, [0.02, 0.34], ["0%", "100%"]);
  const scanOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.34, 0.42],
    [0, 1, 1, 0]
  );
  const cardBorder = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(236,231,221,0.06)", "rgba(198,161,91,0.28)"]
  );

  // Which source is "reading" right now.
  const activeIndex = useTransform(scrollYProgress, (p) =>
    Math.min(discovery.scanning.length - 1, Math.floor(p * 1.6 * discovery.scanning.length))
  );

  return (
    <section ref={ref} className="act-discovery" aria-label="The discovery">
      <div className="act-discovery__pin container">
        <div className="act-discovery__col act-discovery__text">
          <p className="eyebrow">
            <span className="eyebrow__dot" aria-hidden />
            {discovery.eyebrow}
          </p>
          <h2 className="display act-discovery__title">{discovery.title}</h2>
          <p className="lede">{discovery.body}</p>

          <ul className="scan-list">
            {discovery.scanning.map((s, i) => (
              <ScanItem key={s} index={i} active={activeIndex} label={s} />
            ))}
          </ul>
        </div>

        <div className="act-discovery__col act-discovery__visual">
          <motion.div className="brand-card" style={{ borderColor: cardBorder }}>
            {/* Sweeping scan line */}
            <motion.div
              className="brand-card__scan"
              style={{ top: scanY, opacity: scanOpacity }}
              aria-hidden
            />

            <ScrollPiece progress={scrollYProgress} at={0.12} className="brand-card__row">
              <span className="brand-card__key">Business</span>
              <span className="brand-card__name">{discovery.card.name}</span>
            </ScrollPiece>

            <ScrollPiece progress={scrollYProgress} at={0.26} className="brand-card__row">
              <span className="brand-card__key">Palette</span>
              <span className="brand-card__palette">
                {discovery.card.palette.map((c) => (
                  <span
                    key={c}
                    className="brand-card__swatch"
                    style={{ background: c }}
                  />
                ))}
              </span>
            </ScrollPiece>

            <ScrollPiece progress={scrollYProgress} at={0.4} className="brand-card__row">
              <span className="brand-card__key">Feel</span>
              <span className="brand-card__tags">
                {discovery.card.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </span>
            </ScrollPiece>

            <ScrollPiece progress={scrollYProgress} at={0.54} className="brand-card__row brand-card__row--voice">
              <span className="brand-card__key">Voice</span>
              <span className="brand-card__voice">“{discovery.card.voice}”</span>
            </ScrollPiece>

            <ScrollPiece progress={scrollYProgress} at={0.72} className="brand-card__stamp">
              <span className="brand-card__stamp-dot" aria-hidden />
              Brand profile assembled
            </ScrollPiece>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ScanItem({
  index,
  active,
  label,
}: {
  index: number;
  active: import("framer-motion").MotionValue<number>;
  label: string;
}) {
  const opacity = useTransform(active, (a) => (a >= index ? 1 : 0.28));
  const x = useTransform(active, (a) => (a === index ? 8 : 0));
  return (
    <motion.li className="scan-list__item" style={{ opacity, x }}>
      <motion.span
        className="scan-list__mark"
        style={{ opacity: useTransform(active, (a) => (a >= index ? 1 : 0.15)) }}
        aria-hidden
      />
      {label}
    </motion.li>
  );
}

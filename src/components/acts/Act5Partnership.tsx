"use client";

/**
 * ACT 5 — The Partnership.
 *
 * What continues after approval, as a calm montage. Each capability is a
 * refined line-icon with a single line of copy — no dashboards, no grids of
 * boxes. Items surface in sequence as the reader scrolls, and a hairline
 * spine draws itself down the column to bind them into one ongoing motion.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE_CINE } from "@/lib/motion";
import { Eyebrow } from "@/components/shared/Primitives";
import {
  IconCalendar,
  IconReel,
  IconCaption,
  IconCampaign,
  IconOptimise,
  IconReport,
} from "@/components/shared/LineIcons";
import { partnership } from "@/lib/content";

const ICONS = [
  IconCalendar,
  IconReel,
  IconCaption,
  IconCampaign,
  IconOptimise,
  IconReport,
];

export function Act5Partnership() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="act-partner" aria-label="The partnership">
      <div className="container">
        <div className="act-partner__head">
          <Eyebrow>{partnership.eyebrow}</Eyebrow>
          <motion.h2
            className="display act-partner__title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.4, ease: EASE_CINE }}
          >
            {partnership.title}
          </motion.h2>
        </div>

        <div className="act-partner__list" ref={ref}>
          <span className="act-partner__spine" aria-hidden>
            <motion.span
              className="act-partner__spine-fill"
              style={{ scaleY: spine }}
            />
          </span>

          {partnership.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                className="partner-item"
                key={it.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, ease: EASE_CINE }}
              >
                <span className="partner-item__index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="partner-item__icon">
                  <Icon />
                </span>
                <span className="partner-item__text">
                  <span className="partner-item__label">{it.label}</span>
                  <span className="partner-item__note">{it.note}</span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

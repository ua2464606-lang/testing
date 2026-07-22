"use client";

/**
 * ACT 4 — The Gift.
 *
 * The finished sample arrives. An email composes into view — a new-mail line
 * settling, then the message opening to reveal two attachments already in the
 * owner's brand. The emotional beat lands last, large and alone:
 * "No pitch. Just proof."
 */

import { motion } from "framer-motion";
import { EASE_CINE } from "@/lib/motion";
import { Eyebrow } from "@/components/shared/Primitives";
import { gift } from "@/lib/content";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE_CINE } },
};

export function Act4Gift() {
  return (
    <section className="act-gift" aria-label="The gift">
      <div className="container act-gift__inner">
        <Eyebrow className="act-gift__eyebrow">{gift.eyebrow}</Eyebrow>

        <motion.div
          className="email"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.div className="email__bar" variants={item}>
            <span className="email__dot" aria-hidden />
            <span className="email__new">New message</span>
          </motion.div>

          <motion.div className="email__head" variants={item}>
            <span className="email__avatar" aria-hidden>
              F
            </span>
            <div className="email__from">
              <span className="email__from-name">{gift.from}</span>
              <span className="email__from-addr">hello@formulae.ai</span>
            </div>
            <span className="email__time">now</span>
          </motion.div>

          <motion.h3 className="email__subject" variants={item}>
            {gift.subject}
          </motion.h3>
          <motion.p className="email__preview" variants={item}>
            {gift.preview}
          </motion.p>

          <motion.div className="email__attachments" variants={item}>
            <span className="attach">
              <span className="attach__thumb attach__thumb--post" aria-hidden />
              <span className="attach__meta">
                <span className="attach__name">post.jpg</span>
                <span className="attach__kind">Instagram · in your brand</span>
              </span>
            </span>
            <span className="attach">
              <span className="attach__thumb attach__thumb--reel" aria-hidden>
                <span className="attach__play" aria-hidden />
              </span>
              <span className="attach__meta">
                <span className="attach__name">reel.mp4</span>
                <span className="attach__kind">Reel · 12s</span>
              </span>
            </span>
          </motion.div>
        </motion.div>

        <motion.p
          className="act-gift__beat display"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.5, ease: EASE_CINE }}
        >
          {gift.headline}
        </motion.p>
        <motion.p
          className="act-gift__body"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.4, ease: EASE_CINE, delay: 0.2 }}
        >
          {gift.body}
        </motion.p>
      </div>
    </section>
  );
}

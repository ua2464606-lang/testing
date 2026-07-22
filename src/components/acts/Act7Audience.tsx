"use client";

/**
 * ACT 7 — Who it's for.
 *
 * An editorial lookbook. On desktop the section pins and the reader scrolls a
 * horizontal reel of "looks" — each business type shot like a fashion plate,
 * not an icon in a box (GSAP ScrollTrigger drives the horizontal scrub). On
 * mobile it degrades to a calm vertical stack of the same plates.
 */

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap/register";
import { motion } from "framer-motion";
import { EASE_CINE } from "@/lib/motion";
import { Eyebrow } from "@/components/shared/Primitives";
import { audience } from "@/lib/content";

export function Act7Audience() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const mq = window.matchMedia("(min-width: 768px)");
    const el = track.current;
    const sec = section.current;
    if (!el || !sec) return;

    const ctx = gsap.context(() => {
      const build = () => {
        if (!mq.matches) return; // mobile → native vertical stack, no pin
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      };
      build();
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="act-audience" aria-label="Who it's for">
      <div className="act-audience__masthead container">
        <Eyebrow>{audience.eyebrow}</Eyebrow>
        <motion.h2
          className="display act-audience__title"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE_CINE }}
        >
          {audience.title}
        </motion.h2>
      </div>

      <div ref={track} className="lookbook__track">
        {audience.items.map((it, i) => (
          <article className={`look look--${i % 3}`} key={it.name}>
            <div className="look__frame">
              <div className="look__image" aria-hidden />
              <span className="look__index">
                {String(i + 1).padStart(2, "0")} / {String(audience.items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="look__caption">
              <h3 className="look__name">{it.name}</h3>
              <p className="look__note">{it.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

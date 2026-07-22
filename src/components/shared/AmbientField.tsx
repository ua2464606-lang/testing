"use client";

/**
 * A whisper of atmosphere: a handful of slow, soft-focus dust motes drifting
 * upward on a canvas. Deliberately sparse — you should barely notice it, only
 * feel that the dark is alive. Pauses when off-screen and respects
 * reduced-motion (renders a single still frame).
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/scroll/SmoothScrollProvider";

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  a: number;
  tw: number;
};

export function AmbientField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let motes: Mote[] = [];

    const seed = () => {
      const count = Math.min(46, Math.round((w * h) / 42000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.14 + 0.03),
        vx: (Math.random() - 0.5) * 0.06,
        a: Math.random() * 0.5 + 0.1,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const flick = 0.6 + 0.4 * Math.sin(t * 0.0007 + m.tw);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198,161,91,${m.a * flick * 0.5})`;
        ctx.fill();
      }
    };

    let raf = 0;
    let running = true;
    const step = (t: number) => {
      if (running) {
        for (const m of motes) {
          m.y += m.vy;
          m.x += m.vx;
          if (m.y < -10) {
            m.y = h + 10;
            m.x = Math.random() * w;
          }
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
        }
        draw(t);
      }
      raf = requestAnimationFrame(step);
    };

    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(step);
    }

    // Pause the loop when the tab / section is hidden.
    const io = new IntersectionObserver(
      ([e]) => (running = e.isIntersecting && !reduced),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={ref} className="ambient-canvas" aria-hidden />;
}

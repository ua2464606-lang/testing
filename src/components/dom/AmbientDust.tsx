"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

/**
 * A whisper-fine DOM dust layer over the WebGL film. Not the hero particles
 * (those live in the 3D scene) — just a slow, low-opacity mote field that adds
 * a last millimetre of atmospheric depth in front of the lens.
 */
export function AmbientDust() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 40, density: { enable: true } },
        color: { value: ["#f0d9a8", "#cfe0ff", "#ffffff"] },
        opacity: {
          value: { min: 0.02, max: 0.14 },
          animation: { enable: true, speed: 0.4, sync: false },
        },
        size: { value: { min: 0.4, max: 1.6 } },
        move: {
          enable: true,
          speed: 0.25,
          direction: "top",
          random: true,
          straight: false,
          outModes: { default: "out" },
        },
      },
      interactivity: { events: {} },
    }),
    []
  );

  if (!ready) return null;

  return <Particles id="ambient-dust" className="ambient-dust" options={options} />;
}

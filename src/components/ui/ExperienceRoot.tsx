"use client";

import dynamic from "next/dynamic";
import { SCROLL_HEIGHT_VH } from "@/lib/constants/scenes";
import { Loader } from "@/components/dom/Loader";
import { Hud } from "@/components/dom/Hud";
import { SceneOverlay } from "@/components/dom/SceneOverlay";
import { Prompts } from "@/components/dom/Prompts";
import { AmbientDust } from "@/components/dom/AmbientDust";

// WebGL is browser-only: never render it on the server.
const Experience = dynamic(
  () => import("@/components/canvas/Experience").then((m) => m.Experience),
  { ssr: false }
);

/**
 * Composition root for the whole experience:
 *  - a fixed full-viewport stage holding the single WebGL canvas + DOM overlays
 *  - a tall, invisible scroll driver that gives the page its scroll length
 *  - the intro loader on top
 *
 * The stage is `position: fixed` so the film stays put while the driver scrolls
 * underneath it; the shared store keeps the canvas and overlays frame-locked.
 */
export function ExperienceRoot() {
  return (
    <>
      <div className="stage">
        <Experience />
        <div className="stage__overlays">
          <Hud />
          <SceneOverlay />
          <Prompts />
          <AmbientDust />
          <div className="stage__grain" aria-hidden />
          <div className="stage__vignette" aria-hidden />
        </div>
      </div>

      <div
        className="scroll-driver"
        style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
        aria-hidden
      />

      <Loader />
    </>
  );
}

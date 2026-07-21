"use client";

import { VideoPlate } from "@/components/canvas/objects/VideoPlate";
import { Steam } from "@/components/canvas/objects/Steam";
import { ParticleField } from "@/components/canvas/effects/ParticleField";
import { VIDEO_ASSETS } from "@/lib/constants/assets";

/**
 * SCENE 01 — Emergence.
 * Real footage of fries falling into the bucket, mapped as a VideoTexture on a
 * camera-facing plate. The cinematic camera pushes in toward it while dust hangs
 * in the beam and steam lifts off the top — all compositing over the film via
 * the shared post-processing stack. As the scene ends the plate dissolves and
 * the camera continues into the cold vault (no cut).
 */
export function SceneEmergence() {
  return (
    <group position={[0, 0, 0]}>
      <VideoPlate
        src={VIDEO_ASSETS.friesFalling}
        position={[0, 0.1, 0]}
        height={5.2}
        window={[0.0, 0.18]}
      />

      <Steam
        position={[0, 1.4, 0.2]}
        scale={[1.8, 2.6, 1]}
        color="#e9d8c4"
        window={[0.02, 0.16]}
        peak={0.8}
      />

      {/* cinematic dust in the beam */}
      <ParticleField
        count={500}
        radius={5}
        color="#e8c98a"
        size={0.035}
        rise={0.08}
        swirl={0.05}
        opacity={0.4}
        position={[0, 0.5, 0]}
      />
    </group>
  );
}

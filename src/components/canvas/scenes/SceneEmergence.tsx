"use client";

import { Bucket } from "@/components/canvas/objects/Bucket";
import { FallingFries } from "@/components/canvas/objects/FallingFries";
import { Steam } from "@/components/canvas/objects/Steam";
import { ParticleField } from "@/components/canvas/effects/ParticleField";

/**
 * SCENE 01 — Emergence.
 * A bucket rises from black as the key light ramps. Real fries rain in, steam
 * lifts off the rim, dust hangs in the volumetric beam. The camera pushes
 * slowly forward toward the rim (handled by the dolly path).
 */
export function SceneEmergence() {
  return (
    <group position={[0, 0, 0]}>
      <Bucket position={[0, -0.4, 0]} />
      <FallingFries count={44} />
      <Steam
        position={[0, 0.9, 0.1]}
        scale={[1.8, 2.6, 1]}
        color="#e9d8c4"
        window={[0.0, 0.16]}
        peak={0.9}
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

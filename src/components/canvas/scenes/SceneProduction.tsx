"use client";

import { ProductionLine } from "@/components/canvas/objects/ProductionLine";
import { Steam } from "@/components/canvas/objects/Steam";
import { ParticleField } from "@/components/canvas/effects/ParticleField";

/**
 * SCENE 03 — The Line.
 * The camera tracks a single potato down the belt through five stations. Frost
 * vapour blooms at the freeze station; the whole move is continuous.
 */
export function SceneProduction() {
  return (
    <group>
      <ProductionLine />
      {/* frost burst at the freeze station */}
      <Steam
        position={[0, 0.1, -9.8]}
        scale={[2.2, 2.0, 1]}
        color="#bfe6f5"
        speed={0.2}
        window={[0.5, 0.6]}
        peak={1}
      />
      <ParticleField
        count={300}
        radius={3}
        color="#cde7f7"
        size={0.025}
        rise={0.05}
        swirl={0.2}
        opacity={0.55}
        position={[0, 0, -9.5]}
      />
    </group>
  );
}

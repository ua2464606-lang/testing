"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useImageTexture } from "@/hooks/useImageTexture";
import { createGlowTexture } from "@/lib/three/textures";
import { HERO_ASSETS } from "@/lib/constants/assets";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * The Fry Guys bucket — real photography only.
 *
 * Rendered as a camera-facing photographic plate (its natural aspect) with a
 * warm key light. Where the asset is absent it shows a warm light presence, not
 * a procedural vessel. Optional `window` self-reveals the plate across a scroll
 * slice; otherwise it stays visible and its parent group controls it.
 */
export function Bucket({
  position = [0, -0.2, 0],
  size = 3.4,
  window: win,
}: {
  position?: [number, number, number];
  size?: number;
  window?: [number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);
  const plateMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  const { texture, aspect } = useImageTexture(HERO_ASSETS.bucket);
  const glowTex = useMemo(() => createGlowTexture("#f0c98a"), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;

    let eased = 1;
    if (win) {
      const { progress } = experienceState();
      const t = (progress - win[0]) / (win[1] - win[0]);
      let reveal = 0;
      if (t > 0 && t < 1)
        reveal = Math.min(1, Math.max(0, t < 0.5 ? t / 0.35 : (1 - t) / 0.35));
      eased = reveal * reveal * (3 - 2 * reveal);
      g.visible = reveal > 0.001;
    }

    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
    if (plate.current) plate.current.quaternion.copy(state.camera.quaternion);
    if (plateMat.current) plateMat.current.opacity = eased;
    if (glowMat.current) {
      glowMat.current.opacity =
        eased * (0.5 + 0.12 * Math.sin(state.clock.elapsedTime));
    }
  });

  const w = texture ? size * Math.min(aspect, 1.4) : size;
  const h = texture ? size / Math.max(aspect, 0.001) : size;

  return (
    <group ref={group} position={position} visible={!win}>
      <pointLight
        position={[1.5, 2.5, 2.5]}
        intensity={texture ? 6 : 10}
        color="#ffcf95"
        distance={16}
        decay={2}
      />
      {texture ? (
        <mesh ref={plate}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            ref={plateMat}
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : (
        <mesh>
          <planeGeometry args={[size * 1.7, size * 1.7]} />
          <meshBasicMaterial
            ref={glowMat}
            map={glowTex}
            color="#f0c98a"
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

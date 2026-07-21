"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Product as ProductData } from "@/lib/constants/products";
import { useImageTexture } from "@/hooks/useImageTexture";
import { createGlowTexture } from "@/lib/three/textures";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * A hero product, rendered ONLY as real photography.
 *
 * When the product PNG exists it is a transparent, camera-facing photographic
 * plate, scaled to its natural aspect and filling the frame. When it does not
 * exist we render a soft accent-tinted light presence (an additive glow
 * billboard + point light) — never a geometry primitive standing in for food.
 *
 * `window` is a static [start, end] slice of global progress; the plate computes
 * its own reveal in useFrame so React never re-renders during scroll.
 */
export function Product({
  data,
  position = [0, 0, 0],
  window,
  size = 3.2,
}: {
  data: ProductData;
  position?: [number, number, number];
  window: [number, number];
  size?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);
  const plateMat = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.Mesh>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  const { texture, aspect } = useImageTexture(data.image);
  const accent = useMemo(() => new THREE.Color(data.accent), [data.accent]);
  const glowTex = useMemo(() => createGlowTexture(), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;

    const { progress } = experienceState();
    const [a, b] = window;
    const t = (progress - a) / (b - a);
    let reveal = 0;
    if (t > 0 && t < 1) {
      reveal = Math.min(1, Math.max(0, t < 0.5 ? t / 0.4 : (1 - t) / 0.4));
    }
    const eased = reveal * reveal * (3 - 2 * reveal);

    g.visible = reveal > 0.001;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.7 + eased * 0.35, 5, d));
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.05;

    // billboard photographic plate toward camera
    if (plate.current) plate.current.quaternion.copy(state.camera.quaternion);
    if (plateMat.current) plateMat.current.opacity = eased;

    if (glow.current) {
      glow.current.quaternion.copy(state.camera.quaternion);
      const pulse = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 1.2);
      if (glowMat.current) glowMat.current.opacity = eased * 0.6 * pulse;
    }
  });

  const w = texture ? size * Math.min(aspect, 1.6) : size;
  const h = texture ? size / Math.max(aspect, 0.001) : size;

  return (
    <group ref={group} position={position} visible={false}>
      <pointLight
        position={[1.4, 1.8, 2.2]}
        intensity={texture ? 5 : 9}
        color={accent}
        distance={14}
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
        // non-geometry placeholder: a light presence, not fake food
        <mesh ref={glow}>
          <planeGeometry args={[size * 1.6, size * 1.6]} />
          <meshBasicMaterial
            ref={glowMat}
            map={glowTex}
            color={accent}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

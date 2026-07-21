"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Product as ProductData } from "@/lib/constants/products";
import { useProductTexture } from "@/hooks/useProductTexture";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * A single hero product floating in space, filling the frame.
 *
 * If real photography exists it renders as a transparent, camera-facing plate
 * lit by an accent rim. Otherwise it renders a lit procedural stand-in (a faceted
 * gold form) so the composition is never empty.
 *
 * `window` is a static [start, end] slice of global progress. The product
 * computes its own reveal (fade/scale in then out) from that window inside
 * useFrame, so React never re-renders during scroll — all motion is imperative.
 */
export function Product({
  data,
  position = [0, 0, 0],
  window,
  spin = 0.15,
}: {
  data: ProductData;
  position?: [number, number, number];
  window: [number, number];
  spin?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const standRef = useRef<THREE.Mesh>(null);
  const texture = useProductTexture(data.image);
  const accent = new THREE.Color(data.accent);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;

    const { progress } = experienceState();
    const [a, b] = window;
    const t = (progress - a) / (b - a);
    // triangular reveal: 0 → 1 at centre → 0, with soft plateau
    let reveal = 0;
    if (t > 0 && t < 1) {
      reveal = t < 0.5 ? t / 0.4 : (1 - t) / 0.4;
      reveal = Math.min(1, Math.max(0, reveal));
    }
    const eased = reveal * reveal * (3 - 2 * reveal);

    g.visible = reveal > 0.001;
    const targetScale = 0.65 + eased * 0.4;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 5, d));

    const clock = state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(clock * 0.6) * 0.06;

    if (texture && planeRef.current) {
      planeRef.current.quaternion.slerp(state.camera.quaternion, 0.12);
      if (matRef.current) matRef.current.opacity = eased;
    }
    if (standRef.current) {
      standRef.current.rotation.y += d * spin;
      standRef.current.rotation.x = Math.sin(clock * 0.3) * 0.12;
      (standRef.current.material as THREE.MeshStandardMaterial).opacity = eased;
    }
  });

  return (
    <group ref={group} position={position} visible={false}>
      <pointLight
        position={[1.5, 2, 2]}
        intensity={6}
        color={accent}
        distance={12}
        decay={2}
      />
      {texture ? (
        <mesh ref={planeRef}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial
            ref={matRef}
            map={texture}
            transparent
            opacity={0}
            toneMapped={false}
          />
        </mesh>
      ) : (
        <mesh ref={standRef}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshStandardMaterial
            color={accent}
            metalness={0.55}
            roughness={0.28}
            emissive={accent}
            emissiveIntensity={0.12}
            transparent
            opacity={0}
            envMapIntensity={1.4}
            flatShading
          />
        </mesh>
      )}
    </group>
  );
}

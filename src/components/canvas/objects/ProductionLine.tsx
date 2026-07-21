"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useImageTexture } from "@/hooks/useImageTexture";
import { createGlowTexture } from "@/lib/three/textures";
import { HERO_ASSETS } from "@/lib/constants/assets";
import { experienceState } from "@/lib/store/useExperienceStore";
import { SCENES, localProgress } from "@/lib/constants/scenes";

const STATIONS = [
  { z: -6.5, color: "#2b7fb8" }, // wash
  { z: -7.6, color: "#d8dce2" }, // cut
  { z: -8.7, color: "#c98a2f" }, // season
  { z: -9.8, color: "#7fd6f0" }, // freeze
  { z: -10.9, color: "#8a5a2b" }, // pack
] as const;

/**
 * The production line, expressed cinematically with LIGHT — not machinery
 * geometry. Five coloured station lights (with soft glow billboards) mark
 * wash → cut → season → freeze → pack; a real potato sprite travels the line
 * with scroll. No boxes, cylinders or gantries: Three.js is doing lighting,
 * glow, movement — never standing in for the food.
 */
export function ProductionLine() {
  const potato = useRef<THREE.Mesh>(null);
  const potatoMat = useRef<THREE.MeshBasicMaterial>(null);
  const scene = useMemo(() => SCENES.find((s) => s.id === "production")!, []);
  const beltZ = useMemo(() => ({ start: -5.5, end: -11.5 }), []);

  const { texture, aspect } = useImageTexture(HERO_ASSETS.potato);
  const glowTex = useMemo(() => createGlowTexture(), []);
  const potatoGlow = useMemo(() => createGlowTexture("#e9c477"), []);

  useFrame((state, delta) => {
    const progress = localProgress(scene, experienceState().progress);
    if (potato.current) {
      const z = THREE.MathUtils.lerp(beltZ.start, beltZ.end, progress);
      potato.current.position.z = z;
      potato.current.quaternion.copy(state.camera.quaternion);
      if (potatoMat.current) {
        // gentle presence pulse
        const pulse = 0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 1.5);
        potatoMat.current.opacity = texture ? 1 : 0.7 * pulse;
      }
    }
  });

  const pw = texture ? 0.9 * aspect : 0.9;
  const ph = texture ? 0.9 : 0.9;

  return (
    <group>
      {STATIONS.map((s, i) => (
        <group key={i} position={[0, 0.1, s.z]}>
          <pointLight color={s.color} intensity={5} distance={4.5} decay={2} />
          {/* soft glow billboard = a light, not geometry food */}
          <mesh>
            <planeGeometry args={[1.1, 1.1]} />
            <meshBasicMaterial
              map={glowTex}
              color={s.color}
              transparent
              opacity={0.5}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* the followed potato — real photography, or a warm light presence */}
      <mesh ref={potato} position={[0, -0.1, -5.5]}>
        <planeGeometry args={[pw, ph]} />
        {texture ? (
          <meshBasicMaterial
            ref={potatoMat}
            map={texture}
            transparent
            alphaTest={0.1}
            depthWrite={false}
            toneMapped={false}
          />
        ) : (
          <meshBasicMaterial
            ref={potatoMat}
            map={potatoGlow}
            color="#e9c477"
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        )}
      </mesh>
    </group>
  );
}

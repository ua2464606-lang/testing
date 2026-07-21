"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createSteamMaterial } from "@/shaders/materials";
import { experienceState } from "@/lib/store/useExperienceStore";

interface SteamProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  /** static peak opacity when no window is supplied */
  intensity?: number;
  color?: string;
  layers?: number;
  speed?: number;
  /** optional [start,end] global-progress window; steam fades in/out across it */
  window?: [number, number];
  /** peak intensity reached at the window centre */
  peak?: number;
}

/**
 * Layered, upward-drifting steam. Each billboard uses the steam shader with a
 * slightly different phase and always faces the camera. When a `window` is
 * given the plume self-fades across that scroll slice, so scenes stay static
 * and all animation stays in the frame loop.
 */
export function Steam({
  position = [0, 0, 0],
  scale = [2, 3, 1],
  intensity = 1,
  color = "#d7e2ee",
  layers = 3,
  speed = 0.14,
  window,
  peak = 1,
}: SteamProps) {
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(
    () =>
      Array.from({ length: layers }, (_, i) => {
        const m = createSteamMaterial(new THREE.Color(color));
        m.uniforms.uSpeed.value = speed * (0.8 + i * 0.15);
        m.uniforms.uTime.value = i * 13.0;
        return m;
      }),
    [layers, color, speed]
  );

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);

    let target = intensity;
    if (window) {
      const { progress } = experienceState();
      const [a, b] = window;
      const t = (progress - a) / (b - a);
      target =
        t > 0 && t < 1
          ? Math.min(1, (t < 0.5 ? t / 0.35 : (1 - t) / 0.35)) * peak
          : 0;
    }

    materials.forEach((m, i) => {
      m.uniforms.uTime.value += d * (1 + i * 0.1);
      const layered = Math.max(0, target * (0.9 - i * 0.18));
      m.uniforms.uOpacity.value = THREE.MathUtils.damp(
        m.uniforms.uOpacity.value,
        layered,
        1.8,
        d
      );
    });
    if (group.current) group.current.quaternion.copy(state.camera.quaternion);
  });

  return (
    <group ref={group} position={position}>
      {materials.map((m, i) => (
        <mesh
          key={i}
          position={[(i - (layers - 1) / 2) * 0.35, 0, i * 0.02]}
          scale={scale}
        >
          <planeGeometry args={[1, 1, 1, 1]} />
          <primitive object={m} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

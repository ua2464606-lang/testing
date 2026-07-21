"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * A travelling three-point rig. The key light rides with the camera so the
 * subject is always modelled; ambient and rim warm up as we move into the
 * restaurant. This is what "light slowly appears" in scene 01 resolves to —
 * the key ramps from near-black as the intro progresses.
 */
export function Lights() {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame((state, delta) => {
    const { progress } = experienceState();
    const d = Math.min(delta, 0.05);

    // scene 01: light emerges from darkness
    const intro = Math.min(1, progress / 0.12);
    const warmth = progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.18) : 0;

    if (key.current) {
      key.current.position.set(
        state.camera.position.x + 2,
        state.camera.position.y + 3,
        state.camera.position.z + 1.5
      );
      key.current.intensity = THREE.MathUtils.damp(
        key.current.intensity,
        18 * intro,
        3,
        d
      );
      key.current.color.lerpColors(
        new THREE.Color("#cfe0ff"),
        new THREE.Color("#ffd9a0"),
        warmth
      );
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(
        ambientRef.current.intensity,
        0.15 + intro * 0.2 + warmth * 0.25,
        3,
        d
      );
    }
    if (rim.current) {
      rim.current.intensity = 2 + warmth * 2;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.15} />
      <spotLight
        ref={key}
        position={[2, 4, 3]}
        angle={0.6}
        penumbra={0.9}
        intensity={0}
        distance={40}
        decay={1.5}
        castShadow
      />
      <directionalLight
        ref={rim}
        position={[-4, 2, -6]}
        intensity={2}
        color="#8fb6ff"
      />
    </>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createAtmosphereMaterial } from "@/shaders/materials";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * Inside-out backdrop sphere. Its shader grades the whole environment and its
 * `uWarmth` uniform is eased by scroll so the world temperature drifts from the
 * cold vault (scenes 01–03) into the restaurant's amber heat (scene 04+).
 */
export function Atmosphere() {
  const material = useMemo(() => createAtmosphereMaterial(), []);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const { progress } = experienceState();
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // cold until the restaurant, then warm; cool slightly again in finale
    let warmth = 0;
    if (progress > 0.6) warmth = Math.min(1, (progress - 0.6) / 0.18);
    if (progress > 0.9) warmth = Math.max(0.2, 1 - (progress - 0.9) / 0.1);
    material.uniforms.uWarmth.value = THREE.MathUtils.damp(
      material.uniforms.uWarmth.value,
      warmth,
      2,
      Math.min(delta, 0.05)
    );

    // keep the backdrop centred on the camera so it's always enveloping
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
    }
  });

  return (
    <mesh ref={meshRef} scale={60}>
      <sphereGeometry args={[1, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

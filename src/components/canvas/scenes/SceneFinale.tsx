"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Bucket } from "@/components/canvas/objects/Bucket";
import { ParticleField } from "@/components/canvas/effects/ParticleField";
import { CameraRig } from "@/lib/camera/cameraPath";
import { experienceState } from "@/lib/store/useExperienceStore";
import { SCENES, localProgress } from "@/lib/constants/scenes";

/**
 * FINAL SCENE — The Return.
 * Everything folds back: the bucket reforms at the end of the dolly and scales
 * up from nothing as the camera retreats into black. The logo + CTA live in the
 * DOM overlay above this.
 */
export function SceneFinale() {
  const group = useRef<THREE.Group>(null);
  const scene = useMemo(() => SCENES.find((s) => s.id === "finale")!, []);
  const anchor = useMemo(() => {
    const rig = new CameraRig();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    rig.sample(1.0, pos, target);
    return target;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    const d = Math.min(delta, 0.05);
    const t = localProgress(scene, experienceState().progress);
    const eased = t * t * (3 - 2 * t);
    group.current.visible = t > 0.001;
    group.current.scale.setScalar(
      THREE.MathUtils.damp(group.current.scale.x, 0.3 + eased * 0.9, 5, d)
    );
  });

  return (
    <group ref={group} position={[anchor.x, anchor.y - 0.3, anchor.z]} visible={false}>
      <Bucket position={[0, 0, 0]} />
      <ParticleField
        count={400}
        radius={4}
        color="#e8c98a"
        size={0.03}
        rise={-0.1}
        swirl={0.3}
        opacity={0.5}
      />
    </group>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useImageTexture } from "@/hooks/useImageTexture";
import { HERO_ASSETS } from "@/lib/constants/assets";

interface FryState {
  x: number;
  z: number;
  y: number;
  vy: number;
  spin: number;
  spinSpeed: number;
  scale: number;
}

/**
 * Real fries raining into the bucket. Each fry is a photographic sprite
 * (`fry-sprite.png`) billboarded to the camera with a lightweight ballistic
 * tumble. If the asset is absent this renders nothing at all — we never
 * substitute box geometry for a fry.
 */
export function FallingFries({ count = 40 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { texture, aspect } = useImageTexture(HERO_ASSETS.frySprite);

  const fries = useMemo<FryState[]>(
    () => Array.from({ length: count }, () => spawn()),
    [count]
  );

  function spawn(): FryState {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.5;
    return {
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      y: 2.5 + Math.random() * 3,
      vy: -0.4 - Math.random() * 0.6,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 3,
      scale: 0.4 + Math.random() * 0.3,
    };
  }

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || !texture) return;
    const d = Math.min(delta, 0.05);
    const camQ = state.camera.quaternion;

    for (let i = 0; i < fries.length; i++) {
      const f = fries[i];
      f.vy -= 1.4 * d;
      f.y += f.vy * d;
      f.spin += f.spinSpeed * d;
      if (f.y < 0.1) Object.assign(f, spawn());

      dummy.position.set(f.x, f.y, f.z);
      dummy.quaternion.copy(camQ);
      dummy.rotateZ(f.spin);
      dummy.scale.set(f.scale * aspect, f.scale, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

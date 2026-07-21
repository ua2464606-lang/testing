"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FryState {
  x: number;
  z: number;
  y: number;
  vy: number;
  rot: THREE.Euler;
  rotSpeed: THREE.Vector3;
  len: number;
}

/**
 * Instanced golden fries raining into the bucket. Lightweight ballistic sim:
 * each fry falls under gravity, tumbling, and respawns above the rim once it
 * passes the bucket floor. `active` gates the whole rain so scene 01 can start
 * it as light arrives.
 */
export function FallingFries({
  count = 40,
  active = true,
}: {
  count?: number;
  active?: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const fries = useMemo<FryState[]>(() => {
    return Array.from({ length: count }, () => spawn());
  }, [count]);

  function spawn(): FryState {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.5;
    return {
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      y: 2.5 + Math.random() * 3,
      vy: -0.4 - Math.random() * 0.6,
      rot: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      len: 0.5 + Math.random() * 0.35,
    };
  }

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const d = Math.min(delta, 0.05);

    for (let i = 0; i < fries.length; i++) {
      const f = fries[i];
      if (active) {
        f.vy -= 1.4 * d; // gravity
        f.y += f.vy * d;
        f.rot.x += f.rotSpeed.x * d;
        f.rot.y += f.rotSpeed.y * d;
        f.rot.z += f.rotSpeed.z * d;
        if (f.y < 0.1) Object.assign(f, spawn());
      }
      dummy.position.set(f.x, f.y, f.z);
      dummy.rotation.copy(f.rot);
      dummy.scale.set(0.06, f.len, 0.06);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e8b04a" metalness={0.1} roughness={0.5} />
    </instancedMesh>
  );
}

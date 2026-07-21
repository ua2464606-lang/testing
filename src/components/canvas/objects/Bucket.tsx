"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The Fry Guys bucket, built procedurally: a tapered charcoal vessel with a
 * brushed-gold rim and a dark interior we later fly the camera into. It rotates
 * almost imperceptibly to catch the rim light — the kind of restraint a premium
 * campaign lives on.
 */
export function Bucket({
  position = [0, -0.4, 0],
  rotationSpeed = 0.08,
}: {
  position?: [number, number, number];
  rotationSpeed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += Math.min(delta, 0.05) * rotationSpeed;
      // gentle float
      group.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={group} position={position}>
      {/* outer shell */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 0.72, 1.5, 64, 1, true]} />
        <meshStandardMaterial
          color="#141414"
          metalness={0.35}
          roughness={0.55}
          side={THREE.DoubleSide}
          envMapIntensity={1.1}
        />
      </mesh>

      {/* gold rim */}
      <mesh position={[0, 0.76, 0]}>
        <torusGeometry args={[1.05, 0.035, 24, 80]} />
        <meshStandardMaterial
          color="#d9a441"
          metalness={1}
          roughness={0.28}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* interior — darker, absorbs light so the camera dives into black */}
      <mesh>
        <cylinderGeometry args={[1.0, 0.68, 1.48, 64, 1, true]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.1}
          roughness={0.95}
          side={THREE.BackSide}
        />
      </mesh>

      {/* base */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.04, 64]} />
        <meshStandardMaterial color="#0c0c0c" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* gold accent band (brand stripe) */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.008, 0.85, 0.14, 64, 1, true]} />
        <meshStandardMaterial
          color="#c9992f"
          metalness={0.9}
          roughness={0.35}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { experienceState } from "@/lib/store/useExperienceStore";
import { SCENES, localProgress } from "@/lib/constants/scenes";

const STATIONS = [
  { z: -6.5, color: "#2b7fb8", label: "wash" },
  { z: -7.6, color: "#b8b8c0", label: "cut" },
  { z: -8.7, color: "#c98a2f", label: "season" },
  { z: -9.8, color: "#7fd6f0", label: "freeze" },
  { z: -10.9, color: "#8a5a2b", label: "pack" },
] as const;

/**
 * The production line: a brushed-steel belt running along -Z through five
 * gantry stations. A single potato (the one the camera follows) advances along
 * the belt with `progress`, so the whole journey — wash → cut → season →
 * freeze → pack — reads as one unbroken tracking move.
 */
export function ProductionLine() {
  const potato = useRef<THREE.Mesh>(null);
  const rollers = useRef<THREE.Group>(null);

  const beltZ = useMemo(() => ({ start: -5.5, end: -11.5 }), []);
  const scene = useMemo(() => SCENES.find((s) => s.id === "production")!, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const progress = localProgress(scene, experienceState().progress);
    if (potato.current) {
      const z = THREE.MathUtils.lerp(beltZ.start, beltZ.end, progress);
      potato.current.position.z = z;
      potato.current.rotation.x -= d * 2.2; // rolling
      // squash slightly at the cutter
      const atCut = 1 - Math.min(1, Math.abs(z - -7.6) / 0.6);
      potato.current.scale.setScalar(0.32 * (1 - atCut * 0.25));
    }
    if (rollers.current) rollers.current.rotation.x -= d * 3;
  });

  return (
    <group>
      {/* belt bed */}
      <mesh position={[0, -0.35, -8.5]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.08, 7]} />
        <meshStandardMaterial color="#1b1d20" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* side rails */}
      {[-0.85, 0.85].map((x) => (
        <mesh key={x} position={[x, -0.28, -8.5]}>
          <boxGeometry args={[0.06, 0.16, 7]} />
          <meshStandardMaterial
            color="#3a3d42"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
      ))}

      {/* rollers */}
      <group ref={rollers}>
        {Array.from({ length: 9 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -0.4, -5.6 - i * 0.72]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.09, 0.09, 1.5, 20]} />
            <meshStandardMaterial
              color="#55585e"
              metalness={0.95}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* station gantries */}
      {STATIONS.map((s, i) => (
        <group key={i} position={[0, 0, s.z]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.9, 0.12, 0.12]} />
            <meshStandardMaterial color="#2a2d31" metalness={0.7} roughness={0.4} />
          </mesh>
          {[-0.9, 0.9].map((x) => (
            <mesh key={x} position={[x, 0.1, 0]}>
              <boxGeometry args={[0.1, 0.9, 0.1]} />
              <meshStandardMaterial color="#25282c" metalness={0.7} roughness={0.4} />
            </mesh>
          ))}
          {/* station indicator light */}
          <pointLight
            position={[0, 0.4, 0]}
            color={s.color}
            intensity={3}
            distance={3.5}
            decay={2}
          />
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={2}
            />
          </mesh>
        </group>
      ))}

      {/* the followed potato */}
      <mesh ref={potato} position={[0, -0.15, -5.5]} scale={0.32}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#c9a15a"
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>
    </group>
  );
}

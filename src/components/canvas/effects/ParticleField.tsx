"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeSprite(): THREE.Texture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export interface ParticleFieldProps {
  count?: number;
  /** bounding half-extent of the cube the particles live in */
  radius?: number;
  color?: string;
  size?: number;
  /** upward drift speed */
  rise?: number;
  /** turbulence amount */
  swirl?: number;
  opacity?: number;
  position?: [number, number, number];
}

/**
 * GPU-friendly floating particle field. Reused for cinematic dust (scene 01),
 * frozen crystals (scene 02) and ambient motes elsewhere. Positions drift and
 * wrap inside a cube so the field is effectively infinite and never "runs out".
 */
export function ParticleField({
  count = 600,
  radius = 6,
  color = "#ffffff",
  size = 0.05,
  rise = 0.15,
  swirl = 0.2,
  opacity = 0.6,
  position = [0, 0, 0],
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const sprite = useMemo(() => makeSprite(), []);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * radius;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * radius;
      seeds[i] = Math.random() * 100;
    }
    return { positions, seeds };
  }, [count, radius]);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const d = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const arr = geom.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      arr[i * 3] += Math.sin(t * 0.3 + s) * swirl * d;
      arr[i * 3 + 1] += rise * d;
      arr[i * 3 + 2] += Math.cos(t * 0.25 + s) * swirl * d;
      if (arr[i * 3 + 1] > radius) arr[i * 3 + 1] = -radius;
      if (arr[i * 3] > radius) arr[i * 3] = -radius;
      if (arr[i * 3] < -radius) arr[i * 3] = radius;
      if (arr[i * 3 + 2] > radius) arr[i * 3 + 2] = -radius;
      if (arr[i * 3 + 2] < -radius) arr[i * 3 + 2] = radius;
    }
    geom.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geom} position={position}>
      <pointsMaterial
        map={sprite}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

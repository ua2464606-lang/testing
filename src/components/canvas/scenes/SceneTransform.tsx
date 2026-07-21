"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Product } from "@/components/canvas/objects/Product";
import { ParticleField } from "@/components/canvas/effects/ParticleField";
import { PRODUCTS, type ProductId } from "@/lib/constants/products";
import { CameraRig } from "@/lib/camera/cameraPath";

const MORPH_ORDER: ProductId[] = [
  "curly-fries",
  "waffle-fries",
  "hash-brown",
  "potato-pops",
  "chicken-pops",
  "chicken-seasoned-tender",
];

/**
 * SCENE 05 — The Morph.
 * Every product transforms into the next on a single pedestal. All morph
 * products share one anchor with overlapping reveal windows, so as one fades
 * out the next fades in at the exact same spot — a single sleight of hand.
 */
export function SceneTransform() {
  const items = useMemo(() => {
    const rig = new CameraRig();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    rig.sample(0.86, pos, target);

    const start = 0.8;
    const end = 0.92;
    const span = end - start;
    const n = MORPH_ORDER.length;
    const step = span / n;

    return MORPH_ORDER.map((id, i) => {
      const data = PRODUCTS.find((p) => p.id === id)!;
      const a = start + step * i;
      const b = a + step;
      // overlap windows for crossfade
      return {
        data,
        window: [a - step * 0.4, b + step * 0.4] as [number, number],
        position: [target.x, target.y, target.z] as [number, number, number],
      };
    });
  }, []);

  return (
    <group>
      <ParticleField
        count={260}
        radius={2.5}
        color="#ffd9a0"
        size={0.03}
        rise={0.12}
        swirl={0.25}
        opacity={0.5}
        position={items[0]?.position ?? [0, 0, -19]}
      />
      {items.map((item) => (
        <Product
          key={item.data.id}
          data={item.data}
          window={item.window}
          position={item.position}
          spin={0.3}
        />
      ))}
    </group>
  );
}

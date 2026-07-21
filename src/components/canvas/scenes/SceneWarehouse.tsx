"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Product } from "@/components/canvas/objects/Product";
import { ParticleField } from "@/components/canvas/effects/ParticleField";
import { PRODUCTS } from "@/lib/constants/products";
import { CameraRig } from "@/lib/camera/cameraPath";

/**
 * SCENE 02 — The Cold Vault.
 * Nine products hang frozen in the dark. Each owns a slice of the warehouse
 * scroll window and is placed exactly where the camera is looking during that
 * slice (sampled from the same rig the camera uses), so as we drift the active
 * product is always centred and fills the frame — no cards, no grid.
 */
export function SceneWarehouse() {
  const layout = useMemo(() => {
    const rig = new CameraRig();
    const start = 0.17;
    const end = 0.43;
    const span = end - start;
    const n = PRODUCTS.length;
    const target = new THREE.Vector3();
    const pos = new THREE.Vector3();

    return PRODUCTS.map((data, i) => {
      const a = start + (span * i) / n;
      const b = start + (span * (i + 1)) / n;
      const mid = (a + b) / 2;
      rig.sample(mid, pos, target);
      // small alternating lateral offset for orbit variety
      const sway = (i % 2 === 0 ? 1 : -1) * 0.25;
      return {
        data,
        window: [a - span / n / 2, b + span / n / 2] as [number, number],
        position: [target.x + sway, target.y, target.z] as [
          number,
          number,
          number
        ],
      };
    });
  }, []);

  return (
    <group>
      {/* frozen crystals filling the vault */}
      <ParticleField
        count={700}
        radius={9}
        color="#bcd6f0"
        size={0.03}
        rise={-0.04}
        swirl={0.15}
        opacity={0.5}
        position={[0, 0, -3]}
      />
      {layout.map((item) => (
        <Product
          key={item.data.id}
          data={item.data}
          window={item.window}
          position={item.position}
        />
      ))}
    </group>
  );
}

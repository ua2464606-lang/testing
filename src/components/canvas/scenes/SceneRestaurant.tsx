"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Product } from "@/components/canvas/objects/Product";
import { Steam } from "@/components/canvas/objects/Steam";
import { PRODUCTS } from "@/lib/constants/products";
import { CameraRig } from "@/lib/camera/cameraPath";

/**
 * SCENE 04 — The Heat.
 * Frozen becomes golden. A warm hero portion sits in restaurant light, oil
 * sheen catching the key, thick steam rising. Colour temperature has already
 * swung warm via the Atmosphere + Lights rigs.
 */
export function SceneRestaurant() {
  const anchor = useMemo(() => {
    const rig = new CameraRig();
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    rig.sample(0.71, pos, target);
    return target;
  }, []);

  const hero = PRODUCTS.find((p) => p.id === "classic-fries")!;

  return (
    <group>
      <Product
        data={{ ...hero, accent: "#f6b73c" }}
        window={[0.62, 0.8]}
        position={[anchor.x, anchor.y, anchor.z]}
      />
      <pointLight
        position={[anchor.x + 2, anchor.y + 2, anchor.z + 2]}
        intensity={12}
        color="#ffcf85"
        distance={16}
        decay={2}
      />
      <Steam
        position={[anchor.x, anchor.y + 0.8, anchor.z]}
        scale={[2.4, 3.2, 1]}
        color="#f3e2cf"
        speed={0.16}
        window={[0.62, 0.8]}
        peak={1}
      />
    </group>
  );
}

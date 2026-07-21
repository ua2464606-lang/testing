"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * Loads a product PNG without suspending. If the asset is missing (e.g. real
 * photography hasn't been dropped into /public/products yet) it resolves to
 * null and the caller renders a lit 3D stand-in instead of crashing.
 */
export function useProductTexture(url: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let disposed = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        setTexture(tex);
      },
      undefined,
      () => {
        // asset absent — stay null, caller shows the stand-in
        if (!disposed) setTexture(null);
      }
    );
    return () => {
      disposed = true;
    };
  }, [url]);

  return texture;
}

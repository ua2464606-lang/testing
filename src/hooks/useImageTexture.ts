"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

export interface ImageTextureResult {
  texture: THREE.Texture | null;
  /** natural aspect ratio (w/h) once loaded, else 1 */
  aspect: number;
  loaded: boolean;
}

/**
 * Loads a real image asset (photography / professionally rendered PNG) as a
 * texture without suspending. If the asset is absent it resolves to null and
 * the caller shows a non-geometry light "presence" placeholder instead — we
 * never substitute a geometry primitive for the missing food/product.
 */
export function useImageTexture(url: string | null): ImageTextureResult {
  const [state, setState] = useState<ImageTextureResult>({
    texture: null,
    aspect: 1,
    loaded: false,
  });

  useEffect(() => {
    if (!url) {
      setState({ texture: null, aspect: 1, loaded: false });
      return;
    }
    let disposed = false;
    new THREE.TextureLoader().load(
      url,
      (tex) => {
        if (disposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const img = tex.image as { width: number; height: number };
        const aspect = img?.width && img?.height ? img.width / img.height : 1;
        setState({ texture: tex, aspect, loaded: true });
      },
      undefined,
      () => {
        if (!disposed) setState({ texture: null, aspect: 1, loaded: false });
      }
    );
    return () => {
      disposed = true;
    };
  }, [url]);

  return state;
}

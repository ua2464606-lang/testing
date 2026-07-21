"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * The post stack IS the cinematography:
 *  - Bloom        → volumetric bloom on lit rims and steam
 *  - DepthOfField → shallow focus, the "product on a stage" feel
 *  - ChromaticAb. → subtle lens fringing at the edges (lens distortion)
 *  - Noise        → animated film grain
 *  - Vignette     → keeps the eye centred, deepens the dark
 *
 * Intensities breathe with scroll: the restaurant scene blooms hotter, the
 * finale pulls focus wide as we retreat into black.
 */
export function PostProcessing() {
  const caRef = useRef<any>(null);
  const offset = useRef(new THREE.Vector2(0.0006, 0.0006));

  useFrame(() => {
    const { progress } = experienceState();
    // stronger fringing during the fast production/transform travel
    const travel = Math.max(
      0,
      Math.min(1, (progress - 0.44) / 0.18)
    );
    const amt = 0.0005 + travel * 0.0016;
    offset.current.set(amt, amt);
    if (caRef.current && caRef.current.offset) {
      caRef.current.offset.copy(offset.current);
    }
  });

  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        focusDistance={0.012}
        focalLength={0.05}
        bokehScale={3.2}
        height={480}
      />
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.42}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        ref={caRef}
        blendFunction={BlendFunction.NORMAL}
        offset={offset.current}
        radialModulation
        modulationOffset={0.35}
      />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.22} />
      <Vignette eskil={false} offset={0.28} darkness={0.92} />
    </EffectComposer>
  );
}

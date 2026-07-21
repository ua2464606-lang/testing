"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

import { CinematicCamera } from "./camera/CinematicCamera";
import { Lights } from "./objects/Lights";
import { Atmosphere } from "./objects/Atmosphere";
import { PostProcessing } from "./effects/PostProcessing";

import { SceneEmergence } from "./scenes/SceneEmergence";
import { SceneWarehouse } from "./scenes/SceneWarehouse";
import { SceneProduction } from "./scenes/SceneProduction";
import { SceneRestaurant } from "./scenes/SceneRestaurant";
import { SceneTransform } from "./scenes/SceneTransform";
import { SceneFinale } from "./scenes/SceneFinale";

/**
 * The single WebGL stage. One fixed full-screen canvas holds the entire film;
 * every scene is mounted at once in world space and self-animates from the
 * shared scroll store, so there are no mounts/unmounts (and no hitches) as the
 * camera dollies from scene to scene.
 *
 * The environment map is built procedurally from Lightformers — no external
 * HDR fetch — so reflections look premium with zero network dependency.
 */
export function Experience() {
  return (
    <Canvas
      className="webgl-canvas"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 42, near: 0.1, far: 200, position: [0, 0.6, 9.5] }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#050505", 10, 46]} />

      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer
            intensity={1.4}
            position={[4, 3, 4]}
            scale={[8, 8, 1]}
            color="#ffe6c0"
          />
          <Lightformer
            intensity={0.9}
            position={[-5, 1, -3]}
            scale={[6, 6, 1]}
            color="#9fc3ff"
          />
          <Lightformer
            intensity={0.6}
            position={[0, -4, 2]}
            scale={[10, 4, 1]}
            color="#402a12"
          />
        </Environment>

        <Atmosphere />
        <Lights />
        <CinematicCamera />

        <SceneEmergence />
        <SceneWarehouse />
        <SceneProduction />
        <SceneRestaurant />
        <SceneTransform />
        <SceneFinale />

        <PostProcessing />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

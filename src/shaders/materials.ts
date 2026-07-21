import * as THREE from "three";
import { steamVertexShader, steamFragmentShader } from "./steam.glsl";
import {
  atmosphereVertexShader,
  atmosphereFragmentShader,
} from "./atmosphere.glsl";

/**
 * Imperative material factories. Built as raw ShaderMaterials and attached via
 * <primitive object={mat} attach="material" /> so we avoid JSX intrinsic
 * typing gymnastics while keeping all GLSL in the shaders/ folder.
 */

export function createSteamMaterial(color = new THREE.Color("#cfd8e3")) {
  return new THREE.ShaderMaterial({
    vertexShader: steamVertexShader,
    fragmentShader: steamFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: color },
      uSpeed: { value: 0.12 },
    },
  });
}

export function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uWarmth: { value: 0 },
      uGlow: { value: 0.6 },
    },
  });
}

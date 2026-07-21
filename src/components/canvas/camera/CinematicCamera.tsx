"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "@/lib/camera/cameraPath";
import { experienceState } from "@/lib/store/useExperienceStore";

/**
 * Drives the default camera along the cinematic dolly path.
 *
 * Every frame it samples the rig at the current scroll progress, then critically
 * damps toward that pose. Damping is what makes the motion feel physical: the
 * camera has momentum and never snaps, even if the scroll value jumps.
 * A tiny pointer-driven parallax adds handheld life without breaking continuity.
 */
export function CinematicCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const rig = useMemo(() => new CameraRig(), []);

  const targetPos = useRef(new THREE.Vector3(0, 0.6, 9.5));
  const targetLook = useRef(new THREE.Vector3(0, 0.2, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0.2, 0));
  const parallax = useRef(new THREE.Vector2(0, 0));

  useFrame((_, delta) => {
    const { progress, pointer, reducedMotion } = experienceState();
    const d = Math.min(delta, 0.05); // clamp on tab refocus

    const fov = rig.sample(progress, targetPos.current, targetLook.current);

    // pointer parallax (disabled under reduced motion)
    const px = reducedMotion ? 0 : pointer.x * 0.18;
    const py = reducedMotion ? 0 : -pointer.y * 0.12;
    parallax.current.x = THREE.MathUtils.damp(parallax.current.x, px, 3, d);
    parallax.current.y = THREE.MathUtils.damp(parallax.current.y, py, 3, d);

    // critically damped follow — the source of the "cinematic weight"
    const lambda = reducedMotion ? 12 : 3.4;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetPos.current.x + parallax.current.x,
      lambda,
      d
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetPos.current.y + parallax.current.y,
      lambda,
      d
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetPos.current.z,
      lambda,
      d
    );

    currentLook.current.x = THREE.MathUtils.damp(
      currentLook.current.x,
      targetLook.current.x + parallax.current.x * 0.5,
      lambda,
      d
    );
    currentLook.current.y = THREE.MathUtils.damp(
      currentLook.current.y,
      targetLook.current.y + parallax.current.y * 0.5,
      lambda,
      d
    );
    currentLook.current.z = THREE.MathUtils.damp(
      currentLook.current.z,
      targetLook.current.z,
      lambda,
      d
    );
    camera.lookAt(currentLook.current);

    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 2.5, d);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

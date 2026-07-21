"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGlowTexture } from "@/lib/three/textures";
import { useExperienceStore, experienceState } from "@/lib/store/useExperienceStore";

/**
 * Real footage as a hero, rendered inside the WebGL stage.
 *
 * The mp4 is bound to a THREE.VideoTexture on a camera-facing plate, so the
 * cinematic dolly, film grain, vignette, chromatic aberration, dust and steam
 * all composite over real film — it stays part of the single continuous shot
 * rather than a flat DOM background.
 *
 * Autoplay respects browser policy: the video is muted + playsInline, and play
 * is (re)attempted once the user has entered the experience (a real gesture).
 * If the file is missing or can't decode, a soft warm light presence renders
 * instead — never a geometry stand-in.
 */
export function VideoPlate({
  src,
  position = [0, 0.1, 0],
  height = 5,
  window: win,
}: {
  src: string;
  position?: [number, number, number];
  height?: number;
  window: [number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const plate = useRef<THREE.Mesh>(null);
  const plateMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);

  const entered = useExperienceStore((s) => s.entered);
  const [aspect, setAspect] = useState(1);
  const [ok, setOk] = useState(false);
  const glowTex = useMemo(() => createGlowTexture("#f0c98a"), []);

  const video = useMemo(() => {
    if (typeof document === "undefined") return null;
    const v = document.createElement("video");
    v.src = src;
    v.loop = true;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.crossOrigin = "anonymous";
    return v;
  }, [src]);

  const texture = useMemo(() => {
    if (!video) return null;
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [video]);

  // load / decode lifecycle
  useEffect(() => {
    if (!video) return;
    const onMeta = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspect(video.videoWidth / video.videoHeight);
        setOk(true);
      }
    };
    const onErr = () => setOk(false);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("error", onErr);
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("error", onErr);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [video]);

  // (re)attempt playback once entered
  useEffect(() => {
    if (!video || !ok) return;
    if (entered) video.play().catch(() => {});
    else video.play().catch(() => {}); // muted autoplay may already be allowed
  }, [video, ok, entered]);

  useFrame((state, delta) => {
    void delta;
    const g = group.current;
    if (!g) return;

    const { progress } = experienceState();
    const t = (progress - win[0]) / (win[1] - win[0]);
    // long plateau: emerge in, hold, dissolve as camera enters the bucket
    const fadeIn = THREE.MathUtils.smoothstep(t, 0.0, 0.12);
    const fadeOut = 1 - THREE.MathUtils.smoothstep(t, 0.82, 1.0);
    const reveal = Math.max(0, Math.min(1, fadeIn * fadeOut));

    g.visible = reveal > 0.001;
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;

    if (plate.current) plate.current.quaternion.copy(state.camera.quaternion);
    if (plateMat.current) plateMat.current.opacity = reveal;
    if (glowMat.current)
      glowMat.current.opacity = reveal * 0.55 * (0.9 + 0.1 * Math.sin(state.clock.elapsedTime));
  });

  const showVideo = !!texture && ok;
  const w = height * aspect;

  return (
    <group ref={group} position={position} visible={false}>
      {showVideo ? (
        <mesh ref={plate}>
          <planeGeometry args={[w, height]} />
          <meshBasicMaterial
            ref={plateMat}
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : (
        <mesh ref={plate}>
          <planeGeometry args={[height * 1.3, height * 1.3]} />
          <meshBasicMaterial
            ref={glowMat}
            map={glowTex}
            color="#f0c98a"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

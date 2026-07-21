import * as THREE from "three";

/**
 * A soft radial glow sprite. This is a *light* primitive (an additive bloom
 * billboard), not geometry standing in for food. It is used both by the
 * particle fields and as the non-geometry "presence" placeholder shown where a
 * product photograph will sit until the real asset is supplied.
 */
export function createGlowTexture(inner = "#ffffff"): THREE.Texture {
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, inner);
  g.addColorStop(0.35, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

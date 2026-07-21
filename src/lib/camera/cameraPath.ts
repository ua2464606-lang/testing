import * as THREE from "three";

/**
 * The cinematic dolly path.
 *
 * We define a handful of keyframes (position, look-at target, fov) pinned to
 * points on the global progress axis. Positions and targets are turned into
 * Catmull-Rom curves so sampling at any progress yields a smooth, continuous
 * pose — the camera is always *travelling*, never cutting.
 */

export interface CameraKeyframe {
  /** progress at which this pose is reached, 0..1 */
  at: number;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// Hand-tuned to read as one push-in through the six scenes.
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // 01 — emergence: far, low, pushing slowly toward the bucket in the dark
  { at: 0.0, position: [0, 0.6, 9.5], target: [0, 0.2, 0], fov: 42 },
  { at: 0.14, position: [0, 0.4, 4.6], target: [0, 0.1, 0], fov: 40 },
  // 02 — warehouse: we cross the rim into the cold vault, drifting sideways
  { at: 0.22, position: [0, 0.0, 1.4], target: [0, 0, -2], fov: 46 },
  { at: 0.34, position: [2.4, 0.3, -1.2], target: [0, 0, -3.5], fov: 50 },
  { at: 0.44, position: [-2.2, -0.2, -3.0], target: [0, 0, -5], fov: 48 },
  // 03 — production line: tracking laterally alongside the belt
  { at: 0.53, position: [4.5, 0.4, -6.0], target: [0.5, 0, -7], fov: 44 },
  { at: 0.62, position: [1.0, 0.2, -9.5], target: [0, 0.1, -11], fov: 42 },
  // 04 — restaurant heat: settle, warm, closer
  { at: 0.71, position: [0, 0.1, -12.6], target: [0, 0, -14], fov: 38 },
  { at: 0.8, position: [-1.4, 0.3, -15.3], target: [0, 0.1, -16.5], fov: 40 },
  // 05 — transform: orbit-ish sweep around the morph pedestal
  { at: 0.86, position: [2.2, 0.2, -18.2], target: [0, 0, -19.5], fov: 44 },
  { at: 0.92, position: [0, 0.4, -21.0], target: [0, 0.1, -22.5], fov: 42 },
  // 06 — finale: pull back into the dark, logo centred
  { at: 0.97, position: [0, 0.3, -24.5], target: [0, 0.1, -26], fov: 40 },
  { at: 1.0, position: [0, 0.4, -27.5], target: [0, 0.1, -28.5], fov: 46 },
];

export class CameraRig {
  private posCurve: THREE.CatmullRomCurve3;
  private targetCurve: THREE.CatmullRomCurve3;
  private ats: number[];
  private fovs: number[];

  constructor(keyframes: CameraKeyframe[] = CAMERA_KEYFRAMES) {
    const sorted = [...keyframes].sort((a, b) => a.at - b.at);
    this.ats = sorted.map((k) => k.at);
    this.fovs = sorted.map((k) => k.fov);
    this.posCurve = new THREE.CatmullRomCurve3(
      sorted.map((k) => new THREE.Vector3(...k.position)),
      false,
      "centripetal",
      0.5
    );
    this.targetCurve = new THREE.CatmullRomCurve3(
      sorted.map((k) => new THREE.Vector3(...k.target)),
      false,
      "centripetal",
      0.5
    );
  }

  /** Map global progress → curve parameter u, respecting keyframe spacing. */
  private toU(progress: number): number {
    const ats = this.ats;
    const n = ats.length;
    if (progress <= ats[0]) return 0;
    if (progress >= ats[n - 1]) return 1;
    for (let i = 0; i < n - 1; i++) {
      if (progress >= ats[i] && progress <= ats[i + 1]) {
        const span = ats[i + 1] - ats[i] || 1e-6;
        const localT = (progress - ats[i]) / span;
        return (i + localT) / (n - 1);
      }
    }
    return 1;
  }

  private fovAt(progress: number): number {
    const ats = this.ats;
    const n = ats.length;
    if (progress <= ats[0]) return this.fovs[0];
    if (progress >= ats[n - 1]) return this.fovs[n - 1];
    for (let i = 0; i < n - 1; i++) {
      if (progress >= ats[i] && progress <= ats[i + 1]) {
        const span = ats[i + 1] - ats[i] || 1e-6;
        const t = (progress - ats[i]) / span;
        // smoothstep for gentle fov breathing
        const s = t * t * (3 - 2 * t);
        return THREE.MathUtils.lerp(this.fovs[i], this.fovs[i + 1], s);
      }
    }
    return this.fovs[n - 1];
  }

  sample(
    progress: number,
    outPos: THREE.Vector3,
    outTarget: THREE.Vector3
  ): number {
    const u = this.toU(progress);
    this.posCurve.getPoint(u, outPos);
    this.targetCurve.getPoint(u, outTarget);
    return this.fovAt(progress);
  }
}

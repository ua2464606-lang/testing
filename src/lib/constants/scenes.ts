/**
 * Scene map for the single continuous shot.
 *
 * The whole site is one normalized scroll axis: progress ∈ [0, 1].
 * Each scene owns a contiguous slice of that axis. Because the slices are
 * contiguous (no gaps), the camera path — which is sampled from the same
 * progress value — never teleports between scenes.
 */

export type SceneId =
  | "emergence" // 01
  | "warehouse" // 02
  | "production" // 03
  | "restaurant" // 04
  | "transform" // 05
  | "finale";

export interface SceneDef {
  id: SceneId;
  index: number;
  /** Inclusive start / exclusive end on the global progress axis. */
  start: number;
  end: number;
  /** Roman numeral shown in the editorial overlay. */
  numeral: string;
  overline: string;
  title: string;
  caption: string;
}

export const SCENES: SceneDef[] = [
  {
    id: "emergence",
    index: 0,
    start: 0.0,
    end: 0.16,
    numeral: "01",
    overline: "The Arrival",
    title: "From the dark,\na bucket.",
    caption: "Real fries fall. Steam rises. The camera begins to breathe.",
  },
  {
    id: "warehouse",
    index: 1,
    start: 0.16,
    end: 0.44,
    numeral: "02",
    overline: "The Cold Vault",
    title: "Nine forms\nof gold.",
    caption: "Frozen, suspended, weightless. Orbit each one.",
  },
  {
    id: "production",
    index: 2,
    start: 0.44,
    end: 0.62,
    numeral: "03",
    overline: "The Line",
    title: "Follow\nthe potato.",
    caption: "Wash. Cut. Season. Freeze. Pack. One unbroken move.",
  },
  {
    id: "restaurant",
    index: 3,
    start: 0.62,
    end: 0.8,
    numeral: "04",
    overline: "The Heat",
    title: "Frozen becomes\ngolden.",
    caption: "Oil shine. Rising steam. The moment of crisp.",
  },
  {
    id: "transform",
    index: 4,
    start: 0.8,
    end: 0.92,
    numeral: "05",
    overline: "The Morph",
    title: "One form\ninto the next.",
    caption: "Curly, waffle, hash, pop, tender — a single sleight of hand.",
  },
  {
    id: "finale",
    index: 5,
    start: 0.92,
    end: 1.0,
    numeral: "06",
    overline: "The Return",
    title: "Fry Guys.",
    caption: "Everything folds back into the dark.",
  },
];

export const getSceneAt = (progress: number): SceneDef => {
  for (const scene of SCENES) {
    if (progress >= scene.start && progress < scene.end) return scene;
  }
  return SCENES[SCENES.length - 1];
};

/** Local progress inside a scene, 0..1. */
export const localProgress = (scene: SceneDef, progress: number): number => {
  const t = (progress - scene.start) / (scene.end - scene.start);
  return Math.min(1, Math.max(0, t));
};

/** Total scroll length of the experience, in viewport heights. */
export const SCROLL_HEIGHT_VH = 760;

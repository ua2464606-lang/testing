import { create } from "zustand";
import { getSceneAt, type SceneId } from "@/lib/constants/scenes";

interface ExperienceState {
  /** Global normalized scroll progress, 0..1. Written by the Lenis loop. */
  progress: number;
  /** Currently active scene id (derived, but cached for the DOM overlay). */
  activeScene: SceneId;
  /** Asset / warm-up gate for the intro loader. */
  ready: boolean;
  /** Whether the WebGL experience has been entered (post-loader). */
  entered: boolean;
  /** Pointer in normalized device-ish coords, for parallax. -1..1 */
  pointer: { x: number; y: number };
  /** Coarse reduced-motion / low-power flag. */
  reducedMotion: boolean;

  setProgress: (p: number) => void;
  setReady: (v: boolean) => void;
  setEntered: (v: boolean) => void;
  setPointer: (x: number, y: number) => void;
  setReducedMotion: (v: boolean) => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  progress: 0,
  activeScene: "emergence",
  ready: false,
  entered: false,
  pointer: { x: 0, y: 0 },
  reducedMotion: false,

  setProgress: (p) => {
    const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
    const next = getSceneAt(clamped).id;
    if (next !== get().activeScene) {
      set({ progress: clamped, activeScene: next });
    } else {
      set({ progress: clamped });
    }
  },
  setReady: (v) => set({ ready: v }),
  setEntered: (v) => set({ entered: v }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
}));

/** Non-reactive accessor for use inside useFrame (avoids re-renders). */
export const experienceState = useExperienceStore.getState;

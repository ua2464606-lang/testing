# Fry Guys — A Cinematic in Six Moves

An immersive, scroll-driven WebGL storytelling experience for the premium
frozen-food brand **Fry Guys**. The entire site is a *single continuous shot*:
scrolling dollies a virtual camera through six connected scenes. No pages, no
grid, no cards — one film.

> This is not an e-commerce site, a landing page, a dashboard, or a theme.

## The film

| # | Scene | What happens |
|---|-------|--------------|
| 01 | **Emergence** | A bucket rises from black; light ramps in; real fries rain in; steam lifts. |
| 02 | **The Cold Vault** | Nine products hang frozen; the camera drifts and each fills the frame. |
| 03 | **The Line** | The camera tracks one potato down the belt: wash → cut → season → freeze → pack. |
| 04 | **The Heat** | Frozen becomes golden; the world warms; oil sheen and thick steam. |
| 05 | **The Morph** | Each product transforms into the next on a single pedestal. |
| 06 | **The Return** | Everything folds back; the bucket reforms; logo + CTA; back to black. |

## Architecture

The build is deliberately modular — camera, timeline, shaders and scenes are all
separated.

```
src/
├─ app/                      # Next.js App Router (layout, page, globals.css)
├─ components/
│  ├─ canvas/                # everything inside the WebGL <Canvas>
│  │  ├─ Experience.tsx      # the single stage; mounts all scenes at once
│  │  ├─ camera/             # CinematicCamera — damped follow of the dolly path
│  │  ├─ effects/            # PostProcessing, ParticleField
│  │  ├─ objects/            # Bucket, Product, Steam, ProductionLine, Lights, Atmosphere
│  │  └─ scenes/             # Scene01…Finale orchestrators
│  ├─ dom/                   # editorial overlay: Loader, Hud, SceneOverlay, Prompts, AmbientDust
│  └─ ui/                    # ExperienceRoot composition
├─ lib/
│  ├─ camera/cameraPath.ts   # keyframed Catmull-Rom dolly (the "no teleport" guarantee)
│  ├─ constants/             # products + scene map (the timeline source of truth)
│  ├─ gsap/                  # single plugin registration
│  ├─ scroll/                # Lenis provider — the only reader of window scroll
│  └─ store/                 # zustand store shared by DOM + WebGL frame loop
├─ shaders/                  # GLSL: steam, atmosphere (+ material factories)
├─ hooks/                    # useProductTexture (graceful asset fallback)
└─ fonts/                    # licensed-font wiring instructions
```

### How continuity works

There is **one** source of scroll truth: `SmoothScrollProvider` (Lenis) writes a
normalized `progress ∈ [0,1]` into a zustand store every frame. Both the DOM
overlay and the WebGL camera read that same value, so they are frame-locked.

The camera samples a **Catmull-Rom curve** (`CameraRig`) at `progress` and then
*critically damps* toward that pose — it always has momentum and never snaps,
which is what sells the "one unbroken move" feeling. Because the six scenes own
contiguous slices of the same axis, crossing a boundary is just the curve
continuing.

Every scene is mounted at all times and **self-animates** by reading the store
inside `useFrame`, so scrolling triggers no React re-renders in the hot path.

## Tech

Next.js 15 · TypeScript · Tailwind CSS v4 · React Three Fiber + drei ·
`@react-three/postprocessing` (bloom / DOF / grain / vignette / chromatic
aberration) · custom GLSL · GSAP + ScrollTrigger + MotionPath · Lenis · zustand
· tsParticles · Framer Motion (micro-interactions) · Lucide.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Assets & fonts (read these)

- **Product photography** → `public/products/README.md`. Real, campaign-grade
  transparent PNGs. Until present, a lit 3D stand-in renders so nothing breaks.
- **Fonts** → `src/fonts/README.md`. Neue Montreal / PP Editorial New / Satoshi
  / Geist are licensed and not committed; the CSS names them first and falls
  back gracefully, upgrading automatically once the faces are added.

## Deployment

Zero-config on **Vercel**. The procedural environment map (Lightformers) means
reflections need no external HDR fetch.

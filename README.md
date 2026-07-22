# FormulaeAI — Your AI Marketing Employee

A cinematic, scroll-driven editorial site for **FormulaeAI**, an AI that behaves
like a full-time marketing employee for local businesses. The site is not a SaaS
landing page — it is an experiential film that unfolds as you scroll: premium,
calm, confident, minimal. Deep charcoal backgrounds, a single warm-gold accent,
an editorial serif paired with a clean grotesk, and motion that reveals like a
film rather than a website.

> No dashboards. No feature grids. No stock SaaS gradients. One accent colour.

## The film — scroll is the story

The page is a single continuous scroll journey, cut into acts:

| Act | Title | What happens |
|-----|-------|--------------|
| 0 | **Opening** | Full-bleed intro. "Your AI Marketing Employee" resolves line by line over a slow light-sweep and drifting dust. A scroll cue, nothing else. |
| 1 | **The Problem** | A pinned frame. One line at a time surfaces and dissolves like film subtitles — the exhausting cycle of hiring designers, editors, media buyers. |
| 2 | **The Discovery** | Pinned. A scan line sweeps as a brand-profile card assembles itself from the business's site, logo, palette, voice and feed. |
| 3 | **The Creation** | Pinned. A phone builds a post in-brand: the image resolves from a mask, the caption types itself (driven by scroll), hashtags settle in. |
| 4 | **The Gift** | An email composes into view with the finished sample attached. The beat lands: *"No pitch. Just proof."* |
| 5 | **The Partnership** | A calm montage of what continues after approval — calendar, reels, captions, campaigns, optimisation, reports — as refined line-icons. |
| 6 | **The Philosophy** | A held, full-screen statement: *"It should never feel like software. It should feel like hiring someone who never sleeps."* |
| 7 | **Who it's for** | An editorial lookbook. On desktop it pins and scrolls horizontally through business types; on mobile it stacks vertically. |
| 8 | **Closing** | The tagline returns line by line. One calm call-to-action. |

## Motion & craft

- **Scroll-linked**, not just fade-on-view: opacity, transform, scale and even
  caption typing are driven by scroll progress (Framer Motion `useScroll` /
  `useTransform`).
- **Pinned scrollytelling** for Acts 2, 3 and 7 — visuals hold while content
  scrubs (GSAP ScrollTrigger for the horizontal lookbook pin).
- **Smooth scroll** via Lenis so the whole page reads as one film reel, with
  GSAP kept frame-locked to it.
- **Cursor-aware parallax** on the hero (desktop only), weighted with a lerp so
  it reads as depth, not lag.
- Cinematic easing throughout (expo-out / ease-in-out — no bounce), film grain,
  animated letterbox bars, and a whisper-thin gold progress line.
- Fully **responsive** (pins collapse to vertical reveals on mobile) and
  **`prefers-reduced-motion`** aware (frames hold, movement drops).

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx              # fonts (Fraunces + Inter), metadata, smooth-scroll provider
│  ├─ page.tsx                # sequences the nine acts into one film
│  └─ globals.css             # the entire cinematic design system + tokens
├─ components/
│  ├─ acts/                   # Act0Hero … Act8Closing — one module per act
│  └─ shared/                 # Atmosphere (grain/letterbox), AmbientField (canvas dust),
│                             #   ProgressLine, Primitives (eyebrow/reveal/mask-lines),
│                             #   ScrollPiece (scroll-linked reveal), LineIcons
└─ lib/
   ├─ content.ts              # all narrative copy in one place
   ├─ motion.ts               # shared easing curves + reveal variants
   ├─ gsap/register.ts        # single GSAP plugin registration
   └─ scroll/                 # Lenis provider + pointer/reduced-motion context
```

## Design language

- **Palette** — deep charcoal (`#0a0a0b`) with a single refined warm gold
  (`#c6a15b`) used sparingly, on warm off-white type.
- **Type** — [Fraunces](https://fonts.google.com/specimen/Fraunces) (editorial
  serif, high optical contrast) for headlines; [Inter](https://fonts.google.com/specimen/Inter)
  (clean neo-grotesque) for body and labels. Loaded via `next/font`.
- **Visuals are drawn, not stock** — the brand card, the Instagram post's
  "photo", the email attachments and the lookbook plates are all composed from
  CSS gradients in brand tones. No screenshots, no stock imagery.

## Tech

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion ·
GSAP + ScrollTrigger · Lenis · `next/font`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Deployment

Zero-config on **Vercel**. Fonts are self-hosted at build time via `next/font`,
so there is no runtime font fetch.

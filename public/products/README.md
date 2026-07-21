# Food & product assets — real imagery only

**Hard rule:** the food and products are shown **only** as real photography or
professionally rendered assets. The 3D layer never uses geometry primitives
(spheres, boxes, cylinders, cones, low-poly meshes) to represent food. Three.js
here is limited to camera, lighting, particles, steam/smoke, lens distortion,
depth, post-processing and movement.

Until the assets below are present, each food slot renders a **non-geometry
light presence** (a soft accent glow) plus the product's name as editorial type
— never a stand-in shape.

## Product plates (nine)

Transparent PNGs, named exactly to match `src/lib/constants/products.ts`:

```
classic-fries.png
curly-fries.png
seasoned-curly-fries.png
waffle-fries.png
seasoned-waffle-fries.png
hash-brown.png
potato-pops.png
chicken-pops.png
chicken-seasoned-tender.png
```

## Hero assets (three)

Referenced from `src/lib/constants/assets.ts`:

```
bucket.png        # the hero Fry Guys bucket, lit on black (scenes 01 + finale)
fry-sprite.png    # a single fry, used for the falling-fries rain (scene 01)
potato.png        # a whole potato, travels the production line (scene 03)
```

## Guidance for a premium, campaign-grade result

- **Real commercial food photography / rendered assets only** — no
  illustrations, CSS, SVG, cartoon or procedural geometry. Think McDonald's
  premium, KFC, Farm Frites, Lamb Weston.
- Transparent PNG, ~2000 px on the long edge, colour-graded warm.
- Shot on black / dark studio sweep so it composites into the dark stage.
- Consistent lighting direction across all nine plates so the morph in Scene 05
  reads as one continuous object.

As soon as a matching PNG is present it is picked up automatically — see
`src/hooks/useImageTexture.ts`. No code changes required.

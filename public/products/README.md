# Product photography

Drop **photorealistic, transparent-background PNGs** here, named exactly to
match `src/lib/constants/products.ts`:

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

Guidance for a premium, campaign-grade result:

- **Real commercial food photography only** — no illustrations, CSS, SVG or
  cartoon renders. Think McDonald's premium, KFC, Farm Frites, Lamb Weston.
- Transparent PNG, ~2000 px on the long edge, colour-graded warm.
- Shot on black or against a dark studio sweep so it composites into the vault.
- Consistent lighting direction across all nine so the morph in Scene 05 reads
  as one continuous object.

Until these exist, the 3D layer renders a lit stand-in per product (a faceted
form tinted with the product's accent colour) so nothing ever appears broken —
the loader and scenes work end-to-end without the assets. As soon as a matching
PNG is present it is picked up automatically (see
`src/hooks/useProductTexture.ts`).

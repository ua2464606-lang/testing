/**
 * Non-catalogue hero image assets. Like the products, these are **real
 * photography / professionally rendered PNGs** dropped into /public — never
 * geometry. Until present, the scenes render a non-geometry light presence and
 * lean on the atmospheric systems (particles, steam, light) that Three.js is
 * allowed to drive.
 *
 * Required transparent PNGs (see public/products/README.md):
 *   /products/bucket.png        — the hero Fry Guys bucket, lit on black
 *   /products/fry-sprite.png    — a single fry, for the falling-fries rain
 *   /products/potato.png        — a whole potato, for the production line
 */
export const HERO_ASSETS = {
  bucket: "/products/bucket.png",
  frySprite: "/products/fry-sprite.png",
  potato: "/products/potato.png",
} as const;

/**
 * Product catalogue for the Fry Guys experience.
 *
 * `image` points at a photorealistic PNG that must live under
 * `public/products/`. These are intentionally *not* committed — drop real
 * commercial photography (transparent PNG, ~2000px, colour-graded) into that
 * folder. Until then the 3D layer renders a lit stand-in so the scene never
 * shows a broken asset. See `public/products/README.md`.
 */

export type ProductId =
  | "classic-fries"
  | "curly-fries"
  | "seasoned-curly-fries"
  | "waffle-fries"
  | "seasoned-waffle-fries"
  | "hash-brown"
  | "potato-pops"
  | "chicken-pops"
  | "chicken-seasoned-tender";

export interface Product {
  id: ProductId;
  name: string;
  /** Editorial one-liner, kept deliberately sparse. */
  tagline: string;
  /** Path under /public. */
  image: string;
  /** Accent colour used for grading / light tint in the 3D scene. */
  accent: string;
  /** Short descriptor shown as an overline. */
  category: "Potato" | "Chicken";
}

export const PRODUCTS: Product[] = [
  {
    id: "classic-fries",
    name: "Classic Fries",
    tagline: "The original cut. Nothing to hide behind.",
    image: "/products/classic-fries.png",
    accent: "#f4b942",
    category: "Potato",
  },
  {
    id: "curly-fries",
    name: "Curly Fries",
    tagline: "Spiralled for the perfect crunch geometry.",
    image: "/products/curly-fries.png",
    accent: "#e8a63a",
    category: "Potato",
  },
  {
    id: "seasoned-curly-fries",
    name: "Seasoned Curly Fries",
    tagline: "Spice-dusted spirals. Loud on purpose.",
    image: "/products/seasoned-curly-fries.png",
    accent: "#d98324",
    category: "Potato",
  },
  {
    id: "waffle-fries",
    name: "Waffle Fries",
    tagline: "Lattice-cut. Engineered for dip.",
    image: "/products/waffle-fries.png",
    accent: "#f0b64a",
    category: "Potato",
  },
  {
    id: "seasoned-waffle-fries",
    name: "Seasoned Waffle Fries",
    tagline: "A grid of flavour. Every square counts.",
    image: "/products/seasoned-waffle-fries.png",
    accent: "#cf7a24",
    category: "Potato",
  },
  {
    id: "hash-brown",
    name: "Hash Brown",
    tagline: "Golden slab. Crisp perimeter, tender core.",
    image: "/products/hash-brown.png",
    accent: "#e0a34a",
    category: "Potato",
  },
  {
    id: "potato-pops",
    name: "Potato Pops",
    tagline: "Bite-size. Impossible to stop.",
    image: "/products/potato-pops.png",
    accent: "#f2c14e",
    category: "Potato",
  },
  {
    id: "chicken-pops",
    name: "Chicken Pops",
    tagline: "Poppable protein. Craft-battered.",
    image: "/products/chicken-pops.png",
    accent: "#e3a857",
    category: "Chicken",
  },
  {
    id: "chicken-seasoned-tender",
    name: "Chicken Seasoned Tender",
    tagline: "Whole-muscle tender. Seasoned to the bone.",
    image: "/products/chicken-seasoned-tender.png",
    accent: "#d98f45",
    category: "Chicken",
  },
];

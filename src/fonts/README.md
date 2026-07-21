# Fonts

The design targets **Neue Montreal**, **PP Editorial New**, **Satoshi** and
**Geist**. These are commercial / licensed families, so their font files are
**not** committed here.

The stylesheet (`src/app/globals.css`) declares a font stack that *names these
families first* and falls back to a high-quality system stack, so the layout is
correct immediately and upgrades automatically once the real faces are present.

## To wire up the real faces

1. Drop the licensed `.woff2` files into this folder.
2. Register them with `next/font/local` in `src/app/layout.tsx`, e.g.

   ```ts
   import localFont from "next/font/local";

   const editorial = localFont({
     src: "../fonts/PPEditorialNew-Regular.woff2",
     variable: "--font-editorial",
   });
   const sans = localFont({
     src: [
       { path: "../fonts/NeueMontreal-Regular.woff2", weight: "400" },
       { path: "../fonts/NeueMontreal-Medium.woff2", weight: "500" },
     ],
     variable: "--font-sans",
   });
   ```

3. Add the `variable` class names to `<html>` and the CSS variables below will
   pick them up.

`Geist` can alternatively be installed via `npm i geist` and imported from
`geist/font/sans` without shipping files.

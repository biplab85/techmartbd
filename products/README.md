# Product photographs

Every banner draws its products from this folder. Until a photo is present the
banner falls back to the built-in vector art in `../assets.js`, so all twenty
PNGs render complete either way — but real photography is what makes them look
like the reference strip.

## Drop files here

Use these exact names. Anything named differently is ignored.

| File            | Product                | Used on banners            |
|-----------------|------------------------|----------------------------|
| `watch.png`     | Smart watch            | 01–05, 08–11, 16–20        |
| `blender.png`   | Juicer blender         | 01–05, 08, 09, 12, 13, 16–19 |
| `cooker.png`    | Rice cooker            | 01–05, 08, 13, 16–19       |
| `fan.png`       | USB rechargeable fan   | 14                         |
| `headphone.png` | Over-ear headphones    | 02, 05, 15, 18             |
| `phone.png`     | Phone + earbuds case   | 15                         |

Adding a new product: put `<name>.png` here, add a matching vector fallback to
`PRODUCTS` in `../assets.js`, then reference it as `<div class="pslot"
data-p="<name>"></div>`.

## What the files need to be

- **PNG with a transparent background.** The products sit on teal, on white and
  on photo tiles; a white rectangle behind the product will show on every dark
  banner. Cut the background out first.
- **Roughly 1200–1600px on the long edge.** Smaller than ~800px will look soft
  on the 1640×856 covers and the 1080×1920 stories.
- **Shot square-on, product upright, minimal perspective.** The layouts stand
  several products on one shared floor line; a strongly tilted shot breaks it.
- **Trim tight to the product.** Padding baked into the PNG reads as the
  product being too small, because the slot scales to fit the whole image.
- No drop shadow needed — the banners add their own contact shadow and glow.

## Then re-render

```
cd D:\mart-logo\banners
node render.js
```

Finished PNGs land in `../out/`. To redo a single banner: `node render.js fb-14`.

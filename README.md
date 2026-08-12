# TechCartBD — Facebook banner set

Twenty banners for the Facebook page, built from `logo.svg` and the design
language of the supplied reference strip (`banner.png`): white or off-white
copy field, deep-teal colour block, a lime seam cutting between them on the
logo's own 7:9 angle, navy display type with the second line in lime, outlined
trust icons, lime pill CTA.

Finished PNGs are in **`out/`**. Everything is 1× and ready to upload.

## The set

### Feed posts — 1200×630
| # | File | Message |
|---|------|---------|
| 01 | `fb-01-smart-tech` | Smart Tech Better Life — flagship brand post |
| 02 | `fb-02-upgrade-lifestyle` | Upgrade Your Lifestyle — product tiles + trust bar |
| 03 | `fb-03-trusted-gadget-partner` | Your Trusted Gadget Partner |
| 04 | `fb-04-simplifies-life` | Tech That Simplifies Life — 30% seal |
| 05 | `fb-05-mega-gadget-sale` | Mega Gadget Sale |
| 06 | `fb-06-free-delivery` | Free delivery nationwide |
| 07 | `fb-07-warranty-trust` | 1 Year Warranty |
| 08 | `fb-08-cash-on-delivery` | Cash on delivery |
| 09 | `fb-09-flash-sale` | 24-hour flash sale + countdown |
| 10 | `fb-10-new-arrival` | Smart watch launch + price |

### Square posts / carousel — 1080×1080
| # | File | Message |
|---|------|---------|
| 11 | `fb-11-smartwatch-spotlight` | Smart watch, priced |
| 12 | `fb-12-blender-spotlight` | Blender, priced |
| 13 | `fb-13-kitchen-combo` | Blender + cooker bundle |
| 14 | `fb-14-usb-fan` | USB rechargeable fan |
| 15 | `fb-15-audio-spotlight` | Audio category |

### Page covers — 1640×856
| # | File | Message |
|---|------|---------|
| 16 | `fb-16-cover-smart-tech` | Smart Tech Better Life |
| 17 | `fb-17-cover-trusted-partner` | Your Trusted Gadget Partner |
| 18 | `fb-18-cover-upgrade-lifestyle` | Upgrade Your Lifestyle |

Covers keep all type inside x 150–1490 / y 150–706, because Facebook crops the
cover differently on desktop and mobile.

### Stories / Reels — 1080×1920
| # | File | Message |
|---|------|---------|
| 19 | `fb-19-story-flash-deal` | Flash sale |
| 20 | `fb-20-story-new-arrival` | Smart watch launch |

Stories keep everything between y 250 and y 1670 — Facebook's own chrome covers
the top and bottom strips.

## Editing

- **Copy, prices, offers** — edit the text directly in the banner's `.html`.
  Prices are plain text (`৳2,450`); nothing is hard-coded into an image.
- **Brand colours, type scale, buttons, chips, trust icons** — `fb.css`. Change
  a token there and all twenty follow.
- **Logo and product art** — `assets.js`. The logo is traced from `logo.svg`
  and inlined as SVG rather than loaded through `<img>`, because an
  `<img>`-loaded SVG cannot see the `@font-face` in `fb.css` and the wordmark
  would silently fall back to a system font.

## Product photography

The products are vector art right now. Drop real cutouts into `products/` and
they take over automatically — see `products/README.md` for the file names and
what the images need to be.

## Re-rendering

```
cd D:\mart-logo\banners
node render.js            # all banners → out/
node render.js fb-14      # just the ones matching
```

The renderer serves the folder over a local port and screenshots each page at
the exact size in its file name, so adding a banner needs no change to
`render.js` — just name it `fb-<n>-<slug>-<W>x<H>.html`.
# techmartbd

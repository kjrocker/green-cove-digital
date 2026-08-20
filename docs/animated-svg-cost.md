# The cost model for animated SVG backgrounds

Written after the Firefox-on-Android scroll-lag bug of 2026-08-20. The incident
log — symptoms, diagnosis, exact code changes — is in
[known-issues.md](known-issues.md). This is the transferable part: why the
original design was appealing, what it actually cost, and how to price the next
one before shipping it.

## Why we liked randomization and overflow

The original ornament system made four decisions, and all four were defensible:

1. **One repeating tile per layer.** A field of 45 circles costs the same as a
   field of 3, because the whole layer is one composited surface. Shape count
   is free — so use plenty.
2. **A unique seed per instance.** `nextSeed()` gave every card its own
   scatter, so no two ornaments on a page looked alike, and a seeded PRNG kept
   builds byte-identical.
3. **Overhang on all four sides.** `inset: calc(-1 * var(--fieldPx))` meant the
   layer could drift a full tile in *any* direction and never expose its host.
   One rule, no per-instance reasoning, obviously correct.
4. **A large tile.** At 1400px the repeat never became visible, even across a
   full-width section.

Every one of these is a reasonable instinct. Every one of them has a cost that
is invisible on a desktop GPU and quadratic on a phone.

## What they actually cost

**Overhang is squared.** A layer with overhang `F` on all sides is
`(W + 2F) x (H + 2F)`. On a phone a 360x320 card became a **3160x3120**
composited layer — 9.86 Mpx to decorate 0.12 Mpx of card. Doubling the overhang
quadruples the layer.

**Tile size is a raster budget, not a coordinate space.** `background-size`
sets the surface the browser must rasterise the SVG into, at device pixels:
`(FIELD x DPR)^2 x 4 bytes`. At FIELD 1400 and DPR 3 that is a **71 MB surface
to hold 45 circles**. Sparse content does not make a cheap raster.

**Uniqueness costs a surface.** Because every instance got its own seed, no two
ornaments could share a decoded surface. Fifteen unique tiles on one page — over
**1 GB** of distinct surfaces on a device with nothing like that spare. The
tiles then thrash the image cache and re-rasterise on the main thread, during
scroll.

**Compositors have a prerender budget.** Firefox only prerenders a
transform-animated frame up to roughly `1.125 x` the viewport (capped at
4096px) — about **442x958** on a phone. Past that the animation falls back to
the **main thread** and repaints every frame. Thirteen such layers is a main
thread that never idles, which is precisely what "lagging scroll" means.

**`define:vars` stamps every element.** Astro copies the component's entire
variable set onto every element it renders. Twelve distinct data URIs became
132 copies — 99 KB of base64, 92% of a 355 KB document.

None of this reproduces on a desktop: the cache absorbs the surfaces and the
GPU absorbs the layers.

## What replaced it

- **Shrink the tile.** `FIELD` 1400 -> 700, shape count derived from density
  (`atDensity()`) so the look is preserved. Area is quadratic, so this alone is
  ~4x on both layer and surface.
- **Overhang only where content arrives from.** A layer drifting up-and-left
  needs margin on its bottom and right and nowhere else: `inset: 0 -F -F 0`.
- **Share the tiles; vary by free transforms.** Three tiles per tone, picked by
  seed, then differentiated per instance by `background-position` (a crop) and
  `scaleX(±1)` (a mirror). Neither adds a surface nor grows the layer.
- **Drop the layer where it cannot be seen.** Card ornaments are hidden below
  `48em` — the site's only breakpoint, and a performance one.
- **Name the tiles once.** One `:root` block per page instead of `define:vars`.

## Total savings

| | before | after | |
|---|---|---|---|
| Site HTML, all 7 pages | 2,045 KB | **187 KB** | 91% |
| Home page | 355 KB | **30 KB** (7 KB gzipped) | 92% |
| Data URI occurrences (home) | 132 | **17**, all unique | 8x |
| Animated bubble layers on a phone | 13 | **3** | 4x |
| Card layer area | 9.86 Mpx | **1.08 Mpx** | 9x |
| Tile raster surfaces (home) | ~1,058 MB | **~71 MB** | 15x |

No visual change at any width, and builds stayed byte-identical.

## Rules for next time

- **Price the layer, not the artwork.** `(W + overhang) x (H + overhang) x DPR^2
  x 4 bytes`, times the number of animated layers. Do this arithmetic before
  choosing an overhang.
- **Overhang belongs on the side content arrives from**, never on all four.
- **Variety should come from transforms, not from assets.** A crop and a mirror
  are free; a second generated tile is a second surface. Regenerating an asset
  per instance defeats every cache in the stack.
- **Rotation is not free.** It grows the bounding box 24-36% off-axis, and it
  rotates the motion vector with it — half of all angles would have the bubbles
  sinking. `scaleX(±1)` is the one orientation change that costs nothing.
- **Stay inside the prerender budget** (~1.125x viewport) or accept main-thread
  animation. This is the line between "ambient background" and "scroll jank".
- **Never put a large value in `define:vars`.** It is emitted per element.
- **You cannot reproduce this class of bug on a desktop.** Reach for arithmetic
  over profiling — and remember every animation here sits behind
  `prefers-reduced-motion`, which makes "turn on Remove animations and reload" a
  free remote diagnostic.

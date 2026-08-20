# Known Issues

## Contact form failure shows no error message to users

**Severity:** medium — the failure path of a live form is silently broken.

The contact form's error banner never renders. `src/pages/contact.astro`
computes:

```astro
const hasError = Astro.url.searchParams.get("error") === "1";
```

and only renders the `.form-error` banner inside `{hasError && (...)}`. But the
page is statically prerendered, so `hasError` is evaluated at **build time**,
where there is no query string — the banner markup is dropped from the built
output entirely:

```sh
$ grep -c "Something went wrong" dist/contact/index.html
0
```

Meanwhile `functions/api/contact.ts` redirects to `/contact?error=1` on a
validation failure or an SES owner-notification send error. The user lands on a plain contact
page with **no visible error** — the form appears to have done nothing.

### Fix options

- **SSR the page** — drop prerendering for `/contact` so `Astro.url` reflects
  the real request and `hasError` is evaluated per-request.
- **Handle it client-side** — a small inline script reads `location.search` and
  toggles the banner. Keeps the page static.
- **Error from the Function** — have `functions/api/contact.ts` return its own
  error HTML/response instead of redirecting to a static page that can't show it.

Discovered while building the `run-green-cove-digital` skill; also noted in that
skill's Gotchas.

## `typescript` is pinned to 6.x for `astro check`

**Severity:** low — a dependency constraint, not a defect.

`pnpm check` (`astro check`) needs TypeScript's programmatic compiler API.
TypeScript 7's native compiler does not ship it yet, so `astro check` fails
outright on 7.x with:

> The TypeScript module loaded (found 7.0.2) does not expose the programmatic
> API that `astro check` relies on.

`package.json` therefore pins `typescript` to `^6`. Track
<https://github.com/withastro/roadmap/discussions/1321> before bumping.

## Smaller things noticed during the component extraction

- **`data-flow="sm"` is a no-op in four places.** The rule compiles to
  `.flow > * + *[data-flow=sm]`, i.e. it only applies when the element is *also* a
  non-first child of a `.flow`. It silently does nothing on the two service cards in
  `index.astro`, on `Footer.astro`'s copyright column, and on the contact form's
  first field (so field one has a 1em label gap and fields two and three have
  0.5em). The fix — a sibling `.flow[data-flow="sm"] { --flow-space: 0.5em }` rule —
  turns all four no-ops into effects at once, so it needs a visual review.
- **`Cove.astro` uses `id="background-wrapper"`.** Every page renders 2+ Cove
  instances (about renders 3), so the id is duplicated. Not currently a rendering
  bug — Astro's scope hash means all instances match the styles — but duplicate ids
  are invalid HTML and would break any future anchor or `getElementById`. Mechanical
  one-file change to a class.
- **Dead CSS.** `.b-primary`, `header.spot-color-primary`, both blockquote blocks
  (no `<blockquote>` exists anywhere), `.features svg`, `.features a`,
  `--color-light-glare`, `--color-secondary-glare` and all four
  `--transition-*` tokens are unused. `--color-primary-glare` is no longer on
  this list — `Drift` adopted its value as the light ornament tint. Keep
  `.spot-color-secondary` — `SpotBand`'s `spot` prop makes it reachable.
- ~~**`OG` in `src/data/client.ts` is exported but never imported**, and the
  `/assets/social.jpg` it points at does not exist in `public/`. No page emits
  `og:image`.~~ Fixed: `OG` now points at a generated `public/og.png` and
  `BaseHead.astro` emits the full `og:image` / `twitter:image` set. See
  [og-image.md](og-image.md).

## Ornament layers caused scroll lag on Firefox for Android — fixed 2026-08-20

The reusable lesson from this one is written up separately in
[animated-svg-cost.md](animated-svg-cost.md); what follows is the incident log.

**Severity:** was high on mobile; not reproducible on desktop at all.

Reported as "lagging scroll on Firefox on the phone" for a page that is
essentially pure text. The bubbles are *not* DOM nodes — they are base64 SVG
data URIs used as `background-image` on one `<div>` per ornament — so the DOM
was never the problem. Three compounding costs were:

1. **Oversized composited layers.** `.drift__bubbles` used
   `inset: calc(-1 * var(--fieldPx))`, a full field of overhang on all four
   sides. With `FIELD = 1400` that made every layer 2800px wider and taller
   than its host: a 360×320 card on a phone grew a **3160×3120** layer.
   Firefox only prerenders a transform animation up to roughly
   `layout.animation.prerender.viewport-ratio-limit` (1.125) × the viewport,
   capped at 4096px — about 442×958 on a phone. Every bubble layer was 3–7×
   past that, so the animations fell back to the main thread and repainted
   during scroll.

2. **Unshared raster surfaces.** `background-size` was 1400×1400 CSS px, i.e. a
   **~71 MB** surface at DPR 3 to hold 45 circles — and `nextSeed()` gave every
   instance its own tile, so nothing was ever shared. The home page wanted 15
   distinct tiles, over 1 GB of surfaces, on a device that has nothing like
   that to spare.

3. **Payload.** Astro's `define:vars` stamps the custom properties onto every
   element in the component, so each ~10 KB data URI was emitted many times per
   page. The home page was 363 KB of HTML, 92% of it base64.

### What changed

- `FIELD` 1400 → 700, bubble count 45 → 11 (same density). Drift durations
  halved alongside it so apparent speed is unchanged.
- Overhang is now one field on the **two sides the field arrives from**, not
  all four — `inset: 0 -F -F 0`.
- One shared set of tiles (`BUBBLE_TILES` in `src/lib/ornaments.ts`) instead of
  one per instance. Per-instance variety comes from `bubbleVariant`: a
  `background-position` crop and a `scaleX(±1)` mirror, both free at composite
  time.
- Card ornaments are dropped below `48em` — the site's only breakpoint, and a
  performance one rather than a layout one.

Home page: 363 KB → 126 KB, unique data URIs 21 → 12, bubble layers on a phone
13 → 3, per-layer area ~9× smaller, tile surfaces 71 MB → 18 MB.

### Gotchas if you touch this again

- **The mirror must live inside `@keyframes drift-diagonal`.** The animation
  animates `transform`, so a base `transform: scaleX(-1)` is overridden the
  moment it starts. The individual `scale:` property does not work either: it
  composes as translate → rotate → scale, which applies the translate in the
  parent's coordinate space rather than the mirrored one, so the step stops
  landing on the tile lattice and the field jumps once per cycle.
- **A general rotation is not safe.** Rotating the field rotates the drift
  vector with it, and half the angles have the bubbles *sinking*
  (`rotate(180deg)`, `rotate(270deg)`, `scaleY(-1)`). Off-axis angles also
  inflate the layer's bounding box by 24–36% and break the two-sided overhang,
  because the side the field arrives from rotates too. `scaleX(±1)` is the one
  variant that is free and always still rises.
- **Verify the loop stays seamless** after changing `FIELD` or the inset: the
  per-cycle translate must be exactly one `FIELD`, or the lattice will jump.
- Builds are deterministic — `pnpm build` twice and diff `dist/` to confirm.

### The `define:vars` duplication (also fixed)

Astro's `define:vars` does two things: it forces the `<style>` block inline
instead of bundling it, and it stamps the component's **entire** variable set
onto **every element the component renders**. `<Drift>` renders up to three
elements and `<Cove>` seven, so the home page carried 132 copies of 12 distinct
data URIs — 99 KB of base64 for images that are build-time constants.

The tile set is fully enumerable (tone × edge × seed are all closed), so it is
now built once in `ornaments.ts` and emitted once per page as a `:root` block by
`<OrnamentTiles>`, which `BaseLayout` renders in `<head>`. Components reference a
tile by name and carry only their own small values:

```html
<div class="drift__bubbles" style="--drift-tile:var(--o-bubble-light-2);--drift-crop:112px 319px;--drift-flip:-1">
```

Neither `Drift` nor `Cove` uses `define:vars` any more, so their stylesheets
bundle normally. `TILE`, `FIELD` and the wave height ride along in the same
`:root` block, so they stay single-sourced in TypeScript instead of being
restated in CSS.

Home page **363 KB → 30 KB**; data URI occurrences **132 → 17**, all unique.

Why inline rather than a linked stylesheet: the block is ~12 KB raw but only
**~1.8 KB gzipped**, because the tiles are near-identical SVGs. A second
stylesheet would cost a render-blocking round trip on exactly the slow phones
this was all about, and cross-page caching is worth little here when
`prefetchAll` already pulls other pages in the background. If it ever does need
to be cached, percent-encoding the SVGs instead of base64 takes that 1.8 KB to
1.3 KB — measured, but not worth the churn to `dataUri()` (which `scripts/og/`
also uses) on its own.

A page carries all 17 tiles even if it draws fewer; trimming to the used set
would mean tracking usage across a render that emits `<head>` before `<body>`,
which is not worth 12 KB raw / 1.8 KB on the wire.

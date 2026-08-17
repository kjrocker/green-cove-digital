# The og:image card

`public/og.png` — the 1200×630 card social platforms render when the site is
shared. Before it existed, every share on LinkedIn, Facebook, Slack or iMessage
was a bare link (logged in `known-issues.md` and `content-review.md`, and the
reason `src/data/client.ts` carried a dead `OG.image` pointer at a
`/assets/social.jpg` that was never created).

It is **generated, not screenshotted** — composed from the site's own visual
vocabulary so it stays recognizably the same brand without being a picture of a
page that will change.

## What it is made of

| Element | Source |
|---|---|
| Water gradient | `Cove.astro`'s two radial gradients, transposed to the frame |
| Top-right bloom | `Cove.astro`'s `ellipse 90% 60% at 80% -10%` |
| Wave layers | `wavePathD()` in `src/lib/ornaments.ts` — the site's own geometry |
| Light motes | `dotFieldCircles()` in `src/lib/ornaments.ts` |
| Sun | the amber disc from `public/favicon.svg` |
| Amber kicker rule | `--color-secondary` |

`Cove.astro`'s curved bottom close is deliberately **not** on the card — see
below.

The wave and mote geometry is imported from `src/lib/ornaments.ts` rather than
copied, so the card cannot drift from the hero. `wavePathD` and
`dotFieldCircles` were extracted from the existing `waveTileUri` /
`dotFieldUri` for exactly this — both take an optional width/height so the card
can draw across a 1200×630 frame instead of a repeating tile.

### Why the bottom curve is not on the card

The one element that could not be transplanted. On the site,
`Cove.astro`'s curve draws only the **transition strip** — the light area
itself is the page section underneath it. The path sits at y≈90 of 96 on the
left and y≈43 in the middle, so on a standalone card it renders as a wedge that
tapers to nothing at the left edge and is then clipped by the frame. It reads
as a mis-crop, not a shore.

`bottomEdge()` can fix that, and still supports it:

- **`edge.base`** runs a full-width band of the same fill beneath the curve, so
  the light has a floor it never falls below.
- **`edge.fill`** moves off `--color-light` — a warm sand
  (`hsl(40, 46%, 90%)`) turns the curve into a beach rather than a leftover
  page transition, and sits softer than white under a dark card.

Both are rendered as variants f2/f4. The card ships **without** either: the
curve only ever meant anything as a handoff to content below it, and there is
no content below. Letting the water run to the frame means nothing on the card
is borrowed from a context it doesn't have.

Keep this in mind if you reuse the curve on another standalone image — it needs
a `base`, or it needs to not be there.

## Regenerating

```sh
pnpm og                              # all variants → tmp/og/ + contact sheet
node scripts/og/render.mjs --only e5  # one variant, fast loop
node scripts/og/render.mjs --ship e5  # also write public/og.png
```

`tmp/` is gitignored, so iterating costs nothing; only `--ship` touches the
repo. `public/og.png` is committed, exactly like the generated
`public/favicon.ico`.

**Do not overwrite `og.png` once the domain is live.** Scrapers cache
aggressively and key on the URL. Ship a regenerated card as `/og-2.png` and
update `OG.image` in `src/data/client.ts`.

## How the iteration harness works

`scripts/og/variants.mjs` holds the design history as data. Each round has a
`BASE_<n>` that its variants patch, derived by applying the previous round's
winner to the previous round's base; `DEFAULTS` falls out of the end of that
chain.

That indirection matters. The obvious approach — promote the winner into
`DEFAULTS` — silently redraws every earlier round, because their patches
inherit whatever `DEFAULTS` currently holds, so the PNGs on disk stop matching
what was actually reviewed. Pinning each round to its own base means adding a
round F cannot disturb rounds A–E.

To add a round: append `WINNER_<last>`, derive `BASE_<next>`, write the variants
against it, and add them to `VARIANTS`.

The contact sheet's tiles are deliberately small (~380px). Feeds render a
1200×630 near 500px wide, so a tagline that is unreadable on the sheet is
unreadable in the feed — the sheet is the legibility test, not just an index.

The rounds that produced the current card are logged in `tmp/og/NOTES.md`
(untracked; regenerate the images to see them).

## Constraints

**Renderer.** sharp, already a devDependency as Astro's image service, so no
new dependency and no system dependency. This diverges from
`scripts/make-favicon`, which shells out to ImageMagick — but only because
sharp cannot write multi-size `.ico` containers. PNG has no such constraint.

sharp rasterizes SVG through librsvg, which means:

- **no `@font-face` and no `foreignObject`** — plain `<text>`, gradients, masks
  and clip paths only. Not a real limit here: the site has no SVG filters,
  `feTurbulence`, noise or blur anywhere, and its texture is entirely dot
  fields and low-opacity wave silhouettes.
- **fonts resolve through fontconfig**, so the family has to be installed on
  the machine that runs the generator.

**Font.** `--font-base` is `Inter, Segoe UI, …`, but the Inter `@font-face`
block at the top of `src/css/global.css` is commented out and no font files
ship with the repo — so the live site renders in the OS fallback and there is
no "correct" typeface to match. `scripts/og/cove.mjs` therefore pins a neutral
grotesque (`FONT`) that is actually installed locally. If the Inter faces are
ever restored, revisit that pin so the card matches the site again.

**Format.** PNG. WebP support across scrapers is inconsistent. The card lands
around 137KB; if a future version exceeds ~500KB, JPEG q88 compresses these
smooth gradients far better — update the extension in `client.ts` too.

**Safe area.** Slack and Discord letterbox or crop the 1.91:1 frame, so the
wordmark and tagline stay inside a centered ~1000×520 box.

## Where it is wired in

`src/components/BaseHead.astro` emits `og:image`, its width/height/alt,
`og:url`, `og:site_name`, `og:locale`, `twitter:image` and
`twitter:card=summary_large_image` (a plain `summary` would render the
1200×630 as a small square thumbnail).

`og:image` is **absolute** — scrapers reject a relative URL — even though every
other reference in the project is a path.

These sit inside the existing `description && (…)` block, so `thanks.astro`,
which passes no description, stays deliberately bare.

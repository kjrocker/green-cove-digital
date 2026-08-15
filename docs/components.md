# Layout components

Extracted 2026-08-15 from six pages that each hand-rolled a full `<html>`
document. The extraction was output-preserving: no CSS was added, changed, or
deleted, and every component emits classes that already existed in
`src/css/index.css`.

## Writing a new page

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import Section from "../components/Section.astro";
import SpotBand from "../components/SpotBand.astro";
import Grid from "../components/Grid.astro";
import Card from "../components/Card.astro";
import { SITE } from "../data/client";

const jsonLd = { "@context": "https://schema.org", "@type": "Service", /* … */ };
---

<BaseLayout
  title={`Page Name - ${SITE.title}`}
  path="/page-name"
  description="…"
  jsonLd={jsonLd}
>
  <Hero slot="header" title="Page Headline">
    <p class="big">Lead paragraph.</p>
  </Hero>

  <Section>
    <h2>A content region</h2>
    <Grid layout="50-50">
      <Card><h3>One</h3><p>…</p></Card>
      <Card><h3>Two</h3><p>…</p></Card>
    </Grid>
  </Section>

  <SpotBand>
    <h2>A green band</h2>
    <p>…</p>
  </SpotBand>
</BaseLayout>
```

`<Hero>` must carry `slot="header"` — it renders outside `<main>`, above the
content, because the header and the hero share one `<Cove>` background.

## Reference

| Component | Props | Emits |
|---|---|---|
| `layouts/BaseLayout` | `title`, `path`, `description`, `ogTitle`, `ogDescription`, `twitterDescription`, `noindex`, `jsonLd` | `<html>` / `<head>` / `<body>` / `<main>` / `<Footer>` |
| `BaseHead` | same as above | the head tags, in a fixed order |
| `Hero` | `title`, `brandSize` | `<Cove>` + `<SiteHeader>` + `.section__inner` > `.wrapper.flow.region` > `h1` |
| `SiteHeader` | `brandSize` | `header.flow` + brand + `<Navigation>` |
| `Section` | `as` (default `article`), `ornament` (default off), `seed`, `class`, …rest | `.flow.region.wrapper`, wrapped in `.ornament-host` when `ornament` |
| `SpotBand` | `spot` (default `primary`), `ornament` (default **on**), `seed` | `.section.spot-color-*` + two `<Curve>` around a `<Section>` |
| `Grid` | `as` (default `div`), `layout`, `class`, …rest | `.grid` + `data-layout` |
| `Card` | `as` (default `div`), `ornament` (default **on**), `seed`, `class`, …rest | `.card.flow` |
| `Drift` | `waves`, `bubbles` (default on), `edge`, `tone`, `seed`, `static` | the absolutely-positioned ornament layers |
| `NavList` | `class` | the four-item `ul.cluster` |

`Section`, `Grid` and `Card` spread their remaining props onto the element, so
`role="list"`, `data-flow="sm"` and friends pass straight through. They get
that by extending `HTMLAttributes<"div">` from `astro/types` — **not** a raw
`[key: string]: unknown` index signature, which silently defeats type checking
on the declared props (`astro check` will accept `<Card as="span">` and only
warn that `Props` is "declared but never used").

### Head props

Only `title` is required. Omitting `description` suppresses the whole SEO block
(canonical + description + og:\* + twitter:\*) — that is what `thanks.astro`
does. The fallback chain is `ogTitle → title`, `ogDescription → description`,
`twitterDescription → ogDescription`; `twitter:title` always tracks `og:title`.
All three fallbacks are load-bearing, because across the five SEO'd pages
`<title>` differs from `og:title` on four, `description` from `og:description`
on three, and `og:description` from `twitter:description` on two.

`BaseLayout` and `BaseHead` also expose a named `head` slot for page-specific
head content. Nothing uses it yet.

## Cove

Three `<Cove>` instances can be on a page and the layout owns none of them:
`Hero` renders one (with the bare defaults), `Footer` renders its own
`<Cove top static bottom={false}>`, and `about.astro` composes a third
`<Cove top static>` inline for its "What I Believe" band. That one-off is
deliberately not a component — one use is below the extraction threshold.

## Drift — ambient motion below the hero

`Drift` puts the cove's vocabulary on the flat surfaces: a wave silhouette
hugging one edge, plus sparse circles drifting slowly up and to the left. It
renders one absolutely-positioned `<div>` per layer, each carrying a repeating
data-URI background from `src/lib/ornaments.ts` — the same technique as
`Cove`'s `.wave` / `.motes`, so a layer stays one composited surface no matter
how many circles it holds.

On `SpotBand` the wave rises from the **bottom** edge, tucking under the closing
`<Curve>`. It was anchored to the top first; down here it keeps clear of the
header and the band's opening curve entirely.

Three surfaces opt in. **`SpotBand`** and **`Card`** carry it by default
(`ornament={false}` opts out); **`Section`** is off by default and pages turn it
on for the one large section per page where it reads well — `index`'s "Why Work
With Me?", `about`'s "Technical Expertise", `contact`'s "Send a Message",
`small-business`'s "Perfect For", `consulting`'s "How I Can Help". The `static`
Coves in `Footer.astro` and `about.astro` stay frozen — that editorial choice
holds, and `Drift` has the same `static` escape hatch.

Two mechanics carry the whole thing:

- **Stacking.** The host sets `position: relative; isolation: isolate;
  overflow: hidden` and the layers take `z-index: -1`. Inside an isolated
  stacking context, negative-z children paint above the host's own background
  but below its in-flow content — so the ornament sits over the green/dark fill
  and under the text with no change to the content markup. Without `isolate`
  they would sink behind the host's background and vanish. On `SpotBand` this
  has to be `.section__inner`, since that is the element painting
  `var(--spot-color)`; it opts in via `[data-ornament]` so `Hero`'s
  `.section__inner` is untouched. On `Section` it is a full-bleed wrapper div,
  because `.wrapper` is capped at 85rem and clipping there would show as a
  narrow band of texture inside a full-bleed light background.
- **Diagonal drift.** The bubble layer takes `inset: calc(-1 * var(--fieldPx))`,
  overhanging one full tile on all four sides, and the keyframe translates by
  one tile up *and* left — so it stays covered for the whole cycle. Cove's
  `width: calc(100% + …)` only over-extends horizontally and can't do this.

Intensity is deliberately at the floor: opacity 0.045–0.12, cycles 180–300s.
Cards run slowest (`--drift-bubble-time: 300s` on `.card`) because a page can
carry four or more. `--drift-wave-opacity`, `--drift-bubble-opacity` and the two
`*-time` properties inherit, so a host can retune any of it. `Section`'s dark
tint on a light band sits behind body copy and stays at 0.045.

Every layer is inside one file, so a single
`@media (prefers-reduced-motion: reduce) { animation: none }` per layer covers
the feature — the ornament stays visible, only the movement goes.

### The generators

`src/lib/ornaments.ts` holds `waveTileUri()` and `dotFieldUri()`, shared by
`Cove` and `Drift`. They are **seeded** (mulberry32), not `Math.random()`, so
two builds emit byte-identical data URIs — `nextSeed()` hands each `Drift`
instance a fresh seed in render order so two cards on a page don't wear the same
scatter in the same place. Pass `seed` explicitly to pin one.

`waveTileUri` takes an `anchor`: `"bottom"` (Cove's shape, and `SpotBand`'s)
fills down to the tile bottom, `"top"` closes the path to the tile top instead —
a mirrored silhouette without a `scaleY(-1)` that would collide with the drift
`transform`. Either way the anchored edge is masked with a gradient,
or the layer's own straight top edge reads as a rule across the band.

## The brand header

Every page uses the same markup — `<p class="wrapper …"><a class="big-brand">`
— and `brandSize="hero"` only changes its size. The home page needs a larger
brand, so it gets `.brand-hero`, which sets `--size-step-6` on the `<p>` *and*
makes the link inherit it. Sizing the block as well as the inline is what keeps
the line box identical to the `<h1>` this replaced.

The home page used to render its brand as an actual `<h1>`, which gave index
two `<h1>`s. Converting it to the shared link markup fixed that with no visual
change (verified pixel-identical). Two shims from the extraction —
`brandAs="h1"` and `wrapNav` — are both gone.

## Lead paragraphs

`<p class="big">` under a hero `<h1>` renders at `--size-step-2`, one step above
body text. The rule used to be written `h1.big`, so it matched nothing on a
paragraph and the three pages using it silently rendered leads at body size.

## Deliberately not extracted

- **A CTA component.** The closing "Ready to Get Started?" blocks share a shape
  (`h2` + `p` + link) but no markup beyond `<Section>` — the rest is copy.
  Pushing every string through a prop, then adding a slot escape hatch for
  index's two-anchor `.cluster`, collapses straight back into `<Section>`.
- **A `mailto:` component.** Four uses; a component is more characters at the
  call site than the template literal. Add `mailto:` to `BUSINESS` in
  `src/data/client.ts` if it ever grates.
- **`Cluster` / `Wrapper` / `Flow` wrappers.** These are CSS utilities, not
  layout structures.
- **A features grid, and a Cove band.** One use each.

## Verifying an output-preserving change

`dist/` is gitignored, so snapshot by copying it aside, then diff the built HTML
with the scope hashes and asset hashes masked. The base64 data URIs no longer
need masking: every ornament field is seeded, so `pnpm build` twice and
`diff -r` on the two `dist/` trees comes back clean. That diff is also the test
for the seeding itself — if it ever reports a difference, something reintroduced
`Math.random()` or made render order unstable.

Screenshots still differ inside any animated surface, since the drift phase
depends on when the shot was taken — compare frozen regions, or emulate
`prefers-reduced-motion: reduce` (`chromium --force-prefers-reduced-motion`),
which pins every layer at phase zero.

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
| `Hero` | `title`, `brandAs`, `wrapNav` | `<Cove>` + `<SiteHeader>` + `.section__inner` > `.wrapper.flow.region` > `h1` |
| `SiteHeader` | `brandAs`, `wrapNav` | `header.flow` + brand + `<Navigation>` |
| `Section` | `as` (default `article`), `class`, …rest | `.flow.region.wrapper` |
| `SpotBand` | `spot` (default `primary`) | `.section.spot-color-*` + two `<Curve>` around a `<Section>` |
| `Grid` | `as` (default `div`), `layout`, `class`, …rest | `.grid` + `data-layout` |
| `Card` | `as` (default `div`), `class`, …rest | `.card.flow` |
| `NavList` | `class` | the five-item `ul.cluster` |

`Section`, `Grid` and `Card` spread their remaining props onto the element, so
`role="list"`, `data-flow="sm"` and friends pass straight through.

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

## Two props that only exist to preserve bugs

`SiteHeader`'s `brandAs="h1"` and `wrapNav` reproduce divergences on the home
and service pages rather than fixing them. Both are documented in
[known-issues.md](known-issues.md); each is a one-line deletion once the
corresponding design call is made.

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

`dist/` is gitignored, so snapshot by copying it aside, then diff the built
HTML with the scope hashes, asset hashes and Cove's base64 data URIs masked
(Cove's mote fields are `Math.random()`-seeded, so they differ on every build).
Screenshots differ inside any `<Cove>` for the same reason plus the wave
animation phase — compare the regions outside them.

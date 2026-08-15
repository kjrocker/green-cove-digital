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
- **`OG` in `src/data/client.ts` is exported but never imported**, and the
  `/assets/social.jpg` it points at does not exist in `public/`. No page emits
  `og:image`.

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

## Nested `<nav><nav>` on three pages

**Severity:** low — invalid-ish markup and a 2px visual inconsistency.

`Navigation.astro` emits its own `<nav style="padding-top:1px;padding-bottom:1px;">`.
The home, small-business and consulting pages historically wrapped `<Navigation />`
in a *second* identical `<nav>`, so those three render `<nav><nav>…</nav></nav>`.
Because `index.css` has `.section nav { background: var(--color-light) }`, both navs
get the light background and the outer one's inline 1px padding makes the header
strip 2px taller than on `/about`, `/contact` and `/thanks`.

The component extraction preserved this deliberately, behind a prop:

```astro
<SiteHeader wrapNav />        <!-- index, small-business, consulting -->
```

**Fix:** delete the `wrapNav` prop from `src/components/SiteHeader.astro` and its
three call sites. That is the whole change. It makes those three headers 2px
shorter, matching the other three — so it wants a screenshot check, which is why
it was left out of the refactor-only pass.

## The home page has two `<h1>`s

**Severity:** low — SEO/a11y, no visual defect.

`index.astro` renders the site title as an `<h1 class="wrapper ml-md-sm mt-l-xl big">`
in the header *and* the page headline as a second `<h1>` in the hero. Every other
page uses `<p class="wrapper mt-m-l"><a class="big-brand">` for the brand, so it has
only one.

Preserved behind `<SiteHeader brandAs="h1" />` — one grep-able token, one line to
delete once the design call is made.

**Why it wasn't just fixed:** there is no zero-pixel option. Switching index to the
`big-brand` treatment drops the brand from `--size-step-6` to `--size-step-4`, makes
it a link, and changes its margins; demoting the hero `<h1>` to `<h2>` is worse for
SEO. Someone needs to decide what the home page header should look like.

## `.big` on a `<p>` does nothing

**Severity:** low — three lead paragraphs are smaller than intended.

`src/css/index.css` defines only `h1.big`. But `about`, `services/small-business`
and `services/consulting` each open with `<p class="big">` for the hero lead, which
matches no rule and renders at body size — identical to the bare `<p>` leads on
`index`, `contact` and `thanks`.

Someone clearly meant those leads to be larger. **Fix** is a one-line rule, but it
needs a size decision (`--size-step-2`?) and changes three pages visually.

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
  (no `<blockquote>` exists anywhere), `.features svg`, `.features a`, the three
  `--color-*-glare` tokens and all four `--transition-*` tokens are unused. Keep
  `.spot-color-secondary` — `SpotBand`'s `spot` prop makes it reachable.
- **`OG` in `src/data/client.ts` is exported but never imported**, and the
  `/assets/social.jpg` it points at does not exist in `public/`. No page emits
  `og:image`.

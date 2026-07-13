# pgLantern on the Green Cove site: quick implementation plan

Context: pgLantern (a queryable API over the PostgreSQL mailing-list archives
and commit history) is a Green Cove Digital product, built in the `pgml-api`
repo. The strategy decision recorded in `pgml-api/docs/decisions.md` makes this
site pgLantern's legitimacy anchor: pgLantern's footer, receipts, and ToS point
at Green Cove Digital, and this site proves a real operating business exists.
The transfer runs both ways — pgLantern in the portfolio proves the agency
ships real product.

Standing rule from that decision: **this site gets no blog and no content
surface.** Nothing in this plan creates one. All writing goes to Kevin's
personal blog; product prose lives on pglantern.com.

**Timing gate:** ship this when pgLantern's landing page is live at
`pglantern.com` (plan: `pgml-api/docs/landing-page.md`). Linking to the
pre-landing app front door undercuts the point. Everything below can be built
and merged behind that one link-flip.

Voice note: this site's audience is small-business owners and software teams,
not the pgLantern ICP. Describe pgLantern in plain terms ("a hosted API over
the PostgreSQL mailing-list archives and commit history — search, threading,
and the commit that landed each discussion, as JSON"); don't port the
curl-first landing copy here.

## Work items

1. **Data first** (`src/data/client.ts`): add a `PRODUCTS` export —
   `[{ name: "pgLantern", url: "https://pglantern.com", tagline, description }]`.
   Components read from this; no hardcoded product strings in pages.

2. **Homepage "Products" section** (`src/pages/index.astro`): one compact
   section (a `.card` in the existing `.grid`/`.flow`/`.region` system, spot
   color per the CSS conventions in CLAUDE.md) — name, one-plain-sentence
   description, link. No screenshots needed at first; text + link is the
   legitimacy signal. Don't add a `/products` page or nav item for a single
   product — revisit if a second product exists.

3. **Consulting page proof block**
   (`src/pages/services/consulting.astro`): this is the highest-value edit.
   The page already sells PostgreSQL consulting (schema design, query
   optimization); add one short paragraph under the PostgreSQL section:
   Green Cove Digital builds and operates pgLantern — a production Postgres system
   (full-text search over ~770k messages, keyset pagination throughout) — with
   the link. Concrete operated-product > any adjective on a services page.

4. **About page**: one sentence in the existing narrative mentioning pgLantern
   as the in-house product, linked. Keep it to a sentence — the about page is
   about Kevin/the agency, not the product.

5. **Structured data**: on the homepage, extend the existing JSON-LD — either
   add `owns: [{ "@type": "SoftwareApplication", name, url }]` to the
   `LocalBusiness` block or emit a sibling `SoftwareApplication` object with
   `publisher` naming `BUSINESS.name`. **Consistency requirement:** the
   `name`/`legalName`/`url` strings must match what pgLantern's landing page
   emits in its own JSON-LD (`pgml-api/docs/landing-page.md` item 4 builds
   those from `config :horton, :site` — product_name "pgLantern", company
   "Green Cove Digital", company_url `https://greencovedigital.com`). The two
   sites' structured data should describe the same entities identically.

6. **Cross-link consistency check**: pgLantern's footer links
   `https://greencovedigital.com` (its `company_url` config) — confirm that's
   this site's canonical URL (`SITE.url` says yes; verify no www redirect
   mismatch in the Cloudflare config) so the trust chain doesn't bounce
   through a redirect.

## Verification

`pnpm build` + `pnpm preview`; click the pgLantern links; validate the JSON-LD
parses (paste into a schema validator or `JSON.parse` the rendered block).
Check the homepage section in both narrow and wide viewports (the `.grid`
system is responsive, but a one-card grid row can look stranded — eyeball it).

## Out of scope

- Any blog, news page, or content section (decided against — see context).
- A dedicated `/products` page (single product; a section suffices).
- Portfolio entries for client work (separate concern, separate decision).
- Changes on the pgLantern side (its landing plan already emits the matching
  Organization JSON-LD and footer link).

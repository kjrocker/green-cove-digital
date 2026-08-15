# Content strategy: this site sells the agency, not the consultant

Decided 2026-08-15. Supersedes the "dual consultancy + agency" framing the site
launched with, and the "highest-value edit" note in
[pglantern-portfolio.md](pglantern-portfolio.md) item 3 (see below).

**Scope of this file:** what the site says and why — positioning, audience,
SEO, page structure, tone. The offer itself — prices, term, cancellation,
ownership, what's included — lives in
[business-model.md](business-model.md). If a note is a fact about the
business rather than a decision about the site, it belongs there.

## The decision

Green Cove Digital's website markets **one thing: subscription websites for
small businesses**. Technical consulting (TypeScript monorepos, PostgreSQL) is
still contracted and billed through Green Cove Digital LLC, but it is
**marketed through Kevin as an individual** — personal blog, pgsql-hackers
contributions, GitHub, referrals — not through this site.

Two surfaces, one legal entity:

| | Discovery / marketing surface | Counterparty |
|---|---|---|
| Small-business websites | greencovedigital.com (this repo) | Green Cove Digital LLC |
| Consulting | kevinrocker.com / blog / mailing lists / network | Green Cove Digital LLC |

## Why

- **The two audiences share nothing SEO-wise.** "small business website
  design Charlotte" and "PostgreSQL consultant" have different searchers,
  intent, entity types (`LocalBusiness` vs. a person/professional service) and
  E-E-A-T signals. One site carrying both dilutes topical authority and forced
  the homepage `<title>`/H1 into a generic "Software Engineering for
  Businesses…" that targeted nobody. Before this change `index.astro` mentioned
  consulting 14×, PostgreSQL 6×, TypeScript 6× — the homepage was pulling
  against the small-business page, which already had the best-targeted copy
  on the site.
- **Consulting buyers don't arrive via a services page.** They arrive via
  reputation. UPDATE.md already said consulting is driven by networking; the
  standing rule in pglantern-portfolio.md already sends all writing to the
  personal blog. This just makes the site consistent with both.
- ~~**Local SEO wants a single-purpose entity.**~~ Superseded 2026-08-16 —
  there is no local SEO (see "The location problem"). The single-purpose
  argument stands on its own.

## ⚠ The location problem (flagged 2026-08-16; copy corrected the same day)

**Decision: national/remote.** Green Cove is positioned as working remotely
with small businesses across the US. Charlotte appears exactly once, as
"Charlotte native" on the about page (`PERSON.hometown`). `BUSINESS.address`
is gone from `client.ts`; `BUSINESS.legalName` and `BUSINESS.areaServed`
("US") replace it. JSON-LD is `Organization` (no `address`, no `priceRange`)
on every page. Titles and meta carry no city. The rest of this section is
the reasoning, kept so nobody reintroduces a location.

**"Based in Charlotte, NC" was not true.** Charlotte is Kevin's hometown; he
has lived in Europe for years, has no fixed address (moves every few months),
and the LLC is registered in New Mexico through a registered agent. There is
no city Green Cove Digital operates *from* and no honest way to claim a
persistent service area.

Before the fix the site asserted a Charlotte location in: both `<title>` tags and
meta descriptions ("in Charlotte, NC"), the homepage `LocalBusiness` JSON-LD
`address` and `areaServed: City`, the small-business `Service` JSON-LD
address, `SITE.description` ("from Charlotte, NC"), the about hero and body
("based in Charlotte, NC"), the contact page ("Based in… working with
businesses locally and remotely"), the footer line, the FAQ "Do you work with
businesses outside Charlotte?" ("I'm based in Charlotte… no travel
surcharge"), and the consulting page hero. The "no travel surcharge" clause
and "locally" both imply in-person is on the table; it isn't.

Consequences for the plan in this file:

- **Google Business Profile is off the table.** GBP requires a real
  location, or a service-area business staffed from a real address in the
  area. A profile on a hometown you don't live in is a guideline violation
  that gets suspended, and it's the kind of thing a local competitor reports.
  Remove the GBP / NAP / `geo` / `sameAs` to-dos below; the neighbourhood
  service-area pages (deferred) are cancelled for the same reason.
- **The map pack is unreachable.** Without GBP there is no local-pack
  ranking. What's left is organic ranking for "web design charlotte"-type
  queries, where a page that isn't from a business in Charlotte will compete
  weakly and — if it claims to be — dishonestly.
- **`LocalBusiness` with a Charlotte `PostalAddress` is a false statement in
  structured data.** Same for `areaServed: City`.
- **Time zone.** Kevin is 5–7 hours ahead of US Eastern. "Reply within one
  business day" is fine; "a short call" needs US-morning slots and the site
  shouldn't imply same-day, drop-by, or evening availability.

### Recommendation

Not disclosing where Kevin lives is fine. Claiming somewhere he doesn't is
not. Reposition from *located in Charlotte* to *from Charlotte, works
remotely with businesses anywhere in the US* — hometown as affinity, not as
address — and stop trying to be a local business in the SEO sense.

1. **Copy.** Replace every "based in Charlotte, NC" with either nothing or
   "Charlotte native" / "grew up in Charlotte" where the personal angle
   helps (about page, one line). Contact and footer: "Working remotely with
   small businesses across the US." FAQ: retitle to "Do you work with
   businesses in my area?" → "Yes — everything happens over calls and a
   preview link, wherever you are. I'm a Charlotte native and work with
   businesses across the US." Drop "no travel surcharge" and "locally".
2. **Structured data.** Change `LocalBusiness` → `Organization` (or
   `ProfessionalService` without an address); remove `address`; keep
   `areaServed: Country US`; drop `priceRange` (it belongs on the `Offer`,
   where it already is). Person schema on `/about`: remove `address` too.
3. **Titles/H1s.** Take the city out of the homepage `<title>` and meta and
   lean on the differentiator instead — the price, "$0 down", and the
   engineer/subscription angle: "Small Business Websites — $180/mo, $0 Down".
   The keyword strategy becomes model-led ("subscription website", "website
   for $180 a month", "$0 down website") and vertical-led (plumbers,
   restaurants), not city-led.
4. **If a Charlotte page is still wanted**, make it one honest page:
   "Websites for Charlotte small businesses, from a Charlotte native — built
   remotely." That can rank a little and won't blow up. Do not templatize it
   across cities.
5. **Registered-agent address** (New Mexico) is never NAP, never in JSON-LD,
   never on the site.
6. **Update this file's "Why" section** — the "local SEO wants a
   single-purpose entity" argument was sound, but the local half of it no
   longer applies; the single-purpose half still does.

**Why not New Mexico instead?** (asked 2026-08-16.) The LLC has a real
address there, but it's a registered-agent address — a *legal* location, not
an *operating* one. GBP guidelines name registered agents, virtual offices
and PO boxes as ineligible, so it buys no local presence; and even if it
did, "web design Albuquerque" is a market with no story behind it. "Based in
New Mexico" would be as untrue as "based in Charlotte". Its legitimate use is
as the entity's legal address — contracts, invoices, terms, payment
processors, WHOIS, an optional footer/terms line "Green Cove Digital LLC, a
New Mexico limited liability company" — never as NAP or in structured data.
Kevin's stated intent is national/remote, which is also the only framing that
is true everywhere it's said; prefer "across the US" over "global" — the
audience is US small businesses and the phrasing signals that without
disclosing where Kevin is.

All of the above was applied 2026-08-16 (items 1–3, 5). Item 4 — a single
honest Charlotte page — was not built; revisit only if there is a reason to.

## What changed on the site (2026-08-15)

- **Homepage** — agency-only. Title/H1/description target small-business
  websites in Charlotte, NC. Consulting section, consulting CTA and the
  "TypeScript monorepos / PostgreSQL" specialties paragraph removed. JSON-LD
  `LocalBusiness` describes one service (`serviceType: ["Web Design", "Web
  Development"]`).
- **Navigation** — "For Software Teams" removed. Nav is Home / About /
  For Small Businesses / Contact.
- **About page** — the engineering background stays, reframed as *why trust
  us* ("your web person is a real engineer who works on PostgreSQL itself"),
  not as a second service. Links to `/services/consulting` removed. Person
  JSON-LD keeps `knowsAbout` — that's a credibility signal, not a service.
- **Contact page** — copy no longer offers a "consulting consultation".
- **`src/data/client.ts`** — `SITE.description` no longer mentions
  consulting.
- **`/services/consulting`** — **kept, unlinked, indexable.** It's the landing
  target for referrals until a "Work with me" page exists on the personal
  site. It is not in the nav, footer, homepage, or the sitemap (filtered in `astro.config.mjs`). Do not
  `noindex` it — unlinked it does no SEO harm, and referred visitors may
  still be sent there.

## Still to do

- [x] **Personal site "Work with me" page** exists (kevinrocker.com). But
      Kevin does **not** want Green Cove to link or redirect to it
      (2026-08-16), so the planned 301 is off. `/services/consulting` stays
      as-is for now — whether to `noindex` it is undecided.
- [ ] **pgLantern proof** now goes on the homepage/about as "the agency ships
      real product" (pglantern-portfolio.md items 2, 4, 5). Item 3 (consulting
      page proof block) is dropped; that proof belongs on the personal site.
- [ ] ~~Google Business Profile, NAP consistency, and a real service-area
      statement~~ — **cancelled**, see "The location problem" above.
      Replace with a truthful remote-service statement.
- [ ] Deepen homepage and small-business page content per the reference-site
      patterns below (UPDATE.md's original ask).

## Standing rules

- **This site gets no blog or content section.** All writing goes to the
  personal blog. (Carried over from pglantern-portfolio.md.)
- **Consulting is not mentioned in nav, homepage, or as a service anywhere on
  this site.** The about page may say what Kevin has *done* (dispatch
  software, PostgreSQL work, pgLantern) as credibility. It may not say what he
  *sells* beyond websites.
- **One entity, one offer** in structured data: `Organization` (not
  `LocalBusiness` — there is no location) → web design for small businesses,
  `areaServed` US. Person schema on `/about` uses `worksFor` to point at it.
  No `address` anywhere.
- Anything that would only make sense to a software team goes to the personal
  site.

## Patterns borrowed from reference sites

Mined 2026-08-15 from oui.digital and oakharborwebdesigns.com (UPDATE.md
named both). Content patterns only — both sites' animations were judged
over-ambitious and our existing components already handle layout.

### What each site does

**oui.digital** (San Diego, solo founder, Astro). Home H1 "Small Business Web
Design in San Diego That Brings Leads"; title "San Diego Web Design for Small
Businesses | Oui Digital"; price in meta. Homepage: hero → services → objection
handling ("What if I don't like it? … There's no reveal at the end to be
disappointed by") → case studies → founder/trust ("You Work Directly With Me,
Not an Account Manager") → testimonials → 3-tier pricing with monthly/lump-sum
toggle → 3-step process ("live in 14 days") → free tools ("Not ready to
talk?") → FAQ + stat strip → final CTA. Every section ends with one CTA. Full
`LocalBusiness` JSON-LD (address, geo, hours, priceRange, areaServed, sameAs
incl. Google Maps). Five hand-written neighbourhood pages with real local
detail. A separate pricing FAQ ("What to know before you choose a plan").
Honest expectation-setting ("Rankings depend on competition, content, and
time"). Explicit not-a-fit list.

**oakharborwebdesigns.com** (Ryan Postell, "$0 down / $175 mo"). Price in the
title tag. H1 "Small Business Web Designer" (no city; location pushed to 60+
templated city pages — thin, don't copy). Positioning is anti-WordPress /
anti-page-builder ("nothing TO hack", "100 PageSpeed scores", "test your own
site"). Design-stage money-back guarantee. Owner-answers-the-phone. Radically
candid FAQ on money mechanics (12-month minimum, no buyout, "$100 per page
after 5 — one time, not $300 a month, that would be crazy!"), plus "what if
something happens to you?" continuity answer. Nearly empty JSON-LD.

### Borrowed (in priority order) → where it landed

1. Price + $0 down in `<title>` and meta → homepage head.
2. H1 = audience + service + outcome; city in title/meta → homepage.
3. "What's included" checklist **plus a pricing FAQ right under the price**
   (page cap, extra pages, after month 12, out of scope) → small-business
   page.
4. Ownership/cancellation stated plainly and early — our model is the same as
   both references' (see [business-model.md](business-model.md)). Say it
   candidly, Oak Harbor style ("otherwise everyone would sign up for a month
   and cancel") and lead with what they *do* keep → homepage "Your Domain,
   Your Content, Your Data", small-business FAQ + "No Vendor Lock-In".
5. Process transparency instead of testimonials: design first, preview link,
   no big reveal; numbered 3 steps with a timeline → homepage "How It Works",
   small-business "How It Works".
6. Design-stage guarantee ("if I can't design something you like, we part
   ways and you owe nothing" — trivially true with $0 down) → small-business.
7. Founder-direct positioning + founder story → about page.
8. "Good fit / not a fit" lists → homepage.
9. Comparison vs Wix/Squarespace and vs $5k agencies on total cost, speed,
   who-does-the-edits → homepage price band, small-business FAQ.
10. Frank FAQ with money mechanics, "what do you need from me", "can I edit it
    myself", "where is it hosted", "what if something happens to you" →
    small-business `#faq`.
11. Full `LocalBusiness` JSON-LD with `areaServed`; footer NAP; Google
    Business Profile `sameAs` once it exists → homepage JSON-LD (partial —
    geo/hours/sameAs still to add).
12. Small-business empathy line for the monthly fee ("prices go stale, hours
    change, a photo needs swapping, none of it urgent enough to chase down a
    developer") → small-business "Why Monthly".
13. Every section ends with exactly one CTA → both pages.
14. Honest expectation-setting on SEO → small-business FAQ.

Deferred, not rejected: one soft "Not ready to talk?" self-check (Oui's free
tools, cut to one). Service-area / neighbourhood pages are **rejected** — see
"The location problem".

Not copying: templated city pages across many states, "Hours: 24/7 /
Location: United States", bilingual site chrome, six free tools, industries
mega-menu, animations on either site.

## Rule: borrow the pattern, never the sentence

Audited 2026-08-15 after the first draft: six phrases had come across
near-verbatim from Oui ("websites don't break all at once… chase down a
developer"; "no reveal at the end to be disappointed by"; "you email me the
change, I make it") and Oak Harbor ("otherwise everyone would… we'd be out of
business"; "if we can't design something you like, money back"; "we never take
hostages"). All rewritten. When mining competitor sites in future, take the
*section* and the *question*, then write the answer cold in Kevin's voice —
the engineer angle is ours and theirs isn't, so it should read differently.

## Where the terms live

Prices, minimum term, cancellation, ownership and what's included are **not**
in this file — they're in [business-model.md](business-model.md), which copy
has to match. Split out 2026-08-16; before that they were the tail of this
document.

Where the terms surface in the copy:

- **Minimum term** — homepage price band (one clause) and not-a-fit list;
  small-business price card (one clause, links to FAQ), "Why a Monthly Fee?",
  meta/`Service` JSON-LD, and four FAQs ("Is there a contract or a minimum
  term?", "What if I have to cancel during the first year?", "What happens
  after the first year?", "What if I don't like the design?").
- **Ownership / cancellation** — homepage "Your Domain, Your Content, Your
  Data"; small-business FAQ and "No Vendor Lock-In".
- **One-time build** — none. Removed 2026-08-16; see business-model.md.

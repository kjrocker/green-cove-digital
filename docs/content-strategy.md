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
- **Local SEO wants a single-purpose entity.** Google Business Profile,
  consistent NAP, one `LocalBusiness` schema, service-area copy — all of it is
  simpler and stronger with one offer.

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

- [ ] **Personal site "Work with me" page** (kevinrocker.com, not this repo):
      scope, rate, how to engage, and one line — "engagements are contracted
      through Green Cove Digital LLC". When it's live, 301
      `/services/consulting` → that page and delete `consulting.astro`.
- [ ] **pgLantern proof** now goes on the homepage/about as "the agency ships
      real product" (pglantern-portfolio.md items 2, 4, 5). Item 3 (consulting
      page proof block) is dropped; that proof belongs on the personal site.
- [ ] Google Business Profile, NAP consistency, and a real service-area
      statement (Charlotte + surrounding, and "everywhere remotely").
- [ ] Deepen homepage and small-business page content per the reference-site
      patterns below (UPDATE.md's original ask).

## Standing rules

- **This site gets no blog or content section.** All writing goes to the
  personal blog. (Carried over from pglantern-portfolio.md.)
- **Consulting is not mentioned in nav, homepage, or as a service anywhere on
  this site.** The about page may say what Kevin has *done* (dispatch
  software, PostgreSQL work, pgLantern) as credibility. It may not say what he
  *sells* beyond websites.
- **One entity, one offer** in structured data: `LocalBusiness` → web design
  for small businesses. Person schema on `/about` uses `worksFor` to point at
  it.
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
tools, cut to one); a handful of hand-written service-area pages
(Charlotte neighbourhoods / nearby towns) — only once the GBP exists.

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

- **Minimum term** — homepage hero, price band and not-a-fit list;
  small-business price card, "Why a Monthly Fee?", "No Vendor Lock-In",
  meta/`Service` JSON-LD, and five FAQs ("Is there a contract or a minimum
  term?", "What if I have to cancel during the first year?", "Can I just buy
  the site outright instead?", "What happens after the first year?", "What if
  I don't like the design?").
- **Ownership / cancellation** — homepage "Your Domain, Your Content, Your
  Data"; small-business FAQ and "No Vendor Lock-In".
- **One-time build** — its own section, `#own-it` on the small-business page.

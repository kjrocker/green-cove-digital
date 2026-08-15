# Content review — 2026-08-16

A critical read of every public page as it stands at commit `110d00e`
(`index`, `about`, `contact`, `thanks`, `services/small-business`, and the
unlinked `services/consulting`), checked against
[business-model.md](business-model.md) and
[content-strategy.md](content-strategy.md). Findings only — nothing here has
been changed on the site. Each item says where it is, why it matters, and
what I'd do; severity is my judgement of how much it costs a prospect's trust
or a sale.

Legend: **H** = fix before sending traffic; **M** = fix soon; **L** = polish.

## Status (2026-08-16, same day)

**Applied** in the working tree: all of §1 (design-fit FAQ, "no contract to
sign", "No commitment", incentive line, CTAs unified to "Book a Call",
homepage ownership clause, "No Vendor Lock-In" → "What You Keep", Sound
Familiar card 3, "five or fifty", "couple" → "few"); §2 Squarespace → "$20–40",
"yours will too" softened, booking/reservations/payments → "can be added",
about-page "promise" line; §3 heading → "You Deal With Me, Start to Finish";
§5 footer NAP line uncommented, contact hero, `404.astro`; §6 `Person.name`,
`jobTitle`, title separators/lengths, meta descriptions; §7 "$0 down"
everywhere, US spellings, unused tagline removed, ("pick up the phone" kept — Kevin: every client has his number
by the time they're a client, whether or not it's on the site).

**Answered by Kevin, 2026-08-16** (`addressing-questions.md`, folded into
business-model.md): no phone, no street address, no greencovedigital.com
mailbox — none of these are coming, so §5's first two items and the
NAP/`geo` parts of §6 are closed as *won't do*. Translation is case-by-case
(bullet removed from "What's Included", FAQ softened). Refresh is every four
years (FAQ updated). Backups/SSL/infra belong to the host and are not
described in copy. $5,000 is an ad-hoc ballpark and stays. Tap-to-call stays.
Nav item is now "Websites and Pricing".

**Still open**: `/services/consulting` — the personal-site page exists but
Kevin doesn't want to link to it from here, so the planned 301 is off; noindex
or leave as-is is undecided. §4 restructure of the small-business page; a
demo/mock site (§5); `og:image`; contact-form fields and the error-banner bug
(known-issues.md); "couple of business days" and 2–4 weeks are still
unconfirmed.

## 0. The location claim (added 2026-08-16, after the first pass)

**H — "Based in Charlotte, NC" is not true**, and the site says it or implies
it in about a dozen places (titles, meta, JSON-LD `address`, about, contact,
footer, FAQ "outside Charlotte" with "no travel surcharge", consulting page).
Kevin is a Charlotte native living in Europe with no fixed address; the LLC
is registered elsewhere. This reframes several items below: §5's NAP /
address / hours items and §6's `geo` / `sameAs` / GBP items are not just
*won't do* — they'd be false, and a Google Business Profile would be a
guideline violation. The local-SEO premise of the 2026-08-15 strategy
doesn't hold. Full analysis and a recommendation (hometown-as-affinity, not
address; `Organization` not `LocalBusiness`; city out of the title; a
model-led rather than city-led keyword strategy) are in
[content-strategy.md → "The location problem"](content-strategy.md#-the-location-problem-flagged-2026-08-16).
**Resolved the same day**: Kevin chose national/remote; every location
claim above was rewritten (Charlotte survives only as "Charlotte native" on
the about page), JSON-LD is `Organization` without an address, and the city
is out of titles and meta.

## 1. Copy that contradicts the offer

These are the ones that matter most: the site says one thing about money or
commitment in one place and something else in another. A careful prospect
(and this is a $2,160 first-year decision) will notice.

- **H — "we shake hands and walk away."** `small-business.astro`, FAQ "What
  if I don't like the design?" Business-model.md is explicit that the only
  softening allowed is "Then we don't launch it," and that a "shake hands and
  walk" pre-launch exit must not be described anywhere. As written it reads
  as: if you don't like the design, you owe nothing — which contradicts the
  FAQ two entries up ("twelve monthly payments, starting with the first
  one… the remaining monthly payments are still owed"). This is a
  money-mechanics ambiguity in the client's favour, so it's the kind of
  sentence that gets quoted back during a dispute. Cut the last sentence, or
  make it consistent with the term ("If we can't land on a design you're
  happy with, we don't launch — I'd rather keep iterating than ship
  something you hate").

- **H — "no contract to sign, nothing to pay yet."** `small-business.astro`,
  How It Works step 1. The FAQ answers "Is there a contract or a minimum
  term?" with "Yes." Both cannot be true. What's meant is "you don't sign
  anything *on the call*" — say that, or drop the clause. The written summary
  the next sentence promises *is* the thing they'll sign.

- **M — "No commitment."** Final CTA on `small-business.astro`, directly
  below seventeen FAQs explaining a twelve-month commitment. It refers to
  the call, but sits under a "Ready to Get Started?" heading and a "Start
  Your Website — $0 Down" button, so it reads as a description of the offer.
  Homepage's version ("Nothing to sign and nothing to pay for the call") is
  correct — reuse it.

- **M — The incentive argument is undercut by the term.** "Why a Monthly
  Fee?": *"I only get paid next month if the site is still fast, secure and
  online this month."* Under a twelve-payment minimum that's not true for the
  first year, and the same section says so two paragraphs later. Either
  scope it ("after the first year…") or lead with the honest version of the
  incentive: the fee is what keeps the small fixes happening.

- **M — "Get a Free Quote."** Hero and closing CTA on both main pages, plus
  the contact meta description. There is nothing to quote: the price is flat,
  public, and in the title tag. "Quote" tells the visitor the price might be
  different for them, which is the opposite of the pitch. Also there are
  currently six different CTA labels for the same action ("Get a Free
  Quote", "Get a Free Website Quote", "Book the call", "Start Your Website —
  $0 Down", "Get in Touch", "Ask Kevin"). Pick one primary ("Book a call" or
  "Start your site") and use it everywhere the action is the same.

- **M — Ownership is euphemised on the homepage.** "Your Domain, Your
  Content, Your Data" ends: *"The subscription covers the site I build and
  run, and nothing else."* That's the sentence that's supposed to carry
  "you don't keep the site if you cancel," and it doesn't. Business-model.md
  asks for candour, and the small-business FAQ delivers it ("The site itself,
  no"). The homepage should say it in one plain clause. Related: the
  small-business section heading **"No Vendor Lock-In"** over-claims — a
  site that comes down when you stop paying is, by most people's definition,
  a form of lock-in. The body is honest; the heading isn't. "What You Keep"
  or "Your Domain, Your Content, Your Data" (matching the homepage) is safer.

- **M — "Sound Familiar?" card 3 attacks our own model.** The Wix/Squarespace
  card complains that *"the monthly fee keeps creeping up, and you're not
  sure who actually owns any of it."* Green Cove is also a monthly fee, and
  under Green Cove the client also doesn't own the site. A prospect who reads
  the FAQ afterwards will connect those. Keep the DIY pain ("every change is
  a weekend") and drop the two clauses that boomerang.

- **L — "five pages or fifty."** `about.astro`, "What I Believe". The offer
  is five pages plus $100 each; "fifty" invites the wrong expectation and
  the FAQ already says large sites are "a different kind of project".

- **L — "Every couple of years I'll refresh the design"** (FAQ) vs
  business-model.md "every few years". Two ≠ few. Also worth confirming this
  promise is one Kevin wants in writing — a redesign every two years at $180
  a month is a lot of unbilled hours.

## 2. Claims that aren't confirmed, or that we can't currently back

Business-model.md already lists backups, tap-to-call, "couple of business
days", 2–4 weeks and the $5,000 comparison as *stated but not confirmed*. They
are not stated once — they're load-bearing:

| Claim | Where it appears |
|---|---|
| Backups | homepage How It Works step 3; small-business "What's Included", How It Works step 3, hosting FAQ |
| 2–4 weeks | homepage How It Works step 1; small-business "What It Costs", FAQ "How long does it take?" |
| Edits "within a couple of business days" | small-business FAQ 1 |
| Reply within one business day | contact hero, contact "What Happens Next", thanks page, small-business FAQ footer |
| $5,000 agency build | homepage price band; small-business "Why Monthly" |
| Tap-to-call | homepage "Built for Phones First" |

Add to that list, because none of these are in business-model.md at all:

- **H — Translation "by certified professional translators".** Small-business
  "What's Included" (as an "(additional fee)" bullet in a list titled
  *included*) and the last FAQ. Neither the service, the vendor, nor the
  pricing basis is recorded anywhere. Either confirm and document it, or cut
  it — a "what's included" list should not contain things that cost extra.
- **M — "Squarespace charges $33/month."** Twice (homepage price band,
  small-business "What It Costs"). Squarespace's published plans don't land
  on $33 in any tier/billing combination I know of, and the number will
  drift. Say "around $25–40 a month" or "$20–40 a month depending on plan",
  and date-check it once a year. Same for "a $0 builder is cheaper".
- **M — "This site scores 100 on Google Lighthouse… and yours will too."**
  Homepage "Fast Enough to Rank", small-business hero and "Built for
  Performance", about "Built Like Real Software". Four places, and the
  small-business page invites the visitor to go test it. Fine as long as it's
  true on the day they test — which means it needs to be true on mobile, on
  a cold cache, on the live domain, and it should be checked in the deploy
  process, not assumed. The stronger risk is *"yours will too"*: a client
  site with the optional content editor, a booking widget, or a Google Maps
  embed will not hit 100 without effort. Promise "fast" and "faster than
  your competitors"; keep 100 as what *this* site does.
- **M — Booking, reservations, payments.** "Perfect For" promises "makes it
  easy for clients to book a consultation", "reservation integration if
  needed", "simple payment processing if you need it". None of these are in
  the included list or the FAQ, and each is a real integration with a
  third-party fee. Say "can be added" and let the call price it.
- **L — "the reason I can promise your site will still work… in five years"**
  (about, "Deep in the Open-Source Community") — contributing to PostgreSQL
  is a fine credibility line, but it isn't the *reason* a marketing site will
  work in five years. It reads as a non-sequitur to a non-technical reader.
  The real reason (no plugins, static pages, standards) is in the previous
  card — move it or drop the "promise".

## 3. Contradiction with the "one person" positioning

The site leans hard on founder-direct: "One Person, Start to Finish", "You
talk to me, the person writing the code, every time", "I write every line of
code myself". Meanwhile business-model.md says content may be produced by a
writer or SEO specialist, and the site says translations are done by
translators. The copy handles content with the passive voice ("content is
written from our conversation") — that's fine and deliberate. But "One
Person, Start to Finish" as a *heading* is not compatible with a
subcontracted writer. Suggest "One Point of Contact, Start to Finish" or
"You Deal With Me" — the actual promise (no account manager, no handoff)
survives, and it stays true.

## 4. Two pages telling the same story

`index.astro` and `services/small-business.astro` both contain: the price
band with the $0-down gloss, the Squarespace comparison, a three-step "How It
Works", a "who this is for" grid, and a closing CTA. Roughly 60% of the
small-business page restates the homepage. Consequences:

- The reader who follows "See What's Included" from the hero gets the same
  pitch again before reaching the new material (the included list and the
  FAQ), which is what they clicked for.
- Both pages target "small business websites" + city. `<title>`s
  are "Small Business Websites in Charlotte, NC — $180/Month, $0 Down" and
  "Small Business Website Pricing — $180/Month, $0 Down"; H1s are "Websites
  for Small Businesses, Built by a Real Engineer" and "Small Business
  Websites". They compete with each other for the same query.

Recommendation: make the small-business page **the pricing/details page** and
own it. H1 "Pricing and What's Included", drop the hero paragraph and "How
It Works" (link back to the homepage's), keep What It Costs → Why Monthly →
Built for Performance → Perfect For → What You Keep → FAQ. Rename the nav
item to match ("Pricing" or "Websites & Pricing" — "For Small Businesses" is
a leftover from when there was also "For Software Teams"). The homepage keeps
the pitch and the process.

## 5. Things a prospect will look for and not find

- **H — No phone number, anywhere.** The homepage's fourth pain card ends
  *"You need someone who'll still pick up the phone."* The site offers no
  phone to pick up. Contact page has email only; footer has email only. Both
  reference sites lead with the owner's phone. Kevin's call (2026-08-16): the line stays — clients get his
  number once they're clients; publishing one on the site is a separate
  decision.
- **H — Email is `me@kevinrocker.com`.** On a site whose entire argument is
  that Green Cove Digital is an established business with one clear offer,
  the contact address is a personal domain. It also weakens the "one entity"
  structured-data story. `kevin@greencovedigital.com` (or `hello@`), and
  keep the personal address for the personal site.
- **H — No example work.** Not a testimonial, not a portfolio item, not a
  screenshot, not "here's a sample site I built for a fictional plumber."
  Content-strategy.md consciously chose process transparency over
  testimonials, but the reference sites have *both*. The only proof on the
  site is a Lighthouse score. One demo site (or two mock designs for
  plausible local businesses, clearly labelled as demonstrations) would do
  more than any paragraph on the page. This is the biggest content gap.
- **M — No address, hours or service-area statement.** Content-strategy.md
  lists footer NAP and a real service-area statement as to-do; the footer
  NAP line is literally commented out in `Footer.astro`. `LocalBusiness`
  JSON-LD has no `telephone`, `geo`, `openingHours`, `image`/`logo`, or
  `sameAs`. This is the local-SEO groundwork the site *sells* — the site
  should be its own best example.
- **M — No 404 page.** `src/pages` has no `404.astro`, so Cloudflare serves
  its default. Small, but it's the one page every mistyped URL lands on.
- **L — No `og:image`.** Known-issues.md already records that `OG.image`
  points at a file that doesn't exist. Every share of the site on LinkedIn,
  Facebook, or iMessage renders as a bare link.
- **L — Contact form asks nothing useful.** Name, email, message. Two
  optional fields — "Business name" and "Current website (if any)" — would
  qualify the lead and make the first reply faster. Also, per known-issues,
  the error banner never renders, so a failed submission is silent.
- **L — Contact hero: "Ready to get your business online?"** excludes the
  homepage's first two personas, who already have sites. "Ready to talk about
  your website?" covers both.

## 6. SEO and metadata

- **M — Titles are too long to display.** Homepage `<title>` is ~82
  characters; small-business ~74. Google truncates around 55–60. The part
  that gets cut is "| Green Cove Digital", which is fine, but the em-dash
  price clause is borderline. Consider "Small Business Websites in Charlotte
  NC — $180/mo, $0 Down" and let the brand ride on the site-name display.
- **M — Meta descriptions are too long.** Homepage ~215 chars, small-business
  ~250. Google shows ~155–160 on desktop, less on mobile. Front-load the
  price and city; the "senior software engineer, not a template" tail can go.
- **M — About-page JSON-LD `Person.name` is `PERSON.firstName`** — the entity
  is "Kevin", not "Kevin Rocker". Should be `fullName`. `jobTitle` "Software
  Engineer" would be stronger as "Founder" (or "Founder & Software Engineer")
  since `worksFor` already points at Green Cove.
- **L — `priceRange: "$180/month"`.** Schema.org and Google expect a range
  string like "$$" or "$100–$200"; free text is tolerated but not parsed.
  The `Offer`/`UnitPriceSpecification` on the small-business page is the
  correct place for the number — it's already there.
- **L — `FAQPage` markup.** Since 2023 Google shows FAQ rich results only for
  authoritative government/health sites. Harmless to keep, but don't expect
  SERP real estate from it.
- **L — Title separators are inconsistent**: "—" on the two main pages, "-"
  on About/Contact/Thanks. Pick one.
- **L — H1s.** "About Me" and "Get in Touch" are fine for readers but say
  nothing to search. "About Kevin Rocker, Green Cove Digital" and "Contact
  Green Cove Digital" cost nothing. Homepage H1 has audience + service but no
  outcome or place — content-strategy.md's own pattern (#2) called for
  audience + service + outcome.
- **L — `/services/consulting` is still indexed** and still says "First
  consultation is free… for engineering teams", with its own `Service`
  JSON-LD from the same `LocalBusiness`. Strategy says keep it until the
  personal-site page exists; noting only that as long as it lives, the entity
  in structured data offers two unrelated services, which is what the
  2026-08-15 change set out to stop. If the personal page is more than a few
  weeks out, consider a `noindex` after all — referrals with a direct link
  are unaffected.

## 7. Voice, consistency and polish

- **"Real"** is doing a lot of work: "Built by a Real Engineer", "the way
  real software gets built", "Built Like Real Software", "a real advantage",
  "a real engineer who works on PostgreSQL itself". Once is a positioning
  line; five times reads as insecurity, and it implicitly calls every other
  web designer fake — which lands badly with a prospect who *has* a web
  designer they like. Keep the H1, vary the rest.
- **"$0 down" / "zero down" / "nothing down."** All three are on the
  homepage; `SITE.description` uses "zero down". Business-model.md says the
  phrase is "$0 down". Use it, and only it, in headings, titles and meta;
  "nothing down" is fine once in prose.
- **British spellings** in the FAQ: "colours", "catalogue". US business, US
  audience — "colors", "catalog". (Everything else on the site is US.)
- **`SITE.tagline` "Web Expertise, Pure and Simple"** is defined and used
  nowhere. Either delete it or decide it's the brand line and put it in the
  header/footer. As a tagline it's generic and doesn't mention small
  businesses — if it's going to appear, rewrite it.
- **Small-business hero** paragraph does three jobs (custom, local search,
  Lighthouse, service area) in one sentence, then repeats "Charlotte, NC and
  everywhere else" which appears again in the FAQ. Tighten.
- **Restaurants card**: "Update specials yourself — or email me and I'll do
  it." — good; that's the tone the whole page should have. The "Professional
  Services" card by contrast is a generic list of nouns.
- **"Fair question to ask a one-person business."** (FAQ, "What if something
  happens to you?") — the best answer on the page. The candour here is
  exactly what section 1 is missing elsewhere.
- **FAQ order.** Money questions first is right. "Do you offer other
  languages?" is last and reads as an afterthought; if it stays, it belongs
  after "Do you build online stores?" with the other scope questions.
- **Thanks page** says "You should see a confirmation email" — verified:
  `functions/api/contact.ts` does send one. Fine.

## 8. What I'd do first

In order, if only a few hours were available:

1. Fix the four money/commitment contradictions in §1 (shake hands, no
   contract, no commitment, incentive line). Half an hour, and it's the
   thing that could actually cost a client.
2. Add a phone number and a `@greencovedigital.com` email; uncomment and
   fill in the footer NAP.
3. Cut or confirm the translation bullet; move booking/reservations/payments
   to "can be added".
4. Retitle and slim the small-business page into the pricing page; rename the
   nav item.
5. Build one demo site (or two mock designs) and link it from "Why Work With
   Me?".
6. Trim titles/descriptions; fix `Person.name`; add `telephone`/`geo`/`sameAs`
   to `LocalBusiness` once the GBP exists.

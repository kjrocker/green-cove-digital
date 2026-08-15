# Business model: what Green Cove sells and on what terms

Reference for anyone writing copy. Every number, term and promise on the site
has to match this file. Confirmed with Kevin 2026-08-15 unless marked
otherwise.

For *how* the site markets this — positioning, SEO, page structure — see
[content-strategy.md](content-strategy.md).

## One product: the subscription website

The model is Oui Digital's — tiered monthly plans — with **one tier for now**.
There is no lump-sum / pay-once / one-time-build option, and the site must not
offer, hint at, or answer questions about one (Kevin, 2026-08-16: it
complicates the sale; a `#own-it` section and a "buy it outright" FAQ existed
briefly on 2026-08-15 and were removed). If a prospect asks, that's a
conversation for Kevin, not a promise on the site.

Every figure the copy quotes lives in `src/data/pricing.ts`; page copy
imports `PRICING` and `usd()` rather than writing numbers out. Three fields
hold the whole offer — `monthly`, `termMonths`, `extraPage` — and changing
`monthly` there is the *only* edit a price change needs.

Any total quoted on the site is **derived, not independent** — computed at the
call site as `monthly × termMonths` — so it can't drift from the monthly
price. But any dollar amount written out *in this document* is a copy and can
go stale; when the price moves, re-check every figure here against the
arithmetic. The competitor numbers ($5,000 agency, $33 Squarespace) are
deliberately *not* in `pricing.ts` — they aren't ours and shouldn't move when
our price does. The "three years with me is $X" comparison was dropped
2026-08-16: a multi-year total reads badly next to a $5,000 one-off, so the
copy compares $180/month against the agency's up-front price directly.

The site is built for **$0 down** and billed **$180/month**. Green Cove owns
the code; the site comes down if the subscription ends.

- **Billing starts when the work starts, not at launch.** The first $180 is
  what puts a client on the calendar — no lump sum, no deposit on top. **No
  refunds once work starts** — and the site doesn't talk about refunds at all.
- **Minimum term: twelve monthly payments, starting with the first one** —
  i.e. from the day the work starts, *not* from launch — then month-to-month
  with 30 days' notice. (An earlier version of this doc and the copy said the
  term started at launch; corrected 2026-08-16.)
- **Base is five pages**, one-time **$100 per extra page** (Oak Harbor's
  model). Additional Oui-style tiers can be added later without changing the
  shape of the offer.
- Content edits included. Design refresh **every four years** included
  (Kevin, 2026-08-16).

## Minimum term (decided 2026-08-15, corrected 2026-08-16)

Twelve monthly payments from day one. This **replaces the "no contract, cancel
anytime" line the site launched with** — that claim is gone from every page.

The reasoning is stated once, in the FAQ and "Why a Monthly Fee?": the build
is weeks of work, nobody is paying for it up front, so the first year of
subscription is what pays it off. It's framed as the explicit price of $0
down, and the copy doesn't offer an alternative — anyone who won't commit to a
first year is simply "not a fit" (homepage list).

**Say less, and let the FAQ carry the detail.** Body copy (hero, price band,
price card, "Why a Monthly Fee?") states the term in one clause at most —
"twelve-month minimum, then month to month" — and points at the FAQ. Do not
restate the reasoning, the start date, the notice period and the cancellation
mechanics in every paragraph that mentions the price; the 2026-08-15 rewrite
did, and it read like the contract pasted into a brochure.

**"$0 down" means no upfront lump sum. It does not mean a period of free
work** — billing starts when the work does. Keep the phrase; it is accurate
and it's the SEO hook in the title tags. What it cannot be paired with is
"nothing is owed until you approve the finished site", "full refund any time
before launch", "refundable in the first month" or "no term until launch" —
all shipped in 2026-08-15/16 rewrites, all false under the current model, all
gone (2026-08-16).

Don't soften "$0 down" into hedged substitutes either — an earlier pass
swapped in "no build fee," which concedes ground the phrase doesn't need to
concede. Say "$0 down" and, where the mechanics matter, gloss it as "no lump
sum up front."

Same shape as Oak Harbor's 12-month minimum — the pattern, not the sentences.

## Cancellation

The site says one thing: cancelling inside the first year means the remaining
monthly payments are still owed, with no penalty on top, and after month
twelve it's 30 days' notice. That's it.

The contract is stricter after launch than before it (Kevin, 2026-08-16), but
that distinction is **contract detail, not site copy** — don't describe a
pre-launch/post-launch split, a "shake hands and walk" pre-launch exit, or a
launch-based cancellation fee anywhere on the site. The one softening that
stays is the design-fit FAQ ("What if I don't like the design? Then we don't
launch it") — it's about not shipping something the client hates, not about
money.

## Ownership

Green Cove owns the code. The client owns the domain and every asset/word they
wrote or sent. Site comes down on cancel.

Say it candidly and lead with what they *do* keep. There is no case where the
code changes hands.

## What's included, and what to call it

- **Content**: say "professional" / "search-optimized". Do **not** say Kevin
  writes it himself — he may bring in a writer or SEO specialist. It is
  included, and to a high standard.
- **Hosting**: do **not** name a provider. Sites without a CMS and sites with
  one may be hosted differently; we can't promise a single host. Say
  "professionally managed hosting" / "modern infrastructure".
- **Small e-commerce** (a handful of products with checkout) is in scope;
  large catalogues are not.
- **Design refresh** every four years is included.
- **Translation**: offered case by case — no dedicated partner, no guarantee
  for any given language. Copy may say "often, yes… depends on the language,
  additional fee". It is **not** on the "What's Included" list (removed
  2026-08-16).

## Confirmed 2026-08-16 (from Kevin's answers to the content review)

- **Backups, SSL, infrastructure** are the hosting provider's (Cloudflare,
  CloudCannon, …). Copy may say they're "handled"; it must **not** name the
  provider or describe how (see Hosting above).
- **Tap-to-call** is a feature of the client's site and depends on the client
  supplying a phone number. Fine to list.
- **$5,000 agency comparison** is ad hoc — a ballpark, not a sourced figure.
  Keep "around $5,000"; don't harden it.
- **No phone number and no street address** are published for Green Cove
  itself, and there's no plan to. Contact is email; location is city/state
  only ("Based in Charlotte, NC"). The registered-agent address is in New
  Mexico and is not to be used as NAP. Don't propose adding either.
- **Email stays `me@kevinrocker.com`** for now — no greencovedigital.com
  mailbox yet.

## Stated in copy, not explicitly confirmed

- Content edits "within a couple of business days"
- Two-to-four-week turnaround

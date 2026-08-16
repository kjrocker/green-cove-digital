# Copy style review — 2026-08-16

A read of every public page at commit `ed5418a` for *how* things are said,
not *what* is claimed. [content-review.md](content-review.md) already covered
contradictions, false claims and structured data; this one is about prose:
sentences that work harder than they need to, points made sideways instead
of head-on, and paragraphs that build up to a "reveal" a reader would rather
have had in the first line. Findings only — nothing on the site has been
changed.

Constraints from [business-model.md](business-model.md) that I've kept every
suggested rewrite inside: don't say who writes the content (§"What's
included"), don't name the host, lead ownership with what the client keeps,
don't restate the term mechanics in every price paragraph. Where a finding
bumps into one of those, it says so.

## Status (2026-08-16, same day)

**Applied** in the working tree, per Kevin: everything in §1, §2 and §4
except where noted, plus a light pass on the consulting page. Decisions
taken while applying:

- **Ownership (§1 H)** — the guarantee is *narrow*: domain, files sent, and
  anything the client writes on the site (a blog, announcements). Copy now
  says that in the homepage card, "What You Keep", and the two FAQ answers,
  with "if you added a blog, every post is yours" as the example. The page
  copy written for the client is not promised either way. Recorded in
  business-model.md → Ownership.
- **"$0 down" gloss** — canonical sentence, used on home, price band and FAQ:
  "The first month's $180 is what starts the work — there's no lump sum up
  front and no deposit on top of it." ("puts you on the calendar" is gone.)
- **Term justification** — canonical: "The build takes weeks and nobody pays
  for it up front, so the first year's payments are what pay for it. That's
  the trade for $0 down." Used in "Why a Monthly Subscription" ¶3 and the
  contract FAQ.
- **Kept on purpose** (they earn it): the homepage hero's "not a template or
  an agency"; "quietly wrong about your own business"; "the way real software
  gets built" / "Built Like Real Software"; the roaster card's "done."; "No
  account manager, no handoff."; "Fair question to ask a one-person business."
- **§3 repetition** — Lighthouse still appears three times and 911/first
  responders three times (down from four); the "remote / across the US" line
  is down to about hero, contact (once), footer and FAQ. Left as is.
- Consulting page: hero, both dash-reveals, "no sales pitch" ×1, "deep
  experience", "actual", "not slide decks", "not just a list" — done. Still
  unlinked; the noindex question stays open in content-review.md.

Legend: **H** = it costs clarity on a money/ownership point, or a first-time
reader will stumble; **M** = tighten in the next pass; **L** = polish.

## 0. Overall

The copy is good. It's specific, it's honest, and most of it sounds like a
person. The problems are not general sloppiness; they're a handful of
*habits* that recur enough to become a texture, and a few places where the
habit lands on a fact the reader needs plainly (ownership, the first payment,
the term). Fix the habits and about two-thirds of the individual findings
below disappear.

The five habits, in order of how much they cost:

1. **Definition by negation** — "not a template or an agency", "not a page
   builder", "not a service I'm selling you", "not one who ships and moves
   on", "not a proprietary platform", "not a shared server or a computer in my
   office", "not slide decks", "not just a list of problems"… A dozen-plus
   across the site. Each one is a small piece of indirection: it makes the
   reader work out the positive claim from the thing you're not. One or two
   per page are positioning; five per page reads as anxiety.
2. **The em-dash reveal.** 88 em-dashes across seven pages (32 on the pricing
   page alone). Many are fine list-setters. The costly ones are the ones that
   *carry the point*: "…doesn't break when a plugin updates — because there
   are no plugins", "…a ranking factor and a conversion factor — people leave
   slow sites before they load", "…just the kind of engineer you're getting:
   one who…, not one who…". Rule of thumb: if the text after the dash is the
   thing you actually want the reader to know, make it the sentence.
3. **One fact, three metaphors.** The first payment is "what starts the work"
   (twice), "what puts you on the calendar", and "no lump sum up front". The
   twelve-month term is "the trade for $0 down", "the trade behind the
   twelve-month minimum", and "it takes about a year for that work to be worth
   doing". A reader who visits home + pricing + FAQ meets each fact three
   times in three costumes and has to check they're the same fact. Pick one
   sentence per fact and reuse it verbatim.
4. **Softening adverbs and "real".** *quietly* ×3, *actually* ×3 (+ "the
   actual bottlenecks"), *genuinely*, *properly*, *exactly* ×2, and *real*
   still ×5 after the last pass ("real software", "Real Software", "real
   advantage", "real understanding", "genuinely hard"). Every one can go
   without changing the meaning; most make the sentence sound less sure of
   itself, not more.
5. **Abstract noun where a concrete thing exists.** "the local-search
   groundwork that gets you found", "your business's identity", "professional
   online presence", "hosting infrastructure with a global network in front of
   it", "a different kind of project with very different requirements", "to
   charge for them in a way that makes sense", "respectful of the people who
   create content for it". Each is a placeholder for a specific thing that
   either exists in the copy elsewhere (schema, speed, structure, keywords) or
   should be said outright.

Repetition across pages isn't strictly what was asked, but it feeds the
"overwrought" impression, so §3 lists it briefly.

## 1. Sitewide findings

- **H — Whose words are "your content"?** Homepage: "every word and file you
  *write or send me* stays yours." FAQ: "every word of content *you wrote*."
  Business-model.md says exactly that — the client owns what they wrote or
  sent, and Green Cove owns the code. But the site also says, four times, that
  the content is written *for* the client. So the careful reader asks: does
  the professionally written copy go with me if I leave? The current phrasing
  neither says yes nor no — it narrows "your content" to "content you wrote"
  and hopes nobody notices the gap. That's the exact indirection this review
  is for, and it sits on the one ownership question a prospect will
  actually ask. **What I'd do:** decide, then put one plain sentence in the
  "Do I keep my website?" answer — either "…and the written copy, since it was
  written for your business" or "The copy, like the design, stays with the
  site." Whichever it is, the current wording will read as evasive the moment
  someone notices it.
- **M — "Professional, search-optimized content is written…"** appears in the
  price band, How It Works step 2, the "What's Included" list and the "What do
  you need from me?" FAQ. The passive is deliberate (no naming the writer),
  and that's fine — but the *phrase* is doing the passive's work of hiding the
  agent so visibly that it draws attention to itself. Vary it and shorten it:
  "The copy is written for you from our call — you don't write your own
  website." / "Copy written for you, tuned for search." One long form once (How
  It Works), the short form everywhere else.
- **M — CTA "Book a Call — $0 Down"** (homepage ×1, pricing ×1). $0 down is a
  property of the subscription, not of the call. Combined with "Nothing to
  sign and nothing to pay for the call" right above it, it reads as if the
  call itself has a price that's been waived. "Book a Call" is enough — the
  price is in the H1.
- **M — "…and I'll tell you what it costs"** (homepage closing CTA). The
  price is on every page; "what it costs" implies it varies. Drop it, or "…and
  confirm the price" if you want the beat.
- **L — Fragment punchlines.** "Great for the agency. Hard to justify for a
  five-person business." / "No account manager, no handoff." / "— done." / "No
  retainer required to get started. No sales pitch on the first call." / "If
  you'd rather run your business, this is." Individually fine — this is sales
  copy. Together they're a rhythm the reader starts to hear. Keep the two or
  three best (the roaster "done", "no account manager, no handoff") and write
  the rest as sentences.

## 2. Page by page

### Homepage (`index.astro`)

- **M — Price band, sentence 2.** "That covers a custom design, professional,
  search-optimized content, hosting, your domain, security updates, ongoing
  changes, and the local-search groundwork that gets you found." Nine items,
  and the comma inside "professional, search-optimized" makes it look like
  ten. "the local-search groundwork that gets you found" is habit #5 — the
  pricing page says what it is ("schema, speed, structure, keywords"). Rewrite:
  "That covers design, copy, hosting, your domain, security updates, every
  ongoing change, and the local-SEO basics that get you found on Google."
- **M — Price band, comparison paragraph.** "For comparison: a template on
  Squarespace runs $20–40 a month before you've paid anyone to set it up, and
  a typical agency build starts around $5,000 up front — before hosting or a
  single change. Mine is $180 a month, with hosting and every update already
  in." Two parallel "before…" clauses building to "Mine is" — a reveal of a
  number that's already in bold two paragraphs up. Plainer: "Squarespace is
  $20–40 a month and you build it yourself. An agency build starts around
  $5,000, then hosting and changes are extra. This is $180 a month with
  everything in." (Same comparison is on the pricing page in the good, plain
  form — "Squarespace charges $20–40 a month and makes you build it. I build
  something custom for $180 and keep looking after it." — reuse that.)
- **M — "Fast Enough to Rank" card.** "…because speed is a ranking factor and
  a conversion factor — people leave slow sites before they load." Jargon,
  then the plain version after the dash. Lead with the plain version: "…because
  slow sites lose two ways: Google ranks them lower, and people leave before
  they load."
- **M — "Your Domain, Your Content, Your Data" card.** "No platform is holding
  your business's identity. What the subscription covers is the site itself —
  I own the design and code, and run it for as long as you're a client. If you
  ever leave, everything that's yours goes with you." Three indirections in a
  row: an abstraction ("identity"), a cleft sentence ("What the subscription
  covers is…") that delays the actual point, and a tautology ("everything
  that's yours goes with you" — which is what, exactly? the sentence before
  the abstraction already listed it). Business-model.md wants what-you-keep
  first, and that's right; but the second half can be direct: "The site itself
  — the design and code — is mine, and I run it for as long as you're a
  client. Leave, and your domain, your content and your files go with you."
- **M — "Who This Is For" opening.** One 45-word sentence: a semicolon list,
  a dash, then "small businesses anywhere in the US that need a professional
  site that gets found and turns visitors into calls, without an in-house
  marketing team." Split: "Plumbers, electricians and contractors. Coffee
  roasters, cafés and restaurants. Boutiques and small shops. Lawyers,
  accountants and therapists. Small businesses anywhere in the US that need a
  site that gets found and turns visitors into calls — and don't have a
  marketing team to make that happen."
- **M — How It Works, step 2.** "Professional, search-optimized content is
  written from our conversation — you don't have to write your own website —
  and the design is built around your brand, or I help you sort one out." A
  parenthetical dash-clause in the middle of a compound sentence with its own
  "or" tail. Two sentences: "The copy is written for you from our call — you
  don't write your own website. The design is built around your brand, or we
  work one out together." ("sort one out" is British; everything else on the
  site is US.)
- **L — "Sound Familiar?" card 1:** "Google has *quietly* stopped sending
  people to it." Cut "quietly" (see §0.4). Card 3: "every change eats a
  weekend" — hyperbole that a Squarespace user knows is hyperbole. "every
  change costs you an evening" is closer to true and still lands.
- **L — Hero:** "designed, built, hosted and looked after by an experienced
  engineer, not a template or an agency." Habit #1, but this one is earned —
  it's the positioning line. Keep. Note that "looked after" then recurs on
  about, pricing (×2) and the FAQ; it's a nice phrase, so ration it.
- **L — "I bring the same care to a five-page site for a plumber."** Fine
  here. It's the same beat as the About page's "are exactly what a plumber's
  or a bakery's website needs too" — a reader who hits both notices.

### About (`about.astro`)

This page has the highest density of the habits, which is expected — it's
where the voice stretches out — but three things actually mislead.

- **H — "Almost nobody sells them at that price."** (paragraph 2). *That
  price* refers to nothing: the price hasn't been mentioned yet on this page
  (it arrives in paragraph 3, after "So that's what I do:"). This is the
  reveal structure — history → gap → *ta-da, the offer* — and it has tripped
  over its own feet: the pronoun points forward. Either put "$180 a month" in
  this sentence, or cut the sentence; paragraph 3 makes the point.
- **H — Hero: "…and to charge for them in a way that makes sense."** Habit
  #5. Every visitor knows what "makes sense" is standing in for; say it: "…and
  to charge for them the way you'd rather pay — a flat monthly subscription
  instead of a big invoice."
- **M — "What I Believe."** The weakest section on the site. "The web should
  be fast, accessible, and respectful of the people who create content for it"
  — a plumber cannot tell what the last clause means for them. "exorbitant
  fees", "professional online presence" — the site elsewhere doesn't talk like
  this. "Good software is thoughtful software — built with real understanding
  of how people use it" — an aphorism whose two halves are the same word.
  Everything true in this section is said more concretely in the cards below
  it. **What I'd do:** cut it, or reduce it to the two concrete sentences: "I
  write every line of code myself and stand behind it. That's the standard for
  a five-page site or a fifteen-page one."
- **M — "Deep in the Open-Source Community" card, sentence 2.** "That's not a
  service I'm selling you — it's just the kind of engineer you're getting: one
  who maintains software for the long haul, not one who ships and moves on."
  Three contrast constructions nested in one sentence (not X — it's Y: one
  who A, not one who B). The point is one clause long: "I've maintained
  software for years, and I'll maintain yours." Then sentence 3: "It also
  means I build on open web standards, not a proprietary platform" — it
  doesn't; contributing to Postgres and building on web standards are two
  unrelated facts joined by "also means". Make them two sentences and drop the
  causal link. The closer — "nothing about the site is a secret only I know" —
  is the best line in the card. Keep it.
- **M — "Built Like Real Software" card.** "I have — for over a decade, on
  systems where an outage meant a 911 call didn't get dispatched." Dramatic
  pause plus the third appearance of the 911 line on the site (homepage card,
  About ¶2, here). "Your site gets the same habits: version control, automated
  builds, and a boring, reliable host" — jargon to the audience; on the About
  page it's tolerable, but keep it to the one line it is. Then: "…doesn't break
  when a plugin updates — because there are no plugins." Habit #2 at its
  purest. Plain: "There are no plugins to break when they update." Same
  information, no drumroll.
- **L — ¶1 "Along the way I got deep into the PostgreSQL database"** — "got
  deep into" is casual-vague next to the concrete list before it. "…and became
  a contributor to PostgreSQL" is shorter and says more.
- **L — "the way real software gets built"** (hero) and "Built Like Real
  Software" (card): two of the five surviving "real"s. content-review.md §7
  already made the case; the About page is where the word still clusters.

### Contact (`contact.astro`) and Thanks

- **M — "Everything happens remotely — calls, previews and updates — with
  small businesses across the US."** Two dashes and a prepositional phrase
  hanging off the wrong noun ("happens remotely… with small businesses").
  It's also the fifth place the remote line appears (About hero, footer, FAQ,
  llms.txt). On the contact page it reads defensive — the visitor is already
  here. If it stays: "I work remotely with businesses anywhere in the US;
  calls, previews and updates all happen online."
- **L — Hero "a first one or a better one"** is the same construction as
  About's "or a better one than you have now?" One of them can be plain.
- **L — "What Happens Next": "No obligation and nothing to pay up to that
  point."** "up to that point" is honest and precise, but a reader may hear
  "and then you pay". Since the summary isn't a payment either: "No
  obligation, and nothing to pay until you've read the summary and said yes."
- Thanks page is fine. "your project" vs "your business" everywhere else — L.

### 404

- **L — "Nothing you were looking for is lost — it's just somewhere else."**
  Twee, and not something the page can know. The first sentence and the list
  do the job.

### Pricing (`services/small-business.astro`)

The top of the page is the plainest copy on the site — "Squarespace charges
$20–40 a month and makes you build it. I build something custom for $180 and
keep looking after it" is the model for everything else. Findings are mostly
lower down.

- **H — "$0 down" glossed three ways.** Price band: "The first month's $180
  is what starts the work, and there's nothing else to pay." FAQ: "The first
  $180 is what puts you on the calendar — there's no lump sum up front and no
  deposit on top of it." Homepage: "the first month's $180 is what starts the
  work." "There's nothing else to pay" is also ambiguous — nothing else *at
  the start*, or ever? Pick one sentence and use it in all three places:
  "You pay the first month's $180 when work starts. There's no deposit or
  build fee on top of it." Business-model.md's own gloss ("no lump sum up
  front") can be the short form.
- **H — The term justified three ways.** "Why a Monthly Subscription" ¶3:
  "It's also the trade behind the twelve-month minimum. Building the site is
  weeks of work, paid for by the first year of the subscription." FAQ
  contract: "…at $180 a month it takes about a year for that work to be worth
  doing — that's the trade for $0 down." Business-model.md asks for the
  reasoning stated once and pointed at. "It takes about a year for that work
  to be worth doing" is the roundabout one — it makes the reader do the
  arithmetic to reach "the first year pays for the build". Say that, in both
  places, in the same words: "The build takes weeks and nobody pays for it up
  front, so the first year's payments are what pay for it. That's the trade
  for $0 down." (The FAQ's last sentence — "I'd rather ask you for twelve
  months than for a few thousand dollars on day one" — is good; keep it as the
  close.)
- **M — "What You Keep" ¶2: "The only thing I own is the design and the
  code…"** "Only" minimises the website — which is the product. Same
  indirection as the homepage card, and here it's next to "your business's
  identity isn't tied up in a large corporation", an abstraction. Lead with
  what they keep (per business-model.md), then say the rest without the
  "only": "The site itself — design and code — is mine, hosted and looked
  after for as long as you're a client. If you leave, your domain, content and
  files go with you and the site comes down." The FAQ already says "The site
  itself, no" — the section above it shouldn't be coyer than the FAQ.
- **M — "Why a Monthly Subscription" ¶1.** This is the best-written paragraph
  on the site and it *is* a build-to-reveal ("So it doesn't get done, and a
  year later your site is quietly wrong about your own business"). It earns
  it — it's persuasion, not fact-delivery — so keep the shape. Two nips: "Each
  fix is a five-minute job, but each one is small enough that nobody wants to
  file a ticket or pay a minimum fee for it" → "Each fix takes five minutes,
  and nobody files a ticket or pays a minimum fee for five minutes." And
  "quietly" is the second of three; this is the one to keep if only one stays.
- **M — ¶2 "It also lines up my incentives with yours."** Business-school
  phrasing, and the claim is thin during year one. Plainer and truer: "After
  the first year you only keep paying if the site is still fast, secure and
  online — which is how I'd want it too."
- **M — Vertical cards restate their headings.** "Plumbers, Electricians and
  Contractors" → "Websites for the trades — plumbers, electricians,
  landscapers, HVAC, general contractors." "Boutiques and Small Shops" →
  "Websites for boutiques, specialty stores and makers." "Lawyers, Accountants
  and Therapists" → "Websites for professional practices — law firms,
  accountants, therapists, consultants." Each first sentence is a fragment
  that repeats the h3 for search engines and reads as filler to a person. The
  roaster card doesn't do this and is the best of the four. Start each card
  at its second sentence; if the extra nouns (landscapers, HVAC, makers,
  consultants) matter for search, fold them into the sentence that follows.
- **M — Lawyers card body** is still the generic one: "establishes
  credibility, explains your services clearly, and makes it easy for clients
  to get in touch." Every practice website "establishes credibility". What
  does the site actually *have*? "Your practice areas, who you are, how to
  book — and nothing that makes a nervous first-time client feel sold to."
  (Adjust to what you'd actually build; the point is one concrete thing.)
- **M — "Built for Performance."** "convert better", "modern hosting
  infrastructure", "held to the same bar" (second use), "This site scores 100
  on Google Lighthouse" (third use). "Curious how your current site does? Run
  it through Google's free PageSpeed Insights — then run this one" is the
  keeper. Trim the paragraph above it to: "Slow sites lose visitors and rank
  lower. Mine load in under a second on a phone."
- **L — Hero: "Here's exactly what it costs and what's included."** The
  price is in the title, the H1 and the h3 below; "exactly" is filler. "What
  it costs and what's included" or cut the line.
- **L — "New here? See how it works, start to finish."** "New here?" is
  chatty in a way the page otherwise isn't; "start to finish" is filler.
  "First time? See how it works." or just the link.

#### FAQ

Mostly plain and the "What if something happens to you?" answer is still the
best on the site. Findings:

- **M — "What if I have to cancel during the first year?"** "The first year
  is a commitment, so the remaining monthly payments are still owed — there's
  no penalty on top of that, and nothing at all once the year is up." The
  soft lead-in ("is a commitment, so…") delays the fact, and "nothing at all
  once the year is up" is ambiguous (nothing owed if you cancel after month
  twelve? nothing extra ever?). Plain: "You still owe the remaining months of
  the first year — no penalty on top. After month twelve, cancelling costs
  nothing but 30 days' notice. Either way, your domain and your content stay
  yours."
- **M — "How is this different from Wix or Squarespace?"** The middle
  sentence is 40+ words with stacked relative clauses ("a custom site that's
  designed, written and maintained for you, and that's built to load faster
  and rank better than a template can"). And the closer's parallelism
  misfires: "If you enjoy building websites, a builder is cheaper. If you'd
  rather run your business, this is." — the ear completes "this is
  [cheaper]", which isn't the claim, and it reads a shade snide. Rewrite the
  close: "If you enjoy building websites, a builder is cheaper. If you'd
  rather spend that time on your business, this is what it's for."
- **M — "Do you build online stores?"** The refusal is indirect: "A large
  catalog with inventory, shipping rules and thousands of SKUs is a different
  kind of project with very different requirements." Say what happens: "…is a
  different kind of project, and not one I take on" (or "…one we'd scope
  separately" — whichever is true).
- **M — "Do you offer other languages?"** "Often, yes… for an additional fee
  that *depends* on the amount of content. It *depends* on the language, so
  ask…" Two hedges, two "depends". Business-model.md allows exactly this
  hedge; it can still be one sentence: "Sometimes. For Spanish and some other
  languages I bring in a professional translator (not machine translation)
  for an extra fee based on how much content there is. Ask, and I'll tell you
  whether I can do yours."
- **L — "Will it show up on Google?"** "ships with", "done properly", "local
  business schema", "a real advantage". Plain: "Every site gets the technical
  SEO basics: fast, mobile-first, clean structure, local business markup, and
  copy written around what your customers search for. That puts you ahead of
  most small business sites. But nobody can promise a ranking…"
- **L — "Where is the site hosted…?"** "modern, professionally run hosting
  infrastructure with a global network in front of it" — the constraint is
  no provider name, understood, but "a global network in front of it" means
  nothing to the audience. "professionally managed hosting, not a shared
  server or a computer in my office" is enough; the second sentence (nothing
  to break into) carries the security point well.
- **L — "What does $180 a month *actually* cover?"** / "so they *actually*
  happen" / "what your customers *actually* search for" — cut all three.
- **L — "Most of my clients I never meet in person, and it has never
  mattered."** Inverted syntax for effect. "I never meet most of my clients in
  person, and it has never mattered."
- **L — "What happens after the first year?"** "there's no 'introductory
  rate' that quietly steps up in month thirteen" — third "quietly", plus scare
  quotes. "The price doesn't move and the service doesn't change" already
  says it; the second clause can go.

### Consulting (`services/consulting.astro`)

Unlinked referral page, different audience; content-review.md has it as an
open question (noindex or leave). Briefly, because the same habits are here
in a more generic key:

- "two technologies that large teams depend on and that are genuinely hard to
  get right" — padded justification; the hero can be one sentence.
- "PostgreSQL is used everywhere — and it's easy to use it wrong" (dash
  reveal); "working for you instead of against you" and "a schema that's
  started working against you" — the same cliché twice on one page.
- "First consultation is free" ×4 and "no sales pitch" ×3 on one page.
- "prioritized fixes, not just a list of problems", "Practical sessions, not
  slide decks", "the *actual* bottlenecks", "deep experience with the entire
  monorepo ecosystem", "a second pair of eyes" — habit #1 and stock
  consultant phrasing.

If the page is going to keep living, a one-hour pass with the same rules as
the main site would do it. If it's going noindex, leave it.

## 3. Repetition across pages (brief)

Not the brief, but part of the texture. Counts across the four linked pages:

| Line / claim | Where |
|---|---|
| Lighthouse 100 | home, about, pricing |
| 911 / first responders / dispatch | home card, about ¶1, about ¶2, about card |
| "Working remotely with small businesses across the US" (or near) | about hero, contact ×2, footer, FAQ |
| "held to the same bar" | home, pricing |
| "looked after" | home hero, about, pricing ×2, FAQ |
| Squarespace "$20–40" | home band, pricing band, FAQ |
| "a first one or a better one" | contact hero, about close |
| "computer in my office / house" | FAQ ×2 |
| "Professional, search-optimized content" | home ×2, pricing list, FAQ |

Once per page for a claim (Lighthouse, 911) is fine; the phrases in the lower
half of the table are tics.

## 4. What I'd do first

1. The three **H** items: decide and state whether the written copy goes with
   the client (§1); fix "that price" on the About page; unify the "$0 down"
   gloss and the term justification into one sentence each, used verbatim
   wherever they appear.
2. A find-and-cut pass for *quietly*, *actually*, *genuinely*, *properly*,
   *exactly*, and the five *real*s. Fifteen minutes; no rewrites needed.
3. A dash pass on the pricing page and About page: for each em-dash, ask
   whether the words after it are the point. If yes, make them the sentence.
4. Rewrite the four indirect ownership/limitation sentences to say the thing
   ("What the subscription covers is the site itself", "The only thing I own",
   "a different kind of project with very different requirements", "in a way
   that makes sense").
5. Cut or shrink "What I Believe"; drop the "Websites for…" openers from the
   three vertical cards.

# Performance

The site advertises a Lighthouse 100 on the homepage ("Fast Enough to Rank"),
so the score is a claim we have to keep true, not just a vanity metric.

## PageSpeed, 2026-08-20 — mobile 99/100

Two render-blocking resources were holding the score at 99. Both are now fixed.

### 1. Cloudflare Email Address Obfuscation (the big one)

Cloudflare's Scrape Shield rewrote the footer's `mailto:` link into a
`<span class="__cf_email__">` placeholder and injected this at the end of
`<body>` on **every page**:

```html
<script data-cfasync="false" src="/cdn-cgi/scripts/.../email-decode.min.js"></script>
```

No `defer`, no `async` — a parser-blocking classic script. Lighthouse measured
**482ms of render-blocking for 999 bytes**, and until it ran the footer showed
`[email protected]` instead of the address. The attributes are fixed by
Cloudflare and can't be changed; `data-cfasync="false"` also opts it out of
Rocket Loader, so there's no way to make it non-blocking. The only dashboard
lever is *scope* (a Configuration Rule per path), which just moves the cost
onto whichever page you chose to keep protected.

**Worse, it was protecting nothing.** Two other responses published the address
in plaintext, and neither was ever covered — Scrape Shield only rewrites HTML,
and it skips `<script>` contents:

- `/llms.txt` — `text/plain`, and the file we explicitly point crawlers at.
- The homepage's Organization JSON-LD — `"email":"hello@greencovedigital.com"`.

**Fix:** do the obfuscation ourselves, and plug both leaks.

`src/lib/email.ts` encodes the address at build time using the same scheme
Cloudflare does — XOR against a one-byte key, hex encoded, key carried as the
first byte — and exports a ~250-byte decoder that `BaseLayout` inlines once per
page just before `</body>`. `src/components/EmailLink.astro` is the only thing
that renders the address. Since the decoder is inline it makes no request, so
there's no round trip and nothing for the render-blocking audit to find; it
runs during parse, before first paint, so the link never visibly swaps and CLS
stays 0.

Before the decoder runs — which is what a scraper sees, and what a visitor with
JavaScript off gets — the link points at `/contact` and reads as its `label`.
Both states render in the same sentence, so **any new call site needs a `label`
that's grammatical in place of the address**:

```astro
Email: <EmailLink />                                    <!-- "Email: get in touch" -->
reach me at <EmailLink label="the contact form" />.     <!-- ...vs the address -->
```

The two leaks are closed too: `email` is gone from the Organization JSON-LD
(it's optional, and Google's rich results don't use it), and `llms.txt` now
sends crawlers to the contact form instead of listing the address.

Verified against two scraper models over the whole `dist/` tree — a regex on
the raw bytes, and one that decodes entities and strips tags before matching
text and `mailto:` hrefs. Both harvest nothing. Anything short of a headless
browser gets no address; that's the same bar Cloudflare set, over more surface,
for 0ms instead of 482ms.

Two ways to undo all of it: hand-roll a `mailto:` instead of using
`EmailLink`, or put the address in a response body some other way — that's
exactly how JSON-LD and `llms.txt` sprang leaks. Cloudflare re-injects its
script site-wide the moment it finds one plaintext address.

### 2. Render-blocking stylesheet

The whole site's CSS is one ~9KB file (~3KB gzipped). Astro's default
`build.inlineStylesheets: 'auto'` only inlines under 4KB, so it shipped as an
external `<link>` — 172ms of render-blocking, and worse, it pushed the LCP
element's paint behind a second round trip (LCP *load delay* was 886ms).

**Fix:** `build.inlineStylesheets: "always"` in `astro.config.mjs`.

Measured locally, 3 Lighthouse runs each, mobile/simulated, median:

| | FCP | LCP | Speed Index |
|---|---|---|---|
| external `<link>` | 1052ms | 1502ms | 1052ms |
| inlined | 902ms | 1427ms | 902ms |

LCP load delay fell 886ms → 115ms. The trade is that the CSS is no longer a
shared cache entry across pages; at 3KB gzipped, and with `prefetchAll` already
pulling every page's HTML, that's the cheaper side of the deal. Revisit if the
stylesheet ever grows past ~15KB raw.

## Known remaining lever: the LCP element is decoration

LCP is `div.motes` — the Cove background's mote field — not the `<h1>`. It's a
large background-image div, so Chrome picks it as the LCP candidate over the
heading, and its render delay (~860ms locally, ~60% of LCP) is the single
biggest remaining chunk.

If the `<h1>` were the LCP instead, LCP would land at roughly FCP (~900ms
locally) — a real ~500ms saving. But every route to that runs through the
site's signature background: fewer mote layers, smaller inline SVGs, or
deferring the motes until after first paint. **Not done** — it's a design
decision, not a perf bug. See [animated-svg-cost.md](animated-svg-cost.md) for
the cost work already done on those SVGs.

## Non-issues

- `uses-text-compression` and `uses-long-cache-ttl` show up when auditing a
  plain `python3 -m http.server` build. Cloudflare handles both in production —
  ignore them in local runs.
- The Cloudflare Web Analytics beacon (`static.cloudflareinsights.com`, ~11KB,
  24h TTL) trips `uses-long-cache-ttl`. Not ours to change.

## Re-measuring

The public PageSpeed Insights API now returns a hard `429` quota block for
anonymous callers, and pagespeed.web.dev is a JS shell that can't be fetched.
Run Lighthouse directly instead:

```sh
npx lighthouse@12 https://greencovedigital.com \
  --only-categories=performance --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate --chrome-flags="--headless=new --no-sandbox"
```

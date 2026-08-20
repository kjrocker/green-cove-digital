import type { APIRoute } from "astro";
import { PERSON, SITE } from "../data/client";
import { PRICING, usd } from "../data/pricing";

/**
 * https://greencovedigital.com/llms.txt — a curated plain-text entry point for
 * AI crawlers, per llmstxt.org.
 *
 * An endpoint rather than a file in public/ so the prices below stay sourced
 * from pricing.ts. /services/consulting is deliberately left out: it's an
 * unlinked referral landing page (docs/content-strategy.md), and this site
 * sells one thing. /thanks and /404 are noindex.
 */

const url = (path: string) => `${SITE.url}${path}`;

const body = `# ${SITE.title}

> Custom small business websites on a flat monthly subscription — ${usd(PRICING.monthly)}/month, $0 down,
> no up-front build fee. Built and maintained personally by one senior software engineer,
> remotely, for businesses across the US.

${SITE.title} is a one-person business run by ${PERSON.fullName}, a software engineer with
over a decade of experience. The subscription covers everything: custom design (no
templates), copy written for them, domain registration, hosting, SSL, backups,
security updates, ongoing content changes, and local SEO groundwork. ${PRICING.termMonths}-month minimum
term, then month-to-month with 30 days' notice. Extra pages beyond the first five are ${usd(PRICING.extraPage)}
one time each. Clients always keep their domain, the files they sent, and anything they write on the site.

${SITE.title} works fully remotely and has no physical location or local service area.
Typical clients: trades and contractors, coffee roasters and cafés, boutiques and small
shops, and professional practices such as lawyers, accountants, and therapists.

## Pages

- [Home](${url("/")}): the offer, who it's for, and how the process works.
- [Websites and Pricing](${url("/services/small-business")}): exactly what
  ${usd(PRICING.monthly)}/month covers, why a subscription instead of a large up-front invoice, and a
  detailed FAQ on the money mechanics.
- [About ${PERSON.fullName}](${url("/about")}): background, engineering
  approach, and why an engineer rather than a page builder.
- [Contact](${url("/contact")}): contact form and what happens next. The form is
  the only published contact route; the email address is deliberately not listed
  here in plaintext (docs/performance.md).
`;

export const GET: APIRoute = () =>
	new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});

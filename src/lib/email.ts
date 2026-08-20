/**
 * Build-time email obfuscation.
 *
 * Cloudflare's Scrape Shield used to do this for us, but it did it by
 * injecting a parser-blocking `<script src="/cdn-cgi/.../email-decode.min.js">`
 * at the end of every page — ~480ms of render-blocking on mobile for 999
 * bytes. See docs/performance.md.
 *
 * This is the same scheme (XOR against a one-byte key, hex encoded, key
 * carried as the first byte) done at build time instead, with the decoder
 * inlined once per page by BaseLayout. No request, so no round trip and
 * nothing for Lighthouse's render-blocking audit to find.
 *
 * The key is fixed rather than random so builds stay reproducible. That costs
 * nothing: the key travels in the payload either way, so this was never
 * encryption — it only has to stop an address from matching a plaintext regex,
 * and to make harvesting it require a JavaScript runtime.
 *
 * Emitting an address as plaintext anywhere else in a *response body* undoes
 * all of this — that includes JSON-LD and llms.txt, both of which leaked for
 * exactly this reason.
 */

const KEY = 0x2b;

const hex = (n: number) => n.toString(16).padStart(2, "0");

/** The attribute `encodeEmail` output is carried in, and the decoder's hook. */
export const EMAIL_ATTR = "data-email-enc";

export const encodeEmail = (address: string): string =>
	hex(KEY) +
	[...address].map((c) => hex(c.charCodeAt(0) ^ KEY)).join("");

/**
 * Inlined verbatim into every page. Mirrors `encodeEmail` — change one and you
 * must change the other. Runs during parse, before first paint, so the link
 * never visibly swaps and nothing shifts.
 */
export const EMAIL_DECODER_JS = `for(const a of document.querySelectorAll("[${EMAIL_ATTR}]")){const h=a.getAttribute("${EMAIL_ATTR}"),k=parseInt(h.slice(0,2),16);let e="";for(let i=2;i<h.length;i+=2)e+=String.fromCharCode(parseInt(h.slice(i,i+2),16)^k);a.href="mailto:"+e;a.textContent=e}`;

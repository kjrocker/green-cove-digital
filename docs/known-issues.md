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

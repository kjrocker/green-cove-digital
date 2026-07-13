# Contact form email: Amazon SES (2026-07-13)

The contact form Pages Function (`functions/api/contact.ts`) sends through
**Amazon SES v2** in region **`us-east-1`**, replacing the earlier Resend
integration.

## How it works

The Function runs on the Cloudflare Workers runtime, where the AWS Node SDK
doesn't work cleanly. Requests to the SES v2 `SendEmail` HTTP endpoint
(`https://email.us-east-1.amazonaws.com/v2/email/outbound-emails`) are signed
with AWS SigV4 via [`aws4fetch`](https://github.com/mhart/aws4fetch) — a ~4KB,
zero-dependency library that signs `fetch()` calls using Web Crypto. Cloudflare
Pages bundles the ESM import from `node_modules` at build time.

## Env vars

Non-secret (`wrangler.jsonc` `vars`, mirrored in `.dev.vars.example`):

- `AWS_REGION` — `us-east-1`
- `CONTACT_TO_EMAIL` — owner notification recipient
- `CONTACT_FROM_EMAIL` — verified SES sender (`send@greencovedigital.com`)

Secret (Cloudflare Pages secrets + local gitignored `.dev.vars`):

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Set/rotate the secrets with:

```sh
pnpm exec wrangler pages secret put AWS_ACCESS_KEY_ID
pnpm exec wrangler pages secret put AWS_SECRET_ACCESS_KEY
```

## Sandbox status & best-effort auto-reply

**SES is still in the sandbox**, which only allows sending to *verified*
recipients. The Function sends two emails and treats them differently:

- **Owner notification** (to `CONTACT_TO_EMAIL`, a verified/own address) —
  **required**. If it fails, the submission redirects to `/contact?error=1`.
- **Visitor auto-reply** (to the arbitrary submitter address) — **best effort**.
  While in the sandbox, SES rejects unverified recipients, so this send fails
  for most submitters; the failure is logged (`auto-reply failed (non-fatal)`)
  and swallowed, and the visitor still lands on `/thanks`.

Once AWS grants **production access**, auto-replies start flowing to any
recipient with **no code change needed** — just re-test from an external
address. `src/pages/thanks.astro` still promises a confirmation email, which
won't arrive for most submitters until production access lands.

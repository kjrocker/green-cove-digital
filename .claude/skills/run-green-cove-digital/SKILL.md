---
name: run-green-cove-digital
description: Build, launch, and drive Green Cove Digital — the Astro marketing site with a Cloudflare Pages Function contact form. Use to run, start, serve, build, smoke-test, or screenshot the site, or to verify a change works against the running server (static pages + the /api/contact email Function).
---

# Run Green Cove Digital

Green Cove Digital is an **Astro 5 static site** (six pages: `/`, `/about`,
`/contact`, `/thanks`, `/services/small-business`, `/services/consulting`)
deployed to **Cloudflare Pages**. The only server-side piece is the contact
form: `functions/api/contact.ts` is a **Cloudflare Pages Function** that
validates the POST and sends two emails via **Amazon SES** (notification +
auto-reply, signed with `aws4fetch`).

Two ways to run it — pick by what you're changing:

| Mode | Command | Serves the contact Function? | Use when |
|---|---|---|---|
| **Full app** | `wrangler pages dev ./dist` | **Yes** | Testing the contact form / anything server-side |
| **Fast dev** | `pnpm dev` | **No** (`/api/contact` → 404) | Iterating on page markup/CSS with hot reload |

The running site is driven by **`.claude/skills/run-green-cove-digital/drive.sh`**
— it `curl`s the `/api/contact` Function through its honeypot / invalid /
oversize cases and screenshots every page with headless chromium.

> **The contact form sends real email.** `.dev.vars` on this machine holds
> *working* AWS credentials, so a valid submission delivers to the owner's real
> inbox. The driver therefore **skips the valid case by default**; it is opt-in
> via `LIVE_SEND=1`. To exercise the whole SES path without delivering anything,
> see [Exercising SES safely](#exercising-ses-safely).

**All paths below are relative to the repo root.**

## Prerequisites

```sh
pnpm install        # Node 20+; pnpm 11. Installs Astro, wrangler, sharp.
```

Screenshots need a headless browser — `chromium-browser` (present here) or
`firefox`. The driver auto-detects; `chromium-browser` uses `--no-sandbox`.

**Native build scripts must be allowed.** `esbuild`, `sharp`, and `workerd`
ship postinstall scripts that compile binaries the build/dev servers need.
pnpm 11 blocks these by default. This repo's committed `pnpm-workspace.yaml`
allowlists them (`onlyBuiltDependencies`), so a plain `pnpm install` builds
them with no prompt. If you ever see `Ignored build scripts: esbuild, sharp,
workerd`, that file is missing — restore it, then `pnpm rebuild esbuild sharp workerd`.

## Build

```sh
pnpm build          # Astro -> ./dist/ (also optimizes images via sharp)
```

Produces the static `dist/` that Cloudflare Pages serves. `wrangler pages dev`
serves this same directory and auto-discovers `functions/` alongside it.

## Run (agent path) — START HERE

The contact Function only runs under **wrangler**, so build first, then launch
`wrangler pages dev` **detached** on a fixed IP/port (see Gotchas for why the
`--ip` and background launch matter):

```sh
pnpm build
setsid pnpm exec wrangler pages dev ./dist --port 8788 --ip 127.0.0.1 \
  > /tmp/green-cove-wrangler.log 2>&1 < /dev/null &
```

The Function reads its env from **`.dev.vars`** (gitignored). Create it only if
missing — **never blind-`cp` over it**, the existing file holds real AWS keys
that are not recoverable from git:

```sh
[ -f .dev.vars ] || cp .dev.vars.example .dev.vars
```

The placeholder creds in `.dev.vars.example` are fine for the default smoke run,
which never calls SES.

In a **separate** step, wait for the server, then drive it with one command:

```sh
until curl -fsS -o /dev/null http://127.0.0.1:8788/ 2>/dev/null; do sleep 1; done
.claude/skills/run-green-cove-digital/drive.sh all ./tmp/green-cove-shots
```

`drive.sh [api|shots|all|stop] [OUTDIR]` (default `all ./tmp/green-cove-shots`):

- **`api`** — POSTs `/api/contact` and asserts each server-side redirect. The
  three default cases **never send email** (each returns in ~2ms — no SES
  round-trip):
  - *honeypot* (hidden `company` field filled) → `/thanks`, short-circuits before SES
  - *invalid* (missing/bad fields) → `/contact?error=1`
  - *oversize* (message > `MAX_MESSAGE_LEN` = 5000) → `/contact?error=1`
  - *valid* → **skipped unless `LIVE_SEND=1`.** With it set, the Function makes a
    real SES call: working creds → `/thanks` **and mail is delivered**; expired or
    placeholder creds → `/contact?error=1`. (The visitor auto-reply is best-effort
    — it fails for unverified recipients in the SES sandbox but is swallowed, so it
    never affects the redirect.)
- **`shots`** — writes `home.png`, `about.png`, `contact.png`, `thanks.png`,
  `small-business.png`, `consulting.png` to OUTDIR. **Look at the PNGs** — the
  home hero should show the animated cove waves with the "Software Engineering"
  headline; `thanks.png` should read "Thanks — message received".
- **`stop`** — kills the server by port and cleans up the orphaned `workerd`.

Point the driver elsewhere with `BASE=http://127.0.0.1:4321 drive.sh shots`
(but `api` needs the wrangler host — see the mode table).

Stop the server when done:

```sh
.claude/skills/run-green-cove-digital/drive.sh stop
```

Do **not** reach for `pkill -f 'wrangler pages dev'` — see Gotchas, it kills
your own shell.

### Exercising SES safely

To run the full valid path — signed SES request, owner notification accepted,
`/thanks` redirect — without anything landing in a real inbox, point
`CONTACT_TO_EMAIL` at the AWS mailbox simulator, which accepts and discards:

```sh
cp -p .dev.vars /tmp/dev.vars.backup     # .dev.vars is gitignored — no undo
sed -i 's|^CONTACT_TO_EMAIL=.*|CONTACT_TO_EMAIL=success@simulator.amazonses.com|' .dev.vars
```

Restart wrangler (it reads `.dev.vars` only at startup), then:

```sh
LIVE_SEND=1 .claude/skills/run-green-cove-digital/drive.sh api
```

Verified: this redirects to `/thanks` with no real delivery. Restore afterwards
with `cp -p /tmp/dev.vars.backup .dev.vars`.

## Run (human path)

```sh
pnpm dev            # http://localhost:4321 — hot reload
```

Fast for page/CSS work, but **it does not serve `functions/`** — a POST to
`/api/contact` returns 404, so the contact form can't be exercised here. Note
it binds `localhost` (IPv6), so curl `http://localhost:4321`, not `127.0.0.1`.
Useless for taking screenshots headlessly on its own beyond `drive.sh shots`.

## Deploy

`scripts/deploy` (aka `pnpm deploy`) builds and runs `wrangler pages deploy`;
it first checks `wrangler whoami` and bails if unauthenticated. `pnpm
deploy:preview` builds and rsyncs `dist/` to a personal server. Neither was run
in this environment (both need live credentials) — listed for orientation only.

## Test

There is **no test suite** (no test runner in `package.json`). `drive.sh` is
the verification harness — run it after any change and eyeball the screenshots.

## Gotchas

- **The contact Function is invisible under `astro dev`.** `pnpm dev` serves
  only the static pages; `functions/` runs only under `wrangler pages dev`
  (or in production). Test the form with the wrangler path. This bites you as a
  silent 404 on `/api/contact`.
- **The error banner is baked out of the static build.** `contact.astro` reads
  `Astro.url.searchParams.get("error")` at *build* time, where no query string
  exists — so the `{hasError && …}` block is dropped from `dist/contact/index.html`.
  A failed submission redirects to `/contact?error=1` but the user sees a plain
  contact page with **no visible error message**. (`contact?error=1` screenshots
  byte-identically to `contact` — that's why the driver doesn't shoot it.)
- **A "successful" smoke test used to email the owner for real.** `.dev.vars`
  here holds working AWS keys (not the `AKIA_your_access_key_here` placeholder
  from `.dev.vars.example`), so the valid case genuinely delivered to
  `CONTACT_TO_EMAIL`. Tell-tale: that POST takes ~1100ms in the wrangler log
  versus ~2ms for every non-sending case. That's why the valid case is now
  behind `LIVE_SEND=1`.
- **`pkill -f 'wrangler pages dev'` kills your own shell.** `-f` matches full
  command lines, and the shell running your script has that exact string in its
  own argv — so the shell dies mid-script (exit 144) before later commands run.
  The `[w]rangler` bracket trick does **not** save you either if any *other*
  line in the same invocation mentions the literal string. Kill by port instead:
  `fuser -k 8788/tcp`. This is what `drive.sh stop` does.
- **`fuser -k` leaves an orphaned `workerd`.** Killing the listener doesn't reap
  the `@cloudflare/workerd-linux-64` child, which lingers holding memory. Follow
  with `pkill -x workerd` — `-x` matches the process *name* exactly, so unlike
  `-f` it can never match your shell.
- **`.dev.vars` is required and gitignored.** Without it the Function has no
  `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`CONTACT_*` and every valid
  submission errors out. Copy `.dev.vars.example`. The committed `wrangler.jsonc`
  `vars` block only covers `AWS_REGION` and the two `CONTACT_*` addresses, never
  the secret AWS keys.
- **Honeypot short-circuits before SES.** A filled hidden `company` field
  redirects straight to `/thanks` with no email — so a "successful" `/thanks`
  redirect in a test doesn't prove email actually sent. Only the *valid* case
  (empty `company`) exercises SES.
- **`wrangler pages dev` defaults to a random-ish bind.** Pin it with
  `--port 8788 --ip 127.0.0.1` so the driver's `BASE` matches. `/contact`
  308-redirects to `/contact/` (trailing slash) — `curl -L` and chromium follow it.
- **Native builds:** if `pnpm install` prints `Ignored build scripts`, the
  `pnpm-workspace.yaml` allowlist is missing — the build then fails on a missing
  esbuild binary or produces no optimized images.
- **Headless chromium needs a throwaway profile.** The driver gives each shot a
  fresh `mktemp -d` as `--user-data-dir`; a shared profile errors "already running".
- **Background launches:** a bare `&` job is torn down when a one-shot shell
  returns (and its log is left empty). Launch the server with `setsid … &` and
  wait for it in a *separate* step, or use Claude Code's background Bash.

## Troubleshooting

- `curl … 8788 … Connection refused` / driver says "server not responding" —
  wrangler isn't up yet or bound to a different port. Wait for the `until curl`
  loop; check `/tmp/green-cove-wrangler.log`.
- `POST /api/contact` → **404** — you're hitting `astro dev` (:4321), not
  wrangler (:8788). Only wrangler serves `functions/`.
- Valid submission lands on `/contact?error=1` under `LIVE_SEND=1` — the owner
  send failed. Placeholder or expired `AWS_ACCESS_KEY_ID` /
  `AWS_SECRET_ACCESS_KEY` in `.dev.vars`; the Function logs the SES status and
  body via `console.error` to the wrangler log.
- Shell exits with **144** partway through a launch/stop script — a `pkill -f`
  pattern matched the shell itself. Use `drive.sh stop`.
- `drive.sh shots` fails but `api` passes — no browser found; install
  `chromium-browser` or `firefox`, or run `drive.sh api` only.
- `Ignored build scripts: esbuild, sharp, workerd` on install — restore
  `pnpm-workspace.yaml`, then `pnpm rebuild esbuild sharp workerd`.

# Rebrand: Starburst Digital → Green Cove Digital (2026-07-13)

Pre-launch rebrand. The `Starfield.astro` rotating-starfield hero was replaced
by `src/components/Cove.astro` (same props API: `static`/`top`/`bottom`):
deep-green water gradient, four seamless drifting SVG wave layers, and two
layers of light-mote specks. All SVGs are generated at build time as data URIs.

New palette in `src/css/global.css`:

- primary: deep cove green `hsl(168, 60%, 21%)`
- secondary: sunlit sand `hsl(40, 90%, 55%)` (card shadows, error banner)
- light: pale seafoam `hsl(150, 20%, 96%)` — **the Cove bottom-edge wave fill
  (`#f3f7f5` in `Cove.astro`) must stay in sync with this token**
- dark: green-tinted charcoal `hsl(172, 15%, 18%)`

The favicon is a cove mark (green circle, amber sun, seafoam waves); regenerate
`favicon.ico` with `pnpm make-favicon` after editing `favicon.svg`.

## Pending externalities (code assumes these, not yet done)

- `greencovedigital.com` was assumed as the new domain — needs registering /
  confirming (astro.config.mjs, client.ts, robots.txt, wrangler.jsonc).
- The Cloudflare Pages project is still named after the old brand;
  `wrangler.jsonc` `name` is now `green-cove-digital`, which won't match the
  existing Pages project on deploy — create or rename the Pages project first.
- Amazon SES needs the sending domain/identity verified **and** production
  access granted (to leave the sandbox) before the contact form can fully send
  in production — see [ses-email.md](ses-email.md).
- The local repo directory is still `~/repos/starburst-digital`.

#!/usr/bin/env node
/**
 * Render the og:image variants.
 *
 * Writes `tmp/og/og-<id>.svg` and `tmp/og/og-<id>.png` for each variant, then
 * rebuilds `tmp/og/contact-sheet.png`. `tmp/` is gitignored, so iterating is
 * free — nothing lands in the repo until `--ship`.
 *
 * Usage:
 *   node scripts/og/render.mjs              # every variant + contact sheet
 *   node scripts/og/render.mjs --only a2    # one variant, fast loop
 *   node scripts/og/render.mjs --ship a2    # also write public/og.png
 *
 * Rasterizes with sharp (already a devDependency — Astro's image service), so
 * there is no new dependency and no system dependency. Contrast with
 * scripts/make-favicon, which needs ImageMagick only because sharp cannot write
 * multi-size .ico containers; PNG has no such constraint.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

import { buildCard } from "./cove.mjs";
import { VARIANTS } from "./variants.mjs";
import { buildSheet } from "./sheet.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "tmp/og");

/**
 * Supersampling factor. librsvg rasterizes at `density`/72; rendering at 2× and
 * downsampling with Lanczos keeps the wave edges and type clean.
 */
const DENSITY = 144;

function arg(name) {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1];
}

/** SVG → PNG buffer, supersampled then resized to the exact frame. */
async function rasterize(svg, width, height) {
  return sharp(Buffer.from(svg), { density: DENSITY })
    .resize(width, height, { fit: "fill", kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const only = arg("--only");
  const ship = arg("--ship");

  const selected = only ? VARIANTS.filter((v) => v.id === only) : VARIANTS;
  if (only && selected.length === 0) {
    console.error(`no variant with id "${only}"`);
    process.exit(1);
  }

  await mkdir(OUT, { recursive: true });

  const rendered = [];
  for (const variant of selected) {
    const { params } = variant;
    const svg = buildCard(params);
    const png = await rasterize(svg, params.width, params.height);

    await writeFile(path.join(OUT, `og-${variant.id}.svg`), svg);
    await writeFile(path.join(OUT, `og-${variant.id}.png`), png);

    rendered.push({ ...variant, bytes: png.length });
    console.log(
      `  og-${variant.id}.png  ${String(Math.round(png.length / 1024)).padStart(4)} KB  ${variant.note}`,
    );

    if (ship && variant.id === ship) {
      await writeFile(path.join(ROOT, "public/og.png"), png);
      console.log(`\nshipped public/og.png from variant ${ship}`);
    }
  }

  if (ship && !selected.some((v) => v.id === ship)) {
    console.error(`\ncannot ship "${ship}" — not in the rendered set`);
    process.exit(1);
  }

  // Always sheet the full set, so a --only run still refreshes the comparison.
  await buildSheet({ dir: OUT, variants: VARIANTS });
  console.log(`\ncontact sheet: tmp/og/contact-sheet.png`);
}

await main();

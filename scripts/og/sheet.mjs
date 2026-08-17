/**
 * The contact sheet: every rendered variant tiled and labelled in one image.
 *
 * The tiles are deliberately small. Feeds render a 1200×630 at roughly 500px
 * wide, and these land near 380px — so if a variant's tagline is unreadable on
 * the sheet, it is unreadable in the feed. The sheet is the legibility test,
 * not just an index.
 */

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { FONT } from "./cove.mjs";

const COLS = 3;
const TILE_W = 380;
const TILE_H = Math.round((TILE_W * 630) / 1200); // 200
const PAD = 18;
const LABEL_H = 26;
const BG = "#1b2220";
const INK = "#e8f0ed";

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

export async function buildSheet({ dir, variants }) {
  const present = [];
  for (const v of variants) {
    const file = path.join(dir, `og-${v.id}.png`);
    if (await exists(file)) present.push({ ...v, file });
  }
  if (present.length === 0) return;

  const rows = Math.ceil(present.length / COLS);
  const cellW = TILE_W + PAD;
  const cellH = TILE_H + LABEL_H + PAD;
  const width = COLS * cellW + PAD;
  const height = rows * cellH + PAD;

  const composites = [];
  const labels = [];

  for (const [i, v] of present.entries()) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * cellW;
    const y = PAD + row * cellH;

    composites.push({
      input: await sharp(await readFile(v.file))
        .resize(TILE_W, TILE_H, { fit: "fill", kernel: "lanczos3" })
        .toBuffer(),
      left: x,
      top: y,
    });

    labels.push(
      `<text x="${x}" y="${y + TILE_H + 18}" font-family="${FONT}" font-size="13" fill="${INK}">` +
        `${escape(clip(v.note, 56))}</text>`,
    );
  }

  const overlay =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    labels.join("") +
    `</svg>`;

  const sheet = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG,
    },
  })
    .composite([...composites, { input: Buffer.from(overlay), left: 0, top: 0 }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(path.join(dir, "contact-sheet.png"), sheet);
}

const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

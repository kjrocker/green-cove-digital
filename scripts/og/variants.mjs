/**
 * The unit of iteration.
 *
 * Each round varies one axis over the round before it, so the contact sheet
 * compares like with like instead of showing noise. Per round: append 2–4
 * variants, run `pnpm og`, review `tmp/og/contact-sheet.png`, record the
 * verdict in `tmp/og/NOTES.md`, then pin the winner below.
 *
 * The history is expressed as data: `BASE_<n>` is the card every variant in
 * round n patches, and it is derived by applying the previous round's winner
 * to the previous round's base. `DEFAULTS` — the shipped card — falls out of
 * the end of that chain.
 *
 * That indirection is the point. A naive "promote the winner into DEFAULTS"
 * silently redraws every earlier round, because their patches inherit whatever
 * DEFAULTS currently holds — so the images on disk stop matching the ones that
 * were actually reviewed. Pinning each round to its own base means adding a
 * round F cannot disturb rounds A–E.
 *
 * To add a round: append `WINNER_<last>`, derive `BASE_<next>`, write the
 * variants against it, and add them to the `VARIANTS` export.
 */

import { COLOR, hsl } from "./cove.mjs";
import { merge } from "./merge.mjs";

/** The wave ladder round B settled on; referenced by later bases. */
const WAVES_SEPARATED = [
  { height: 300, amp: 16, periods: 2, opacity: 0.05 },
  { height: 210, amp: 20, periods: 3, opacity: 0.08 },
  { height: 140, amp: 24, periods: 4, opacity: 0.12 },
  { height: 82, amp: 26, periods: 5, opacity: 0.18 },
];

/** Round A's card: the site's own values, transposed to a 1200×630 frame. */
const BASE_A = {
  width: 1200,
  height: 630,

  /** The Cove's top-right light bloom: `ellipse 90% 60% at 80% -10%`. */
  bloom: { x: 0.8, y: -0.1, alpha: 0.16 },

  /** The favicon's sun, placed to agree with the bloom rather than fight it. */
  sun: {
    show: true,
    cx: 0.82,
    cy: 0.2,
    r: 0.1,
    fill: COLOR.sun,
    glow: true,
    glowScale: 3.4,
    behindWaves: false,
  },

  /** `Cove.astro`'s four layers, opacity ladder and all. */
  waves: [
    { height: 260, amp: 14, periods: 2, opacity: 0.07 },
    { height: 190, amp: 18, periods: 3, opacity: 0.1 },
    { height: 130, amp: 22, periods: 4, opacity: 0.14 },
    { height: 80, amp: 26, periods: 5, opacity: 0.2 },
  ],

  /** `Cove.astro`'s two mote fields, scaled from a 1400² tile to the frame. */
  motes: [
    { count: 90, r: 1, seed: 1, opacity: 0.35 },
    { count: 34, r: 2, seed: 2, opacity: 0.25 },
  ],

  edge: { show: false, height: 56 },
  badge: { show: false, x: 100, y: 112, size: 92 },
  rule: { show: false, x: 100, y: 214, w: 88, h: 6, fill: COLOR.secondary },

  text: {
    title: "Green Cove Digital",
    tagline: "Small business websites, built right.",
    align: "left",
    baseline: 0.5,
    titleSize: 82,
    taglineSize: 34,
    titleWeight: 700,
    titleTracking: -2.5,
    taglineTracking: -0.4,
    titleFill: COLOR.light,
    taglineFill: COLOR.wave,
    gap: 62,
    accent: null,
  },
};

/**
 * A· composition. a1 — the sun inset top-right with the text left — held up.
 * Centering fights a site that is left-aligned everywhere; the bleeding sun
 * crops to a lozenge; the sweeping wave mass eats the safe area.
 */
const WINNER_A = {};
const BASE_B = merge(BASE_A, WINNER_A);

/**
 * B· the light bottom edge, and depth in the wave stack. The `#f3f7f5` close
 * is the most recognizable thing about the Cove and the card was missing it;
 * at 72px it reads as the far shore rather than a stray sliver. The site's own
 * opacity ladder stacks into a visible layer cake at 630px tall, which the far
 * taller hero never shows, so the ladder came down and the heights spread.
 * The tagline bump is the standing thumbnail-legibility check, not an axis.
 */
const WINNER_B = {
  edge: { show: true, height: 72 },
  waves: WAVES_SEPARATED,
  sun: { cx: 0.83, cy: 0.22, r: 0.072, glowScale: 5.0 },
  bloom: { alpha: 0.2 },
  text: { taglineSize: 40, gap: 66 },
};
const BASE_C = merge(BASE_B, WINNER_B);

/**
 * C· brand furniture. The amber kicker rule is the one piece that earns its
 * place. The favicon mark puts a second sun on a card that already has one;
 * dropping the real sun to make room for the mark's trades the atmosphere for
 * a logo that reads as a smudge at feed size.
 */
const WINNER_C = { rule: { show: true }, text: { baseline: 0.52 } };
const BASE_D = merge(BASE_C, WINNER_C);

/**
 * D· typography. The site's headings run `letter-spacing: -0.075ch` ≈ -0.037em,
 * so round A's -2.5 at 82px was looser than the site's own type. Going bigger
 * and tighter sharpened the hierarchy; evening out the wordmark:tagline ratio
 * flattened it, and weight 900 outweighs the 700 the site actually uses.
 */
const WINNER_D = {
  text: { titleSize: 92, titleTracking: -3.4, taglineSize: 42, gap: 72 },
};
const BASE_E = merge(BASE_D, WINNER_D);

/**
 * E· polish. Lifting the block clears the tagline off the first wave crest;
 * shrinking the disc inside a wider halo stops the sun reading as a sticker
 * pasted on top and turns it into light through water.
 */
const WINNER_E = {
  text: { baseline: 0.47 },
  rule: { y: 188 },
  sun: { r: 0.066, glowScale: 6.2 },
  bloom: { alpha: 0.26 },
};

const BASE_F = merge(BASE_E, WINNER_E);

/**
 * F· the bottom edge — dropped. `Cove.astro`'s curve only draws the
 * *transition strip*; the light area itself is the page section underneath.
 * On a standalone card that section never arrives, so the strip tapered to
 * nothing at the left edge and was clipped by the frame, reading as a mis-crop
 * rather than a shore.
 *
 * `edge.base` and a sand `edge.fill` do fix that (f2/f4), but the curve only
 * ever meant anything as a handoff to content below it. With no content below,
 * the honest answer is to let the water run to the frame — nothing on the card
 * is then borrowed from a context it doesn't have. The machinery stays in
 * `bottomEdge()` for anything that does have a section beneath it.
 */
const WINNER_F = { edge: { show: false } };

/** The shipped card. `node scripts/og/render.mjs --ship f1` writes it. */
export const DEFAULTS = merge(BASE_F, WINNER_F);

/** Bind a round's variants to the base they were reviewed against. */
const round = (base, list) =>
  list.map((v) => ({ ...v, params: merge(base, v.patch) }));

export const VARIANTS = [
  ...round(BASE_A, [
    {
      id: "a1",
      note: "A· baseline: sun inset top-right, text left, site wave mass",
      patch: {},
    },
    {
      id: "a2",
      note: "A· sun bleeding off the top-right corner, text left",
      patch: {
        sun: { cx: 0.88, cy: 0.06, r: 0.15, glowScale: 3.0 },
        bloom: { alpha: 0.2 },
      },
    },
    {
      id: "a3",
      note: "A· centered text, sun high and small",
      patch: {
        sun: { cx: 0.5, cy: 0.17, r: 0.075 },
        text: { align: "center", baseline: 0.54 },
      },
    },
    {
      id: "a4",
      note: "A· sweeping wave mass (taller layers), text left and higher",
      patch: {
        waves: [
          { height: 420, amp: 20, periods: 2, opacity: 0.07 },
          { height: 320, amp: 24, periods: 3, opacity: 0.1 },
          { height: 220, amp: 26, periods: 4, opacity: 0.14 },
          { height: 130, amp: 30, periods: 5, opacity: 0.2 },
        ],
        text: { baseline: 0.44 },
      },
    },
  ]),

  ...round(BASE_B, [
    {
      id: "b1",
      note: "B· a1 + light bottom edge, shallow (44px)",
      patch: { edge: { show: true, height: 44 } },
    },
    {
      id: "b2",
      note: "B· a1 + light bottom edge, deep (76px)",
      patch: { edge: { show: true, height: 76 } },
    },
    {
      id: "b3",
      note: "B· light edge + separated wave ladder (less layer-cake)",
      patch: { edge: { show: true, height: 56 }, waves: WAVES_SEPARATED },
    },
    {
      id: "b4",
      note: "B· light edge + separated waves + smaller sun, wider glow",
      patch: {
        edge: { show: true, height: 56 },
        waves: WAVES_SEPARATED,
        sun: { cx: 0.83, cy: 0.22, r: 0.072, glowScale: 5.0 },
        bloom: { alpha: 0.2 },
      },
    },
  ]),

  ...round(BASE_C, [
    {
      id: "c1",
      note: "C· favicon mark top-left, sun kept",
      patch: { badge: { show: true }, text: { baseline: 0.56 } },
    },
    {
      id: "c2",
      note: "C· favicon mark top-left, sun off (mark carries the sun)",
      patch: {
        badge: { show: true },
        sun: { show: false },
        text: { baseline: 0.56 },
      },
    },
    {
      id: "c3",
      note: "C· amber kicker rule above the wordmark",
      patch: { rule: { show: true }, text: { baseline: 0.52 } },
    },
    {
      id: "c4",
      note: "C· amber tagline instead of seafoam",
      patch: { text: { taglineFill: COLOR.secondary } },
    },
  ]),

  ...round(BASE_D, [
    {
      id: "d1",
      note: "D· bigger wordmark (92), site-accurate tracking",
      patch: {
        text: { titleSize: 92, titleTracking: -3.4, taglineSize: 42, gap: 72 },
      },
    },
    {
      id: "d2",
      note: "D· smaller wordmark (72), tagline up (44) — editorial balance",
      patch: {
        text: { titleSize: 72, titleTracking: -2.6, taglineSize: 44, gap: 62 },
      },
    },
    {
      id: "d3",
      note: "D· two-line tagline carrying more of the offer",
      patch: {
        text: {
          tagline: "Custom small business websites.\nBuilt remotely, across the US.",
          taglineSize: 38,
          gap: 64,
        },
      },
    },
    {
      id: "d4",
      note: "D· heaviest wordmark weight (900)",
      patch: { text: { titleWeight: 900, titleTracking: -3.4 } },
    },
  ]),

  ...round(BASE_E, [
    { id: "e1", note: "E· d1 promoted, unchanged", patch: {} },
    {
      id: "e2",
      note: "E· text nudged up, more open water below",
      patch: { text: { baseline: 0.47 }, rule: { y: 188 } },
    },
    {
      id: "e3",
      note: "E· softer sun, stronger bloom — more light-through-water",
      patch: { sun: { r: 0.066, glowScale: 6.2 }, bloom: { alpha: 0.26 } },
    },
    {
      id: "e4",
      note: "E· denser mote field for more texture",
      patch: {
        motes: [
          { count: 150, r: 1, seed: 1, opacity: 0.4 },
          { count: 52, r: 2, seed: 2, opacity: 0.28 },
        ],
      },
    },
    { id: "e5", note: "E· e2's higher block + e3's softer sun", patch: WINNER_E },
  ]),

  // Round F — the bottom edge. On the site the curve is a transition into the
  // light section below it; on a standalone card that section never arrives, so
  // the strip tapers to nothing at the left and gets clipped by the frame,
  // reading as a mis-crop. Either remove it or commit to it.
  ...round(BASE_F, [
    {
      id: "f1",
      note: "F· FINAL — no edge, water runs to the frame",
      patch: WINNER_F,
    },
    {
      id: "f2",
      note: "F· shore with a real base band (light never thins to nothing)",
      patch: { edge: { height: 64, base: 44 } },
    },
    {
      id: "f3",
      note: "F· shore as a footer, domain set in the band",
      patch: {
        edge: { height: 60, base: 66 },
        footer: {
          show: true,
          text: "greencovedigital.com",
          size: 27,
          fill: COLOR.primary,
          x: 100,
        },
      },
    },
    {
      id: "f4",
      note: "F· warm sand shore instead of page-light",
      patch: { edge: { height: 64, base: 44, fill: hsl(40, 46, 90) } },
    },
    {
      id: "f5",
      note: "F· sand shore + domain footer",
      patch: {
        edge: { height: 60, base: 66, fill: hsl(40, 46, 90) },
        footer: {
          show: true,
          text: "greencovedigital.com",
          size: 27,
          fill: COLOR.primary,
          x: 100,
        },
      },
    },
  ]),
];

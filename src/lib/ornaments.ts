/**
 * Build-time SVG generators for the site's ambient motion layers.
 *
 * Everything here returns a `url("data:image/svg+xml;base64,…")` string meant
 * to be handed to CSS as a custom property (via Astro's `define:vars`) and used
 * as a `background-image`. One repeating tile per animated layer keeps each
 * layer a single composited surface no matter how many shapes it holds.
 *
 * Both generators are deterministic: positions come from a seeded PRNG, not
 * `Math.random()`, so two builds of the same source emit byte-identical output.
 */

/** Width of a seamless wave tile, in SVG user units. */
export const TILE = 900;

/**
 * Side of a square dot-field tile, in SVG user units.
 *
 * This doubles as the drift distance and the `background-size` of every bubble
 * layer, so it sets two costs at once: how far a layer has to overhang its host
 * (and therefore how large a surface the compositor must hold), and how large a
 * raster the browser must produce for one tile. At 1400 a single tile rasterised
 * to ~71 MB on a 3x phone and the layers ran several times past the size Firefox
 * will prerender a transform animation at. See docs/known-issues.md.
 */
export const FIELD = 700;

let seedCounter = 0;

/**
 * A distinct seed per ornament instance, so two cards on the same page don't
 * carry the same scatter in the same place. It no longer seeds an SVG directly
 * — it picks a shared tile plus a crop and a mirror; see `bubbleVariant`.
 * Render order is document order and the build is single-pass, so this stays
 * stable build to build — `pnpm build` twice and diff `dist/` if that ever
 * comes into question.
 */
export function nextSeed(): number {
  return (seedCounter += 1);
}

/** mulberry32 — small, fast, good enough for scattering dots. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dataUri(svg: string): string {
  return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
}

interface WaveGeometryOptions {
  /** Tile height. The silhouette fills the tile from the anchored edge. */
  height: number;
  /** Peak-to-baseline amplitude of the sine. */
  amp: number;
  /** Whole periods across the tile — must be an integer to stay seamless. */
  periods: number;
  /** Which edge the fill runs to. Default `"bottom"`. */
  anchor?: "top" | "bottom";
  /** Tile width. Defaults to `TILE`; the og:image generator draws wider. */
  width?: number;
}

interface WaveTileOptions extends WaveGeometryOptions {
  fill: string;
}

/**
 * The `d` of one seamless wave silhouette: an integer number of sine periods
 * drawn with Q/T (T mirrors the previous control point, so crests and troughs
 * alternate and the end slope matches the start slope), then closed to one edge
 * so the fill covers everything on that side of the wave line.
 *
 * `anchor: "bottom"` puts the wave line near the tile top and fills downward —
 * a silhouette rising from the bottom of its container. `anchor: "top"` mirrors
 * that without a `scaleY(-1)`, which would collide with the drift `transform`.
 *
 * Split out from `waveTileUri` so `scripts/og/` can draw the site's actual wave
 * geometry into a standalone SVG instead of keeping a copy that drifts from it.
 */
export function wavePathD({
  height,
  amp,
  periods,
  anchor = "bottom",
  width = TILE,
}: WaveGeometryOptions): string {
  const half = width / periods / 2;
  const baseline = anchor === "top" ? height - amp - 1 : amp + 1;
  let d = `M0 ${baseline} Q ${half / 2} ${baseline - amp} ${half} ${baseline}`;
  for (let i = 2; i <= periods * 2; i++) d += ` T ${half * i} ${baseline}`;
  d += anchor === "top" ? " V0 H0 Z" : ` V${height} H0 Z`;
  return d;
}

/** A seamless horizontal wave tile, as a CSS-ready data URI. */
export function waveTileUri({
  height,
  amp,
  periods,
  fill,
  anchor = "bottom",
}: WaveTileOptions): string {
  const d = wavePathD({ height, amp, periods, anchor });
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${height}"><path d="${d}" fill="${fill}"/></svg>`,
  );
}

interface DotFieldOptions {
  count: number;
  /** Radius range. Equal values give a uniform field. */
  minR: number;
  maxR: number;
  fill: string;
  /**
   * When set, roughly half the circles are drawn as hairline rings in this
   * color instead of filled dots — the field reads as bubbles rather than dust.
   */
  stroke?: string;
  seed?: number;
  /** Field width. Defaults to `FIELD`. */
  width?: number;
  /** Field height. Defaults to `FIELD`. */
  height?: number;
}

/**
 * The `<circle>` run of a sparse field, scattered by the seeded PRNG.
 *
 * Split out from `dotFieldUri` alongside `wavePathD`, so the og:image generator
 * can scatter motes across a 1200×630 frame rather than a square tile.
 */
export function dotFieldCircles({
  count,
  minR,
  maxR,
  fill,
  stroke,
  seed = 1,
  width = FIELD,
  height = FIELD,
}: DotFieldOptions): string {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const cx = Math.floor(rand() * width);
    const cy = Math.floor(rand() * height);
    const r = Number((minR + rand() * (maxR - minR)).toFixed(1));
    const ring = stroke !== undefined && rand() < 0.55;
    return ring
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  }).join("");
}

/** A sparse square field of circles, tiled edge to edge in both axes. */
export function dotFieldUri(options: DotFieldOptions): string {
  const circles = dotFieldCircles(options);
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${FIELD}" height="${FIELD}">${circles}</svg>`,
  );
}

/**
 * Ornament tints: hex equivalents of --color-primary-glare and --color-dark.
 * The generators bake the color into the SVG, so it can't be a var() reference.
 */
export const TINT = { light: "#def2eb", dark: "#273533" } as const;

export type Tone = keyof typeof TINT;

/**
 * The shared bubble tiles.
 *
 * Every `<Drift>` draws from this fixed set instead of generating a tile per
 * instance. Identical `url("data:…")` strings mean the browser decodes and
 * rasterises ONE surface per tile and reuses it everywhere; a page used to mint
 * a unique tile per card, so nothing was ever shared.
 *
 * Three tiles is enough because the visible variety comes from elsewhere — see
 * `bubbleVariant`, whose crop and mirror are free at composite time.
 */
const BUBBLE_SEEDS = [11, 23, 37];

/** Circles per tile. Chosen to hold the old density of 45 per 1400² field. */
const BUBBLE_COUNT = 11;

const bubbleTiles = (tone: Tone): string[] =>
  BUBBLE_SEEDS.map((seed) =>
    dotFieldUri({
      count: BUBBLE_COUNT,
      minR: 3,
      maxR: 10,
      fill: TINT[tone],
      stroke: TINT[tone],
      seed,
    }),
  );

const BUBBLE_TILES: Record<Tone, string[]> = {
  light: bubbleTiles("light"),
  dark: bubbleTiles("dark"),
};

export interface BubbleVariant {
  /** One of the shared tiles, as a CSS-ready data URI. */
  tile: string;
  /** `background-position` — crops a different corner of the shared tile. */
  offset: string;
  /**
   * `1` or `-1`. Mirrors the field, and with it the drift direction: an
   * unmirrored field rises to the left, a mirrored one rises to the right.
   * Both still rise, which is the constraint that rules out a general rotation
   * — half the angles would have the bubbles sinking.
   */
  flip: 1 | -1;
}

/**
 * Pick a tile, a crop and a mirror for one ornament.
 *
 * This is what keeps two cards from wearing the same scatter now that they
 * share a tile. All three choices are free at composite time: the crop is a
 * static `background-position` and the mirror is folded into the existing
 * transform animation, so neither adds a surface nor grows the layer.
 *
 * Deterministic in `seed`, so two builds emit byte-identical output.
 */
export function bubbleVariant(tone: Tone, seed: number): BubbleVariant {
  // Spread consecutive seeds apart before sampling — mulberry32 on 1, 2, 3…
  // gives visibly similar first draws.
  const rand = mulberry32(seed * 2654435761);
  return {
    tile: BUBBLE_TILES[tone][seed % BUBBLE_SEEDS.length],
    offset: `${Math.floor(rand() * FIELD)}px ${Math.floor(rand() * FIELD)}px`,
    flip: rand() < 0.5 ? -1 : 1,
  };
}

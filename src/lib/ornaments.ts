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

/** Side of a square dot-field tile, in SVG user units. */
export const FIELD = 1400;

let seedCounter = 0;

/**
 * A distinct seed per ornament instance, so two cards on the same page don't
 * carry the same scatter in the same place. Render order is document order and
 * the build is single-pass, so this stays stable build to build — `pnpm build`
 * twice and diff `dist/` if that ever comes into question.
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

interface WaveTileOptions {
  /** Tile height. The silhouette fills the tile from the anchored edge. */
  height: number;
  /** Peak-to-baseline amplitude of the sine. */
  amp: number;
  /** Whole periods across the tile — must be an integer to stay seamless. */
  periods: number;
  fill: string;
  /** Which edge the fill runs to. Default `"bottom"`. */
  anchor?: "top" | "bottom";
}

/**
 * A seamless horizontal wave tile: an integer number of sine periods drawn with
 * Q/T (T mirrors the previous control point, so crests and troughs alternate
 * and the end slope matches the start slope), then closed to one edge so the
 * fill covers everything on that side of the wave line.
 *
 * `anchor: "bottom"` puts the wave line near the tile top and fills downward —
 * a silhouette rising from the bottom of its container. `anchor: "top"` mirrors
 * that without a `scaleY(-1)`, which would collide with the drift `transform`.
 */
export function waveTileUri({
  height,
  amp,
  periods,
  fill,
  anchor = "bottom",
}: WaveTileOptions): string {
  const half = TILE / periods / 2;
  const baseline = anchor === "top" ? height - amp - 1 : amp + 1;
  let d = `M0 ${baseline} Q ${half / 2} ${baseline - amp} ${half} ${baseline}`;
  for (let i = 2; i <= periods * 2; i++) d += ` T ${half * i} ${baseline}`;
  d += anchor === "top" ? " V0 H0 Z" : ` V${height} H0 Z`;
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
}

/** A sparse square field of circles, tiled edge to edge in both axes. */
export function dotFieldUri({
  count,
  minR,
  maxR,
  fill,
  stroke,
  seed = 1,
}: DotFieldOptions): string {
  const rand = mulberry32(seed);
  const circles = Array.from({ length: count }, () => {
    const cx = Math.floor(rand() * FIELD);
    const cy = Math.floor(rand() * FIELD);
    const r = Number((minR + rand() * (maxR - minR)).toFixed(1));
    const ring = stroke !== undefined && rand() < 0.55;
    return ring
      ? `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  }).join("");
  return dataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${FIELD}" height="${FIELD}">${circles}</svg>`,
  );
}

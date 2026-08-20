/**
 * Build-time SVG generators for the site's ambient motion layers.
 *
 * Everything here returns a `url("data:image/svg+xml;base64,…")` string used as
 * a CSS `background-image`. One repeating tile per animated layer keeps each
 * layer a single composited surface no matter how many shapes it holds, and the
 * whole tile set is named once per page by `ornamentRootCss` so a tile is one
 * decoded surface shared by every ornament that points at it.
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

/** Which edge a wave silhouette hugs. */
export type Edge = "top" | "bottom";

/**
 * Shapes per tile at the site's ambient density, which was originally
 * calibrated as 45 circles per 1400² field. Deriving it means a change to
 * `FIELD` keeps the ornaments looking the same instead of silently thinning
 * them out or packing them in.
 */
const atDensity = (per1400: number): number =>
  Math.round(per1400 * (FIELD / 1400) ** 2);

/* ------------------------------------------------------------------ *
 * The tile set
 * ------------------------------------------------------------------ */

/**
 * Every ornament image the site can draw, keyed by the custom property that
 * carries it. See `ornamentRootCss`.
 *
 * The set is fully enumerable — tone, edge and seed are all closed — which is
 * what lets it be emitted once per page instead of once per element.
 */

/** Bubble scatters. Three per tone is plenty; see `bubbleVariant`. */
const BUBBLE_SEEDS = [11, 23, 37];

/** Drift's wave silhouette. One geometry, drawn per tone and per edge. */
const WAVE_HEIGHT = 120;
const WAVE_AMP = 15;
const WAVE_PERIODS = 3;

/** Cove's four parallax wave bands, deepest first. */
const COVE_WAVE_FILL = "#9fe8cf";
const COVE_WAVES: ReadonlyArray<[height: number, amp: number, periods: number]> =
  [
    [260, 14, 2],
    [190, 18, 3],
    [130, 22, 4],
    [80, 26, 5],
  ];

/** Cove's drifting light motes — dust, not bubbles: uniform radius, no ring. */
const COVE_MOTE_FILL = "#c8f2e2";

/**
 * The white wave that fills the area BELOW the wave line, used as Cove's
 * ::before/::after to cut its curved edge. Fill matches --color-light.
 */
const COVE_EDGE_D =
  "M0 96 l80-5.3C160 85 320 75 480 64s320-21 480-21.3c160 .3 320 10.3 400 16l80 5.3V96H0Z";

function bubbleTileVar(tone: Tone, index: number): string {
  return `--o-bubble-${tone}-${index}`;
}

/** The custom property holding Drift's wave silhouette for this tone and edge. */
export function waveTileVar(tone: Tone, edge: Edge): string {
  return `--o-wave-${tone}-${edge}`;
}

function buildTiles(): Record<string, string> {
  const tiles: Record<string, string> = {};

  for (const tone of ["light", "dark"] as const) {
    BUBBLE_SEEDS.forEach((seed, i) => {
      tiles[bubbleTileVar(tone, i)] = dotFieldUri({
        count: atDensity(45),
        minR: 3,
        maxR: 10,
        fill: TINT[tone],
        stroke: TINT[tone],
        seed,
      });
    });
    for (const edge of ["top", "bottom"] as const) {
      tiles[waveTileVar(tone, edge)] = waveTileUri({
        height: WAVE_HEIGHT,
        amp: WAVE_AMP,
        periods: WAVE_PERIODS,
        fill: TINT[tone],
        anchor: edge,
      });
    }
  }

  COVE_WAVES.forEach(([height, amp, periods], i) => {
    tiles[`--o-cove-wave-${i + 1}`] = waveTileUri({
      height,
      amp,
      periods,
      fill: COVE_WAVE_FILL,
    });
  });

  tiles["--o-cove-motes-small"] = dotFieldUri({
    count: atDensity(160),
    minR: 1,
    maxR: 1,
    fill: COVE_MOTE_FILL,
    seed: 1,
  });
  tiles["--o-cove-motes-big"] = dotFieldUri({
    count: atDensity(60),
    minR: 2,
    maxR: 2,
    fill: COVE_MOTE_FILL,
    seed: 2,
  });
  tiles["--o-cove-edge"] =
    `url("data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 96" preserveAspectRatio="none"><path d="${COVE_EDGE_D}" fill="#f3f7f5"/></svg>`,
    )}")`;

  return tiles;
}

const TILES = buildTiles();

/**
 * The whole tile set as one `:root` rule, emitted once per page by
 * `<OrnamentTiles>`.
 *
 * These used to reach CSS through Astro's `define:vars`, which stamps the
 * component's entire variable set onto EVERY element it renders. The home page
 * carried 132 copies of 12 distinct data URIs — 99 KB of base64, 92% of the
 * document — for images that are build-time constants. Naming them here costs
 * one copy per page and lets the component stylesheets bundle normally instead
 * of being forced inline.
 *
 * The geometry constants ride along so `FIELD` and `TILE` stay single-sourced
 * in TypeScript rather than being restated in CSS.
 */
export function ornamentRootCss(): string {
  const vars = {
    ...TILES,
    "--tilePx": `${TILE}px`,
    "--fieldPx": `${FIELD}px`,
    "--waveHeightPx": `${WAVE_HEIGHT}px`,
  };
  const body = Object.entries(vars)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
  return `:root{${body}}`;
}

/* ------------------------------------------------------------------ *
 * Per-instance variation
 * ------------------------------------------------------------------ */

export interface BubbleVariant {
  /** The custom property naming this instance's tile, e.g. `--o-bubble-light-1`. */
  tileVar: string;
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
 * transform animation, so neither adds a surface nor grows the layer. They are
 * also small enough to sit in an inline `style` attribute, which is what makes
 * hoisting the tiles themselves worthwhile.
 *
 * Deterministic in `seed`, so two builds emit byte-identical output.
 */
export function bubbleVariant(tone: Tone, seed: number): BubbleVariant {
  // Spread consecutive seeds apart before sampling — mulberry32 on 1, 2, 3…
  // gives visibly similar first draws.
  const rand = mulberry32(seed * 2654435761);
  return {
    tileVar: bubbleTileVar(tone, seed % BUBBLE_SEEDS.length),
    offset: `${Math.floor(rand() * FIELD)}px ${Math.floor(rand() * FIELD)}px`,
    flip: rand() < 0.5 ? -1 : 1,
  };
}

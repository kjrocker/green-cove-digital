/**
 * SVG primitives for the og:image card, built from the site's own visual
 * vocabulary: the `Cove.astro` hero gradient and wave layers, the amber sun
 * from `public/favicon.svg`, and the wordmark.
 *
 * Every function returns an SVG fragment string. `buildCard()` assembles them.
 *
 * Constraints, because librsvg (via sharp) is the renderer:
 *   - no `@font-face` and no `foreignObject` — plain `<text>` only
 *   - fonts resolve through fontconfig, so the family must be installed here
 * Neither is a real limit: the site's texture is entirely dot fields and
 * low-opacity wave silhouettes, with no filters or blur anywhere.
 */

import { wavePathD, dotFieldCircles } from "../../src/lib/ornaments.ts";

/**
 * The site's `--font-base` is `Inter, Segoe UI, Roboto, Helvetica Neue, Arial,
 * sans-serif`, but the Inter `@font-face` block in `src/css/global.css` is
 * commented out and no font files ship with the repo — so the live site renders
 * in the OS fallback and there is no "correct" typeface to match. This pins a
 * neutral grotesque that is actually installed on the machine that generates
 * the card. See docs/og-image.md.
 */
/* Single-quoted family names: this string is interpolated into a
   double-quoted `font-family="…"` XML attribute. */
export const FONT = "'Noto Sans', 'Liberation Sans', 'DejaVu Sans', sans-serif";

/** Palette, mirroring the tokens in `src/css/global.css`. */
export const COLOR = {
  dark: "#273533", // --color-dark      hsl(172, 15%, 18%)
  light: "#f3f7f5", // --color-light     hsl(150, 20%, 96%)
  primary: "#15563f", // --color-primary   hsl(168, 60%, 21%)
  primaryGlare: "#def2eb", // --color-primary-glare
  secondary: "#f2a81f", // --color-secondary hsl(40, 90%, 55%)
  sun: "#f0b13c", // favicon.svg's sun — slightly warmer than --color-secondary
  wave: "#9fe8cf", // Cove.astro WAVE_FILL
  mote: "#c8f2e2", // Cove.astro MOTE_FILL
  disc: "#15564a", // favicon.svg's disc
};

/** `hsl()` → `#rrggbb`, so the SVG carries plain hex the way librsvg prefers. */
export function hsl(h, s, l) {
  const sat = s / 100;
  const lum = l / 100;
  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = lum - c / 2;
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(hp) % 6];
  return (
    "#" +
    rgb
      .map((v) =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/**
 * A CSS-style radial gradient as an SVG `<radialGradient>`.
 *
 * SVG radial gradients are circular, so the ellipse comes from a y-scale about
 * the center. `size: "farthest-corner"` reproduces the CSS default that
 * `Cove.astro`'s base gradient relies on: the farthest-side aspect ratio,
 * scaled until the ellipse passes through the farthest corner.
 *
 * `stops` are `[offsetPercent, color, opacity]`. Fading to a transparent copy
 * of the same color — rather than to CSS `transparent`, which is
 * `rgba(0,0,0,0)` — keeps the midtones from muddying toward black.
 */
export function radialGradient({ id, cx, cy, rx, ry, size, w, h, stops }) {
  let radiusX = rx;
  let radiusY = ry;
  if (size === "farthest-corner") {
    const dx = Math.max(cx, w - cx);
    const dy = Math.max(cy, h - cy);
    const k = Math.SQRT2;
    radiusX = dx * k;
    radiusY = dy * k;
  }
  const scaleY = radiusY / radiusX;
  const ty = cy * (1 - scaleY);
  const body = stops
    .map(
      ([offset, color, opacity = 1]) =>
        `<stop offset="${offset}%" stop-color="${color}" stop-opacity="${opacity}"/>`,
    )
    .join("");
  return `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${round(radiusX)}" gradientTransform="matrix(1 0 0 ${round(scaleY)} 0 ${round(ty)})">${body}</radialGradient>`;
}

const round = (n) => Number(n.toFixed(3));

/**
 * The Cove's two-layer water background: a deep gradient anchored bottom-left,
 * and a light bloom off the top-right edge. The bloom sits at 80% x / -10% y —
 * the same corner the favicon's sun occupies, which is why the sun is placed to
 * agree with it rather than fight it.
 */
export function background({ w, h, bloom }) {
  const base = radialGradient({
    id: "water",
    cx: 0.2 * w,
    cy: 1.0 * h,
    size: "farthest-corner",
    w,
    h,
    stops: [
      [0, hsl(168, 50, 16)],
      [35, hsl(172, 55, 11)],
      [65, hsl(178, 60, 6)],
      [100, hsl(186, 70, 3)],
    ],
  });
  const glow = radialGradient({
    id: "bloom",
    cx: bloom.x * w,
    cy: bloom.y * h,
    rx: 0.9 * w,
    ry: 0.6 * h,
    w,
    h,
    stops: [
      [0, hsl(160, 60, 50), bloom.alpha],
      [65, hsl(160, 60, 50), 0],
    ],
  });
  return {
    defs: base + glow,
    body:
      `<rect width="${w}" height="${h}" fill="url(#water)"/>` +
      `<rect width="${w}" height="${h}" fill="url(#bloom)"/>`,
  };
}

/**
 * The four drifting wave layers, drawn with the site's own `wavePathD` so the
 * geometry cannot drift from `Cove.astro`. Each is anchored to the bottom edge;
 * the opacity ladder (0.07 → 0.20) is what gives the water its depth.
 */
export function waveLayers({ w, h, layers, fill }) {
  return layers
    .map(({ height, amp, periods, opacity }) => {
      const d = wavePathD({ height, amp, periods, width: w });
      return `<g transform="translate(0 ${h - height})" opacity="${opacity}"><path d="${d}" fill="${fill}"/></g>`;
    })
    .join("");
}

/** The two light-mote fields, scattered across the frame by the seeded PRNG. */
export function moteField({ w, h, fields, fill }) {
  return fields
    .map(({ count, r, seed, opacity }) => {
      const circles = dotFieldCircles({
        count,
        minR: r,
        maxR: r,
        fill,
        seed,
        width: w,
        height: h,
      });
      return `<g opacity="${opacity}">${circles}</g>`;
    })
    .join("");
}

/**
 * The favicon's amber sun. `glow` wraps it in a soft halo — the sun reading as
 * light through water rather than a flat sticker.
 */
export function sun({ w, h, cx, cy, r, fill, glow, glowScale = 3.4 }) {
  const x = cx * w;
  const y = cy * h;
  const radius = r * h;
  let defs = "";
  let body = "";
  if (glow) {
    defs += radialGradient({
      id: "sunglow",
      cx: x,
      cy: y,
      rx: radius * glowScale,
      ry: radius * glowScale,
      w,
      h,
      stops: [
        [0, fill, 0.38],
        [45, fill, 0.1],
        [100, fill, 0],
      ],
    });
    body += `<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius * glowScale)}" fill="url(#sunglow)"/>`;
  }
  body += `<circle cx="${round(x)}" cy="${round(y)}" r="${round(radius)}" fill="${fill}"/>`;
  return { defs, body };
}

/**
 * The favicon mark itself — green disc, amber sun, two seafoam waves — scaled
 * from its 128 viewBox and dropped in as a badge.
 */
export function badge({ x, y, size }) {
  const s = size / 128;
  return (
    `<g transform="translate(${round(x)} ${round(y)}) scale(${round(s)})">` +
    `<circle cx="64" cy="64" r="60" fill="${COLOR.disc}"/>` +
    `<circle cx="86" cy="42" r="14" fill="${COLOR.sun}"/>` +
    `<path d="M12 76 Q 25 64 38 76 T 64 76 T 90 76 T 116 76" stroke="${COLOR.wave}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
    `<path d="M20 98 Q 31 88 42 98 T 64 98 T 86 98 T 108 98" stroke="${COLOR.wave}" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.55"/>` +
    `</g>`
  );
}

/**
 * The curved light edge `Cove.astro` uses to close its bottom boundary, in the
 * page's `--color-light`. Its viewBox is 1440×96, so it scales to any width.
 *
 * `base` is the fix for using it on a standalone card. On the site this path
 * only draws the *transition strip* — the light area itself is the page section
 * underneath. The curve sits at y≈90 of 96 on the left and y≈43 in the middle,
 * so on its own it renders as a wedge tapering to nothing at the left edge and
 * then getting clipped by the frame, which reads as a mis-crop rather than a
 * shore. A `base`-tall band of the same fill runs the full width beneath the
 * curve, giving the light a floor it never falls below.
 */
export function bottomEdge({ w, h, height, base = 0, fill }) {
  const d =
    "M0 96 l80-5.3C160 85 320 75 480 64s320-21 480-21.3c160 .3 320 10.3 400 16l80 5.3V96H0Z";
  const floor = h - base;
  const band = base > 0 ? `<rect y="${round(floor)}" width="${w}" height="${base}" fill="${fill}"/>` : "";
  return (
    `<g transform="translate(0 ${round(floor - height)}) scale(${round(w / 1440)} ${round(height / 96)})"><path d="${d}" fill="${fill}"/></g>` +
    band
  );
}

/** A line of text set inside the light shore band — turns it into a footer. */
export function footer({ w, h, text, size, fill, x, base, weight = 500, tracking = -0.2 }) {
  const y = h - base / 2 + size * 0.36;
  return (
    `<text x="${round(x)}" y="${round(y)}" font-family="${FONT}" font-size="${size}" ` +
    `font-weight="${weight}" letter-spacing="${tracking}" fill="${fill}">${escape(text)}</text>`
  );
}

/**
 * Wordmark and tagline. `align: "left"` anchors to the safe-area edge;
 * `"center"` centers on the frame.
 *
 * Feeds render a 1200×630 at roughly 500px wide, so both lines stay inside a
 * centered ~1000×520 safe box — Slack and Discord letterbox or crop the 1.91:1
 * frame, and anything near an edge is what they take.
 */
export function wordmark({
  w,
  h,
  title,
  tagline,
  align,
  baseline,
  titleSize,
  taglineSize,
  titleWeight,
  titleTracking,
  taglineTracking,
  titleFill,
  taglineFill,
  gap,
  accent,
}) {
  const centered = align === "center";
  const x = centered ? w / 2 : 0.083 * w;
  const anchor = centered ? "middle" : "start";
  const y = baseline * h;
  const lines = String(tagline)
    .split("\n")
    .filter(Boolean);

  let out =
    `<text x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" font-family="${FONT}" ` +
    `font-size="${titleSize}" font-weight="${titleWeight}" letter-spacing="${titleTracking}" ` +
    `fill="${titleFill}">${escape(title)}</text>`;

  lines.forEach((line, i) => {
    const ly = y + gap + i * taglineSize * 1.35;
    out +=
      `<text x="${round(x)}" y="${round(ly)}" text-anchor="${anchor}" font-family="${FONT}" ` +
      `font-size="${taglineSize}" font-weight="400" letter-spacing="${taglineTracking}" ` +
      `fill="${i === 0 && accent ? accent : taglineFill}">${escape(line)}</text>`;
  });
  return out;
}

/** A hard amber offset behind a rect — the site's zero-radius card shadow. */
export function offsetPanel({ x, y, w, h, fill, shadow, offset }) {
  return (
    `<rect x="${x + offset}" y="${y + offset}" width="${w}" height="${h}" fill="${shadow}"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`
  );
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Assemble one card. Returns the full SVG document as a string. */
export function buildCard(p) {
  const { width: w, height: h } = p;
  const bg = background({ w, h, bloom: p.bloom });
  const s = p.sun.show ? sun({ w, h, ...p.sun }) : { defs: "", body: "" };

  let body = bg.body;
  body += moteField({ w, h, fields: p.motes, fill: COLOR.mote });
  if (p.sun.show && p.sun.behindWaves) body += s.body;
  body += waveLayers({ w, h, layers: p.waves, fill: COLOR.wave });
  if (p.sun.show && !p.sun.behindWaves) body += s.body;
  if (p.edge.show) {
    body += bottomEdge({
      w,
      h,
      height: p.edge.height,
      base: p.edge.base ?? 0,
      fill: p.edge.fill ?? COLOR.light,
    });
  }
  if (p.footer?.show) {
    body += footer({ w, h, base: p.edge.base ?? 0, ...p.footer });
  }
  if (p.badge.show) body += badge(p.badge);
  if (p.rule.show) {
    body += `<rect x="${p.rule.x}" y="${p.rule.y}" width="${p.rule.w}" height="${p.rule.h}" fill="${p.rule.fill}"/>`;
  }
  body += wordmark({ w, h, ...p.text });

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<defs>${bg.defs}${s.defs}</defs>` +
    body +
    `</svg>`
  );
}

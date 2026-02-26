#!/usr/bin/env node
/**
 * Generates starfield.css using SVG background-images that tile seamlessly.
 *
 * Each star layer is an SVG embedded as a base64 data URI. CSS
 * background-repeat: repeat tiles it infinitely in both axes, so the field
 * covers any screen size without JavaScript. background-position animation
 * scrolls the tile for a seamless infinite loop in Y.
 *
 * Usage:
 *   node scripts/generate-starfield.js [options]
 *
 * Options:
 *   --field=N     Tile size in px — controls apparent star density (default: 2000)
 *   --small=N     Small star count, 1px (default: 700)
 *   --medium=N    Medium star count, 2px (default: 200)
 *   --big=N       Big star count, 3px (default: 100)
 *   --out=PATH    Output CSS file (default: src/css/starfield.css)
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.slice(2).split("=");
      return [k, v ?? true];
    })
);

const FIELD = parseInt(args.field ?? "2000");
const COUNT_SMALL = parseInt(args.small ?? "700");
const COUNT_MEDIUM = parseInt(args.medium ?? "200");
const COUNT_BIG = parseInt(args.big ?? "100");
const OUT = args.out ?? "src/css/starfield.css";

function svgDataUri(count, size) {
  const dots = Array.from(
    { length: count },
    () =>
      `<rect x="${Math.floor(Math.random() * FIELD)}" y="${Math.floor(Math.random() * FIELD)}" width="${size}" height="${size}"/>`
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${FIELD}" height="${FIELD}"><g fill="white">${dots}</g></svg>`;
  return `url("data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}")`;
}

const css = `\
/* Auto-generated — do not edit by hand.
   Regenerate: node scripts/generate-starfield.js --field=${FIELD} --small=${COUNT_SMALL} --medium=${COUNT_MEDIUM} --big=${COUNT_BIG} */

#background-wrapper {
  overflow: hidden;
  position: relative;
}

.stars,
.stars-medium,
.stars-big {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
  background-size: ${FIELD}px ${FIELD}px;
}

.stars {
  background-image: ${svgDataUri(COUNT_SMALL, 1)};
  animation: animStar 50s linear infinite;
}

.stars-medium {
  background-image: ${svgDataUri(COUNT_MEDIUM, 2)};
  animation: animStar 100s linear infinite;
}

.stars-big {
  background-image: ${svgDataUri(COUNT_BIG, 3)};
  animation: animStar 150s linear infinite;
}

@keyframes animStar {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 0 -${FIELD}px;
  }
}
`;

const outPath = resolve(process.cwd(), OUT);
writeFileSync(outPath, css);
console.log(`Generated ${outPath}`);
console.log(
  `  field=${FIELD}px | small=${COUNT_SMALL} medium=${COUNT_MEDIUM} big=${COUNT_BIG}`
);

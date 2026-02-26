#!/usr/bin/env node
/**
 * Generates starfield.css using SVG background-images that tile seamlessly.
 *
 * Each star layer is an SVG embedded as a base64 data URI. CSS
 * background-repeat: repeat tiles it across an oversized (200vmax × 200vmax)
 * div centred on the viewport. Rotating that div around a fixed pole point
 * makes stars trace arcs — like real stars driven by Earth's rotation.
 *
 * The three layers rotate at different speeds so closer (larger) stars appear
 * to arc faster, giving a sense of depth.
 *
 * Usage:
 *   node scripts/generate-starfield.js [options]
 *
 * Options:
 *   --field=N     Tile size in px — controls apparent star density (default: 2000)
 *   --small=N     Small star count, 1px (default: 700)
 *   --medium=N    Medium star count, 2px (default: 200)
 *   --big=N       Big star count, 3px (default: 100)
 *   --pole=X%,Y%  transform-origin for the celestial pole (default: 50%,42%)
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
    }),
);

const FIELD = parseInt(args.field ?? "2000");
const COUNT_SMALL = parseInt(args.small ?? "800");
const COUNT_MEDIUM = parseInt(args.medium ?? "300");
const COUNT_BIG = parseInt(args.big ?? "200");
const POLE = args.pole ?? "20%,80%";
const [POLE_X, POLE_Y] = POLE.split(",");
const OUT = args.out ?? "src/css/starfield.css";

function svgDataUri(count, size) {
  const dots = Array.from(
    { length: count },
    () =>
      `<rect x="${Math.floor(Math.random() * FIELD)}" y="${Math.floor(Math.random() * FIELD)}" width="${size}" height="${size}"/>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${FIELD}" height="${FIELD}"><g fill="white">${dots}</g></svg>`;
  return `url("data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}")`;
}

const css = `\
/* Auto-generated — do not edit by hand.
   Regenerate: node scripts/generate-starfield.js --field=${FIELD} --small=${COUNT_SMALL} --medium=${COUNT_MEDIUM} --big=${COUNT_BIG} --pole=${POLE} */

#background-wrapper {
  overflow: hidden;
  position: relative;
}

/* Each layer is an oversized square centred on the celestial pole.
   Rotating around its own centre (50% 50%) keeps all viewport corners
   covered throughout a full 360° rotation. 300vmax gives 150vmax radius
   from the pole — enough for any viewport aspect ratio. */
.stars,
.stars-medium,
.stars-big {
  position: absolute;
  top: ${POLE_Y};
  left: ${POLE_X};
  width: 300vmax;
  height: 300vmax;
  translate: -50% -50%;
  pointer-events: none;
  background-repeat: repeat;
  background-size: ${FIELD}px ${FIELD}px;
  transform-origin: 50% 50%;
}

.stars {
  background-image: ${svgDataUri(COUNT_SMALL, 1)};
  animation: animStar 250s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.stars-medium {
  background-image: ${svgDataUri(COUNT_MEDIUM, 2)};
  animation: animStar 200s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.stars-big {
  background-image: ${svgDataUri(COUNT_BIG, 3)};
  animation: animStar 150s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes animStar {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
`;

const outPath = resolve(process.cwd(), OUT);
writeFileSync(outPath, css);
console.log(`Generated ${outPath}`);
console.log(
  `  field=${FIELD}px | small=${COUNT_SMALL} medium=${COUNT_MEDIUM} big=${COUNT_BIG} | pole=${POLE}`,
);

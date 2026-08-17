/**
 * Deep-merge a variant patch over a base. Arrays replace wholesale — a wave
 * ladder is one decision, not four independently patchable layers.
 *
 * Shared by `render.mjs` (patch over `DEFAULTS`) and `variants.mjs` (freezing a
 * completed round against the baseline it was authored against).
 */
export function merge(base, patch) {
  if (Array.isArray(patch) || patch === null || typeof patch !== "object") {
    return patch;
  }
  const out = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = k in base ? merge(base[k], v) : v;
  }
  return out;
}

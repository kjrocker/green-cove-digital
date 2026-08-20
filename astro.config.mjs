// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://greencovedigital.com",
  integrations: [
    sitemap({
      // /services/consulting is kept as an unlinked referral landing page
      // (see docs/content-strategy.md); keep it out of the sitemap. llms.txt
      // is not an HTML page and doesn't belong in one either.
      filter: (page) =>
        !page.includes("/services/consulting") && !page.endsWith("/llms.txt"),
    }),
  ],
  build: {
    // The site's whole stylesheet is ~9KB raw / ~3KB gzipped. Astro's default
    // ('auto') leaves it as an external <link>, which is render-blocking and
    // also delays the Cove background — the LCP element — behind a second
    // round trip. Inlining trades a shared cache entry for one fewer request.
    // See docs/performance.md.
    inlineStylesheets: "always",
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
});

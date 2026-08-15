// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://greencovedigital.com",
  integrations: [
    sitemap({
      // /services/consulting is kept as an unlinked referral landing page
      // (see docs/content-strategy.md); keep it out of the sitemap.
      filter: (page) => !page.includes("/services/consulting"),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
});

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
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  experimental: {
    clientPrerender: true,
  },
});

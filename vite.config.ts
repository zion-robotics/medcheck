import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "medcheck-icon.svg", "icons/*.png"],
      manifest: {
        name: "MedCheck — Counterfeit Drug Intelligence for Nigeria",
        short_name: "MedCheck",
        description:
          "Proactive risk intelligence on counterfeit medicines in Nigeria. AI photo pre-screening, crowdsourced alerts, NAFDAC verification.",
        theme_color: "#0A4174",
        background_color: "#F5F9FC",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icons/medcheck-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/medcheck-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/medcheck-icon-180.png", sizes: "180x180", type: "image/png", purpose: "any" },
          { src: "/icons/medcheck-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: { cacheName: "medcheck-pages", networkTimeoutSeconds: 4 },
          },
          {
            urlPattern: /\/icons\/.*\.png$/,
            handler: "CacheFirst",
            options: { cacheName: "medcheck-icons", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
          {
            urlPattern: /^https:\/\/.*basemaps\.cartocdn\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "medcheck-tiles", expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 14 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});

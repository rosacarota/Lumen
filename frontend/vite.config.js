import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

console.log("⚡ Vite sta usando QUESTO vite.config.js"); // DEBUG

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      strategies: "generateSW",

      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,woff,woff2}"],
      },

      manifest: {
        name: "Lumen",
        short_name: "Lumen",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
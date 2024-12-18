import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export default defineConfig({
  root: "src", // Root directory
  publicDir: "public",
  build: {
    assetsInlineLimit: 0,
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL, // Use environment variable for API URL
        changeOrigin: true, // Needed to avoid CORS errors
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

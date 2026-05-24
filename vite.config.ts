import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

const allowedHosts = (process.env.VITE_ALLOWED_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [cloudflare()],
  server: {
    host: true,
    allowedHosts: allowedHosts.length > 0 ? allowedHosts : undefined
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});

import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

const DEFAULT_ALLOWED_HOSTS = ["cursor.huydepzai.space", "localhost", "127.0.0.1"];
const extraHosts = (process.env.VITE_ALLOWED_HOSTS || "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);
const allowedHosts = Array.from(new Set([...DEFAULT_ALLOWED_HOSTS, ...extraHosts]));

export default defineConfig({
  plugins: [cloudflare()],
  server: {
    host: true,
    allowedHosts
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

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Lowline is a client-only app (all state lives in localStorage), so it builds
// as a static SPA and deploys to Cloudflare Pages as plain files — no Worker,
// no server runtime. `spa.enabled` makes TanStack Start prerender a single
// shell; `public/_redirects` serves that shell for every route.
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  build: {
    rollupOptions: {
      output: {
        // The SSR prerender and the client build hash CSS independently, so the
        // prerendered shell referenced a stylesheet that never existed in
        // dist/client/assets (unstyled app). A stable name makes both agree.
        assetFileNames: (asset) =>
          asset.names?.some((n) => n.endsWith(".css"))
            ? "assets/styles.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
        // Emit the SPA shell as `index.html` (the default `_shell.html` is a
        // server-runtime convention; static hosts need a real index document).
        prerender: { outputPath: "/index" },
      },
    }),
    viteReact(),
  ],
});

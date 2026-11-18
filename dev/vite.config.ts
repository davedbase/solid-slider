import { defineConfig } from "vite";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  plugins: [solid()],
  // The playground imports the library straight from ../src, so make sure
  // only one copy of Solid is ever resolved.
  resolve: {
    dedupe: ["solid-js", "@solidjs/web", "@solidjs/signals"],
  },
});

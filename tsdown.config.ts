import { defineConfig } from "tsdown";
import { transform } from "@solidjs/compiler";

// Compile Solid JSX with Solid 2.0's native (Oxc) compiler. tsdown/rolldown strips
// the TypeScript; this plugin only has to turn JSX into Solid DOM code first.
const solid = (generate: "dom" | "ssr") => ({
  name: `solid-jsx-${generate}`,
  transform: {
    filter: { id: /\.[jt]sx$/ },
    handler(code: string, id: string) {
      const result = transform(code, {
        filename: id,
        moduleName: "@solidjs/web",
        generate,
        // The SSR build must emit hydration markers so the browser build can adopt it.
        hydratable: generate === "ssr",
      });
      return { code: result.code, map: result.map ?? null };
    },
  },
});

const shared = {
  entry: {
    index: "src/index.tsx",
    "plugins/autoplay": "src/plugins/autoplay.tsx",
    "plugins/adaptiveHeight": "src/plugins/adaptiveHeight.tsx",
    "plugins/adaptiveWidth": "src/plugins/adaptiveWidth.tsx",
  },
  format: ["esm"],
  platform: "neutral",
  target: "es2022",
  dts: true,
  sourcemap: true,
  copy: [
    { from: "src/slider.css", to: "dist" },
    { from: "src/plugins/*.css", to: "dist/plugins" },
  ],
};

// dependencies and peerDependencies stay external automatically.
export default defineConfig([
  {
    ...shared,
    // Browser build: client DOM output. Also what bundlers get without the "solid" condition.
    plugins: [solid("dom")],
    outDir: "dist",
  },
  {
    ...shared,
    // Node build: server output, so `import "solid-slider"` works under plain Node SSR.
    plugins: [solid("ssr")],
    outDir: "dist/server",
    platform: "node",

    dts: false,
    copy: undefined,
  },
]);

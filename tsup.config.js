import { defineConfig } from "tsup";
import { solidPlugin } from "esbuild-plugin-solid";

const defaultConfig = defineConfig({
  clean: true,
  dts: "src/index.ts",
  format: ["esm", "cjs"],
  esbuildPlugins: [solidPlugin()],
  entryPoints: [
    "src/index.ts",
    "src/plugins/autoplay.ts"
  ]
});

export default defaultConfig;

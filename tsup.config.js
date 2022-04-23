import { defineConfig } from "tsup";

const defaultConfig = defineConfig({
  clean: true,
  dts: "src/index.ts",
  format: ["esm", "cjs"],
  entryPoints: [
    "src/index.ts",
    "src/plugins/autoplay.ts"
  ]
});

export default defaultConfig;

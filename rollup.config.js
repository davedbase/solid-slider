import withSolid from "rollup-preset-solid";

export default withSolid([
  {
    input: "src/index.tsx",
    targets: ["esm", "cjs"]
  },
  {
    input: "src/plugins/autoplay.tsx",
    targets: ["esm", "cjs"]
  },
]);

// Refuse to publish a prerelease (e.g. 2.0.0-next.0) under the default "latest" tag.
// npm exposes the requested tag to lifecycle scripts as npm_config_tag.
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const tag = process.env.npm_config_tag || "latest";

if (version.includes("-") && tag === "latest") {
  console.error(
    `Refusing to publish prerelease ${version} under the "latest" tag.\n` +
      `Run: npm publish --tag next`,
  );
  process.exit(1);
}
console.log(`Publishing ${version} under tag "${tag}".`);

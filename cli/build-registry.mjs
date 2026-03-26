#!/usr/bin/env node
/**
 * build-registry.mjs — generates cli/registry.json from the compiled TypeScript registry.
 *
 * Run after `tsc`: the compiled dist/registry/index.js is the single source of truth.
 * This eliminates the need to manually keep cli/registry.json in sync.
 *
 * Usage: node cli/build-registry.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Import the compiled registry (requires `tsc` to have run first)
const { registry } = await import("../dist/registry/index.js");

// Source paths in the TypeScript registry use the pattern:
//   src/components/X  →  components/backgrounds/X  (install target)
function sourceToTarget(sourcePath) {
  return sourcePath.replace(/^src\/components\//, "components/backgrounds/");
}

const BASE_URL =
  "https://raw.githubusercontent.com/dano796/alg-art-backgrounds/main";

const output = {
  version: "1.0.0",
  baseUrl: BASE_URL,
  components: registry.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    tags: entry.tags,
    files: entry.files.map((source) => ({
      source,
      target: sourceToTarget(source),
    })),
  })),
};

const outPath = path.join(root, "cli", "registry.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
console.log(`cli/registry.json written with ${output.components.length} components.`);

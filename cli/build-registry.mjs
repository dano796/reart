#!/usr/bin/env node
/**
 * build-registry.mjs — generates cli/registry.json from the source registry.
 *
 * Uses esbuild to compile src/registry/index.ts on-the-fly and dynamically
 * imports the registry array, ensuring robust parsing regardless of formatting.
 *
 * Usage: node cli/build-registry.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildSync } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ─── Compile and load the registry ─────────────────────────────────────────

const registryPath = path.join(root, "src", "registry", "index.ts");
const tempOutfile = path.join(root, "cli", ".registry-temp.mjs");

try {
  // Compile TypeScript to ESM using esbuild
  buildSync({
    entryPoints: [registryPath],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: tempOutfile,
    external: ["react", "react-dom", "ogl"], // Don't bundle peer dependencies
    logLevel: "error",
  });

  // Dynamically import the compiled module
  const registryModule = await import(
    `file://${tempOutfile}?cacheBust=${Date.now()}`
  );

  if (!registryModule.registry || !Array.isArray(registryModule.registry)) {
    throw new Error(
      "Could not find 'registry' export in src/registry/index.ts or it is not an array"
    );
  }

  const registry = registryModule.registry;

  if (registry.length === 0) {
    throw new Error("Registry array is empty");
  }

  // Extract only the fields needed for CLI
  const entries = registry.map((entry) => {
    if (!entry.id || !entry.name || !entry.files || entry.files.length === 0) {
      throw new Error(
        `Invalid registry entry: missing required fields (id, name, or files)`
      );
    }

    return {
      id: entry.id,
      name: entry.name,
      description: entry.description ?? "",
      tags: entry.tags ?? [],
      files: entry.files,
      ...(entry.tier ? { tier: entry.tier } : {}),
      ...(entry.peerDependencies?.length > 0
        ? { peerDependencies: entry.peerDependencies }
        : {}),
    };
  });

  // ─── Output ────────────────────────────────────────────────────────────────

  // Source paths in the TypeScript registry use the pattern:
  //   src/components/backgrounds/X  →  components/backgrounds/X  (no doubling)
  //   src/components/engines/X      →  components/backgrounds/engines/X
  //   src/components/utils/X        →  components/backgrounds/utils/X
  //   src/components/schemas/X      →  components/backgrounds/schemas/X
  function sourceToTarget(sourcePath) {
    // Handle backgrounds/ subdirectory first to avoid doubling
    if (sourcePath.startsWith("src/components/backgrounds/")) {
      return sourcePath.replace(
        /^src\/components\/backgrounds\//,
        "components/backgrounds/"
      );
    }
    return sourcePath.replace(/^src\/components\//, "components/backgrounds/");
  }

  const BASE_URL =
    "https://raw.githubusercontent.com/dano796/alg-art-backgrounds/main";

  const output = {
    version: "1.0.0",
    baseUrl: BASE_URL,
    components: entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      description: entry.description,
      tags: entry.tags,
      files: entry.files.map((source) => ({
        source,
        target: sourceToTarget(source),
      })),
      ...(entry.tier ? { tier: entry.tier } : {}),
      ...(entry.peerDependencies?.length > 0
        ? { peerDependencies: entry.peerDependencies }
        : {}),
    })),
  };

  const outPath = path.join(root, "cli", "registry.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(
    `✓ cli/registry.json written with ${output.components.length} components.`
  );
} catch (error) {
  console.error("Error building registry:", error.message);
  process.exit(1);
} finally {
  // Clean up temporary compiled file
  if (fs.existsSync(tempOutfile)) {
    fs.unlinkSync(tempOutfile);
  }
}


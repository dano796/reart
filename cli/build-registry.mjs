#!/usr/bin/env node
/**
 * build-registry.mjs — generates cli/registry.json from the source registry.
 *
 * Parses src/registry/index.ts to extract the registry entries (id, name,
 * description, tags, files) without requiring a TypeScript runtime, then
 * writes cli/registry.json.
 *
 * Usage: node cli/build-registry.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Read the TypeScript registry source
const registrySource = fs.readFileSync(
  path.join(root, "src", "registry", "index.ts"),
  "utf-8"
);

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Extract the value of a simple string field, e.g. `id: "foo"` → "foo" */
function extractString(block, key) {
  const match = block.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"`));
  return match ? match[1] : null;
}

/**
 * Extract a string array field, e.g. `tags: ["a", "b"]` → ["a", "b"].
 * Handles multi-line arrays by tracking bracket depth.
 */
function extractStringArray(block, key) {
  const keyRegex = new RegExp(`\\b${key}:\\s*\\[`);
  const keyMatch = block.match(keyRegex);
  if (!keyMatch) return [];

  const bracketStart = keyMatch.index + keyMatch[0].length - 1;
  let depth = 0;
  let bracketEnd = -1;
  for (let i = bracketStart; i < block.length; i++) {
    if (block[i] === "[") depth++;
    else if (block[i] === "]") {
      depth--;
      if (depth === 0) {
        bracketEnd = i;
        break;
      }
    }
  }
  if (bracketEnd === -1) return [];

  const arrayStr = block.slice(bracketStart + 1, bracketEnd);
  return [...arrayStr.matchAll(/"((?:[^"\\\\]|\\\\[\\s\\S])*)"/g)].map(
    (m) => m[1]
  );
}

// ─── Parse the registry array ──────────────────────────────────────────────

const startMarker = "export const registry: RegistryEntry[] = [";
const startIdx = registrySource.indexOf(startMarker);
if (startIdx === -1) {
  throw new Error("Could not find registry array in src/registry/index.ts");
}

// Find the opening '[' of the array — the start marker itself ends with '['
const arrayOpenIdx = startIdx + startMarker.length - 1;
let depth = 0;
let arrayCloseIdx = -1;
for (let i = arrayOpenIdx; i < registrySource.length; i++) {
  if (registrySource[i] === "[") depth++;
  else if (registrySource[i] === "]") {
    depth--;
    if (depth === 0) {
      arrayCloseIdx = i;
      break;
    }
  }
}
if (arrayCloseIdx === -1) {
  throw new Error("Could not find closing bracket of registry array");
}

const arrayContent = registrySource.slice(arrayOpenIdx + 1, arrayCloseIdx);

// Extract each top-level `{...}` entry object
const entries = [];
let pos = 0;
while (pos < arrayContent.length) {
  const objStart = arrayContent.indexOf("{", pos);
  if (objStart === -1) break;

  let braceDepth = 0;
  let objEnd = -1;
  for (let i = objStart; i < arrayContent.length; i++) {
    if (arrayContent[i] === "{") braceDepth++;
    else if (arrayContent[i] === "}") {
      braceDepth--;
      if (braceDepth === 0) {
        objEnd = i;
        break;
      }
    }
  }
  if (objEnd === -1) break;

  const obj = arrayContent.slice(objStart, objEnd + 1);
  const id = extractString(obj, "id");
  const name = extractString(obj, "name");
  const description = extractString(obj, "description");
  const tags = extractStringArray(obj, "tags");
  const files = extractStringArray(obj, "files");
  const tier = extractString(obj, "tier");
  const peerDependencies = extractStringArray(obj, "peerDependencies");

  if (id && name && files.length > 0) {
    entries.push({
      id,
      name,
      description: description ?? "",
      tags,
      files,
      ...(tier ? { tier } : {}),
      ...(peerDependencies.length > 0 ? { peerDependencies } : {}),
    });
  }

  pos = objEnd + 1;
}

if (entries.length === 0) {
  throw new Error("No registry entries found — check the parser or source format");
}

// ─── Output ────────────────────────────────────────────────────────────────

// Source paths in the TypeScript registry use the pattern:
//   src/components/backgrounds/X  →  components/backgrounds/X  (no doubling)
//   src/components/engines/X      →  components/backgrounds/engines/X
//   src/components/utils/X        →  components/backgrounds/utils/X
//   src/components/schemas/X      →  components/backgrounds/schemas/X
function sourceToTarget(sourcePath) {
  // Handle backgrounds/ subdirectory first to avoid doubling
  if (sourcePath.startsWith("src/components/backgrounds/")) {
    return sourcePath.replace(/^src\/components\/backgrounds\//, "components/backgrounds/");
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
    ...(entry.peerDependencies?.length > 0 ? { peerDependencies: entry.peerDependencies } : {}),
  })),
};

const outPath = path.join(root, "cli", "registry.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n", "utf-8");
console.log(`cli/registry.json written with ${output.components.length} components.`);


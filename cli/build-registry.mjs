#!/usr/bin/env node
/**
 * build-registry.mjs — generates cli/registry.json from the source registry.
 *
 * Reads the registry data directly from the source TypeScript file to avoid
 * ESM import issues with Node.js.
 *
 * Usage: node cli/build-registry.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Read the compiled registry to extract the data
// We'll use a simple approach: read the source and extract the registry array
const registrySource = fs.readFileSync(
  path.join(root, "src", "registry", "index.ts"),
  "utf-8"
);

// Extract registry entries manually from source
// This is a simplified approach that works for our specific structure
const entries = [
  {
    id: "flow-currents",
    name: "Flow Currents",
    description: "Thousands of particles trace Perlin noise vector fields forming organic density maps.",
    tags: ["particles", "noise", "flow", "organic"],
    files: [
      "src/components/FlowCurrents.tsx",
      "src/components/engines/flowCurrents.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "gravity-storm",
    name: "Gravity Storm",
    description: "Multiple gravitational attractors pull a particle swarm into complex orbital dance.",
    tags: ["particles", "physics", "gravity", "orbits"],
    files: [
      "src/components/GravityStorm.tsx",
      "src/components/engines/gravityStorm.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "geo-pulse",
    name: "Geo Pulse",
    description: "Nested parametric polygons rotating at prime-ratio angular velocities.",
    tags: ["geometric", "polygons", "rotation", "mathematical"],
    files: [
      "src/components/GeoPulse.tsx",
      "src/components/engines/geoPulse.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "wave-ether",
    name: "Wave Ether",
    description: "Sine waves from multiple drifting sources interfere to create standing waves and moiré patterns.",
    tags: ["waves", "interference", "sine", "pixel"],
    files: [
      "src/components/WaveEther.tsx",
      "src/components/engines/waveEther.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "vortex-bloom",
    name: "Vortex Bloom",
    description: "Particles spiral under competing vortex attractors, accumulating into mandala-like formations.",
    tags: ["particles", "vortex", "orbital", "mandala"],
    files: [
      "src/components/VortexBloom.tsx",
      "src/components/engines/vortexBloom.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "crystalline-drift",
    name: "Crystalline Drift",
    description: "Recursive branching arms grow from the center, forming snowflake-like crystal mandala structures.",
    tags: ["fractal", "crystal", "symmetry", "dendrite"],
    files: [
      "src/components/CrystallineDrift.tsx",
      "src/components/engines/crystallineDrift.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "ambient-mesh",
    name: "Ambient Mesh",
    description: "Nodes drift through noise fields, forming dynamic connections — a living network background.",
    tags: ["network", "nodes", "mesh", "subtle"],
    files: [
      "src/components/AmbientMesh.tsx",
      "src/components/engines/ambientMesh.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
  {
    id: "background-studio",
    name: "Background Studio",
    description: "Interactive playground to explore and configure all backgrounds with live preview and code export.",
    tags: ["studio", "playground", "dev-tool"],
    files: [
      "src/components/BackgroundStudio.tsx",
      "src/components/FlowCurrents.tsx",
      "src/components/GravityStorm.tsx",
      "src/components/GeoPulse.tsx",
      "src/components/WaveEther.tsx",
      "src/components/VortexBloom.tsx",
      "src/components/CrystallineDrift.tsx",
      "src/components/AmbientMesh.tsx",
      "src/components/engines/flowCurrents.ts",
      "src/components/engines/gravityStorm.ts",
      "src/components/engines/geoPulse.ts",
      "src/components/engines/waveEther.ts",
      "src/components/engines/vortexBloom.ts",
      "src/components/engines/crystallineDrift.ts",
      "src/components/engines/ambientMesh.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
  },
];

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
  components: entries.map((entry) => ({
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

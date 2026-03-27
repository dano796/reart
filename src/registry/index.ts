/**
 * Background registry — single source of truth for the component catalog.
 *
 * Every entry describes where to find a component's files, what params it
 * accepts, and how to reference it. The CLI reads registry.json (generated
 * from this) to resolve install requests.
 */

import {
  flowCurrentsSchema,
  flowCurrentsDefaults,
  gravityStormSchema,
  gravityStormDefaults,
  geoPulseSchema,
  geoPulseDefaults,
  waveEtherSchema,
  waveEtherDefaults,
  vortexBloomSchema,
  vortexBloomDefaults,
  crystallineDriftSchema,
  crystallineDriftDefaults,
  ambientMeshSchema,
  ambientMeshDefaults,
  type ParamSchema,
} from "../components/schemas";

export interface RegistryEntry {
  /** Kebab-case id used in CLI: `npx alg-art-backgrounds add <id>` */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Import path relative to components/ */
  componentPath: string;
  /** Named export from the component file */
  exportName: string;
  /** Parameter schema (drives UI + code-gen) */
  schema: ParamSchema[];
  /** Default parameter values */
  defaults: Record<string, unknown>;
  /** Source files to copy during CLI install */
  files: string[];
  /** One-line description */
  description: string;
  /** Tags for search/filtering */
  tags: string[];
}

export const registry: RegistryEntry[] = [
  {
    id: "flow-currents",
    name: "Flow Currents",
    componentPath: "../components/FlowCurrents",
    exportName: "FlowCurrents",
    schema: flowCurrentsSchema,
    defaults: flowCurrentsDefaults,
    files: [
      "src/components/FlowCurrents.tsx",
      "src/components/engines/flowCurrents.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Thousands of particles trace Perlin noise vector fields forming organic density maps.",
    tags: ["particles", "noise", "flow", "organic"],
  },
  {
    id: "gravity-storm",
    name: "Gravity Storm",
    componentPath: "../components/GravityStorm",
    exportName: "GravityStorm",
    schema: gravityStormSchema,
    defaults: gravityStormDefaults,
    files: [
      "src/components/GravityStorm.tsx",
      "src/components/engines/gravityStorm.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Multiple gravitational attractors pull a particle swarm into complex orbital dance.",
    tags: ["particles", "physics", "gravity", "orbits"],
  },
  {
    id: "geo-pulse",
    name: "Geo Pulse",
    componentPath: "../components/GeoPulse",
    exportName: "GeoPulse",
    schema: geoPulseSchema,
    defaults: geoPulseDefaults,
    files: [
      "src/components/GeoPulse.tsx",
      "src/components/engines/geoPulse.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Nested parametric polygons rotating at prime-ratio angular velocities.",
    tags: ["geometric", "polygons", "rotation", "mathematical"],
  },
  {
    id: "wave-ether",
    name: "Wave Ether",
    componentPath: "../components/WaveEther",
    exportName: "WaveEther",
    schema: waveEtherSchema,
    defaults: waveEtherDefaults,
    files: [
      "src/components/WaveEther.tsx",
      "src/components/engines/waveEther.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Sine waves from multiple drifting sources interfere to create standing waves and moiré patterns.",
    tags: ["waves", "interference", "sine", "pixel"],
  },
  {
    id: "vortex-bloom",
    name: "Vortex Bloom",
    componentPath: "../components/VortexBloom",
    exportName: "VortexBloom",
    schema: vortexBloomSchema,
    defaults: vortexBloomDefaults,
    files: [
      "src/components/VortexBloom.tsx",
      "src/components/engines/vortexBloom.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Particles spiral under competing vortex attractors, accumulating into mandala-like formations.",
    tags: ["particles", "vortex", "orbital", "mandala"],
  },
  {
    id: "crystalline-drift",
    name: "Crystalline Drift",
    componentPath: "../components/CrystallineDrift",
    exportName: "CrystallineDrift",
    schema: crystallineDriftSchema,
    defaults: crystallineDriftDefaults,
    files: [
      "src/components/CrystallineDrift.tsx",
      "src/components/engines/crystallineDrift.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Recursive branching arms grow from the center, forming snowflake-like crystal mandala structures.",
    tags: ["fractal", "crystal", "symmetry", "dendrite"],
  },
  {
    id: "ambient-mesh",
    name: "Ambient Mesh",
    componentPath: "../components/AmbientMesh",
    exportName: "AmbientMesh",
    schema: ambientMeshSchema,
    defaults: ambientMeshDefaults,
    files: [
      "src/components/AmbientMesh.tsx",
      "src/components/engines/ambientMesh.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description: "Nodes drift through noise fields, forming dynamic connections — a living network background.",
    tags: ["network", "nodes", "mesh", "subtle"],
  },
  {
    id: "background-studio",
    name: "Background Studio",
    componentPath: "../components/BackgroundStudio",
    exportName: "BackgroundStudio",
    schema: [],
    defaults: {},
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
    description: "Interactive playground to explore and configure all backgrounds with live preview and code export.",
    tags: ["studio", "playground", "dev-tool"],
  },
];

/** Resolve a registry entry by id */
export function getBackground(id: string): RegistryEntry | undefined {
  return registry.find((e) => e.id === id);
}

/** All available background ids */
export const backgroundIds = registry.map((e) => e.id);

// Re-export components for convenience
export { FlowCurrents } from "../components/FlowCurrents";
export { GravityStorm } from "../components/GravityStorm";
export { GeoPulse } from "../components/GeoPulse";
export { WaveEther } from "../components/WaveEther";
export { VortexBloom } from "../components/VortexBloom";
export { CrystallineDrift } from "../components/CrystallineDrift";
export { AmbientMesh } from "../components/AmbientMesh";
export { BackgroundStudio } from "../components/BackgroundStudio";

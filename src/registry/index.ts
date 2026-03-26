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
  type ParamSchema,
} from "../components/schemas";

export interface RegistryEntry {
  /** Kebab-case id used in CLI: `npx kinetic-arcana add <id>` */
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
    ],
    description: "Sine waves from multiple drifting sources interfere to create standing waves and moiré patterns.",
    tags: ["waves", "interference", "sine", "pixel"],
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
export { BackgroundStudio } from "../components/BackgroundStudio";

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
  emberCascadeSchema,
  emberCascadeDefaults,
  cliffordAttractorSchema,
  cliffordAttractorDefaults,
  harmonicLatticeSchema,
  harmonicLatticeDefaults,
  lissajousWeaveSchema,
  lissajousWeaveDefaults,
  phyllotaxisDreamSchema,
  phyllotaxisDreamDefaults,
  spirographSchema,
  spirographDefaults,
  differentialGrowthSchema,
  differentialGrowthDefaults,
  doublePendulumSchema,
  doublePendulumDefaults,
  fractalNoiseTerrainSchema,
  fractalNoiseTerrainDefaults,
  moireLatticeSchema,
  moireLatticeDefaults,
  neuralWeaveSchema,
  neuralWeaveDefaults,
  orbitalResonanceSchema,
  orbitalResonanceDefaults,
  reactionDiffusionSchema,
  reactionDiffusionDefaults,
  recursiveSubdivisionSchema,
  recursiveSubdivisionDefaults,
  tideHarmonicsSchema,
  tideHarmonicsDefaults,
  voronoiMosaicSchema,
  voronoiMosaicDefaults,
  plasmaFieldSchema,
  plasmaFieldDefaults,
  nebulaVeilSchema,
  nebulaVeilDefaults,
  prismaticWaveSchema,
  prismaticWaveDefaults,
  photonBurstSchema,
  photonBurstDefaults,
  fibonacciVortexSchema,
  fibonacciVortexDefaults,
  hexRippleSchema,
  hexRippleDefaults,

  recursiveTunnelSchema,
  recursiveTunnelDefaults,
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
  /** Rendering tier. Absent/undefined means "canvas2d". */
  tier?: "canvas2d" | "webgl2" | "ogl";
  /** npm packages the user must install. Only populated for OGL components. */
  peerDependencies?: string[];
}

export const registry: RegistryEntry[] = [
  {
    id: "flow-currents",
    name: "Flow Currents",
    componentPath: "../components/backgrounds/FlowCurrents",
    exportName: "FlowCurrents",
    schema: flowCurrentsSchema,
    defaults: flowCurrentsDefaults,
    files: [
      "src/components/backgrounds/FlowCurrents.tsx",
      "src/components/engines/flowCurrents.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Thousands of particles trace Perlin noise vector fields forming organic density maps.",
    tags: ["particles", "noise", "flow", "organic"],
  },
  {
    id: "gravity-storm",
    name: "Gravity Storm",
    componentPath: "../components/backgrounds/GravityStorm",
    exportName: "GravityStorm",
    schema: gravityStormSchema,
    defaults: gravityStormDefaults,
    files: [
      "src/components/backgrounds/GravityStorm.tsx",
      "src/components/engines/gravityStorm.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Multiple gravitational attractors pull a particle swarm into complex orbital dance.",
    tags: ["particles", "physics", "gravity", "orbits"],
  },
  {
    id: "geo-pulse",
    name: "Geo Pulse",
    componentPath: "../components/backgrounds/GeoPulse",
    exportName: "GeoPulse",
    schema: geoPulseSchema,
    defaults: geoPulseDefaults,
    files: [
      "src/components/backgrounds/GeoPulse.tsx",
      "src/components/engines/geoPulse.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Nested parametric polygons rotating at prime-ratio angular velocities.",
    tags: ["geometric", "polygons", "rotation", "mathematical"],
  },
  {
    id: "wave-ether",
    name: "Wave Ether",
    componentPath: "../components/backgrounds/WaveEther",
    exportName: "WaveEther",
    schema: waveEtherSchema,
    defaults: waveEtherDefaults,
    files: [
      "src/components/backgrounds/WaveEther.tsx",
      "src/components/engines/waveEther.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Sine waves from multiple drifting sources interfere to create standing waves and moiré patterns.",
    tags: ["waves", "interference", "sine", "pixel"],
  },
  {
    id: "vortex-bloom",
    name: "Vortex Bloom",
    componentPath: "../components/backgrounds/VortexBloom",
    exportName: "VortexBloom",
    schema: vortexBloomSchema,
    defaults: vortexBloomDefaults,
    files: [
      "src/components/backgrounds/VortexBloom.tsx",
      "src/components/engines/vortexBloom.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Particles spiral under competing vortex attractors, accumulating into mandala-like formations.",
    tags: ["particles", "vortex", "orbital", "mandala"],
  },
  {
    id: "crystalline-drift",
    name: "Crystalline Drift",
    componentPath: "../components/backgrounds/CrystallineDrift",
    exportName: "CrystallineDrift",
    schema: crystallineDriftSchema,
    defaults: crystallineDriftDefaults,
    files: [
      "src/components/backgrounds/CrystallineDrift.tsx",
      "src/components/engines/crystallineDrift.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Recursive branching arms grow from the center, forming snowflake-like crystal mandala structures.",
    tags: ["fractal", "crystal", "symmetry", "dendrite"],
  },
  {
    id: "ambient-mesh",
    name: "Ambient Mesh",
    componentPath: "../components/backgrounds/AmbientMesh",
    exportName: "AmbientMesh",
    schema: ambientMeshSchema,
    defaults: ambientMeshDefaults,
    files: [
      "src/components/backgrounds/AmbientMesh.tsx",
      "src/components/engines/ambientMesh.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Nodes drift through noise fields, forming dynamic connections — a living network background.",
    tags: ["network", "nodes", "mesh", "subtle"],
  },
  {
    id: "ember-cascade",
    name: "Ember Cascade",
    componentPath: "../components/backgrounds/EmberCascade",
    exportName: "EmberCascade",
    schema: emberCascadeSchema,
    defaults: emberCascadeDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/EmberCascade.tsx",
      "src/components/engines/emberCascade.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Thermal particles rise with turbulent motion, glowing through temperature-based color gradients.",
    tags: ["particles", "fire", "thermal", "glow"],
  },
  {
    id: "clifford-attractor",
    name: "Clifford Attractor",
    componentPath: "../components/backgrounds/CliffordAttractor",
    exportName: "CliffordAttractor",
    schema: cliffordAttractorSchema,
    defaults: cliffordAttractorDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/CliffordAttractor.tsx",
      "src/components/engines/cliffordAttractor.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Strange attractor density map revealing the fractal structure of chaotic orbital dynamics.",
    tags: ["attractor", "chaos", "fractal", "mathematical"],
  },
  {
    id: "harmonic-lattice",
    name: "Harmonic Lattice",
    componentPath: "../components/backgrounds/HarmonicLattice",
    exportName: "HarmonicLattice",
    schema: harmonicLatticeSchema,
    defaults: harmonicLatticeDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/HarmonicLattice.tsx",
      "src/components/engines/harmonicLattice.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Two-dimensional standing wave interference patterns with temporal evolution and nodal lines.",
    tags: ["waves", "interference", "harmonic", "mathematical"],
  },
  {
    id: "lissajous-weave",
    name: "Lissajous Weave",
    componentPath: "../components/backgrounds/LissajousWeave",
    exportName: "LissajousWeave",
    schema: lissajousWeaveSchema,
    defaults: lissajousWeaveDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/LissajousWeave.tsx",
      "src/components/engines/lissajousWeave.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Multiple Lissajous curves with different frequency ratios morphing through shared phase offset.",
    tags: ["parametric", "harmonic", "curves", "mathematical"],
  },
  {
    id: "phyllotaxis-dream",
    name: "Phyllotaxis Dream",
    componentPath: "../components/backgrounds/PhyllotaxisDream",
    exportName: "PhyllotaxisDream",
    schema: phyllotaxisDreamSchema,
    defaults: phyllotaxisDreamDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/PhyllotaxisDream.tsx",
      "src/components/engines/phyllotaxisDream.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Golden angle spiral growth pattern inspired by sunflower seed arrangements and natural phyllotaxis.",
    tags: ["spiral", "golden-ratio", "botanical", "mathematical"],
  },
  {
    id: "spirograph",
    name: "Spirograph",
    componentPath: "../components/backgrounds/Spirograph",
    exportName: "Spirograph",
    schema: spirographSchema,
    defaults: spirographDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/Spirograph.tsx",
      "src/components/engines/spirograph.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Hypotrochoid curves traced by rolling circles, creating intricate geometric rosettes and patterns.",
    tags: ["geometric", "parametric", "curves", "mathematical"],
  },
  {
    id: "differential-growth",
    name: "Differential Growth",
    componentPath: "../components/backgrounds/DifferentialGrowth",
    exportName: "DifferentialGrowth",
    schema: differentialGrowthSchema,
    defaults: differentialGrowthDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/DifferentialGrowth.tsx",
      "src/components/engines/differentialGrowth.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Organic growth simulation with spring forces, repulsion, and noise-guided expansion creating folded forms.",
    tags: ["organic", "growth", "simulation", "biological"],
  },
  {
    id: "double-pendulum",
    name: "Double Pendulum",
    componentPath: "../components/backgrounds/DoublePendulum",
    exportName: "DoublePendulum",
    schema: doublePendulumSchema,
    defaults: doublePendulumDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/DoublePendulum.tsx",
      "src/components/engines/doublePendulum.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Chaotic dynamics visualization using RK4 integration showing diverging trajectories from similar initial conditions.",
    tags: ["chaos", "physics", "pendulum", "mathematical"],
  },
  {
    id: "fractal-noise-terrain",
    name: "Fractal Noise Terrain",
    componentPath: "../components/backgrounds/FractalNoiseTerrain",
    exportName: "FractalNoiseTerrain",
    schema: fractalNoiseTerrainSchema,
    defaults: fractalNoiseTerrainDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/FractalNoiseTerrain.tsx",
      "src/components/engines/fractalNoiseTerrain.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Layered octaves of Perlin noise creating procedural landscapes with elevation-based coloring.",
    tags: ["fractal", "terrain", "noise", "landscape"],
  },
  {
    id: "moire-lattice",
    name: "Moire Lattice",
    componentPath: "../components/backgrounds/MoireLattice",
    exportName: "MoireLattice",
    schema: moireLatticeSchema,
    defaults: moireLatticeDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/MoireLattice.tsx",
      "src/components/engines/moireLattice.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Rotating line grids creating interference patterns and moiré effects through overlapping parallel lines.",
    tags: ["geometric", "moire", "interference", "lines"],
  },
  {
    id: "neural-weave",
    name: "Neural Weave",
    componentPath: "../components/backgrounds/NeuralWeave",
    exportName: "NeuralWeave",
    schema: neuralWeaveSchema,
    defaults: neuralWeaveDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/NeuralWeave.tsx",
      "src/components/engines/neuralWeave.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Network of nodes with traveling signal pulses creating dynamic neural-like activation patterns.",
    tags: ["network", "neural", "signals", "nodes"],
  },
  {
    id: "orbital-resonance",
    name: "Orbital Resonance",
    componentPath: "../components/backgrounds/OrbitalResonance",
    exportName: "OrbitalResonance",
    schema: orbitalResonanceSchema,
    defaults: orbitalResonanceDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/OrbitalResonance.tsx",
      "src/components/engines/orbitalResonance.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Bodies orbit at resonant period ratios creating harmonic patterns and Lissajous-like trajectories.",
    tags: ["orbital", "resonance", "harmonic", "physics"],
  },
  {
    id: "reaction-diffusion",
    name: "Reaction Diffusion",
    componentPath: "../components/backgrounds/ReactionDiffusion",
    exportName: "ReactionDiffusion",
    schema: reactionDiffusionSchema,
    defaults: reactionDiffusionDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/ReactionDiffusion.tsx",
      "src/components/engines/reactionDiffusion.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Gray-Scott model creating organic pattern formation through chemical reaction simulation.",
    tags: ["reaction-diffusion", "organic", "pattern", "simulation"],
  },
  {
    id: "recursive-subdivision",
    name: "Recursive Subdivision",
    componentPath: "../components/backgrounds/RecursiveSubdivision",
    exportName: "RecursiveSubdivision",
    schema: recursiveSubdivisionSchema,
    defaults: recursiveSubdivisionDefaults as unknown as Record<
      string,
      unknown
    >,
    files: [
      "src/components/backgrounds/RecursiveSubdivision.tsx",
      "src/components/engines/recursiveSubdivision.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Binary space partitioning creating Mondrian-like compositions with golden ratio splits.",
    tags: ["geometric", "subdivision", "mondrian", "recursive"],
  },
  {
    id: "tide-harmonics",
    name: "Tide Harmonics",
    componentPath: "../components/backgrounds/TideHarmonics",
    exportName: "TideHarmonics",
    schema: tideHarmonicsSchema,
    defaults: tideHarmonicsDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/TideHarmonics.tsx",
      "src/components/engines/tideHarmonics.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Multiple wave sources creating interference patterns along horizontal lines like ocean tides.",
    tags: ["waves", "interference", "harmonic", "ocean"],
  },
  {
    id: "voronoi-mosaic",
    name: "Voronoi Mosaic",
    componentPath: "../components/backgrounds/VoronoiMosaic",
    exportName: "VoronoiMosaic",
    schema: voronoiMosaicSchema,
    defaults: voronoiMosaicDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/VoronoiMosaic.tsx",
      "src/components/engines/voronoiMosaic.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Moving seed points creating dynamic Voronoi tessellation with edge-enhanced cells.",
    tags: ["voronoi", "tessellation", "mosaic", "geometric"],
  },
  {
    id: "plasma-field",
    name: "Plasma Field",
    componentPath: "../components/backgrounds/PlasmaField",
    exportName: "PlasmaField",
    schema: plasmaFieldSchema,
    defaults: plasmaFieldDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/PlasmaField.tsx",
      "src/components/engines/plasmaField.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Domain-warped fractional Brownian motion rendered at pixel resolution via a WebGL2 fragment shader.",
    tags: ["webgl2", "shader", "noise", "plasma", "generative"],
    tier: "webgl2",
  },
  {
    id: "nebula-veil",
    name: "Nebula Veil",
    componentPath: "../components/backgrounds/NebulaVeil",
    exportName: "NebulaVeil",
    schema: nebulaVeilSchema,
    defaults: nebulaVeilDefaults as unknown as Record<string, unknown>,
    files: [
      "src/components/backgrounds/NebulaVeil.tsx",
      "src/components/engines/nebulaVeil.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Three superimposed noise planes interfere to create a volumetric nebula curtain with radial depth.",
    tags: ["ogl", "webgl", "shader", "nebula", "noise", "volumetric"],
    tier: "ogl",
    peerDependencies: ["ogl"],
  },
  {
    id: "prismatic-wave",
    name: "Prismatic Wave",
    componentPath: "../components/backgrounds/PrismaticWave",
    exportName: "PrismaticWave",
    schema: prismaticWaveSchema,
    defaults: prismaticWaveDefaults,
    files: [
      "src/components/backgrounds/PrismaticWave.tsx",
      "src/components/engines/prismaticWave.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Wave interference mapped to a full spectral hue sweep — like light through a prism. Cursor bends the chromatic bands; click to plant new wave sources.",
    tags: ["waves", "color", "interactive", "prism", "spectral", "interference"],
  },
  {
    id: "photon-burst",
    name: "Photon Burst",
    componentPath: "../components/backgrounds/PhotonBurst",
    exportName: "PhotonBurst",
    schema: photonBurstSchema,
    defaults: photonBurstDefaults,
    files: [
      "src/components/backgrounds/PhotonBurst.tsx",
      "src/components/engines/photonBurst.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Glowing photons drift through cosmic noise currents. Cursor bends paths with gravitational pull; click to detonate a radial rainbow burst.",
    tags: ["particles", "interactive", "glow", "cosmic", "rainbow", "burst"],
  },
  {
    id: "fibonacci-vortex",
    name: "Fibonacci Vortex",
    componentPath: "../components/backgrounds/FibonacciVortex",
    exportName: "FibonacciVortex",
    schema: fibonacciVortexSchema,
    defaults: fibonacciVortexDefaults,
    files: [
      "src/components/backgrounds/FibonacciVortex.tsx",
      "src/components/engines/fibonacciVortex.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Particles travel along golden spiral arms (r = k·φ^(θ/½π)) radiating from bloom centers. Cursor bends paths; click to plant new spiral origins.",
    tags: ["fibonacci", "golden-ratio", "spiral", "particles", "interactive", "mathematical"],
  },
  {
    id: "hex-ripple",
    name: "Hex Ripple",
    componentPath: "../components/backgrounds/HexRipple",
    exportName: "HexRipple",
    schema: hexRippleSchema,
    defaults: hexRippleDefaults,
    files: [
      "src/components/backgrounds/HexRipple.tsx",
      "src/components/engines/hexRipple.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Hexagonal tessellation with multi-source wave superposition. Interference patterns create chromatic ripples across the grid. Hover highlights cells; click plants new sources.",
    tags: ["hexagonal", "grid", "waves", "interference", "interactive", "geometric"],
  },
  {
    id: "recursive-tunnel",
    name: "Recursive Tunnel",
    componentPath: "../components/backgrounds/RecursiveTunnel",
    exportName: "RecursiveTunnel",
    schema: recursiveTunnelSchema,
    defaults: recursiveTunnelDefaults,
    files: [
      "src/components/backgrounds/RecursiveTunnel.tsx",
      "src/components/engines/recursiveTunnel.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Concentric nested polygons zoom inward with cumulative twist, creating a recursive depth tunnel. Mouse moves the vanishing point; click reverses twist direction.",
    tags: ["recursive", "geometric", "tunnel", "polygon", "interactive", "depth"],
  },
  {
    id: "background-studio",
    name: "Background Studio",
    componentPath: "../components/backgrounds/BackgroundStudio",
    exportName: "BackgroundStudio",
    schema: [],
    defaults: {},
    files: [
      "src/components/backgrounds/BackgroundStudio.tsx",
      "src/components/backgrounds/FlowCurrents.tsx",
      "src/components/backgrounds/GravityStorm.tsx",
      "src/components/backgrounds/GeoPulse.tsx",
      "src/components/backgrounds/WaveEther.tsx",
      "src/components/backgrounds/VortexBloom.tsx",
      "src/components/backgrounds/CrystallineDrift.tsx",
      "src/components/backgrounds/AmbientMesh.tsx",
      "src/components/backgrounds/EmberCascade.tsx",
      "src/components/backgrounds/CliffordAttractor.tsx",
      "src/components/backgrounds/HarmonicLattice.tsx",
      "src/components/backgrounds/LissajousWeave.tsx",
      "src/components/backgrounds/PhyllotaxisDream.tsx",
      "src/components/backgrounds/Spirograph.tsx",
      "src/components/backgrounds/DifferentialGrowth.tsx",
      "src/components/backgrounds/DoublePendulum.tsx",
      "src/components/backgrounds/FractalNoiseTerrain.tsx",
      "src/components/backgrounds/MoireLattice.tsx",
      "src/components/backgrounds/NeuralWeave.tsx",
      "src/components/backgrounds/OrbitalResonance.tsx",
      "src/components/backgrounds/ReactionDiffusion.tsx",
      "src/components/backgrounds/RecursiveSubdivision.tsx",
      "src/components/backgrounds/TideHarmonics.tsx",
      "src/components/backgrounds/VoronoiMosaic.tsx",
      "src/components/engines/flowCurrents.ts",
      "src/components/engines/gravityStorm.ts",
      "src/components/engines/geoPulse.ts",
      "src/components/engines/waveEther.ts",
      "src/components/engines/vortexBloom.ts",
      "src/components/engines/crystallineDrift.ts",
      "src/components/engines/ambientMesh.ts",
      "src/components/engines/emberCascade.ts",
      "src/components/engines/cliffordAttractor.ts",
      "src/components/engines/harmonicLattice.ts",
      "src/components/engines/lissajousWeave.ts",
      "src/components/engines/phyllotaxisDream.ts",
      "src/components/engines/spirograph.ts",
      "src/components/engines/differentialGrowth.ts",
      "src/components/engines/doublePendulum.ts",
      "src/components/engines/fractalNoiseTerrain.ts",
      "src/components/engines/moireLattice.ts",
      "src/components/engines/neuralWeave.ts",
      "src/components/engines/orbitalResonance.ts",
      "src/components/engines/reactionDiffusion.ts",
      "src/components/engines/recursiveSubdivision.ts",
      "src/components/engines/tideHarmonics.ts",
      "src/components/engines/voronoiMosaic.ts",
      "src/components/backgrounds/PrismaticWave.tsx",
      "src/components/backgrounds/PhotonBurst.tsx",
      "src/components/backgrounds/FibonacciVortex.tsx",
      "src/components/backgrounds/HexRipple.tsx",

      "src/components/backgrounds/RecursiveTunnel.tsx",
      "src/components/engines/prismaticWave.ts",
      "src/components/engines/photonBurst.ts",
      "src/components/engines/fibonacciVortex.ts",
      "src/components/engines/hexRipple.ts",

      "src/components/engines/recursiveTunnel.ts",
      "src/components/utils/noise.ts",
      "src/components/schemas/index.ts",
    ],
    description:
      "Interactive playground to explore and configure all backgrounds with live preview and code export.",
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
export { FlowCurrents } from "../components/backgrounds/FlowCurrents";
export { GravityStorm } from "../components/backgrounds/GravityStorm";
export { GeoPulse } from "../components/backgrounds/GeoPulse";
export { WaveEther } from "../components/backgrounds/WaveEther";
export { VortexBloom } from "../components/backgrounds/VortexBloom";
export { CrystallineDrift } from "../components/backgrounds/CrystallineDrift";
export { AmbientMesh } from "../components/backgrounds/AmbientMesh";
export { EmberCascade } from "../components/backgrounds/EmberCascade";
export { CliffordAttractor } from "../components/backgrounds/CliffordAttractor";
export { HarmonicLattice } from "../components/backgrounds/HarmonicLattice";
export { LissajousWeave } from "../components/backgrounds/LissajousWeave";
export { PhyllotaxisDream } from "../components/backgrounds/PhyllotaxisDream";
export { Spirograph } from "../components/backgrounds/Spirograph";
export { DifferentialGrowth } from "../components/backgrounds/DifferentialGrowth";
export { DoublePendulum } from "../components/backgrounds/DoublePendulum";
export { FractalNoiseTerrain } from "../components/backgrounds/FractalNoiseTerrain";
export { MoireLattice } from "../components/backgrounds/MoireLattice";
export { NeuralWeave } from "../components/backgrounds/NeuralWeave";
export { OrbitalResonance } from "../components/backgrounds/OrbitalResonance";
export { ReactionDiffusion } from "../components/backgrounds/ReactionDiffusion";
export { RecursiveSubdivision } from "../components/backgrounds/RecursiveSubdivision";
export { TideHarmonics } from "../components/backgrounds/TideHarmonics";
export { VoronoiMosaic } from "../components/backgrounds/VoronoiMosaic";
export { PrismaticWave } from "../components/backgrounds/PrismaticWave";
export { PhotonBurst } from "../components/backgrounds/PhotonBurst";
export { FibonacciVortex } from "../components/backgrounds/FibonacciVortex";
export { HexRipple } from "../components/backgrounds/HexRipple";

export { RecursiveTunnel } from "../components/backgrounds/RecursiveTunnel";

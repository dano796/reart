/**
 * Parameter schema system.
 *
 * Params interfaces and defaults live in each component file so installed
 * components are self-contained. This file re-exports them and adds the
 * schema arrays used by BackgroundStudio for UI generation.
 */

// Re-export Params interfaces and defaults from each component
export type { FlowCurrentsParams } from "../backgrounds/FlowCurrents";
export { flowCurrentsDefaults } from "../backgrounds/FlowCurrents";
export type { GravityStormParams } from "../backgrounds/GravityStorm";
export { gravityStormDefaults } from "../backgrounds/GravityStorm";
export type { GeoPulseParams } from "../backgrounds/GeoPulse";
export { geoPulseDefaults } from "../backgrounds/GeoPulse";
export type { WaveEtherParams } from "../backgrounds/WaveEther";
export { waveEtherDefaults } from "../backgrounds/WaveEther";
export type { VortexBloomParams } from "../backgrounds/VortexBloom";
export { vortexBloomDefaults } from "../backgrounds/VortexBloom";
export type { CrystallineDriftParams } from "../backgrounds/CrystallineDrift";
export { crystallineDriftDefaults } from "../backgrounds/CrystallineDrift";
export type { AmbientMeshParams } from "../backgrounds/AmbientMesh";
export { ambientMeshDefaults } from "../backgrounds/AmbientMesh";
export type { EmberCascadeParams } from "../backgrounds/EmberCascade";
export { emberCascadeDefaults } from "../backgrounds/EmberCascade";
export type { CliffordAttractorParams } from "../backgrounds/CliffordAttractor";
export { cliffordAttractorDefaults } from "../backgrounds/CliffordAttractor";
export type { HarmonicLatticeParams } from "../backgrounds/HarmonicLattice";
export { harmonicLatticeDefaults } from "../backgrounds/HarmonicLattice";
export type { LissajousWeaveParams } from "../backgrounds/LissajousWeave";
export { lissajousWeaveDefaults } from "../backgrounds/LissajousWeave";
export type { PhyllotaxisDreamParams } from "../backgrounds/PhyllotaxisDream";
export { phyllotaxisDreamDefaults } from "../backgrounds/PhyllotaxisDream";
export type { SpirographParams } from "../backgrounds/Spirograph";
export { spirographDefaults } from "../backgrounds/Spirograph";
export type { DifferentialGrowthParams } from "../engines/differentialGrowth";
export { differentialGrowthDefaults } from "../backgrounds/DifferentialGrowth";
export type { DoublePendulumParams } from "../engines/doublePendulum";
export { doublePendulumDefaults } from "../backgrounds/DoublePendulum";
export type { FractalNoiseTerrainParams } from "../engines/fractalNoiseTerrain";
export { fractalNoiseTerrainDefaults } from "../backgrounds/FractalNoiseTerrain";
export type { MoireLatticeParams } from "../engines/moireLattice";
export { moireLatticeDefaults } from "../backgrounds/MoireLattice";
export type { NeuralWeaveParams } from "../engines/neuralWeave";
export { neuralWeaveDefaults } from "../backgrounds/NeuralWeave";
export type { OrbitalResonanceParams } from "../engines/orbitalResonance";
export { orbitalResonanceDefaults } from "../backgrounds/OrbitalResonance";
export type { ReactionDiffusionParams } from "../engines/reactionDiffusion";
export { reactionDiffusionDefaults } from "../backgrounds/ReactionDiffusion";
export type { RecursiveSubdivisionParams } from "../engines/recursiveSubdivision";
export { recursiveSubdivisionDefaults } from "../backgrounds/RecursiveSubdivision";
export type { TideHarmonicsParams } from "../engines/tideHarmonics";
export { tideHarmonicsDefaults } from "../backgrounds/TideHarmonics";
export type { VoronoiMosaicParams } from "../engines/voronoiMosaic";
export { voronoiMosaicDefaults } from "../backgrounds/VoronoiMosaic";
export type { PrismaticWaveParams } from "../backgrounds/PrismaticWave";
export { prismaticWaveDefaults } from "../backgrounds/PrismaticWave";
export type { PhotonBurstParams } from "../backgrounds/PhotonBurst";
export { photonBurstDefaults } from "../backgrounds/PhotonBurst";
export type { FibonacciVortexParams } from "../backgrounds/FibonacciVortex";
export { fibonacciVortexDefaults } from "../backgrounds/FibonacciVortex";
export type { HexRippleParams } from "../backgrounds/HexRipple";
export { hexRippleDefaults } from "../backgrounds/HexRipple";

export type { RecursiveTunnelParams } from "../backgrounds/RecursiveTunnel";
export { recursiveTunnelDefaults } from "../backgrounds/RecursiveTunnel";

// ─────────────────────────────────────────────────────────────────────────────
// ParamSchema — drives BackgroundStudio UI controls and code-gen
// ─────────────────────────────────────────────────────────────────────────────

export type ParamType = "number" | "color" | "boolean" | "select";

export interface NumberParam {
  name: string;
  label: string;
  type: "number";
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface ColorParam {
  name: string;
  label: string;
  type: "color";
  default: string;
}

export interface BooleanParam {
  name: string;
  label: string;
  type: "boolean";
  default: boolean;
}

export interface SelectParam {
  name: string;
  label: string;
  type: "select";
  default: string;
  options: { value: string; label: string }[];
}

export type ParamSchema = NumberParam | ColorParam | BooleanParam | SelectParam;

// ─────────────────────────────────────────────────────────────────────────────
// FLOW CURRENTS
// ─────────────────────────────────────────────────────────────────────────────

export const flowCurrentsSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "count", label: "Particle Count", type: "number", default: 3000, min: 500, max: 6000, step: 250 },
  { name: "speed", label: "Flow Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "noiseScale", label: "Noise Scale", type: "number", default: 0.004, min: 0.001, max: 0.015, step: 0.001 },
  { name: "trailOpacity", label: "Trail Opacity", type: "number", default: 8, min: 2, max: 30, step: 1 },
  { name: "noiseEvol", label: "Noise Evolution", type: "number", default: 0.0005, min: 0, max: 0.005, step: 0.0002 },
  { name: "colorWarm", label: "Warm Color", type: "color", default: "#e8855a" },
  { name: "colorCool", label: "Cool Color", type: "color", default: "#5a9bcc" },
  { name: "colorAccent", label: "Accent", type: "color", default: "#a0c878" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GRAVITY STORM
// ─────────────────────────────────────────────────────────────────────────────

export const gravityStormSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "count", label: "Particle Count", type: "number", default: 1200, min: 200, max: 3000, step: 100 },
  { name: "attractors", label: "Attractor Count", type: "number", default: 3, min: 1, max: 8, step: 1 },
  { name: "gravity", label: "Gravity Strength", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "turbulence", label: "Turbulence", type: "number", default: 0.5, min: 0, max: 2.0, step: 0.1 },
  { name: "orbitSpeed", label: "Orbit Speed", type: "number", default: 0.008, min: 0.001, max: 0.03, step: 0.001 },
  { name: "colorCore", label: "Core Color", type: "color", default: "#ff6b35" },
  { name: "colorTrail", label: "Trail Color", type: "color", default: "#7b5ea7" },
];

// ─────────────────────────────────────────────────────────────────────────────
// GEO PULSE
// ─────────────────────────────────────────────────────────────────────────────

export const geoPulseSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "layers", label: "Layer Count", type: "number", default: 7, min: 3, max: 12, step: 1 },
  { name: "sides", label: "Sides", type: "number", default: 6, min: 3, max: 12, step: 1 },
  { name: "rotSpeed", label: "Rotation Speed", type: "number", default: 0.008, min: 0.001, max: 0.05, step: 0.001 },
  { name: "pulse", label: "Pulse Amplitude", type: "number", default: 0.12, min: 0, max: 0.4, step: 0.01 },
  { name: "connect", label: "Connection Density", type: "number", default: 0.4, min: 0, max: 1, step: 0.05 },
  { name: "colorPrimary", label: "Primary", type: "color", default: "#d97757" },
  { name: "colorSecondary", label: "Secondary", type: "color", default: "#6a9bcc" },
  { name: "colorAccent", label: "Accent", type: "color", default: "#e8d87a" },
];

// ─────────────────────────────────────────────────────────────────────────────
// WAVE ETHER
// ─────────────────────────────────────────────────────────────────────────────

export const waveEtherSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "sources", label: "Wave Sources", type: "number", default: 3, min: 1, max: 6, step: 1 },
  { name: "frequency", label: "Frequency", type: "number", default: 0.018, min: 0.005, max: 0.05, step: 0.001 },
  { name: "amplitude", label: "Amplitude", type: "number", default: 1.0, min: 0.1, max: 2.0, step: 0.05 },
  { name: "waveSpeed", label: "Wave Speed", type: "number", default: 0.025, min: 0.005, max: 0.08, step: 0.005 },
  { name: "resolution", label: "Resolution", type: "number", default: 8, min: 4, max: 20, step: 2 },
  { name: "colorCrest", label: "Crest Color", type: "color", default: "#00d4ff" },
  { name: "colorTrough", label: "Trough Color", type: "color", default: "#0a0a2e" },
  { name: "colorMid", label: "Mid Color", type: "color", default: "#7b2fff" },
];

// ─────────────────────────────────────────────────────────────────────────────
// VORTEX BLOOM
// ─────────────────────────────────────────────────────────────────────────────

export const vortexBloomSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 12345, min: 1, max: 999999, step: 1 },
  { name: "vortexCount", label: "Vortex Count", type: "number", default: 4, min: 2, max: 8, step: 1 },
  { name: "particleCount", label: "Particle Count", type: "number", default: 3000, min: 500, max: 5000, step: 250 },
  { name: "orbitStrength", label: "Orbit Strength", type: "number", default: 1.2, min: 0.1, max: 3.0, step: 0.1 },
  { name: "spiralTightness", label: "Spiral Tightness", type: "number", default: 0.9, min: 0.1, max: 2.5, step: 0.1 },
  { name: "fadeRate", label: "Trail Fade", type: "number", default: 4, min: 1, max: 20, step: 1 },
  { name: "trailWeight", label: "Trail Weight", type: "number", default: 0.7, min: 0.2, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#080810" },
  { name: "colorA", label: "Vortex A", type: "color", default: "#d97757" },
  { name: "colorB", label: "Vortex B", type: "color", default: "#6a9bcc" },
  { name: "colorC", label: "Vortex C", type: "color", default: "#e8c46a" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CRYSTALLINE DRIFT
// ─────────────────────────────────────────────────────────────────────────────

export const crystallineDriftSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 7777, min: 1, max: 999999, step: 1 },
  { name: "symmetry", label: "Symmetry", type: "number", default: 6, min: 2, max: 12, step: 1 },
  { name: "maxDepth", label: "Branch Depth", type: "number", default: 7, min: 2, max: 10, step: 1 },
  { name: "angleVariance", label: "Angle Variance", type: "number", default: 0.5, min: 0.05, max: 1.5, step: 0.05 },
  { name: "segmentLength", label: "Segment Length", type: "number", default: 6, min: 2, max: 14, step: 0.5 },
  { name: "branchInterval", label: "Branch Interval", type: "number", default: 12, min: 5, max: 30, step: 1 },
  { name: "bgColor", label: "Background", type: "color", default: "#050a14" },
  { name: "crystalColor", label: "Crystal", type: "color", default: "#6ab8e8" },
  { name: "glowColor", label: "Glow Halo", type: "color", default: "#c4e8ff" },
];

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT MESH
// ─────────────────────────────────────────────────────────────────────────────

export const ambientMeshSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 8888, min: 1, max: 999999, step: 1 },
  { name: "nodeCount", label: "Node Count", type: "number", default: 80, min: 20, max: 200, step: 10 },
  { name: "connectionDistance", label: "Connection Distance", type: "number", default: 150, min: 50, max: 300, step: 10 },
  { name: "motionSpeed", label: "Motion Speed", type: "number", default: 0.3, min: 0.1, max: 1.5, step: 0.1 },
  { name: "noiseScale", label: "Noise Scale", type: "number", default: 2.0, min: 0.5, max: 5.0, step: 0.25 },
  { name: "breatheSpeed", label: "Breathe Speed", type: "number", default: 0.5, min: 0.0, max: 2.0, step: 0.1 },
  { name: "breatheAmount", label: "Breathe Amount", type: "number", default: 0.15, min: 0.0, max: 0.5, step: 0.05 },
  { name: "edgeOpacity", label: "Edge Opacity", type: "number", default: 0.75, min: 0.1, max: 1.0, step: 0.05 },
  { name: "nodeSize", label: "Node Size", type: "number", default: 4, min: 2, max: 10, step: 0.5 },
  { name: "nodeGlow", label: "Node Glow", type: "number", default: 0.8, min: 0.0, max: 2.0, step: 0.1 },
  { name: "bgOpacity", label: "BG Opacity", type: "number", default: 0.5, min: 0.0, max: 1.0, step: 0.05 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "nodeColor", label: "Nodes", type: "color", default: "#50b8e8" },
  { name: "edgeColor", label: "Edges", type: "color", default: "#50b8e8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// EMBER CASCADE
// ─────────────────────────────────────────────────────────────────────────────

export const emberCascadeSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "particleCount", label: "Particle Count", type: "number", default: 800, min: 200, max: 2000, step: 100 },
  { name: "sourceCount", label: "Source Count", type: "number", default: 3, min: 1, max: 8, step: 1 },
  { name: "riseSpeed", label: "Rise Speed", type: "number", default: 1.2, min: 0.2, max: 3.0, step: 0.1 },
  { name: "turbulence", label: "Turbulence", type: "number", default: 1.0, min: 0.0, max: 3.0, step: 0.1 },
  { name: "glowSize", label: "Glow Size", type: "number", default: 1.0, min: 0.3, max: 2.5, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "hotColor", label: "Hot Color", type: "color", default: "#ffaa33" },
  { name: "midColor", label: "Mid Color", type: "color", default: "#ff5533" },
  { name: "coolColor", label: "Cool Color", type: "color", default: "#aa2233" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CLIFFORD ATTRACTOR
// ─────────────────────────────────────────────────────────────────────────────

export const cliffordAttractorSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "pA", label: "Parameter A", type: "number", default: -1.4, min: -2.5, max: 2.5, step: 0.1 },
  { name: "pB", label: "Parameter B", type: "number", default: 1.6, min: -2.5, max: 2.5, step: 0.1 },
  { name: "pC", label: "Parameter C", type: "number", default: 1.0, min: -2.5, max: 2.5, step: 0.1 },
  { name: "pD", label: "Parameter D", type: "number", default: 0.7, min: -2.5, max: 2.5, step: 0.1 },
  { name: "pointsPerFrame", label: "Points/Frame", type: "number", default: 8000, min: 1000, max: 20000, step: 1000 },
  { name: "brightness", label: "Brightness", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Shadow Color", type: "color", default: "#1a1a2e" },
  { name: "colorB", label: "Light Color", type: "color", default: "#00d4ff" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HARMONIC LATTICE
// ─────────────────────────────────────────────────────────────────────────────

export const harmonicLatticeSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "modeCount", label: "Mode Count", type: "number", default: 6, min: 2, max: 12, step: 1 },
  { name: "maxModeNumber", label: "Max Mode #", type: "number", default: 5, min: 2, max: 10, step: 1 },
  { name: "baseFrequency", label: "Base Frequency", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "timeSpeed", label: "Time Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "resolution", label: "Resolution", type: "number", default: 80, min: 20, max: 150, step: 10 },
  { name: "nodeThreshold", label: "Node Threshold", type: "number", default: 0.15, min: 0.0, max: 0.5, step: 0.05 },
  { name: "contrastPower", label: "Contrast Power", type: "number", default: 1.5, min: 0.5, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#ff6b35" },
  { name: "colorB", label: "Color B", type: "color", default: "#f7931e" },
  { name: "colorC", label: "Color C", type: "color", default: "#fdc830" },
];

// ─────────────────────────────────────────────────────────────────────────────
// LISSAJOUS WEAVE
// ─────────────────────────────────────────────────────────────────────────────

export const lissajousWeaveSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "curveCount", label: "Curve Count", type: "number", default: 12, min: 3, max: 30, step: 1 },
  { name: "freqMax", label: "Max Freq", type: "number", default: 5, min: 2, max: 10, step: 1 },
  { name: "radius", label: "Radius", type: "number", default: 180, min: 50, max: 350, step: 10 },
  { name: "phaseSpeed", label: "Phase Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#ff6b35" },
  { name: "colorB", label: "Color B", type: "color", default: "#f7931e" },
  { name: "colorC", label: "Color C", type: "color", default: "#fdc830" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PHYLLOTAXIS DREAM
// ─────────────────────────────────────────────────────────────────────────────

export const phyllotaxisDreamSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "numPoints", label: "Point Count", type: "number", default: 800, min: 200, max: 2000, step: 50 },
  { name: "spread", label: "Spread", type: "number", default: 4.5, min: 2.0, max: 8.0, step: 0.1 },
  { name: "angleScale", label: "Angle Scale", type: "number", default: 1.0, min: 0.95, max: 1.05, step: 0.01 },
  { name: "morph", label: "Morph", type: "number", default: 1.0, min: 0.0, max: 3.0, step: 0.1 },
  { name: "rotSpeed", label: "Rot Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "dotSize", label: "Dot Size", type: "number", default: 6, min: 2, max: 15, step: 0.5 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#ff6b35" },
  { name: "colorB", label: "Color B", type: "color", default: "#f7931e" },
  { name: "colorC", label: "Color C", type: "color", default: "#fdc830" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SPIROGRAPH
// ─────────────────────────────────────────────────────────────────────────────

export const spirographSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42731, min: 1, max: 999999, step: 1 },
  { name: "R", label: "Outer R", type: "number", default: 120, min: 50, max: 200, step: 5 },
  { name: "r", label: "Inner r", type: "number", default: 45, min: 10, max: 100, step: 5 },
  { name: "d", label: "Distance d", type: "number", default: 70, min: 10, max: 150, step: 5 },
  { name: "speed", label: "Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "lineWeight", label: "Line Weight", type: "number", default: 1.2, min: 0.5, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#ff6b35" },
  { name: "colorB", label: "Color B", type: "color", default: "#f7931e" },
  { name: "colorC", label: "Color C", type: "color", default: "#fdc830" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DIFFERENTIAL GROWTH
// ─────────────────────────────────────────────────────────────────────────────

export const differentialGrowthSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 4242, min: 1, max: 999999, step: 1 },
  { name: "growthRate", label: "Growth Rate", type: "number", default: 0.8, min: 0.1, max: 2.0, step: 0.1 },
  { name: "repelRadius", label: "Repel Radius", type: "number", default: 12, min: 5, max: 30, step: 1 },
  { name: "repelStrength", label: "Repel Strength", type: "number", default: 0.4, min: 0.1, max: 1.0, step: 0.05 },
  { name: "maxEdge", label: "Max Edge", type: "number", default: 8, min: 4, max: 20, step: 1 },
  { name: "maxNodes", label: "Max Nodes", type: "number", default: 2800, min: 500, max: 5000, step: 100 },
  { name: "stepsPerFrame", label: "Steps/Frame", type: "number", default: 3, min: 1, max: 10, step: 1 },
  { name: "fadeRate", label: "Fade Rate", type: "number", default: 18, min: 5, max: 50, step: 1 },
  { name: "lineWeight", label: "Line Weight", type: "number", default: 1.8, min: 0.5, max: 4.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Color A", type: "color", default: "#50b8e8" },
  { name: "colorB", label: "Color B", type: "color", default: "#e850b8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// DOUBLE PENDULUM
// ─────────────────────────────────────────────────────────────────────────────

export const doublePendulumSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 7777, min: 1, max: 999999, step: 1 },
  { name: "numPendulums", label: "Pendulum Count", type: "number", default: 9, min: 1, max: 20, step: 1 },
  { name: "length1", label: "Length 1", type: "number", default: 180, min: 50, max: 300, step: 10 },
  { name: "length2", label: "Length 2", type: "number", default: 180, min: 50, max: 300, step: 10 },
  { name: "gravity", label: "Gravity", type: "number", default: 1.2, min: 0.5, max: 3.0, step: 0.1 },
  { name: "simSpeed", label: "Sim Speed", type: "number", default: 1.5, min: 0.5, max: 3.0, step: 0.1 },
  { name: "fadeRate", label: "Fade Rate", type: "number", default: 8, min: 2, max: 30, step: 1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Color A", type: "color", default: "#e8b850" },
  { name: "colorB", label: "Color B", type: "color", default: "#50e8b8" },
  { name: "colorC", label: "Color C", type: "color", default: "#b850e8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// FRACTAL NOISE TERRAIN
// ─────────────────────────────────────────────────────────────────────────────

export const fractalNoiseTerrainSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 3333, min: 1, max: 999999, step: 1 },
  { name: "octaves", label: "Octaves", type: "number", default: 6, min: 1, max: 10, step: 1 },
  { name: "persistence", label: "Persistence", type: "number", default: 0.5, min: 0.1, max: 1.0, step: 0.05 },
  { name: "lacunarity", label: "Lacunarity", type: "number", default: 2.0, min: 1.5, max: 3.0, step: 0.1 },
  { name: "scale", label: "Scale", type: "number", default: 4.0, min: 1.0, max: 10.0, step: 0.5 },
  { name: "contrast", label: "Contrast", type: "number", default: 1.2, min: 0.5, max: 3.0, step: 0.1 },
  { name: "lighting", label: "Lighting", type: "number", default: 2.5, min: 0.0, max: 5.0, step: 0.25 },
  { name: "driftSpeed", label: "Drift Speed", type: "number", default: 0.8, min: 0.0, max: 3.0, step: 0.1 },
  { name: "resolution", label: "Resolution", type: "number", default: 120, min: 40, max: 200, step: 10 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Deep", type: "color", default: "#1a2332" },
  { name: "colorB", label: "Mid", type: "color", default: "#2d4a5a" },
  { name: "colorC", label: "High", type: "color", default: "#5a7a6a" },
  { name: "colorD", label: "Peak", type: "color", default: "#d4e8e0" },
];

// ─────────────────────────────────────────────────────────────────────────────
// MOIRE LATTICE
// ─────────────────────────────────────────────────────────────────────────────

export const moireLatticeSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 5555, min: 1, max: 999999, step: 1 },
  { name: "gridCount", label: "Grid Count", type: "number", default: 5, min: 2, max: 12, step: 1 },
  { name: "lineSpacing", label: "Line Space", type: "number", default: 18, min: 5, max: 50, step: 1 },
  { name: "lineWeight", label: "Line Weight", type: "number", default: 0.8, min: 0.2, max: 3.0, step: 0.1 },
  { name: "lineAlpha", label: "Line Alpha", type: "number", default: 85, min: 20, max: 255, step: 5 },
  { name: "rotSpeed", label: "Rot Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Color A", type: "color", default: "#50b8e8" },
  { name: "colorB", label: "Color B", type: "color", default: "#e8b850" },
  { name: "colorC", label: "Color C", type: "color", default: "#e850b8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEURAL WEAVE
// ─────────────────────────────────────────────────────────────────────────────

export const neuralWeaveSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 6666, min: 1, max: 999999, step: 1 },
  { name: "nodeCount", label: "Node Count", type: "number", default: 45, min: 10, max: 100, step: 5 },
  { name: "connectionRadius", label: "Connect Radius", type: "number", default: 180, min: 50, max: 400, step: 10 },
  { name: "signalCount", label: "Signal Count", type: "number", default: 8, min: 1, max: 20, step: 1 },
  { name: "signalSpeed", label: "Signal Speed", type: "number", default: 1.2, min: 0.3, max: 3.0, step: 0.1 },
  { name: "nodeSize", label: "Node Size", type: "number", default: 5, min: 2, max: 12, step: 0.5 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "nodeColor", label: "Node Color", type: "color", default: "#50b8e8" },
  { name: "edgeColor", label: "Edge Color", type: "color", default: "#50b8e8" },
  { name: "signalColor", label: "Signal Color", type: "color", default: "#e8b850" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ORBITAL RESONANCE
// ─────────────────────────────────────────────────────────────────────────────

export const orbitalResonanceSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 9999, min: 1, max: 999999, step: 1 },
  { name: "bodyCount", label: "Body Count", type: "number", default: 5, min: 2, max: 12, step: 1 },
  { name: "simSpeed", label: "Sim Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "trailLength", label: "Trail Length", type: "number", default: 200, min: 50, max: 500, step: 10 },
  { name: "trailWeight", label: "Trail Weight", type: "number", default: 1.5, min: 0.5, max: 4.0, step: 0.1 },
  { name: "bodySize", label: "Body Size", type: "number", default: 8, min: 3, max: 20, step: 1 },
  { name: "centerSize", label: "Center Size", type: "number", default: 12, min: 5, max: 30, step: 1 },
  { name: "fadeTrails", label: "Fade Trails", type: "boolean", default: true },
  { name: "fadeAmount", label: "Fade Amount", type: "number", default: 8, min: 2, max: 30, step: 1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#ff6b35" },
  { name: "colorB", label: "Color B", type: "color", default: "#f7931e" },
  { name: "colorC", label: "Color C", type: "color", default: "#fdc830" },
  { name: "colorD", label: "Color D", type: "color", default: "#50b8e8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// REACTION DIFFUSION
// ─────────────────────────────────────────────────────────────────────────────

export const reactionDiffusionSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 1111, min: 1, max: 999999, step: 1 },
  { name: "Da", label: "Diffusion A", type: "number", default: 1.0, min: 0.1, max: 2.0, step: 0.05 },
  { name: "Db", label: "Diffusion B", type: "number", default: 0.5, min: 0.1, max: 1.0, step: 0.05 },
  { name: "f", label: "Feed Rate", type: "number", default: 0.055, min: 0.01, max: 0.1, step: 0.005 },
  { name: "k", label: "Kill Rate", type: "number", default: 0.062, min: 0.01, max: 0.1, step: 0.005 },
  { name: "stepsPerFrame", label: "Steps/Frame", type: "number", default: 10, min: 1, max: 30, step: 1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0a0a" },
  { name: "colorA", label: "Color A", type: "color", default: "#1a1a2e" },
  { name: "colorB", label: "Color B", type: "color", default: "#00d4ff" },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECURSIVE SUBDIVISION
// ─────────────────────────────────────────────────────────────────────────────

export const recursiveSubdivisionSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 2222, min: 1, max: 999999, step: 1 },
  { name: "maxDepth", label: "Max Depth", type: "number", default: 6, min: 2, max: 10, step: 1 },
  { name: "splitProbability", label: "Split Prob", type: "number", default: 0.85, min: 0.3, max: 1.0, step: 0.05 },
  { name: "minSize", label: "Min Size", type: "number", default: 30, min: 10, max: 100, step: 5 },
  { name: "maxStroke", label: "Max Stroke", type: "number", default: 4, min: 0.5, max: 10, step: 0.5 },
  { name: "minStroke", label: "Min Stroke", type: "number", default: 0.5, min: 0.1, max: 3, step: 0.1 },
  { name: "colorMode", label: "Color Mode", type: "number", default: 0, min: 0, max: 1, step: 1 },
  { name: "animated", label: "Animated", type: "boolean", default: true },
  { name: "animSpeed", label: "Anim Speed", type: "number", default: 1.5, min: 0.5, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Color A", type: "color", default: "#50b8e8" },
  { name: "colorB", label: "Color B", type: "color", default: "#e8b850" },
  { name: "colorC", label: "Color C", type: "color", default: "#e850b8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// TIDE HARMONICS
// ─────────────────────────────────────────────────────────────────────────────

export const tideHarmonicsSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 8888, min: 1, max: 999999, step: 1 },
  { name: "waveCount", label: "Wave Count", type: "number", default: 5, min: 2, max: 12, step: 1 },
  { name: "gridRows", label: "Grid Rows", type: "number", default: 35, min: 10, max: 80, step: 5 },
  { name: "frequency", label: "Frequency", type: "number", default: 1.0, min: 0.3, max: 3.0, step: 0.1 },
  { name: "amplitude", label: "Amplitude", type: "number", default: 45, min: 10, max: 150, step: 5 },
  { name: "speed", label: "Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
  { name: "colorA", label: "Color A", type: "color", default: "#50b8e8" },
  { name: "colorB", label: "Color B", type: "color", default: "#e850b8" },
];

// ─────────────────────────────────────────────────────────────────────────────
// VORONOI MOSAIC
// ─────────────────────────────────────────────────────────────────────────────

export const voronoiMosaicSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 4444, min: 1, max: 999999, step: 1 },
  { name: "seedCount", label: "Seed Count", type: "number", default: 25, min: 5, max: 60, step: 5 },
  { name: "moveSpeed", label: "Move Speed", type: "number", default: 0.5, min: 0.0, max: 2.0, step: 0.1 },
  { name: "edgeContrast", label: "Edge Contrast", type: "number", default: 1.2, min: 0.0, max: 3.0, step: 0.1 },
  { name: "bgColor", label: "Background", type: "color", default: "#0a0e14" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PLASMA FIELD  (WebGL2 — Tier 2)
// ─────────────────────────────────────────────────────────────────────────────

export type { PlasmaFieldParams } from "../backgrounds/PlasmaField";
export { plasmaFieldDefaults } from "../engines/plasmaField";

export const plasmaFieldSchema: ParamSchema[] = [
  { name: "seed", label: "Seed", type: "number", default: 42, min: 1, max: 999, step: 1 },
  { name: "speed", label: "Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "scale", label: "Scale", type: "number", default: 2.5, min: 0.5, max: 6.0, step: 0.1 },
  { name: "contrast", label: "Contrast", type: "number", default: 2.2, min: 0.5, max: 4.0, step: 0.1 },
  { name: "colorA", label: "Color A", type: "color", default: "#0d1b6e" },
  { name: "colorB", label: "Color B", type: "color", default: "#c0146c" },
  { name: "colorC", label: "Color C", type: "color", default: "#f5a623" },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEBULA VEIL  (OGL — Tier 3)
// ─────────────────────────────────────────────────────────────────────────────

export type { NebulaVeilParams } from "../backgrounds/NebulaVeil";
export { nebulaVeilDefaults } from "../engines/nebulaVeil";

export const nebulaVeilSchema: ParamSchema[] = [
  { name: "speed", label: "Speed", type: "number", default: 1.0, min: 0.1, max: 3.0, step: 0.1 },
  { name: "amplitude", label: "Amplitude", type: "number", default: 2.0, min: 0.5, max: 4.0, step: 0.1 },
  { name: "density", label: "Density", type: "number", default: 2.2, min: 0.5, max: 5.0, step: 0.1 },
  { name: "blend", label: "Layer Blend", type: "number", default: 0.6, min: 0.0, max: 1.0, step: 0.05 },
  { name: "colorA", label: "Color A", type: "color", default: "#0a0a2e" },
  { name: "colorB", label: "Color B", type: "color", default: "#7b2fbe" },
  { name: "colorC", label: "Color C", type: "color", default: "#00d4ff" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PRISMATIC WAVE
// ─────────────────────────────────────────────────────────────────────────────

export const prismaticWaveSchema: ParamSchema[] = [
  { name: "seed",         label: "Seed",          type: "number",  default: 42731, min: 1,    max: 999999, step: 1    },
  { name: "sources",      label: "Wave Sources",  type: "number",  default: 5,     min: 2,    max: 12,     step: 1    },
  { name: "frequency",    label: "Frequency",     type: "number",  default: 0.012, min: 0.004,max: 0.03,   step: 0.001 },
  { name: "waveSpeed",    label: "Wave Speed",    type: "number",  default: 0.025, min: 0.005,max: 0.1,    step: 0.005 },
  { name: "resolution",   label: "Resolution",    type: "number",  default: 6,     min: 3,    max: 16,     step: 1    },
  { name: "dispersion",   label: "Dispersion",    type: "number",  default: 300,   min: 60,   max: 360,    step: 10   },
  { name: "hueOffset",    label: "Hue Offset",    type: "number",  default: 0,     min: 0,    max: 360,    step: 5    },
  { name: "saturation",   label: "Saturation",    type: "number",  default: 0.9,   min: 0.3,  max: 1.0,    step: 0.05 },
  { name: "brightness",   label: "Brightness",    type: "number",  default: 0.65,  min: 0.3,  max: 0.85,   step: 0.05 },
  { name: "lensStrength", label: "Lens Strength", type: "number",  default: 1.0,   min: 0,    max: 3.0,    step: 0.1  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PHOTON BURST
// ─────────────────────────────────────────────────────────────────────────────

export const photonBurstSchema: ParamSchema[] = [
  { name: "seed",          label: "Seed",             type: "number", default: 42731, min: 1,     max: 999999, step: 1    },
  { name: "count",         label: "Photon Count",     type: "number", default: 800,   min: 200,   max: 2500,   step: 100  },
  { name: "speed",         label: "Speed",            type: "number", default: 1.0,   min: 0.2,   max: 3.0,    step: 0.1  },
  { name: "noiseScale",    label: "Drift Scale",      type: "number", default: 0.0025,min: 0.001, max: 0.008,  step: 0.0005 },
  { name: "trailOpacity",  label: "Trail Length",     type: "number", default: 12,    min: 4,     max: 40,     step: 2    },
  { name: "burstSize",     label: "Burst Size",       type: "number", default: 28,    min: 8,     max: 60,     step: 4    },
  { name: "cursorGravity", label: "Cursor Gravity",   type: "number", default: 0.18,  min: 0,     max: 0.6,    step: 0.02 },
];

// ─────────────────────────────────────────────────────────────────────────────
// FIBONACCI VORTEX
// ─────────────────────────────────────────────────────────────────────────────

export const fibonacciVortexSchema: ParamSchema[] = [
  { name: "seed",           label: "Seed",            type: "number", default: 33771, min: 1,   max: 999999, step: 1    },
  { name: "numArms",        label: "Spiral Arms",     type: "number", default: 8,     min: 3,   max: 13,     step: 1    },
  { name: "particlesPerArm",label: "Particles/Arm",   type: "number", default: 90,    min: 10,  max: 100,    step: 5    },
  { name: "speed",          label: "Speed",           type: "number", default: 1.0,   min: 0.1, max: 3.0,    step: 0.1  },
  { name: "mouseStrength",  label: "Mouse Pull",      type: "number", default: 0.14,  min: 0,   max: 0.5,    step: 0.02 },
  { name: "maxBlooms",      label: "Max Blooms",      type: "number", default: 4,     min: 1,   max: 8,      step: 1    },
  { name: "trailOpacity",   label: "Trail Length",    type: "number", default: 20,    min: 3,   max: 40,     step: 1    },
  { name: "colorPrimary",   label: "Inner Color",     type: "color",  default: "#f5c842" },
  { name: "colorSecondary", label: "Mid Color",       type: "color",  default: "#e05a20" },
  { name: "colorAccent",    label: "Outer Color",     type: "color",  default: "#8c42f5" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEX RIPPLE
// ─────────────────────────────────────────────────────────────────────────────

export const hexRippleSchema: ParamSchema[] = [
  { name: "seed",       label: "Seed",        type: "number", default: 51289, min: 1,     max: 999999, step: 1      },
  { name: "cellSize",   label: "Cell Size",   type: "number", default: 22,    min: 8,     max: 50,     step: 2      },
  { name: "waveSpeed",  label: "Wave Speed",  type: "number", default: 1.0,   min: 0.1,   max: 3.0,    step: 0.1    },
  { name: "frequency",  label: "Frequency",   type: "number", default: 0.038, min: 0.01,  max: 0.1,    step: 0.002  },
  { name: "damping",    label: "Damping",     type: "number", default: 0.0006,min: 0.0001,max: 0.003,  step: 0.0001 },
  { name: "maxSources", label: "Max Sources", type: "number", default: 6,     min: 1,     max: 10,     step: 1      },
  { name: "colorTrough",label: "Trough",      type: "color",  default: "#080820" },
  { name: "colorMid",   label: "Mid",         type: "color",  default: "#1a6fff" },
  { name: "colorCrest", label: "Crest",       type: "color",  default: "#00ffcc" },
];

// ─────────────────────────────────────────────────────────────────────────────
// RECURSIVE TUNNEL
// ─────────────────────────────────────────────────────────────────────────────

export const recursiveTunnelSchema: ParamSchema[] = [
  { name: "sides",            label: "Polygon Sides",  type: "number", default: 6,    min: 3,   max: 12,  step: 1    },
  { name: "layers",           label: "Layer Count",    type: "number", default: 22,   min: 8,   max: 40,  step: 2    },
  { name: "zoomSpeed",        label: "Zoom Speed",     type: "number", default: 0.1,  min: 0.05,max: 1.5, step: 0.05 },
  { name: "twistPerLayer",    label: "Twist",          type: "number", default: 0.11, min: 0,   max: 0.5, step: 0.01 },
  { name: "parallaxStrength", label: "Parallax",       type: "number", default: 0.28, min: 0,   max: 1.0, step: 0.05 },
  { name: "colorInner",       label: "Inner Color",    type: "color",  default: "#ff2d78" },
  { name: "colorMid",         label: "Mid Color",      type: "color",  default: "#2d78ff" },
  { name: "colorOuter",       label: "Outer Color",    type: "color",  default: "#2dffbe" },
];

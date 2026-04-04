// Public API — re-export everything consumers need

// Components
export { FlowCurrents } from "./components/backgrounds/FlowCurrents";
// export { GravityStorm } from "./components/backgrounds/GravityStorm"; // ARCHIVED
export { GeoPulse } from "./components/backgrounds/GeoPulse";
export { WaveEther } from "./components/backgrounds/WaveEther";
// export { VortexBloom } from "./components/backgrounds/VortexBloom"; // ARCHIVED
// export { CrystallineDrift } from "./components/backgrounds/CrystallineDrift"; // ARCHIVED
export { AmbientMesh } from "./components/backgrounds/AmbientMesh";
// export { EmberCascade } from "./components/backgrounds/EmberCascade"; // ARCHIVED
// export { CliffordAttractor } from "./components/backgrounds/CliffordAttractor"; // ARCHIVED
export { HarmonicLattice } from "./components/backgrounds/HarmonicLattice";
export { LissajousWeave } from "./components/backgrounds/LissajousWeave";
export { PhyllotaxisDream } from "./components/backgrounds/PhyllotaxisDream";
// export { Spirograph } from "./components/backgrounds/Spirograph"; // ARCHIVED
// export { DifferentialGrowth } from "./components/backgrounds/DifferentialGrowth"; // ARCHIVED
// export { DoublePendulum } from "./components/backgrounds/archived/DoublePendulum"; // ARCHIVED
export { FractalNoiseTerrain } from "./components/backgrounds/FractalNoiseTerrain";
export { MoireLattice } from "./components/backgrounds/MoireLattice";
export { NeuralWeave } from "./components/backgrounds/NeuralWeave";
export { OrbitalResonance } from "./components/backgrounds/OrbitalResonance";
// export { ReactionDiffusion } from "./components/backgrounds/ReactionDiffusion"; // ARCHIVED
export { RecursiveSubdivision } from "./components/backgrounds/RecursiveSubdivision";
export { TideHarmonics } from "./components/backgrounds/TideHarmonics";
export { VoronoiMosaic } from "./components/backgrounds/VoronoiMosaic";
export { PlasmaField } from "./components/backgrounds/PlasmaField";
export { NebulaVeil } from "./components/backgrounds/NebulaVeil";
export { PrismaticWave } from "./components/backgrounds/PrismaticWave";
export { PhotonBurst } from "./components/backgrounds/PhotonBurst";
export { FibonacciVortex } from "./components/backgrounds/FibonacciVortex";
export { HexRipple } from "./components/backgrounds/HexRipple";

export { RecursiveTunnel } from "./components/backgrounds/RecursiveTunnel";
// Engines (for headless / custom renderer usage)
export {
  initFlowCurrents,
  drawFlowCurrents,
  resetFlowCurrents,
  type FlowCurrentsState,
} from "./components/engines/flowCurrents";
// export {
//   initGravityStorm,
//   drawGravityStorm,
//   resetGravityStorm,
//   type GravityStormState,
// } from "./components/engines/archived/gravityStorm"; // ARCHIVED
export {
  initGeoPulse,
  drawGeoPulse,
  resetGeoPulse,
  type GeoPulseState,
} from "./components/engines/geoPulse";
export {
  initWaveEther,
  drawWaveEther,
  resetWaveEther,
  type WaveEtherState,
} from "./components/engines/waveEther";
// export {
//   initVortexBloom,
//   drawVortexBloom,
//   resetVortexBloom,
//   type VortexBloomState,
// } from "./components/engines/archived/vortexBloom"; // ARCHIVED
// export {
//   initCrystallineDrift,
//   drawCrystallineDrift,
//   resetCrystallineDrift,
//   type CrystallineDriftState,
// } from "./components/engines/archived/crystallineDrift"; // ARCHIVED
export {
  initAmbientMesh,
  drawAmbientMesh,
  resetAmbientMesh,
  type AmbientMeshState,
} from "./components/engines/ambientMesh";
// export {
//   initEmberCascade,
//   drawEmberCascade,
//   resetEmberCascade,
//   type EmberCascadeState,
// } from "./components/engines/archived/emberCascade"; // ARCHIVED
// export {
//   initCliffordAttractor,
//   drawCliffordAttractor,
//   resetCliffordAttractor,
//   type CliffordAttractorState,
// } from "./components/engines/archived/cliffordAttractor"; // ARCHIVED
export {
  initHarmonicLattice,
  drawHarmonicLattice,
  resetHarmonicLattice,
  type HarmonicLatticeState,
} from "./components/engines/harmonicLattice";
export {
  initLissajousWeave,
  drawLissajousWeave,
  resetLissajousWeave,
  type LissajousWeaveState,
} from "./components/engines/lissajousWeave";
export {
  initPhyllotaxisDream,
  drawPhyllotaxisDream,
  resetPhyllotaxisDream,
  type PhyllotaxisDreamState,
} from "./components/engines/phyllotaxisDream";
// export {
//   initSpirograph,
//   drawSpirograph,
//   resetSpirograph,
//   type SpirographState,
// } from "./components/engines/archived/spirograph"; // ARCHIVED
// export {
//   initDifferentialGrowth,
//   drawDifferentialGrowth,
//   resetDifferentialGrowth,
//   type DifferentialGrowthState,
// } from "./components/engines/archived/differentialGrowth"; // ARCHIVED
// export {
//   initDoublePendulum,
//   drawDoublePendulum,
//   resetDoublePendulum,
//   type DoublePendulumState,
// } from "./components/engines/archived/doublePendulum"; // ARCHIVED
export {
  initFractalNoiseTerrain,
  drawFractalNoiseTerrain,
  resetFractalNoiseTerrain,
  type FractalNoiseTerrainState,
} from "./components/engines/fractalNoiseTerrain";
export {
  initMoireLattice,
  drawMoireLattice,
  resetMoireLattice,
  type MoireLatticeState,
} from "./components/engines/moireLattice";
export {
  initNeuralWeave,
  drawNeuralWeave,
  resetNeuralWeave,
  type NeuralWeaveState,
} from "./components/engines/neuralWeave";
export {
  initOrbitalResonance,
  drawOrbitalResonance,
  resetOrbitalResonance,
  type OrbitalResonanceState,
} from "./components/engines/orbitalResonance";
// export {
//   initReactionDiffusion,
//   drawReactionDiffusion,
//   resetReactionDiffusion,
//   type ReactionDiffusionState,
// } from "./components/engines/archived/reactionDiffusion"; // ARCHIVED
export {
  initRecursiveSubdivision,
  drawRecursiveSubdivision,
  resetRecursiveSubdivision,
  type RecursiveSubdivisionState,
} from "./components/engines/recursiveSubdivision";
export {
  initTideHarmonics,
  drawTideHarmonics,
  resetTideHarmonics,
  type TideHarmonicsState,
} from "./components/engines/tideHarmonics";
export {
  initVoronoiMosaic,
  drawVoronoiMosaic,
  resetVoronoiMosaic,
  type VoronoiMosaicState,
} from "./components/engines/voronoiMosaic";
export {
  initPlasmaField,
  drawPlasmaField,
  resetPlasmaField,
  plasmaFieldDefaults,
  type PlasmaFieldState,
  type PlasmaFieldParams,
} from "./components/engines/plasmaField";
export {
  initNebulaVeil,
  drawNebulaVeil,
  resetNebulaVeil,
  nebulaVeilDefaults,
  type NebulaVeilState,
  type NebulaVeilParams,
} from "./components/engines/nebulaVeil";
export {
  initPrismaticWave,
  drawPrismaticWave,
  resetPrismaticWave,
  spawnAtClick as prismaticWaveSpawnAtClick,
  type PrismaticWaveState,
} from "./components/engines/prismaticWave";
export {
  initPhotonBurst,
  drawPhotonBurst,
  resetPhotonBurst,
  spawnAtClick as photonBurstSpawnAtClick,
  type PhotonBurstState,
} from "./components/engines/photonBurst";
export {
  initFibonacciVortex,
  drawFibonacciVortex,
  resetFibonacciVortex,
  addBloom as fibonacciVortexAddBloom,
  type FibonacciVortexState,
} from "./components/engines/fibonacciVortex";
export {
  initHexRipple,
  drawHexRipple,
  resetHexRipple,
  addSource as hexRippleAddSource,
  type HexRippleState,
} from "./components/engines/hexRipple";

export {
  initRecursiveTunnel,
  drawRecursiveTunnel,
  resetRecursiveTunnel,
  toggleTwist as recursiveTunnelToggleTwist,
  type RecursiveTunnelState,
} from "./components/engines/recursiveTunnel";

// Schemas & types
export {
  flowCurrentsSchema,
  flowCurrentsDefaults,
  // gravityStormSchema, // ARCHIVED
  // gravityStormDefaults, // ARCHIVED
  geoPulseSchema,
  geoPulseDefaults,
  waveEtherSchema,
  waveEtherDefaults,
  // vortexBloomSchema, // ARCHIVED
  // vortexBloomDefaults, // ARCHIVED
  // crystallineDriftSchema, // ARCHIVED
  // crystallineDriftDefaults, // ARCHIVED
  ambientMeshSchema,
  ambientMeshDefaults,
  // emberCascadeSchema, // ARCHIVED
  // emberCascadeDefaults, // ARCHIVED
  // cliffordAttractorSchema, // ARCHIVED
  // cliffordAttractorDefaults, // ARCHIVED
  harmonicLatticeSchema,
  harmonicLatticeDefaults,
  lissajousWeaveSchema,
  lissajousWeaveDefaults,
  phyllotaxisDreamSchema,
  phyllotaxisDreamDefaults,
  // spirographSchema, // ARCHIVED
  // spirographDefaults, // ARCHIVED
  // differentialGrowthSchema, // ARCHIVED
  // differentialGrowthDefaults, // ARCHIVED
  // doublePendulumSchema, // ARCHIVED
  // doublePendulumDefaults, // ARCHIVED
  fractalNoiseTerrainSchema,
  fractalNoiseTerrainDefaults,
  moireLatticeSchema,
  moireLatticeDefaults,
  neuralWeaveSchema,
  neuralWeaveDefaults,
  orbitalResonanceSchema,
  orbitalResonanceDefaults,
  // reactionDiffusionSchema, // ARCHIVED
  // reactionDiffusionDefaults, // ARCHIVED
  recursiveSubdivisionSchema,
  recursiveSubdivisionDefaults,
  tideHarmonicsSchema,
  tideHarmonicsDefaults,
  voronoiMosaicSchema,
  voronoiMosaicDefaults,
  plasmaFieldSchema,
  nebulaVeilSchema,
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
  type FlowCurrentsParams,
  // type GravityStormParams, // ARCHIVED
  type GeoPulseParams,
  type WaveEtherParams,
  // type VortexBloomParams, // ARCHIVED
  // type CrystallineDriftParams, // ARCHIVED
  type AmbientMeshParams,
  // type EmberCascadeParams, // ARCHIVED
  // type CliffordAttractorParams, // ARCHIVED
  type HarmonicLatticeParams,
  type LissajousWeaveParams,
  type PhyllotaxisDreamParams,
  // type SpirographParams, // ARCHIVED
  // type DifferentialGrowthParams, // ARCHIVED
  // type DoublePendulumParams, // ARCHIVED
  type FractalNoiseTerrainParams,
  type MoireLatticeParams,
  type NeuralWeaveParams,
  type OrbitalResonanceParams,
  // type ReactionDiffusionParams, // ARCHIVED
  type RecursiveSubdivisionParams,
  type TideHarmonicsParams,
  type VoronoiMosaicParams,
  type PrismaticWaveParams,
  type PhotonBurstParams,
  type FibonacciVortexParams,
  type HexRippleParams,

  type RecursiveTunnelParams,
} from "./components/schemas";

// Registry
export { registry, getBackground, backgroundIds } from "./registry";

// Utils (exposed for custom backgrounds)
export {
  PerlinNoise,
  SeededRandom,
  hexToRgb,
  lerp,
  clamp,
  map,
  rgba,
} from "./components/utils/noise";

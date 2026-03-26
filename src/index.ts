// Public API — re-export everything consumers need

// Components
export { FlowCurrents } from "./components/FlowCurrents";
export { GravityStorm } from "./components/GravityStorm";
export { GeoPulse } from "./components/GeoPulse";
export { WaveEther } from "./components/WaveEther";
export { BackgroundStudio } from "./components/BackgroundStudio";

// Engines (for headless / custom renderer usage)
export {
  initFlowCurrents,
  drawFlowCurrents,
  resetFlowCurrents,
  type FlowCurrentsState,
} from "./components/engines/flowCurrents";
export {
  initGravityStorm,
  drawGravityStorm,
  resetGravityStorm,
  type GravityStormState,
} from "./components/engines/gravityStorm";
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

// Schemas & types
export {
  flowCurrentsSchema,
  flowCurrentsDefaults,
  gravityStormSchema,
  gravityStormDefaults,
  geoPulseSchema,
  geoPulseDefaults,
  waveEtherSchema,
  waveEtherDefaults,
  type ParamSchema,
  type FlowCurrentsParams,
  type GravityStormParams,
  type GeoPulseParams,
  type WaveEtherParams,
} from "./components/schemas";

// Registry
export { registry, getBackground, backgroundIds } from "./registry";

// Utils (exposed for custom backgrounds)
export { PerlinNoise, SeededRandom, hexToRgb, lerp, clamp, map, rgba } from "./components/utils/noise";

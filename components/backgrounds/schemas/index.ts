/**
 * Parameter schema system.
 *
 * Each schema entry describes one prop on a background component:
 * - Used to generate playground UI controls automatically
 * - Used to generate typed React props
 * - Used to generate code-export snippets
 */

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
// ───────────────────────────────────────────────────────────────────────���─────

export const flowCurrentsSchema: ParamSchema[] = [
  { name: "seed",         label: "Seed",            type: "number",  default: 42731,  min: 1,      max: 999999, step: 1      },
  { name: "count",        label: "Particle Count",  type: "number",  default: 3000,   min: 500,    max: 6000,   step: 250    },
  { name: "speed",        label: "Flow Speed",      type: "number",  default: 1.0,    min: 0.1,    max: 3.0,    step: 0.1    },
  { name: "noiseScale",   label: "Noise Scale",     type: "number",  default: 0.004,  min: 0.001,  max: 0.015,  step: 0.001  },
  { name: "trailOpacity", label: "Trail Opacity",   type: "number",  default: 8,      min: 2,      max: 30,     step: 1      },
  { name: "noiseEvol",    label: "Noise Evolution", type: "number",  default: 0.0005, min: 0,      max: 0.005,  step: 0.0002 },
  { name: "colorWarm",    label: "Warm Color",      type: "color",   default: "#e8855a" },
  { name: "colorCool",    label: "Cool Color",      type: "color",   default: "#5a9bcc" },
  { name: "colorAccent",  label: "Accent",          type: "color",   default: "#a0c878" },
];

export interface FlowCurrentsParams {
  seed?: number;
  count?: number;
  speed?: number;
  noiseScale?: number;
  trailOpacity?: number;
  noiseEvol?: number;
  colorWarm?: string;
  colorCool?: string;
  colorAccent?: string;
}

export const flowCurrentsDefaults: Required<FlowCurrentsParams> = {
  seed: 42731, count: 3000, speed: 1.0, noiseScale: 0.004,
  trailOpacity: 8, noiseEvol: 0.0005,
  colorWarm: "#e8855a", colorCool: "#5a9bcc", colorAccent: "#a0c878",
};

// ─────────────────────────────────────────────────────────────────────────────
// GRAVITY STORM
// ─────────────────────────────────────────────────────────────────────────────

export const gravityStormSchema: ParamSchema[] = [
  { name: "seed",         label: "Seed",             type: "number", default: 42731, min: 1,    max: 999999, step: 1     },
  { name: "count",        label: "Particle Count",   type: "number", default: 1200,  min: 200,  max: 3000,   step: 100   },
  { name: "attractors",   label: "Attractor Count",  type: "number", default: 3,     min: 1,    max: 8,      step: 1     },
  { name: "gravity",      label: "Gravity Strength", type: "number", default: 1.0,   min: 0.1,  max: 3.0,    step: 0.1   },
  { name: "turbulence",   label: "Turbulence",       type: "number", default: 0.5,   min: 0,    max: 2.0,    step: 0.1   },
  { name: "orbitSpeed",   label: "Orbit Speed",      type: "number", default: 0.008, min: 0.001,max: 0.03,   step: 0.001 },
  { name: "colorCore",    label: "Core Color",       type: "color",  default: "#ff6b35" },
  { name: "colorTrail",   label: "Trail Color",      type: "color",  default: "#7b5ea7" },
];

export interface GravityStormParams {
  seed?: number;
  count?: number;
  attractors?: number;
  gravity?: number;
  turbulence?: number;
  orbitSpeed?: number;
  colorCore?: string;
  colorTrail?: string;
}

export const gravityStormDefaults: Required<GravityStormParams> = {
  seed: 42731, count: 1200, attractors: 3, gravity: 1.0,
  turbulence: 0.5, orbitSpeed: 0.008,
  colorCore: "#ff6b35", colorTrail: "#7b5ea7",
};

// ─────────────────────────────────────────────────────────────────────────────
// GEO PULSE
// ─────────────────────────────────────────────────────────────────────────────

export const geoPulseSchema: ParamSchema[] = [
  { name: "seed",        label: "Seed",               type: "number", default: 42731, min: 1,    max: 999999, step: 1    },
  { name: "layers",      label: "Layer Count",         type: "number", default: 7,     min: 3,    max: 12,     step: 1    },
  { name: "sides",       label: "Sides",               type: "number", default: 6,     min: 3,    max: 12,     step: 1    },
  { name: "rotSpeed",    label: "Rotation Speed",      type: "number", default: 0.008, min: 0.001,max: 0.05,   step: 0.001},
  { name: "pulse",       label: "Pulse Amplitude",     type: "number", default: 0.12,  min: 0,    max: 0.4,    step: 0.01 },
  { name: "connect",     label: "Connection Density",  type: "number", default: 0.4,   min: 0,    max: 1,      step: 0.05 },
  { name: "colorPrimary",   label: "Primary",   type: "color", default: "#d97757" },
  { name: "colorSecondary", label: "Secondary", type: "color", default: "#6a9bcc" },
  { name: "colorAccent",    label: "Accent",    type: "color", default: "#e8d87a" },
];

export interface GeoPulseParams {
  seed?: number;
  layers?: number;
  sides?: number;
  rotSpeed?: number;
  pulse?: number;
  connect?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
}

export const geoPulseDefaults: Required<GeoPulseParams> = {
  seed: 42731, layers: 7, sides: 6, rotSpeed: 0.008, pulse: 0.12, connect: 0.4,
  colorPrimary: "#d97757", colorSecondary: "#6a9bcc", colorAccent: "#e8d87a",
};

// ──────────────���──────────────────────────────────────────────────────────────
// WAVE ETHER
// ─────────────────────────────────────────────────────────────────────────────

export const waveEtherSchema: ParamSchema[] = [
  { name: "seed",        label: "Seed",         type: "number", default: 42731,  min: 1,     max: 999999, step: 1     },
  { name: "sources",     label: "Wave Sources", type: "number", default: 3,      min: 1,     max: 6,      step: 1     },
  { name: "frequency",   label: "Frequency",    type: "number", default: 0.018,  min: 0.005, max: 0.05,   step: 0.001 },
  { name: "amplitude",   label: "Amplitude",    type: "number", default: 1.0,    min: 0.1,   max: 2.0,    step: 0.05  },
  { name: "waveSpeed",   label: "Wave Speed",   type: "number", default: 0.025,  min: 0.005, max: 0.08,   step: 0.005 },
  { name: "resolution",  label: "Resolution",   type: "number", default: 8,      min: 4,     max: 20,     step: 2     },
  { name: "colorCrest",  label: "Crest Color",  type: "color",  default: "#00d4ff" },
  { name: "colorTrough", label: "Trough Color", type: "color",  default: "#0a0a2e" },
  { name: "colorMid",    label: "Mid Color",    type: "color",  default: "#7b2fff" },
];

export interface WaveEtherParams {
  seed?: number;
  sources?: number;
  frequency?: number;
  amplitude?: number;
  waveSpeed?: number;
  resolution?: number;
  colorCrest?: string;
  colorTrough?: string;
  colorMid?: string;
}

export const waveEtherDefaults: Required<WaveEtherParams> = {
  seed: 42731, sources: 3, frequency: 0.018, amplitude: 1.0,
  waveSpeed: 0.025, resolution: 8,
  colorCrest: "#00d4ff", colorTrough: "#0a0a2e", colorMid: "#7b2fff",
};

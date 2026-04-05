import type { ParamSchema } from "@dano796/react-reart";

export type BackgroundId =
  | "flow-currents"
  | "gravity-storm"
  | "geo-pulse"
  | "wave-ether"
  | "vortex-bloom"
  | "crystalline-drift"
  | "ambient-mesh"
  | "ember-cascade"
  | "clifford-attractor"
  | "harmonic-lattice"
  | "lissajous-weave"
  | "phyllotaxis-dream"
  | "spirograph"
  | "differential-growth"
  | "double-pendulum"
  | "fractal-noise-terrain"
  | "moire-lattice"
  | "neural-weave"
  | "orbital-resonance"
  | "reaction-diffusion"
  | "recursive-subdivision"
  | "tide-harmonics"
  | "voronoi-mosaic"
  | "fractal-tree"
  | "sierpinski-chaos"
  | "dragon-fold"
  | "plasma-field"
  | "nebula-veil"
  | "prismatic-wave"
  | "photon-burst"
  | "fibonacci-vortex"
  | "hex-ripple"
  | "recursive-tunnel";

export type AnyParams = Record<string, number | string | boolean>;

export interface BackgroundEntry {
  id: BackgroundId;
  label: string;
  schema: ParamSchema[];
  defaults: AnyParams;
  Component: (props: any) => JSX.Element;
  description: string;
}

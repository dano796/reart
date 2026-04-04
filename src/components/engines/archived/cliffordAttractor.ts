/**
 * Clifford Attractor Engine
 * Strange attractor density accumulator with power-law color mapping
 */

import { SeededRandom, hexToRgb, lerp } from "../../utils/noise";

export interface CliffordAttractorParams {
  seed: number;
  pA: number;
  pB: number;
  pC: number;
  pD: number;
  pointsPerFrame: number;
  brightness: number;
  bgColor: string;
  colorA: string;
  colorB: string;
}

export interface CliffordAttractorState {
  densityMap: Uint32Array;
  ax: number;
  ay: number;
  rng: SeededRandom;
  width: number;
  height: number;
  gridW: number;
  gridH: number;
}

const GRID_W = 270;
const GRID_H = 270;

export function initCliffordAttractor(
  width: number,
  height: number,
  params: CliffordAttractorParams
): CliffordAttractorState {
  const rng = new SeededRandom(params.seed);
  const densityMap = new Uint32Array(GRID_W * GRID_H);
  densityMap.fill(0);

  let ax = rng.random() * 4 - 2;
  let ay = rng.random() * 4 - 2;

  // Burn-in iterations to reach attractor
  for (let i = 0; i < 500; i++) {
    const nx = Math.sin(params.pA * ay) + params.pC * Math.cos(params.pA * ax);
    const ny = Math.sin(params.pB * ax) + params.pD * Math.cos(params.pB * ay);
    ax = nx;
    ay = ny;
  }

  return { densityMap, ax, ay, rng, width, height, gridW: GRID_W, gridH: GRID_H };
}

export function drawCliffordAttractor(
  ctx: CanvasRenderingContext2D,
  state: CliffordAttractorState,
  params: CliffordAttractorParams
): void {
  const { densityMap, gridW, gridH, width, height } = state;

  // Accumulate points
  for (let i = 0; i < params.pointsPerFrame; i++) {
    const nx = Math.sin(params.pA * state.ay) + params.pC * Math.cos(params.pA * state.ax);
    const ny = Math.sin(params.pB * state.ax) + params.pD * Math.cos(params.pB * state.ay);
    state.ax = nx;
    state.ay = ny;

    // Map to grid
    const px = Math.round(lerp(0, gridW - 1, (state.ax + 2.8) / 5.6));
    const py = Math.round(lerp(0, gridH - 1, (state.ay + 2.8) / 5.6));

    if (px >= 0 && px < gridW && py >= 0 && py < gridH && densityMap[py * gridW + px] < 60000) {
      densityMap[py * gridW + px]++;
    }
  }

  // Render density map
  const bg = hexToRgb(params.bgColor);
  const c1 = hexToRgb(params.colorA);
  const c2 = hexToRgb(params.colorB);
  const scale = params.brightness * 0.0012;

  const imageData = ctx.createImageData(gridW, gridH);
  const pixels = imageData.data;

  for (let i = 0; i < gridW * gridH; i++) {
    const d = densityMap[i];
    const idx = i * 4;

    if (d === 0) {
      pixels[idx] = bg.r;
      pixels[idx + 1] = bg.g;
      pixels[idx + 2] = bg.b;
    } else {
      const t = Math.min(1, Math.pow(d * scale, 0.5));
      pixels[idx] = lerp(c1.r, c2.r, t);
      pixels[idx + 1] = lerp(c1.g, c2.g, t);
      pixels[idx + 2] = lerp(c1.b, c2.b, t);
    }
    pixels[idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  ctx.drawImage(ctx.canvas, 0, 0, gridW, gridH, 0, 0, width, height);
}

export function resetCliffordAttractor(
  state: CliffordAttractorState,
  params: CliffordAttractorParams
): void {
  const newState = initCliffordAttractor(state.width, state.height, params);
  state.densityMap = newState.densityMap;
  state.ax = newState.ax;
  state.ay = newState.ay;
  state.rng = newState.rng;
}

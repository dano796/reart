/**
 * Spirograph Engine
 * Hypotrochoid curves from rolling circles
 */

import { SeededRandom, hexToRgb, lerp, rgba } from "../../utils/noise";

export interface SpirographParams {
  seed: number;
  R: number;
  r: number;
  d: number;
  speed: number;
  lineWeight: number;
  bgColor: string;
  colorA: string;
  colorB: string;
  colorC: string;
}

export interface SpirographState {
  t: number;
  prevX: number | null;
  prevY: number | null;
  colorPhase: number;
  rng: SeededRandom;
  width: number;
  height: number;
  needsClear?: boolean;
}

export function initSpirograph(
  width: number,
  height: number,
  params: SpirographParams
): SpirographState {
  const rng = new SeededRandom(params.seed);
  const colorPhase = rng.random() * Math.PI * 2;

  return {
    t: 0,
    prevX: null,
    prevY: null,
    colorPhase,
    rng,
    width,
    height,
  };
}

function hx(t: number, R: number, r: number, d: number): number {
  return (R - r) * Math.cos(t) + d * Math.cos(((R - r) * t) / r);
}

function hy(t: number, R: number, r: number, d: number): number {
  return (R - r) * Math.sin(t) - d * Math.sin(((R - r) * t) / r);
}

export function drawSpirograph(
  ctx: CanvasRenderingContext2D,
  state: SpirographState,
  params: SpirographParams
): void {
  const { width, height } = state;
  const cx = width / 2;
  const cy = height / 2;

  const bg = hexToRgb(params.bgColor);

  // Clear canvas completely if needed (on reset)
  if (state.needsClear) {
    ctx.fillStyle = rgba(bg.r, bg.g, bg.b, 255);
    ctx.fillRect(0, 0, width, height);
    state.needsClear = false;
  }

  const steps = Math.floor(params.speed * 90);
  const maxT = Math.PI * 42;

  const c1 = hexToRgb(params.colorA);
  const c2 = hexToRgb(params.colorB);
  const c3 = hexToRgb(params.colorC);

  const sc = Math.min(width, height) * 0.44 / (Math.abs(params.R - params.r) + params.d + 0.5);

  for (let s = 0; s < steps; s++) {
    if (state.t >= maxT) {
      // Fade and reset
      ctx.fillStyle = rgba(bg.r, bg.g, bg.b, 55);
      ctx.fillRect(0, 0, width, height);
      state.t = 0;
      state.prevX = null;
      state.prevY = null;
      state.colorPhase += 0.8;
      break;
    }

    const x = cx + hx(state.t, params.R, params.r, params.d) * sc;
    const y = cy + hy(state.t, params.R, params.r, params.d) * sc;

    if (state.prevX !== null && state.prevY !== null) {
      const f = (Math.sin(state.t * 0.08 + state.colorPhase) + 1) * 0.5;
      const g = (Math.sin(state.t * 0.05 + state.colorPhase + 2) + 1) * 0.5;

      const r1 = lerp(c1.r, lerp(c2.r, c3.r, g), f);
      const g1 = lerp(c1.g, lerp(c2.g, c3.g, g), f);
      const b1 = lerp(c1.b, lerp(c2.b, c3.b, g), f);

      ctx.strokeStyle = rgba(r1, g1, b1, 210);
      ctx.lineWidth = params.lineWeight;
      ctx.beginPath();
      ctx.moveTo(state.prevX, state.prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    state.prevX = x;
    state.prevY = y;
    state.t += 0.007;
  }
}

export function resetSpirograph(
  state: SpirographState,
  params: SpirographParams
): void {
  const newState = initSpirograph(state.width, state.height, params);
  state.t = newState.t;
  state.prevX = newState.prevX;
  state.prevY = newState.prevY;
  state.colorPhase = newState.colorPhase;
  state.rng = newState.rng;
  state.needsClear = true;
}

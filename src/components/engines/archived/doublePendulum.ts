/**
 * Double Pendulum Engine
 * Chaotic dynamics visualization using RK4 integration
 */

import { SeededRandom, hexToRgb, rgba } from "../../utils/noise";

export interface DoublePendulumParams {
  seed: number;
  numPendulums: number;
  length1: number;
  length2: number;
  gravity: number;
  simSpeed: number;
  fadeRate: number;
  bgColor: string;
  colorA: string;
  colorB: string;
  colorC: string;
}

interface Pendulum {
  state: [number, number, number, number]; // [theta1, omega1, theta2, omega2]
  px: number | null;
  py: number | null;
  col: { r: number; g: number; b: number };
}

export interface DoublePendulumState {
  pendulums: Pendulum[];
  rng: SeededRandom;
  gFrame: number;
  width: number;
  height: number;
  needsClear: boolean;
}

function deriv(
  s: [number, number, number, number],
  L1: number,
  L2: number,
  g: number
): [number, number, number, number] {
  const [t1, v1, t2, v2] = s;
  const d = t1 - t2;
  const den = 2 - Math.cos(2 * d);
  const a1 =
    (-g * 3 * Math.sin(t1) -
      Math.sin(t1 - 2 * t2) -
      2 * Math.sin(d) * (v2 ** 2 * L2 + v1 ** 2 * L1 * Math.cos(d))) /
    (L1 * den);
  const a2 =
    (2 *
      Math.sin(d) *
      (v1 ** 2 * L1 * 2 + g * 2 * Math.cos(t1) + v2 ** 2 * L2 * Math.cos(d))) /
    (L2 * den);
  return [v1, a1, v2, a2];
}

function rk4(
  s: [number, number, number, number],
  L1: number,
  L2: number,
  g: number,
  dt: number
): [number, number, number, number] {
  const k1 = deriv(s, L1, L2, g);
  const k2 = deriv(
    s.map((v, i) => v + k1[i] * (dt / 2)) as [number, number, number, number],
    L1,
    L2,
    g
  );
  const k3 = deriv(
    s.map((v, i) => v + k2[i] * (dt / 2)) as [number, number, number, number],
    L1,
    L2,
    g
  );
  const k4 = deriv(
    s.map((v, i) => v + k3[i] * dt) as [number, number, number, number],
    L1,
    L2,
    g
  );
  return s.map((v, i) => v + ((k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * dt) / 6) as [
    number,
    number,
    number,
    number
  ];
}

function pos2(
  s: [number, number, number, number],
  L1: number,
  L2: number,
  ox: number,
  oy: number
): { x: number; y: number } {
  const [t1, , t2] = s;
  return {
    x: ox + L1 * Math.sin(t1) + L2 * Math.sin(t2),
    y: oy + L1 * Math.cos(t1) + L2 * Math.cos(t2),
  };
}

export function initDoublePendulum(
  width: number,
  height: number,
  params: DoublePendulumParams
): DoublePendulumState {
  const rng = new SeededRandom(params.seed);
  const pal = [hexToRgb(params.colorA), hexToRgb(params.colorB), hexToRgb(params.colorC)];

  const pendulums: Pendulum[] = [];
  for (let i = 0; i < params.numPendulums; i++) {
    const ofs = (i - Math.floor(params.numPendulums / 2)) * 0.025;
    pendulums.push({
      state: [Math.PI * 0.65, 0, Math.PI + ofs, 0.01],
      px: null,
      py: null,
      col: pal[i % pal.length],
    });
  }

  return { pendulums, rng, gFrame: 0, width, height, needsClear: true };
}

export function drawDoublePendulum(
  ctx: CanvasRenderingContext2D,
  state: DoublePendulumState,
  params: DoublePendulumParams
): void {
  const { pendulums, width, height } = state;

  // Clear or fade background
  if (state.needsClear) {
    const bg = hexToRgb(params.bgColor);
    ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
    ctx.fillRect(0, 0, width, height);
    state.needsClear = false;
  } else {
    const bg = hexToRgb(params.bgColor);
    ctx.fillStyle = rgba(bg.r, bg.g, bg.b, params.fadeRate);
    ctx.fillRect(0, 0, width, height);
  }

  const ox = width / 2;
  const oy = height * 0.28;
  const L1 = params.length1;
  const L2 = params.length2;
  const dt = 0.035 / params.simSpeed;
  const steps = Math.max(1, Math.floor(params.simSpeed * 2.5));

  for (const pend of pendulums) {
    // Integrate physics
    for (let s = 0; s < steps; s++) {
      pend.state = rk4(pend.state, L1, L2, params.gravity, dt);
    }

    // Get position of second mass
    const { x, y } = pos2(pend.state, L1, L2, ox, oy);

    // Draw trail
    if (pend.px !== null && pend.py !== null) {
      ctx.strokeStyle = rgba(pend.col.r, pend.col.g, pend.col.b, 185);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(pend.px, pend.py);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    pend.px = x;
    pend.py = y;
  }

  state.gFrame++;
}

export function resetDoublePendulum(
  state: DoublePendulumState,
  params: DoublePendulumParams
): void {
  const newState = initDoublePendulum(state.width, state.height, params);
  state.pendulums = newState.pendulums;
  state.rng = newState.rng;
  state.gFrame = 0;
  state.needsClear = true;
}

/**
 * Differential Growth Engine
 * Simulates organic growth through spring forces, repulsion, and noise-guided expansion
 */

import { PerlinNoise, SeededRandom, hexToRgb, lerp, rgba } from "../../utils/noise";

export interface DifferentialGrowthParams {
  seed: number;
  growthRate: number;
  repelRadius: number;
  repelStrength: number;
  maxEdge: number;
  maxNodes: number;
  stepsPerFrame: number;
  fadeRate: number;
  lineWeight: number;
  bgColor: string;
  colorA: string;
  colorB: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface DifferentialGrowthState {
  nodes: Node[];
  noise: PerlinNoise;
  rng: SeededRandom;
  gFrame: number;
  width: number;
  height: number;
  needsClear: boolean;
}

export function initDifferentialGrowth(
  width: number,
  height: number,
  params: DifferentialGrowthParams
): DifferentialGrowthState {
  const rng = new SeededRandom(params.seed);
  const noise = new PerlinNoise(params.seed);

  // Create initial circle of nodes
  const nodes: Node[] = [];
  const N = 28;
  const r0 = 45;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    nodes.push({
      x: width / 2 + Math.cos(a) * r0,
      y: height / 2 + Math.sin(a) * r0,
      vx: 0,
      vy: 0,
    });
  }

  return { nodes, noise, rng, gFrame: 0, width, height, needsClear: true };
}

function growStep(
  state: DifferentialGrowthState,
  params: DifferentialGrowthParams,
  noise: PerlinNoise
): void {
  const { nodes, gFrame } = state;
  const N = nodes.length;
  const fx = new Float32Array(N);
  const fy = new Float32Array(N);

  // Spring forces (smoothing)
  for (let i = 0; i < N; i++) {
    const prev = nodes[(i - 1 + N) % N];
    const next = nodes[(i + 1) % N];
    const mx = (prev.x + next.x) / 2;
    const my = (prev.y + next.y) / 2;
    fx[i] += (mx - nodes[i].x) * 0.28;
    fy[i] += (my - nodes[i].y) * 0.28;
  }

  // Repulsion forces
  const rr = params.repelRadius;
  const rs = params.repelStrength;
  for (let i = 0; i < N; i++) {
    for (let j = i + 3; j < N - (i < 2 ? 1 : 0); j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
      if (d < rr) {
        const f = (rs * (1 - d / rr)) / d;
        fx[i] += dx * f;
        fy[i] += dy * f;
        fx[j] -= dx * f;
        fy[j] -= dy * f;
      }
    }
  }

  // Growth forces (outward along normal)
  for (let i = 0; i < N; i++) {
    const n = nodes[i];
    const prev = nodes[(i - 1 + N) % N];
    const next = nodes[(i + 1) % N];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.sqrt(tx * tx + ty * ty) + 0.001;
    const nx = -ty / len;
    const ny = tx / len;
    const noiseVal = (noise.get(n.x * 0.004, n.y * 0.004, gFrame * 0.007) - 0.5) * 2;
    fx[i] += nx * params.growthRate * (0.6 + noiseVal * 0.4);
    fy[i] += ny * params.growthRate * (0.6 + noiseVal * 0.4);
  }

  // Apply forces with damping
  for (let i = 0; i < N; i++) {
    nodes[i].vx = (nodes[i].vx + fx[i]) * 0.45;
    nodes[i].vy = (nodes[i].vy + fy[i]) * 0.45;
    nodes[i].x += nodes[i].vx;
    nodes[i].y += nodes[i].vy;
  }

  // Insert new nodes where edges are too long
  const next: Node[] = [];
  for (let i = 0; i < N; i++) {
    next.push(nodes[i]);
    const nn = nodes[(i + 1) % N];
    const d = Math.hypot(nn.x - nodes[i].x, nn.y - nodes[i].y);
    if (d > params.maxEdge && next.length < params.maxNodes) {
      next.push({
        x: (nodes[i].x + nn.x) / 2,
        y: (nodes[i].y + nn.y) / 2,
        vx: 0,
        vy: 0,
      });
    }
  }
  state.nodes = next;
  state.gFrame++;
}

export function drawDifferentialGrowth(
  ctx: CanvasRenderingContext2D,
  state: DifferentialGrowthState,
  params: DifferentialGrowthParams
): void {
  const { noise, gFrame, width, height } = state;

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

  // Perform growth steps
  for (let s = 0; s < params.stepsPerFrame; s++) {
    growStep(state, params, noise);
  }

  // Draw the curve
  const N = state.nodes.length;
  const c1 = hexToRgb(params.colorA);
  const c2 = hexToRgb(params.colorB);

  for (let i = 0; i < N; i++) {
    const nn = state.nodes[(i + 1) % N];
    const t = i / N;
    const ct = (Math.sin(t * Math.PI * 2 * 3 + gFrame * 0.02) + 1) * 0.5;
    const r = lerp(c1.r, c2.r, ct);
    const g = lerp(c1.g, c2.g, ct);
    const b = lerp(c1.b, c2.b, ct);

    ctx.strokeStyle = rgba(r, g, b, 190);
    ctx.lineWidth = params.lineWeight;
    ctx.beginPath();
    ctx.moveTo(state.nodes[i].x, state.nodes[i].y);
    ctx.lineTo(nn.x, nn.y);
    ctx.stroke();
  }
}

export function resetDifferentialGrowth(
  state: DifferentialGrowthState,
  params: DifferentialGrowthParams
): void {
  const newState = initDifferentialGrowth(state.width, state.height, params);
  state.nodes = newState.nodes;
  state.noise = newState.noise;
  state.rng = newState.rng;
  state.gFrame = 0;
  state.needsClear = true;
}

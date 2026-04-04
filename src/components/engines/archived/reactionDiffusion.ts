/**
 * Reaction Diffusion Engine
 * Gray-Scott model creating organic pattern formation
 */

import { SeededRandom, hexToRgb, lerp } from "../../utils/noise";

export interface ReactionDiffusionParams {
  seed: number;
  Da: number;
  Db: number;
  f: number;
  k: number;
  stepsPerFrame: number;
  bgColor: string;
  colorA: string;
  colorB: string;
}

export interface ReactionDiffusionState {
  W: number;
  H: number;
  A: Float32Array;
  B: Float32Array;
  nA: Float32Array;
  nB: Float32Array;
  rng: SeededRandom;
  imageData: ImageData | null;
  width: number;
  height: number;
}

function lap(G: Float32Array, x: number, y: number, W: number, H: number): number {
  const l = (x - 1 + W) % W;
  const r = (x + 1) % W;
  const u = (y - 1 + H) % H;
  const d = (y + 1) % H;
  return (
    0.2 * (G[y * W + l] + G[y * W + r] + G[u * W + x] + G[d * W + x]) +
    0.05 * (G[u * W + l] + G[u * W + r] + G[d * W + l] + G[d * W + r]) -
    G[y * W + x]
  );
}

export function initReactionDiffusion(
  width: number,
  height: number,
  params: ReactionDiffusionParams
): ReactionDiffusionState {
  const W = 150;
  const H = 150;
  const rng = new SeededRandom(params.seed);

  const A = new Float32Array(W * H);
  const B = new Float32Array(W * H);
  const nA = new Float32Array(W * H);
  const nB = new Float32Array(W * H);

  A.fill(1);
  B.fill(0);

  // Seed with random circles
  for (let n = 0; n < 35; n++) {
    const cx = Math.floor(rng.random() * W);
    const cy = Math.floor(rng.random() * H);
    const r = Math.floor(rng.range(2, 6));

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r * r) {
          const i = ((cy + dy + H) % H) * W + ((cx + dx + W) % W);
          B[i] = 1;
          A[i] = 0;
        }
      }
    }
  }

  return { W, H, A, B, nA, nB, rng, imageData: null, width, height };
}

function rdStep(state: ReactionDiffusionState, params: ReactionDiffusionParams): void {
  const { W, H, A, B, nA, nB } = state;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const a = A[i];
      const b = B[i];
      const abb = a * b * b;

      nA[i] = Math.max(0, Math.min(1, a + params.Da * lap(A, x, y, W, H) - abb + params.f * (1 - a)));
      nB[i] = Math.max(0, Math.min(1, b + params.Db * lap(B, x, y, W, H) + abb - (params.f + params.k) * b));
    }
  }

  // Swap buffers
  const tmpA = state.A;
  state.A = state.nA;
  state.nA = tmpA;

  const tmpB = state.B;
  state.B = state.nB;
  state.nB = tmpB;
}

export function drawReactionDiffusion(
  ctx: CanvasRenderingContext2D,
  state: ReactionDiffusionState,
  params: ReactionDiffusionParams
): void {
  const { W, H, B, width, height } = state;

  // Run simulation steps
  for (let s = 0; s < params.stepsPerFrame; s++) {
    rdStep(state, params);
  }

  // Create or reuse image data
  if (!state.imageData) {
    state.imageData = ctx.createImageData(W, H);
  }

  const c1 = hexToRgb(params.colorA);
  const c2 = hexToRgb(params.colorB);

  // Update pixels
  const pixels = state.imageData.data;
  for (let i = 0; i < W * H; i++) {
    const t = Math.pow(B[i], 0.65);
    const idx = i * 4;
    pixels[idx] = lerp(c1.r, c2.r, t);
    pixels[idx + 1] = lerp(c1.g, c2.g, t);
    pixels[idx + 2] = lerp(c1.b, c2.b, t);
    pixels[idx + 3] = 255;
  }

  // Draw scaled to canvas
  ctx.putImageData(state.imageData, 0, 0);
  ctx.drawImage(ctx.canvas, 0, 0, W, H, 0, 0, width, height);
}

export function resetReactionDiffusion(
  state: ReactionDiffusionState,
  params: ReactionDiffusionParams
): void {
  const newState = initReactionDiffusion(state.width, state.height, params);
  state.W = newState.W;
  state.H = newState.H;
  state.A = newState.A;
  state.B = newState.B;
  state.nA = newState.nA;
  state.nB = newState.nB;
  state.rng = newState.rng;
  state.imageData = null;
}

/**
 * Crystalline Drift engine — framework-agnostic Canvas 2D renderer.
 *
 * Recursive branching arms grow from the center, guided by noise,
 * forming snowflake-like crystal mandala structures with radial symmetry.
 */

import { PerlinNoise, SeededRandom, hexToRgb, rgba, map } from "../utils/noise";
import type { CrystallineDriftParams } from "../schemas";
import { crystallineDriftDefaults } from "../schemas";

interface Arm {
  x: number;
  y: number;
  angle: number;
  depth: number;
  age: number;
}

export interface CrystallineDriftState {
  arms: Arm[];
  noise: PerlinNoise;
  rng: SeededRandom;
  frame: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  initialized: boolean;
}

function drawSymmetric(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  depth: number,
  cx: number,
  cy: number,
  params: Required<CrystallineDriftParams>
): void {
  const t = depth / params.maxDepth;
  const alpha = map(t, 0, 1, 210, 50);
  const weight = map(t, 0, 1, 1.9, 0.3);

  const col = hexToRgb(params.crystalColor);
  const gc = hexToRgb(params.glowColor);

  const lx1 = x1 - cx;
  const ly1 = y1 - cy;
  const lx2 = x2 - cx;
  const ly2 = y2 - cy;

  for (let i = 0; i < params.symmetry; i++) {
    const a = (i / params.symmetry) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);

    const rx1 = lx1 * ca - ly1 * sa + cx;
    const ry1 = lx1 * sa + ly1 * ca + cy;
    const rx2 = lx2 * ca - ly2 * sa + cx;
    const ry2 = lx2 * sa + ly2 * ca + cy;

    // Draw glow
    ctx.strokeStyle = rgba(gc.r, gc.g, gc.b, alpha * 0.35);
    ctx.lineWidth = weight * 4.5;
    ctx.beginPath();
    ctx.moveTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.stroke();

    // Draw crystal line
    ctx.strokeStyle = rgba(col.r, col.g, col.b, alpha);
    ctx.lineWidth = weight;
    ctx.beginPath();
    ctx.moveTo(rx1, ry1);
    ctx.lineTo(rx2, ry2);
    ctx.stroke();
  }
}

export function initCrystallineDrift(
  width: number,
  height: number,
  params: CrystallineDriftParams = {}
): CrystallineDriftState {
  const p = { ...crystallineDriftDefaults, ...params };
  const noise = new PerlinNoise(p.seed);
  const rng = new SeededRandom(p.seed);

  const cx = width / 2;
  const cy = height / 2;

  const arms: Arm[] = [{ x: cx, y: cy, angle: -Math.PI / 2, depth: 0, age: 0 }];

  return {
    arms,
    noise,
    rng,
    frame: 0,
    width,
    height,
    cx,
    cy,
    initialized: true,
  };
}

export function drawCrystallineDrift(
  ctx: CanvasRenderingContext2D,
  state: CrystallineDriftState,
  params: CrystallineDriftParams = {}
): void {
  const p = { ...crystallineDriftDefaults, ...params };
  const { arms, noise, rng, frame, cx, cy, width, height } = state;

  const newArms: Arm[] = [];
  const keepArms: Arm[] = [];

  for (const arm of arms) {
    // Apply noise to angle
    const na =
      (noise.get(arm.x * 0.006, arm.y * 0.006, frame * 0.002) - 0.5) *
      p.angleVariance;
    arm.angle += na;

    // Calculate new position
    const nx = arm.x + Math.cos(arm.angle) * p.segmentLength;
    const ny = arm.y + Math.sin(arm.angle) * p.segmentLength;

    // Draw symmetric segments
    drawSymmetric(ctx, arm.x, arm.y, nx, ny, arm.depth, cx, cy, p);

    arm.x = nx;
    arm.y = ny;
    arm.age++;

    // Check if arm should continue
    const distFromCenter = Math.hypot(arm.x - cx, arm.y - cy);
    const maxRadius = Math.min(width, height) * 0.48;

    if (distFromCenter < maxRadius && arm.age < 280) {
      keepArms.push(arm);

      // Branch
      if (arm.age % p.branchInterval === 0 && arm.depth < p.maxDepth) {
        const ao = rng.range(0.32, 0.85);
        newArms.push({
          x: arm.x,
          y: arm.y,
          angle: arm.angle + ao,
          depth: arm.depth + 1,
          age: 0,
        });

        if (rng.random() < 0.52) {
          newArms.push({
            x: arm.x,
            y: arm.y,
            angle: arm.angle - ao * 0.78,
            depth: arm.depth + 1,
            age: 0,
          });
        }
      }
    }
  }

  state.arms = [...keepArms, ...newArms].slice(0, 700);
  state.frame++;
}

export function resetCrystallineDrift(
  ctx: CanvasRenderingContext2D,
  state: CrystallineDriftState,
  params: CrystallineDriftParams = {}
): CrystallineDriftState {
  const p = { ...crystallineDriftDefaults, ...params };
  const bg = hexToRgb(p.bgColor);
  ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initCrystallineDrift(state.width, state.height, p);
}

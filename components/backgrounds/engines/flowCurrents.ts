/**
 * Flow Currents engine — framework-agnostic Canvas 2D renderer.
 *
 * Faithful port of the p5.js implementation in kinetic-arcana-gallery.html.
 * Thousands of particles trace Perlin-noise vector fields, leaving
 * color-burned trails that form organic density maps.
 */

import { PerlinNoise, SeededRandom, hexToRgb, lerp, clamp, map, rgba } from "../utils/noise";
import type { FlowCurrentsParams } from "../schemas";
import { flowCurrentsDefaults } from "../schemas";

interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  life: number;
  maxLife: number;
  age: number;
  speed: number;
}

export interface FlowCurrentsState {
  particles: Particle[];
  noise: PerlinNoise;
  rng: SeededRandom;
  z: number;
  width: number;
  height: number;
  initialized: boolean;
}

export function initFlowCurrents(
  width: number,
  height: number,
  params: FlowCurrentsParams = {}
): FlowCurrentsState {
  const p = { ...flowCurrentsDefaults, ...params };
  const noise = new PerlinNoise(p.seed);
  const rng = new SeededRandom(p.seed);

  const particles: Particle[] = [];
  for (let i = 0; i < p.count; i++) {
    const x = rng.range(0, width);
    const y = rng.range(0, height);
    const maxLife = rng.range(80, 200);
    particles.push({
      x, y,
      prevX: x, prevY: y,
      life: maxLife,
      maxLife,
      age: rng.floor(0, 100),
      speed: rng.range(0.6, 1.4),
    });
  }

  return { particles, noise, rng, z: 0, width, height, initialized: true };
}

export function drawFlowCurrents(
  ctx: CanvasRenderingContext2D,
  state: FlowCurrentsState,
  params: FlowCurrentsParams = {}
): void {
  const p = { ...flowCurrentsDefaults, ...params };
  const { particles, noise, rng, width: W, height: H } = state;

  // Fade layer
  ctx.fillStyle = rgba(12, 12, 20, p.trailOpacity);
  ctx.fillRect(0, 0, W, H);

  const c1 = hexToRgb(p.colorWarm);
  const c2 = hexToRgb(p.colorCool);
  const c3 = hexToRgb(p.colorAccent);

  for (const pt of particles) {
    pt.age++;
    if (pt.age > pt.maxLife) {
      pt.x = rng.range(0, W);
      pt.y = rng.range(0, H);
      pt.prevX = pt.x;
      pt.prevY = pt.y;
      pt.age = 0;
      pt.maxLife = rng.range(80, 200);
      continue;
    }

    const angle = noise.get(pt.x * p.noiseScale, pt.y * p.noiseScale, state.z) * Math.PI * 2 * 4;
    const vx = Math.cos(angle) * p.speed * pt.speed;
    const vy = Math.sin(angle) * p.speed * pt.speed;

    pt.prevX = pt.x;
    pt.prevY = pt.y;
    pt.x += vx;
    pt.y += vy;

    if (pt.x < 0 || pt.x > W || pt.y < 0 || pt.y > H) {
      pt.x = rng.range(0, W);
      pt.y = rng.range(0, H);
      pt.prevX = pt.x;
      pt.prevY = pt.y;
      pt.age = 0;
      continue;
    }

    const t = pt.age / pt.maxLife;
    const spd = Math.sqrt(vx * vx + vy * vy);
    const si = clamp(spd / (p.speed * 2), 0, 1);

    const baseC = t < 0.5 ? c2 : c3;
    const r = lerp(c1.r, baseC.r, si);
    const g = lerp(c1.g, baseC.g, si);
    const b = lerp(c1.b, baseC.b, si);
    const a = map(Math.sin(t * Math.PI), 0, 1, 60, 200);

    ctx.strokeStyle = rgba(r, g, b, a);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(pt.prevX, pt.prevY);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  }

  state.z += p.noiseEvol;
}

/** Full reset — call when structural params change (count, seed). */
export function resetFlowCurrents(
  ctx: CanvasRenderingContext2D,
  state: FlowCurrentsState,
  params: FlowCurrentsParams = {}
): FlowCurrentsState {
  const p = { ...flowCurrentsDefaults, ...params };
  ctx.fillStyle = `rgb(12,12,20)`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initFlowCurrents(state.width, state.height, p);
}

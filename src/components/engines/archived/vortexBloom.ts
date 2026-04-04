/**
 * Vortex Bloom engine — framework-agnostic Canvas 2D renderer.
 *
 * Particles spiral under competing vortex attractors, accumulating into
 * mandala-like formations through orbital crystallization.
 */

import { PerlinNoise, SeededRandom, hexToRgb, rgba } from "../../utils/noise";
import type { VortexBloomParams } from "../../schemas";
import { vortexBloomDefaults } from "../../schemas";

interface Vortex {
  x: number;
  y: number;
  str: number;
  spin: number;
  col: { r: number; g: number; b: number };
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  px: number;
  py: number;
  age: number;
  maxLife: number;
  cr: number;
  cg: number;
  cb: number;
}

export interface VortexBloomState {
  vortices: Vortex[];
  particles: Particle[];
  noise: PerlinNoise;
  rng: SeededRandom;
  frame: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
  initialized: boolean;
}

function computeColor(pt: Particle, vortices: Vortex[]): void {
  let rS = 0, gS = 0, bS = 0, wS = 0;
  for (const v of vortices) {
    const d2 = (v.x - pt.x) ** 2 + (v.y - pt.y) ** 2;
    const w = 1 / (d2 * 0.00004 + 0.5);
    rS += v.col.r * w;
    gS += v.col.g * w;
    bS += v.col.b * w;
    wS += w;
  }
  pt.cr = rS / wS;
  pt.cg = gS / wS;
  pt.cb = bS / wS;
}

function makeParticle(
  rng: SeededRandom,
  width: number,
  height: number,
  vortices: Vortex[]
): Particle {
  const pt: Particle = {
    x: rng.range(0, width),
    y: rng.range(0, height),
    vx: rng.range(-0.6, 0.6),
    vy: rng.range(-0.6, 0.6),
    px: 0,
    py: 0,
    age: 0,
    maxLife: rng.range(120, 500),
    cr: 255,
    cg: 255,
    cb: 255,
  };
  pt.px = pt.x;
  pt.py = pt.y;
  computeColor(pt, vortices);
  return pt;
}

export function initVortexBloom(
  width: number,
  height: number,
  params: VortexBloomParams = {}
): VortexBloomState {
  const p = { ...vortexBloomDefaults, ...params };
  const noise = new PerlinNoise(p.seed);
  const rng = new SeededRandom(p.seed);

  const cx = width / 2;
  const cy = height / 2;

  const pal = [hexToRgb(p.colorA), hexToRgb(p.colorB), hexToRgb(p.colorC)];
  const vortices: Vortex[] = [];

  for (let i = 0; i < p.vortexCount; i++) {
    const angle = (i / p.vortexCount) * Math.PI * 2 + rng.range(-0.4, 0.4);
    const radius = rng.range(70, Math.min(width, height) * 0.4);
    vortices.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      str: rng.range(0.5, 1.6),
      spin: rng.random() > 0.45 ? 1 : -1,
      col: pal[i % pal.length],
    });
  }

  const particles: Particle[] = [];
  for (let i = 0; i < p.particleCount; i++) {
    particles.push(makeParticle(rng, width, height, vortices));
  }

  return {
    vortices,
    particles,
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

export function drawVortexBloom(
  ctx: CanvasRenderingContext2D,
  state: VortexBloomState,
  params: VortexBloomParams = {}
): void {
  const p = { ...vortexBloomDefaults, ...params };
  const { particles, vortices, noise, rng, width, height, frame } = state;

  // Fade layer
  const bg = hexToRgb(p.bgColor);
  ctx.fillStyle = rgba(bg.r, bg.g, bg.b, p.fadeRate);
  ctx.fillRect(0, 0, width, height);

  for (const pt of particles) {
    pt.px = pt.x;
    pt.py = pt.y;

    // Compute forces from vortices
    let ax = 0, ay = 0;
    for (const v of vortices) {
      const dx = v.x - pt.x;
      const dy = v.y - pt.y;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2) + 0.001;

      const pull = (p.orbitStrength * v.str * 900) / (d2 + 600);
      const tangX = (-dy / d) * v.spin;
      const tangY = (dx / d) * v.spin;
      const orb = (p.spiralTightness * v.str * 700) / (d + 12);

      ax += (dx / d) * pull + tangX * orb;
      ay += (dy / d) * pull + tangY * orb;
    }

    // Add noise turbulence
    const nx = noise.get(pt.x * 0.0025, pt.y * 0.0025, frame * 0.0008);
    const ny = noise.get(pt.x * 0.0025 + 999, pt.y * 0.0025 + 999, frame * 0.0008);
    ax += (nx - 0.5) * 0.5;
    ay += (ny - 0.5) * 0.5;

    // Update velocity with damping
    pt.vx = (pt.vx + ax * 0.016) * 0.978;
    pt.vy = (pt.vy + ay * 0.016) * 0.978;

    // Speed limit
    const spd = Math.sqrt(pt.vx ** 2 + pt.vy ** 2);
    if (spd > 7) {
      pt.vx = (pt.vx / spd) * 7;
      pt.vy = (pt.vy / spd) * 7;
    }

    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.age++;

    // Update color periodically
    if (pt.age % 12 === 0) {
      computeColor(pt, vortices);
    }

    // Reset if dead or out of bounds
    if (
      pt.age >= pt.maxLife ||
      pt.x < -60 ||
      pt.x > width + 60 ||
      pt.y < -60 ||
      pt.y > height + 60
    ) {
      Object.assign(pt, makeParticle(rng, width, height, vortices));
    } else {
      // Draw trail
      const alpha = Math.sin((pt.age / pt.maxLife) * Math.PI) * 210;
      ctx.strokeStyle = rgba(pt.cr, pt.cg, pt.cb, alpha);
      ctx.lineWidth = p.trailWeight;
      ctx.beginPath();
      ctx.moveTo(pt.px, pt.py);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
  }

  state.frame++;
}

export function resetVortexBloom(
  ctx: CanvasRenderingContext2D,
  state: VortexBloomState,
  params: VortexBloomParams = {}
): VortexBloomState {
  const p = { ...vortexBloomDefaults, ...params };
  const bg = hexToRgb(p.bgColor);
  ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initVortexBloom(state.width, state.height, p);
}

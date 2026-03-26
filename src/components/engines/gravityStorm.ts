/**
 * Gravity Storm engine — framework-agnostic Canvas 2D renderer.
 *
 * Multiple gravitational attractors orbit the canvas center while a
 * particle swarm is pulled into complex orbital choreography.
 * Colors indicate velocity: slow particles → trail color, fast → core color.
 */

import { PerlinNoise, SeededRandom, hexToRgb, lerp, clamp, rgba } from "../utils/noise";
import type { GravityStormParams } from "../schemas";
import { gravityStormDefaults } from "../schemas";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  age: number;
}

interface Attractor {
  x: number;
  y: number;
  mass: number;
  orbitR: number;
  orbitAngle: number;
  orbitSpeed: number;
}

export interface GravityStormState {
  particles: Particle[];
  attractors: Attractor[];
  noise: PerlinNoise;
  rng: SeededRandom;
  time: number;
  width: number;
  height: number;
}

export function initGravityStorm(
  width: number,
  height: number,
  params: GravityStormParams = {}
): GravityStormState {
  const p = { ...gravityStormDefaults, ...params };
  const rng = new SeededRandom(p.seed);
  const noise = new PerlinNoise(p.seed);

  const attractors: Attractor[] = [];
  for (let i = 0; i < p.attractors; i++) {
    attractors.push({
      x: rng.range(width * 0.2, width * 0.8),
      y: rng.range(height * 0.2, height * 0.8),
      mass: rng.range(0.6, 1.4),
      orbitR: rng.range(80, 220),
      orbitAngle: rng.range(0, Math.PI * 2),
      orbitSpeed: rng.range(0.5, 1.5) * (rng.bool() ? 1 : -1),
    });
  }

  const particles: Particle[] = [];
  for (let i = 0; i < p.count; i++) {
    particles.push({
      x: rng.range(0, width),
      y: rng.range(0, height),
      vx: rng.range(-1.5, 1.5),
      vy: rng.range(-1.5, 1.5),
      life: rng.floor(60, 180),
      age: rng.floor(0, 80),
    });
  }

  return { particles, attractors, noise, rng, time: 0, width, height };
}

export function drawGravityStorm(
  ctx: CanvasRenderingContext2D,
  state: GravityStormState,
  params: GravityStormParams = {}
): void {
  const p = { ...gravityStormDefaults, ...params };
  const { particles, attractors, noise, rng, width: W, height: H } = state;

  state.time += p.orbitSpeed;

  // Move attractors
  const cx = W / 2, cy = H / 2;
  for (const a of attractors) {
    a.orbitAngle += p.orbitSpeed * a.orbitSpeed;
    a.x = cx + Math.cos(a.orbitAngle) * a.orbitR;
    a.y = cy + Math.sin(a.orbitAngle) * a.orbitR;
  }

  // Fade
  ctx.fillStyle = rgba(8, 6, 18, 18);
  ctx.fillRect(0, 0, W, H);

  const c1 = hexToRgb(p.colorCore);
  const c2 = hexToRgb(p.colorTrail);

  for (const pt of particles) {
    pt.age++;
    if (pt.age > pt.life) {
      pt.x = rng.range(0, W);
      pt.y = rng.range(0, H);
      pt.vx = rng.range(-1.5, 1.5);
      pt.vy = rng.range(-1.5, 1.5);
      pt.age = 0;
      pt.life = rng.floor(60, 180);
      continue;
    }

    let ax = 0, ay = 0;
    for (const att of attractors) {
      const dx = att.x - pt.x;
      const dy = att.y - pt.y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 20);
      const force = (p.gravity * att.mass * 600) / (dist * dist);
      ax += (dx / dist) * force;
      ay += (dy / dist) * force;
    }

    if (p.turbulence > 0) {
      const nx = noise.get(pt.x * 0.003, pt.y * 0.003, state.time) * Math.PI * 4;
      ax += Math.cos(nx) * p.turbulence * 0.3;
      ay += Math.sin(nx) * p.turbulence * 0.3;
    }

    pt.vx = (pt.vx + ax * 0.016) * 0.99;
    pt.vy = (pt.vy + ay * 0.016) * 0.99;
    const spd = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);
    if (spd > 8) { pt.vx *= 8 / spd; pt.vy *= 8 / spd; }

    pt.x += pt.vx;
    pt.y += pt.vy;

    if (pt.x < 0 || pt.x > W || pt.y < 0 || pt.y > H) {
      pt.x = rng.range(0, W);
      pt.y = rng.range(0, H);
      pt.vx = rng.range(-1.5, 1.5);
      pt.vy = rng.range(-1.5, 1.5);
      pt.age = 0;
      continue;
    }

    const si = clamp(spd / 8, 0, 1);
    const r = lerp(c2.r, c1.r, si);
    const g = lerp(c2.g, c1.g, si);
    const b = lerp(c2.b, c1.b, si);
    const t = pt.age / pt.life;
    const alpha = Math.sin(t * Math.PI) * 200 * (0.3 + si * 0.7);
    const sz = 1 + si * 2.5;

    ctx.fillStyle = rgba(r, g, b, alpha);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, sz / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Attractor glows
  for (const att of attractors) {
    for (let r = 30; r > 0; r -= 5) {
      const alpha = ((r / 30) * 25) * att.mass;
      ctx.fillStyle = rgba(c1.r, c1.g, c1.b, alpha);
      ctx.beginPath();
      ctx.arc(att.x, att.y, r / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function resetGravityStorm(
  ctx: CanvasRenderingContext2D,
  state: GravityStormState,
  params: GravityStormParams = {}
): GravityStormState {
  ctx.fillStyle = `rgb(8,6,18)`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initGravityStorm(state.width, state.height, params);
}

/**
 * Ember Cascade Engine
 * Thermal particle system with turbulent ascent and temperature-based color gradient
 */

import { PerlinNoise, SeededRandom, hexToRgb, lerp, rgba } from "../../utils/noise";

export interface EmberCascadeParams {
  seed: number;
  particleCount: number;
  sourceCount: number;
  riseSpeed: number;
  turbulence: number;
  glowSize: number;
  bgColor: string;
  hotColor: string;
  midColor: string;
  coolColor: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  size: number;
}

interface Source {
  x: number;
  y: number;
}

export interface EmberCascadeState {
  particles: Particle[];
  sources: Source[];
  noise: PerlinNoise;
  rng: SeededRandom;
  time: number;
  width: number;
  height: number;
  needsClear?: boolean;
}

export function initEmberCascade(
  width: number,
  height: number,
  params: EmberCascadeParams
): EmberCascadeState {
  const rng = new SeededRandom(params.seed);
  const noise = new PerlinNoise(params.seed);

  // Create source points
  const sources: Source[] = [];
  for (let i = 0; i < params.sourceCount; i++) {
    sources.push({
      x: rng.random() * (width * 0.7) + width * 0.15,
      y: rng.random() * (height * 0.26) + height * 0.62,
    });
  }

  // Create particles
  const particles: Particle[] = [];
  for (let i = 0; i < params.particleCount; i++) {
    const src = sources[Math.floor(rng.random() * sources.length)];
    const maxAge = (rng.random() * 120 + 70) * lerp(1.4, 0.55, (params.riseSpeed - 0.2) / 2.8);
    const pt: Particle = {
      x: src.x + (rng.random() * 2 - 1) * 28,
      y: src.y + (rng.random() * 2 - 1) * 10,
      vx: (rng.random() * 2 - 1) * 0.5,
      vy: -(rng.random() * 2.2 + 1.6) * params.riseSpeed,
      age: Math.floor(rng.random() * maxAge),
      maxAge,
      size: (rng.random() * 5 + 2) * params.glowSize,
    };
    particles.push(pt);
  }

  return { particles, sources, noise, rng, time: 0, width, height };
}

function getColor(
  t: number,
  hot: { r: number; g: number; b: number },
  mid: { r: number; g: number; b: number },
  cool: { r: number; g: number; b: number }
): { r: number; g: number; b: number; a: number } {
  let r: number, g: number, b: number, a: number;

  if (t < 0.15) {
    const f = t / 0.15;
    r = lerp(255, hot.r, f);
    g = lerp(255, hot.g, f);
    b = lerp(255, hot.b, f);
    a = lerp(0, 225, t / 0.15);
  } else if (t < 0.5) {
    const f = (t - 0.15) / 0.35;
    r = lerp(hot.r, mid.r, f);
    g = lerp(hot.g, mid.g, f);
    b = lerp(hot.b, mid.b, f);
    a = 215;
  } else {
    const f = (t - 0.5) / 0.5;
    r = lerp(mid.r, cool.r, f);
    g = lerp(mid.g, cool.g, f);
    b = lerp(mid.b, cool.b, f);
    a = lerp(215, 0, f);
  }

  return { r, g, b, a };
}

export function drawEmberCascade(
  ctx: CanvasRenderingContext2D,
  state: EmberCascadeState,
  params: EmberCascadeParams
): void {
  const { particles, sources, noise, rng, time } = state;
  
  // Get actual canvas dimensions (accounting for device pixel ratio)
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const bg = hexToRgb(params.bgColor);
  
  // Clear canvas completely if needed (on reset)
  if (state.needsClear) {
    ctx.fillStyle = rgba(bg.r, bg.g, bg.b, 255);
    ctx.fillRect(0, 0, width, height);
    state.needsClear = false;
  }

  // Fade background (alpha 20 out of 255 = ~0.078)
  ctx.fillStyle = rgba(bg.r, bg.g, bg.b, 20);
  ctx.fillRect(0, 0, width, height);

  const hot = hexToRgb(params.hotColor);
  const mid = hexToRgb(params.midColor);
  const cool = hexToRgb(params.coolColor);

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const pt = particles[i];
    pt.age++;

    // Apply noise-based turbulence
    const nx = noise.get(pt.x * 0.006, pt.y * 0.006, time * 0.013);
    const ny = noise.get(pt.x * 0.006 + 500, pt.y * 0.006 + 500, time * 0.013);
    pt.vx += (nx - 0.5) * params.turbulence * 0.22;
    pt.vy += (ny - 0.5) * params.turbulence * 0.09 - 0.04;

    // Apply drag
    pt.vx *= 0.96;
    pt.vy *= 0.97;

    // Update position
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.size *= 0.999;

    // Respawn if dead
    if (pt.age >= pt.maxAge || pt.y < -30 || pt.size < 0.4) {
      const src = sources[Math.floor(rng.random() * sources.length)];
      pt.x = src.x + (rng.random() * 2 - 1) * 28;
      pt.y = src.y + (rng.random() * 2 - 1) * 10;
      pt.vx = (rng.random() * 2 - 1) * 0.5;
      pt.vy = -(rng.random() * 2.2 + 1.6) * params.riseSpeed;
      pt.age = 0;
      pt.maxAge = (rng.random() * 120 + 70) * lerp(1.4, 0.55, (params.riseSpeed - 0.2) / 2.8);
      pt.size = (rng.random() * 5 + 2) * params.glowSize;
      continue;
    }

    // Draw particle with glow
    const t = pt.age / pt.maxAge;
    const col = getColor(t, hot, mid, cool);

    // Outer glow
    ctx.fillStyle = rgba(col.r, col.g, col.b, col.a * 0.22);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Middle ring
    ctx.fillStyle = rgba(col.r, col.g, col.b, col.a * 0.48);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Core
    ctx.fillStyle = rgba(col.r, col.g, col.b, col.a);
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  state.time++;
}

export function resetEmberCascade(
  state: EmberCascadeState,
  params: EmberCascadeParams
): void {
  const newState = initEmberCascade(state.width, state.height, params);
  state.particles = newState.particles;
  state.sources = newState.sources;
  state.noise = newState.noise;
  state.rng = newState.rng;
  state.time = 0;
  
  // Mark that we need to clear the canvas on next draw
  state.needsClear = true;
}

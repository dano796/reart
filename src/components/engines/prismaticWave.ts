/**
 * PrismaticWave engine — framework-agnostic Canvas 2D renderer.
 *
 * Multiple circular wave sources interfere across a pixel grid. The
 * superposition amplitude is mapped to a full spectral hue sweep (red →
 * violet), mimicking light dispersion through a prism. The cursor acts as a
 * diverging lens that warps nearby sample coordinates, bending the spectral
 * bands around it. Clicking plants a new persistent wave source.
 */

import { SeededRandom, lerp } from "../utils/noise";
import type { PrismaticWaveParams } from "../schemas";
import { prismaticWaveDefaults } from "../schemas";

// ── Internal types ──────────────────────────────────────────────────────────

interface WaveSource {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  freq: number;
  phase: number;
  orbitAngle: number;
  orbitR: number;
  orbitSpeed: number;
  amplitude: number;
}

export interface PrismaticWaveState {
  time: number;
  sources: WaveSource[];
  rng: SeededRandom;
  width: number;
  height: number;
}

// ── Color helpers ────────────────────────────────────────────────────────────

/** HSL → RGB, all channels 0–255. l is 0–1, s is 0–1, h is 0–360. */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// ── Engine functions ─────────────────────────────────────────────────────────

export function initPrismaticWave(
  width: number,
  height: number,
  params: PrismaticWaveParams = {}
): PrismaticWaveState {
  const p = { ...prismaticWaveDefaults, ...params };
  const rng = new SeededRandom(p.seed);

  const sources: WaveSource[] = [];
  for (let i = 0; i < p.sources; i++) {
    const x = rng.range(width * 0.1, width * 0.9);
    const y = rng.range(height * 0.1, height * 0.9);
    sources.push({
      x, y,
      baseX: x, baseY: y,
      freq: rng.range(0.5, 1.6),
      phase: rng.range(0, Math.PI * 2),
      orbitAngle: rng.range(0, Math.PI * 2),
      orbitR: rng.range(20, 90),
      orbitSpeed: rng.range(0.003, 0.018) * (rng.bool() ? 1 : -1),
      amplitude: rng.range(0.6, 1.0),
    });
  }

  return { time: 0, sources, rng, width, height };
}

export function drawPrismaticWave(
  ctx: CanvasRenderingContext2D,
  state: PrismaticWaveState,
  params: PrismaticWaveParams = {},
  mouse?: { x: number; y: number }
): void {
  const p = { ...prismaticWaveDefaults, ...params };
  const { sources, width: W, height: H } = state;

  state.time += p.waveSpeed;

  // Drift wave sources along their orbit paths
  for (const s of sources) {
    s.orbitAngle += s.orbitSpeed * p.waveSpeed;
    s.x = s.baseX + Math.cos(s.orbitAngle) * s.orbitR;
    s.y = s.baseY + Math.sin(s.orbitAngle) * s.orbitR;
  }

  const res      = Math.max(3, Math.round(p.resolution));
  const lensR    = 220; // cursor lens radius in canvas pixels
  const lensK    = p.lensStrength * 40; // max pixel displacement

  // We use hue0 + amplitude * dispersion to spread the spectrum
  const hue0     = p.hueOffset;
  const hueSweep = p.dispersion;

  for (let px = 0; px < W; px += res) {
    for (let py = 0; py < H; py += res) {
      // ── Cursor lens distortion ─────────────────────────────────────────
      // Diverging lens: warps sampling coords outward from cursor center.
      let sx = px, sy = py;
      if (mouse) {
        const dx   = px - mouse.x;
        const dy   = py - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0 && dist < lensR) {
          const t    = 1 - dist / lensR;
          const warp = lensK * t * t;          // quadratic falloff
          sx = px + (dx / dist) * warp;
          sy = py + (dy / dist) * warp;
        }
      }

      // ── Wave superposition ─────────────────────────────────────────────
      // Each source contributes a circular wave: sin(r*freq - time + phase)
      // Chromatic dispersion: a slight per-source frequency offset creates
      // the illusion that different "colors" travel at different speeds.
      let val = 0;
      for (const s of sources) {
        const ddx  = sx - s.x;
        const ddy  = sy - s.y;
        const r    = Math.sqrt(ddx * ddx + ddy * ddy);
        const wave = Math.sin(r * p.frequency * s.freq - state.time + s.phase);
        val += wave * s.amplitude;
      }
      val /= sources.length;          // normalize to roughly [-1, 1]

      // ── Spectral color mapping ─────────────────────────────────────────
      // t ∈ [0,1] → hue sweep across the prism spectrum
      const t   = (val + 1) * 0.5;   // [0, 1]
      const hue = hue0 + t * hueSweep;

      // Lightness: dark at extremes, bright at peaks (t ≈ 0.5 is brightest)
      const peakT = 1 - Math.abs(t - 0.5) * 2; // 0 at edges, 1 at center
      const lightness = lerp(0.06, p.brightness, peakT * peakT);

      const [r, g, b] = hslToRgb(hue, p.saturation, lightness);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(px, py, res, res);
    }
  }
}

export function spawnAtClick(
  state: PrismaticWaveState,
  x: number,
  y: number,
  params: PrismaticWaveParams = {}
): void {
  const p = { ...prismaticWaveDefaults, ...params };

  state.sources.push({
    x, y,
    baseX: x, baseY: y,
    freq:        state.rng.range(0.6, 1.4),
    phase:       state.rng.range(0, Math.PI * 2),
    orbitAngle:  state.rng.range(0, Math.PI * 2),
    orbitR:      state.rng.range(10, 60),
    orbitSpeed:  state.rng.range(0.005, 0.02) * (state.rng.bool() ? 1 : -1),
    amplitude:   1.0,
  });

  // Cap at 2× the default source count to prevent unbounded growth
  const max = p.sources * 2;
  if (state.sources.length > max) {
    state.sources.splice(0, state.sources.length - max);
  }
}

export function resetPrismaticWave(
  ctx: CanvasRenderingContext2D,
  state: PrismaticWaveState,
  params: PrismaticWaveParams = {}
): PrismaticWaveState {
  ctx.fillStyle = "rgb(6,6,14)";
  ctx.fillRect(0, 0, state.width, state.height);
  return initPrismaticWave(state.width, state.height, params);
}

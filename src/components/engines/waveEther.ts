/**
 * Wave Ether engine — framework-agnostic Canvas 2D renderer.
 *
 * Sine waves from multiple drifting sources interfere across a pixel grid.
 * Their superpositions produce standing waves, moiré ghosts, and transient
 * constructive peaks — a three-color gradient maps the interference value.
 */

import { SeededRandom, hexToRgb, lerp, rgba } from "../utils/noise";
import type { WaveEtherParams } from "../schemas";
import { waveEtherDefaults } from "../schemas";

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
}

export interface WaveEtherState {
  time: number;
  sources: WaveSource[];
  width: number;
  height: number;
}

export function initWaveEther(
  width: number,
  height: number,
  params: WaveEtherParams = {}
): WaveEtherState {
  const p = { ...waveEtherDefaults, ...params };
  const rng = new SeededRandom(p.seed);

  const sources: WaveSource[] = [];
  for (let i = 0; i < p.sources; i++) {
    const x = rng.range(width * 0.1, width * 0.9);
    const y = rng.range(height * 0.1, height * 0.9);
    sources.push({
      x, y, baseX: x, baseY: y,
      freq: rng.range(0.7, 1.3),
      phase: rng.range(0, Math.PI * 2),
      orbitAngle: rng.range(0, Math.PI * 2),
      orbitR: rng.range(30, 100),
      orbitSpeed: rng.range(0.005, 0.02) * (rng.bool() ? 1 : -1),
    });
  }

  return { time: 0, sources, width, height };
}

export function drawWaveEther(
  ctx: CanvasRenderingContext2D,
  state: WaveEtherState,
  params: WaveEtherParams = {}
): void {
  const p = { ...waveEtherDefaults, ...params };
  const { sources, width: W, height: H } = state;

  state.time += p.waveSpeed;

  // Drift sources
  for (const s of sources) {
    s.orbitAngle += s.orbitSpeed;
    s.x = s.baseX + Math.cos(s.orbitAngle) * s.orbitR;
    s.y = s.baseY + Math.sin(s.orbitAngle) * s.orbitR;
  }

  const res = Math.max(4, Math.round(p.resolution));
  const c1 = hexToRgb(p.colorCrest);
  const c2 = hexToRgb(p.colorTrough);
  const c3 = hexToRgb(p.colorMid);

  for (let x = 0; x < W; x += res) {
    for (let y = 0; y < H; y += res) {
      let val = 0;
      for (const s of sources) {
        const dx = x - s.x, dy = y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        val += Math.sin(dist * p.frequency * s.freq - state.time + s.phase);
      }
      val = (val / sources.length) * p.amplitude;

      // val in [-1, 1] → normalize to [0, 1]
      const t = (val + 1) / 2;

      let r: number, g: number, b: number;
      if (t < 0.5) {
        const tt = t * 2;
        r = lerp(c2.r, c3.r, tt);
        g = lerp(c2.g, c3.g, tt);
        b = lerp(c2.b, c3.b, tt);
      } else {
        const tt = (t - 0.5) * 2;
        r = lerp(c3.r, c1.r, tt);
        g = lerp(c3.g, c1.g, tt);
        b = lerp(c3.b, c1.b, tt);
      }

      ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      ctx.fillRect(x, y, res, res);
    }
  }
}

export function resetWaveEther(
  _ctx: CanvasRenderingContext2D,
  state: WaveEtherState,
  params: WaveEtherParams = {}
): WaveEtherState {
  return initWaveEther(state.width, state.height, params);
}

/**
 * Geo Pulse engine — framework-agnostic Canvas 2D renderer.
 *
 * Nested parametric polygons rotate at prime-ratio angular velocities,
 * their vertices connected by harmonic threads. Layer radii pulse in
 * and out with a sine breath.
 */

import { SeededRandom, hexToRgb, lerp, rgba } from "../utils/noise";
import type { GeoPulseParams } from "../schemas";
import { geoPulseDefaults } from "../schemas";

interface LayerData {
  baseR: number;
  speedMult: number;
  phaseOffset: number;
  colorT: number;
}

interface ConnectionPair {
  l1: number;
  v1: number;
  l2: number;
  v2: number;
}

export interface GeoPulseState {
  time: number;
  layerAngles: number[];
  layerData: LayerData[];
  connectionPairs: ConnectionPair[];
  width: number;
  height: number;
}

export function initGeoPulse(
  width: number,
  height: number,
  params: GeoPulseParams = {}
): GeoPulseState {
  const p = { ...geoPulseDefaults, ...params };
  const rng = new SeededRandom(p.seed);
  const layers = p.layers;
  const sides = Math.round(p.sides);

  const PRIMES = [1, 1.5, 2.3, 3.1, 4.7, 6.1, 8.3, 11.1, 14.3, 17.9, 23.1, 29.3];
  const maxR = Math.min(width, height) * 0.42;

  const layerAngles: number[] = [];
  const layerData: LayerData[] = [];
  for (let i = 0; i < layers; i++) {
    layerAngles.push(rng.range(0, Math.PI * 2));
    layerData.push({
      baseR: lerp(60, maxR, i / (layers - 1)),
      speedMult: PRIMES[i % PRIMES.length] * (i % 2 === 0 ? 1 : -1),
      phaseOffset: rng.range(0, Math.PI * 2),
      colorT: i / (layers - 1),
    });
  }

  const connectionPairs: ConnectionPair[] = [];
  for (let li = 0; li < layers - 1; li++) {
    for (let vi = 0; vi < sides; vi++) {
      if (rng.next() < p.connect) {
        connectionPairs.push({ l1: li, v1: vi, l2: li + 1, v2: rng.floor(0, sides) });
      }
    }
  }

  return { time: 0, layerAngles, layerData, connectionPairs, width, height };
}

export function drawGeoPulse(
  ctx: CanvasRenderingContext2D,
  state: GeoPulseState,
  params: GeoPulseParams = {}
): void {
  const p = { ...geoPulseDefaults, ...params };
  const { layerData, connectionPairs, width: W, height: H } = state;

  state.time += p.rotSpeed;
  const sides = Math.round(p.sides);

  // Fade
  ctx.fillStyle = rgba(10, 10, 18, 30);
  ctx.fillRect(0, 0, W, H);

  const c1 = hexToRgb(p.colorPrimary);
  const c2 = hexToRgb(p.colorSecondary);
  const c3 = hexToRgb(p.colorAccent);
  const cx = W / 2, cy = H / 2;

  // Compute vertex positions
  const allVerts: { x: number; y: number }[][] = [];
  for (let li = 0; li < layerData.length; li++) {
    const ld = layerData[li];
    const angle = state.time * ld.speedMult + ld.phaseOffset;
    const pulseFactor = 1 + Math.sin(state.time * 2.3 + ld.phaseOffset) * p.pulse;
    const r = ld.baseR * pulseFactor;
    const verts: { x: number; y: number }[] = [];
    for (let vi = 0; vi < sides; vi++) {
      const a = angle + (vi / sides) * Math.PI * 2;
      verts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
    allVerts.push(verts);

    // Draw polygon
    const t = ld.colorT;
    let cr: number, cg: number, cb: number;
    if (t < 0.5) {
      cr = lerp(c1.r, c2.r, t * 2);
      cg = lerp(c1.g, c2.g, t * 2);
      cb = lerp(c1.b, c2.b, t * 2);
    } else {
      cr = lerp(c2.r, c3.r, (t - 0.5) * 2);
      cg = lerp(c2.g, c3.g, (t - 0.5) * 2);
      cb = lerp(c2.b, c3.b, (t - 0.5) * 2);
    }

    const alpha = lerp(220, 100, li / (layerData.length - 1));
    ctx.strokeStyle = rgba(cr, cg, cb, alpha);
    ctx.lineWidth = lerp(1.5, 0.5, li / (layerData.length - 1));
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let vi = 1; vi < sides; vi++) ctx.lineTo(verts[vi].x, verts[vi].y);
    ctx.closePath();
    ctx.stroke();
  }

  // Connections
  ctx.lineWidth = 0.5;
  for (const cp of connectionPairs) {
    if (cp.l1 >= allVerts.length || cp.l2 >= allVerts.length) continue;
    const v1 = allVerts[cp.l1][cp.v1 % sides];
    const v2 = allVerts[cp.l2][cp.v2 % sides];
    if (!v1 || !v2) continue;
    const t = cp.l1 / layerData.length;
    ctx.strokeStyle = rgba(lerp(c1.r, c3.r, t), lerp(c1.g, c3.g, t), lerp(c1.b, c3.b, t), 60);
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.stroke();
  }

  // Center glow
  for (let r = 40; r > 0; r -= 4) {
    const alpha = (r / 40) * 15;
    ctx.fillStyle = rgba(c1.r, c1.g, c1.b, alpha);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function resetGeoPulse(
  ctx: CanvasRenderingContext2D,
  state: GeoPulseState,
  params: GeoPulseParams = {}
): GeoPulseState {
  ctx.fillStyle = `rgb(10,10,18)`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initGeoPulse(state.width, state.height, params);
}

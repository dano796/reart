/**
 * Recursive Tunnel engine — concentric nested polygons creating a depth illusion.
 *
 * N polygon "rings" are drawn from outermost to innermost, each scaled by a
 * fraction that advances every frame — simulating the viewer flying through an
 * infinite prismatic corridor. Two recursive forces structure the visual:
 *
 *   1. Zoom: each ring's normalized radius grows by zoomSpeed per frame; when it
 *      crosses 1.0 it wraps back to 0 (a new ring emerges from the vanishing point).
 *
 *   2. Twist: inner rings are rotated more than outer ones by a cumulative
 *      twistPerLayer factor. Combined with the zoom motion this produces a spinning
 *      barrel-scroll that strengthens the sense of recursive depth.
 *
 * The vanishing point smoothly follows the mouse (with lerp), adding binocular
 * parallax: each ring is displaced toward the vanishing point in proportion to
 * how "deep" (inner) it is. Click toggles the twist direction, reversing the
 * spiral rotation for an instantaneous perceptual flip.
 *
 * Color cycles chromatically from inner (hot) to outer (cool), completing a full
 * spectral sweep once per tunnel "cycle".
 */

import { hexToRgb, lerp, rgba } from "../utils/noise";

// ── Params ────────────────────────────────────────────────────────────────────

export interface RecursiveTunnelParams {
  seed?: number;
  /** Number of polygon sides (3–12). */
  sides?: number;
  /** Number of concentric layers drawn. */
  layers?: number;
  /** Zoom speed (fraction of max radius added per frame). */
  zoomSpeed?: number;
  /** Additional rotation per layer (radians). */
  twistPerLayer?: number;
  /** Inner / hot color. */
  colorInner?: string;
  /** Mid-depth color. */
  colorMid?: string;
  /** Outer / cool color. */
  colorOuter?: string;
  /** How much the vanishing point follows the mouse [0–1]. */
  parallaxStrength?: number;
}

export const recursiveTunnelDefaults: Required<RecursiveTunnelParams> = {
  seed: 11293,
  sides: 6,
  layers: 22,
  zoomSpeed: 0.1,
  twistPerLayer: 0.11,
  colorInner: "#ff2d78",
  colorMid: "#2d78ff",
  colorOuter: "#2dffbe",
  parallaxStrength: 0.28,
};

// ── State ─────────────────────────────────────────────────────────────────────

export interface RecursiveTunnelState {
  /** Phase in [0,1) that drives the zoom animation. */
  phase: number;
  /** Current (smoothed) vanishing point. */
  vanishX: number;
  vanishY: number;
  /** Mouse-driven target for the vanishing point. */
  targetVX: number;
  targetVY: number;
  /** +1 or −1, toggled on click. */
  twistSign: number;
  time: number;
  width: number;
  height: number;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initRecursiveTunnel(
  width: number,
  height: number,
  _params: RecursiveTunnelParams = {}
): RecursiveTunnelState {
  return {
    phase: 0,
    vanishX: width  / 2,
    vanishY: height / 2,
    targetVX: width  / 2,
    targetVY: height / 2,
    twistSign: 1,
    time: 0,
    width,
    height,
  };
}

export function toggleTwist(state: RecursiveTunnelState): void {
  state.twistSign *= -1;
}

export function setVanishTarget(
  state: RecursiveTunnelState,
  x: number,
  y: number
): void {
  state.targetVX = x;
  state.targetVY = y;
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  sides: number,
  angleOffset: number
): void {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const a = angleOffset + (i / sides) * Math.PI * 2;
    const x = cx + Math.cos(a) * radius;
    const y = cy + Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

export function drawRecursiveTunnel(
  ctx: CanvasRenderingContext2D,
  state: RecursiveTunnelState,
  params: RecursiveTunnelParams = {},
  mouse?: { x: number; y: number }
): void {
  const p = { ...recursiveTunnelDefaults, ...params };
  const { width: W, height: H } = state;

  // Track mouse → vanishing point
  if (mouse) {
    state.targetVX = lerp(W / 2, mouse.x, p.parallaxStrength);
    state.targetVY = lerp(H / 2, mouse.y, p.parallaxStrength);
  }
  state.vanishX += (state.targetVX - state.vanishX) * 0.05;
  state.vanishY += (state.targetVY - state.vanishY) * 0.05;

  state.time  += 0.016;
  state.phase  = (state.phase + 0.016 * p.zoomSpeed) % 1;

  // Dark background
  ctx.fillStyle = "rgb(4,4,12)";
  ctx.fillRect(0, 0, W, H);

  const maxR    = Math.max(W, H) * 0.78;
  const cx      = W / 2;
  const cy      = H / 2;
  const sides   = Math.max(3, Math.round(p.sides));
  const cInner  = hexToRgb(p.colorInner);
  const cMid    = hexToRgb(p.colorMid);
  const cOuter  = hexToRgb(p.colorOuter);

  // Draw layers from outermost inward (painter's algorithm)
  for (let li = p.layers - 1; li >= 0; li--) {
    // Normalized depth [0,1]: 0 = center, 1 = edge
    const t      = ((li / p.layers) + state.phase) % 1;
    const radius = t * maxR;
    if (radius < 1.5) continue;

    // Parallax: inner rings offset more toward the vanishing point
    const depth   = 1 - t; // deeper = higher value
    const pcx     = cx + (state.vanishX - cx) * depth * 0.9;
    const pcy     = cy + (state.vanishY - cy) * depth * 0.9;

    // Twist accumulates inward
    const twist      = (1 - t) * p.twistPerLayer * p.layers * state.twistSign;
    const angleOffset = twist + state.time * 0.06 * state.twistSign;

    // Chromatic color mapping: inner=hot, outer=cool
    let r: number, g: number, b: number;
    if (t < 0.5) {
      r = lerp(cInner.r, cMid.r, t * 2);
      g = lerp(cInner.g, cMid.g, t * 2);
      b = lerp(cInner.b, cMid.b, t * 2);
    } else {
      r = lerp(cMid.r, cOuter.r, (t - 0.5) * 2);
      g = lerp(cMid.g, cOuter.g, (t - 0.5) * 2);
      b = lerp(cMid.b, cOuter.b, (t - 0.5) * 2);
    }

    const alpha     = Math.floor(lerp(220, 55, t));
    const lineWidth = lerp(2.2, 0.4, t);

    drawPolygon(ctx, pcx, pcy, radius, sides, angleOffset);
    ctx.strokeStyle = rgba(Math.round(r), Math.round(g), Math.round(b), alpha);
    ctx.lineWidth   = lineWidth;
    ctx.stroke();

    // Very faint glow fill on innermost rings
    if (t < 0.12) {
      const fillA = Math.floor((0.12 - t) / 0.12 * 18);
      ctx.fillStyle = rgba(Math.round(r), Math.round(g), Math.round(b), fillA);
      ctx.fill();
    }
  }

  // Depth-ray lines: connect vanishing point to outermost polygon's vertices
  const outerT     = state.phase % 1;
  const outerR     = outerT * maxR;
  const outerAngle = (1 - outerT) * p.twistPerLayer * p.layers * state.twistSign + state.time * 0.06 * state.twistSign;

  ctx.globalAlpha  = 0.045;
  ctx.strokeStyle  = `rgb(${cOuter.r},${cOuter.g},${cOuter.b})`;
  ctx.lineWidth    = 0.5;
  for (let si = 0; si < sides; si++) {
    const a = outerAngle + (si / sides) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(state.vanishX, state.vanishY);
    ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
    ctx.stroke();
  }
  ctx.globalAlpha  = 1;

}

export function resetRecursiveTunnel(
  ctx: CanvasRenderingContext2D,
  state: RecursiveTunnelState,
  params: RecursiveTunnelParams = {}
): RecursiveTunnelState {
  ctx.fillStyle = "rgb(4,4,12)";
  ctx.fillRect(0, 0, state.width, state.height);
  return initRecursiveTunnel(state.width, state.height, params);
}

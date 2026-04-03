/**
 * Hex Ripple engine — hexagonal tessellation with multi-source wave superposition.
 *
 * A pointy-top hexagonal grid covers the canvas. Each cell's luminance is the
 * linear superposition of damped sinusoidal waves emitted by a set of source
 * points. The interference of multiple sources creates standing-wave nodes,
 * chromatic moiré bands, and ripple fronts that travel across the grid.
 *
 * Wave equation per cell: Σ sin(dist_i · freq − phase_i) · e^(−damping · dist_i)
 * The result is remapped to [0,1] and trilinearly mapped to three user-controlled
 * colors (trough → mid → crest). Mouse hover highlights the cell under the cursor.
 * Click plants a new wave source at the clicked cell center (oldest evicted when
 * the source cap is reached).
 */

import { SeededRandom, hexToRgb, lerp, clamp } from "../utils/noise";

// ── Params ────────────────────────────────────────────────────────────────────

export interface HexRippleParams {
  seed?: number;
  /** Hex cell circumradius in pixels. */
  cellSize?: number;
  /** Wave animation speed multiplier. */
  waveSpeed?: number;
  /** Spatial frequency of each wave (smaller = wider rings). */
  frequency?: number;
  /** Exponential decay rate with distance (higher = shorter reach). */
  damping?: number;
  /** Max simultaneous wave sources. */
  maxSources?: number;
  /** Background / trough color. */
  colorTrough?: string;
  /** Mid-wave color. */
  colorMid?: string;
  /** Crest / highlight color. */
  colorCrest?: string;
}

export const hexRippleDefaults: Required<HexRippleParams> = {
  seed: 51289,
  cellSize: 22,
  waveSpeed: 1.0,
  frequency: 0.038,
  damping: 0.0006,
  maxSources: 6,
  colorTrough: "#080820",
  colorMid: "#1a6fff",
  colorCrest: "#00ffcc",
};

// ── Internal types ─────────────────────────────────────────────────────────────

interface WaveSource {
  x: number;
  y: number;
  /** Running phase (increases every frame). */
  phase: number;
}

interface HexCell {
  x: number; // pixel center x
  y: number; // pixel center y
}

export interface HexRippleState {
  cells: HexCell[];
  sources: WaveSource[];
  time: number;
  cellSize: number;
  width: number;
  height: number;
}

// ── Hex grid construction ─────────────────────────────────────────────────────

function buildHexGrid(W: number, H: number, size: number): HexCell[] {
  const cells: HexCell[] = [];
  // Pointy-top layout: horizontal spacing = size*√3, vertical = size*1.5
  const colW = size * Math.sqrt(3);
  const rowH = size * 1.5;
  const cols = Math.ceil(W / colW) + 2;
  const rows = Math.ceil(H / rowH) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const offsetX = (row % 2 !== 0 ? colW / 2 : 0);
      cells.push({
        x: col * colW + offsetX,
        y: row * rowH,
      });
    }
  }
  return cells;
}

function drawHexPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
): void {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6; // pointy-top offset
    const x = cx + Math.cos(a) * size;
    const y = cy + Math.sin(a) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initHexRipple(
  width: number,
  height: number,
  params: HexRippleParams = {}
): HexRippleState {
  const p = { ...hexRippleDefaults, ...params };
  const rng = new SeededRandom(p.seed);

  // Seed with two phase-offset sources for immediate visual interest
  const sources: WaveSource[] = [
    { x: width  * rng.range(0.25, 0.45), y: height * rng.range(0.3, 0.5), phase: 0 },
    { x: width  * rng.range(0.55, 0.75), y: height * rng.range(0.5, 0.7), phase: Math.PI },
  ];
  const cells = buildHexGrid(width, height, p.cellSize);
  return { cells, sources, time: 0, cellSize: p.cellSize, width, height };
}

export function addSource(
  state: HexRippleState,
  x: number,
  y: number,
  params: HexRippleParams = {}
): void {
  const p = { ...hexRippleDefaults, ...params };
  state.sources.push({ x, y, phase: state.time });
  if (state.sources.length > p.maxSources) state.sources.shift();
}

export function drawHexRipple(
  ctx: CanvasRenderingContext2D,
  state: HexRippleState,
  params: HexRippleParams = {},
  mouse?: { x: number; y: number }
): void {
  const p = { ...hexRippleDefaults, ...params };
  const { width: W, height: H, cells, sources, cellSize } = state;

  state.time += 0.016 * p.waveSpeed;

  // Advance source phases
  for (const src of sources) {
    src.phase += 0.016 * p.waveSpeed * 2.8;
  }

  const cTrough = hexToRgb(p.colorTrough);
  const cMid    = hexToRgb(p.colorMid);
  const cCrest  = hexToRgb(p.colorCrest);

  // Fill background
  ctx.fillStyle = `rgb(${cTrough.r},${cTrough.g},${cTrough.b})`;
  ctx.fillRect(0, 0, W, H);

  const pad = cellSize * 2;

  // Find hovered cell for highlight
  let hoveredCell: HexCell | null = null;
  if (mouse) {
    let best = Infinity;
    for (const cell of cells) {
      const d = Math.hypot(cell.x - mouse.x, cell.y - mouse.y);
      if (d < best) { best = d; hoveredCell = cell; }
    }
    if (best > cellSize * 1.5) hoveredCell = null;
  }

  for (const cell of cells) {
    if (cell.x < -pad || cell.x > W + pad) continue;
    if (cell.y < -pad || cell.y > H + pad) continue;

    // Superpose wave contributions
    let val = 0;
    for (const src of sources) {
      const dx   = cell.x - src.x;
      const dy   = cell.y - src.y;
      const dist = Math.hypot(dx, dy);
      val += Math.sin(dist * p.frequency - src.phase) * Math.exp(-p.damping * dist);
    }
    val /= sources.length;
    const t = clamp((val + 1) / 2, 0, 1); // normalize to [0,1]

    // Trilinear color mapping
    let r: number, g: number, b: number;
    if (t < 0.5) {
      r = lerp(cTrough.r, cMid.r, t * 2);
      g = lerp(cTrough.g, cMid.g, t * 2);
      b = lerp(cTrough.b, cMid.b, t * 2);
    } else {
      r = lerp(cMid.r, cCrest.r, (t - 0.5) * 2);
      g = lerp(cMid.g, cCrest.g, (t - 0.5) * 2);
      b = lerp(cMid.b, cCrest.b, (t - 0.5) * 2);
    }

    const isHovered = hoveredCell === cell;
    const drawSize  = cellSize * (isHovered ? 0.96 : 0.90);

    drawHexPath(ctx, cell.x, cell.y, drawSize);
    ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    ctx.fill();

    // Bright edge on crest cells
    if (t > 0.7) {
      ctx.strokeStyle = `rgba(${cCrest.r},${cCrest.g},${cCrest.b},${(t - 0.7) * 1.8})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Hover ring
    if (isHovered) {
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }
  }

}

export function resetHexRipple(
  ctx: CanvasRenderingContext2D,
  state: HexRippleState,
  params: HexRippleParams = {}
): HexRippleState {
  ctx.fillStyle = "rgb(8,8,32)";
  ctx.fillRect(0, 0, state.width, state.height);
  return initHexRipple(state.width, state.height, params);
}

/**
 * Fibonacci Vortex engine — golden spiral arms animated as particle streams.
 *
 * The mathematical heart is the golden spiral: r = k · φ^(θ / (π/2)), where
 * each quarter-turn multiplies the radius by φ ≈ 1.618. Particles are
 * distributed across N spiral arms (N taken from the Fibonacci sequence:
 * 3, 5, 8, 13) and travel outward along their respective arms, wrapping
 * back to the center when they reach maxRadius. The arms themselves rotate
 * slowly — inner particles faster than outer ones, echoing phyllotaxis math
 * without repeating the sunflower dot pattern.
 *
 * Multiple "bloom" origins can coexist; each owns its own particle cluster.
 * Click to plant new blooms (oldest drops when the cap is reached). Mouse
 * proximity locally bends particle paths through a gravitational softening
 * function, creating fluid distortions without breaking the spiral form.
 */

import { SeededRandom, hexToRgb, lerp, rgba } from "../utils/noise";

/** b in r = k·e^(b·θ) — one quarter-turn (π/2) grows radius by φ */
const PHI = 1.6180339887;
const SPIRAL_B = Math.log(PHI) / (Math.PI / 2);

/** Fibonacci arm counts available for selection */
const FIB_ARM_COUNTS = [3, 5, 8, 13];

// ── Params ────────────────────────────────────────────────────────────────────

export interface FibonacciVortexParams {
  seed?: number;
  /** Number of spiral arms per bloom (snapped to nearest Fibonacci number). */
  numArms?: number;
  /** Particles per arm. */
  particlesPerArm?: number;
  /** Global animation speed multiplier. */
  speed?: number;
  /** Mouse gravitational pull strength [0–1]. */
  mouseStrength?: number;
  /** Maximum simultaneous bloom centers. */
  maxBlooms?: number;
  /** Trail fade opacity per frame (lower = longer trails). */
  trailOpacity?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
}

export const fibonacciVortexDefaults: Required<FibonacciVortexParams> = {
  seed: 33771,
  numArms: 8,
  particlesPerArm: 90,
  speed: 1.0,
  mouseStrength: 0.14,
  maxBlooms: 4,
  trailOpacity: 20,
  colorPrimary: "#f5c842",
  colorSecondary: "#e05a20",
  colorAccent: "#8c42f5",
};

// ── Internal types ─────────────────────────────────────────────────────────────

interface SpiralParticle {
  /** Current θ value along the golden spiral — increases → particle moves outward. */
  phase: number;
  /** Arm index [0, numArms). Each arm adds (arm/numArms)·2π to the angle. */
  arm: number;
}

interface BloomCenter {
  x: number;
  y: number;
  particles: SpiralParticle[];
  /** Overall rotation offset, grows slowly each frame. */
  rotation: number;
  /** Fade-in [0→1]. */
  age: number;
  maxR: number;
  minR: number;
  numArms: number;
}

export interface FibonacciVortexState {
  blooms: BloomCenter[];
  time: number;
  width: number;
  height: number;
  rng: SeededRandom;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function snapToFibArms(n: number): number {
  return FIB_ARM_COUNTS.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
}

function createBloom(
  x: number,
  y: number,
  p: Required<FibonacciVortexParams>,
  rng: SeededRandom,
  W: number,
  H: number
): BloomCenter {
  const maxR = Math.min(W, H) * 0.46;
  const minR = 5;
  const numArms = snapToFibArms(p.numArms);
  const phaseMax = Math.log(maxR / minR) / SPIRAL_B;

  const particles: SpiralParticle[] = [];
  for (let arm = 0; arm < numArms; arm++) {
    for (let j = 0; j < p.particlesPerArm; j++) {
      particles.push({ phase: rng.range(0, phaseMax), arm });
    }
  }
  return {
    x, y, particles,
    rotation: rng.range(0, Math.PI * 2),
    age: 0, maxR, minR, numArms,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function initFibonacciVortex(
  width: number,
  height: number,
  params: FibonacciVortexParams = {}
): FibonacciVortexState {
  const p = { ...fibonacciVortexDefaults, ...params };
  const rng = new SeededRandom(p.seed);
  const bloom = createBloom(width / 2, height / 2, p, rng, width, height);
  bloom.age = 1; // center bloom starts fully visible
  return { blooms: [bloom], time: 0, width, height, rng };
}

export function addBloom(
  state: FibonacciVortexState,
  x: number,
  y: number,
  params: FibonacciVortexParams = {}
): void {
  const p = { ...fibonacciVortexDefaults, ...params };
  state.blooms.push(createBloom(x, y, p, state.rng, state.width, state.height));
  if (state.blooms.length > p.maxBlooms) state.blooms.shift();
}

export function drawFibonacciVortex(
  ctx: CanvasRenderingContext2D,
  state: FibonacciVortexState,
  params: FibonacciVortexParams = {},
  mouse?: { x: number; y: number }
): void {
  const p = { ...fibonacciVortexDefaults, ...params };
  const { width: W, height: H } = state;
  const dt = 0.016 * p.speed;

  state.time += dt;

  // Trail fade
  ctx.fillStyle = rgba(6, 4, 16, p.trailOpacity);
  ctx.fillRect(0, 0, W, H);

  const c1 = hexToRgb(p.colorPrimary);
  const c2 = hexToRgb(p.colorSecondary);
  const c3 = hexToRgb(p.colorAccent);
  const scale = W / 800;

  ctx.globalCompositeOperation = "screen";

  for (const bloom of state.blooms) {
    bloom.age = Math.min(bloom.age + 0.022, 1.0);
    bloom.rotation += dt * 0.13;

    const phaseMax = Math.log(bloom.maxR / bloom.minR) / SPIRAL_B;

    for (const pt of bloom.particles) {
      // Particles accelerate slightly as they spiral outward
      const tNorm = pt.phase / phaseMax;
      pt.phase += dt * (0.6 + 0.6 * tNorm);
      if (pt.phase > phaseMax) pt.phase -= phaseMax;

      const r = bloom.minR * Math.exp(SPIRAL_B * pt.phase);
      const armOffset = (pt.arm / bloom.numArms) * Math.PI * 2;
      const angle = bloom.rotation + armOffset + pt.phase;

      let px = bloom.x + Math.cos(angle) * r;
      let py = bloom.y + Math.sin(angle) * r;

      // Mouse gravitational pull
      if (mouse) {
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          const pull = p.mouseStrength * (1 - dist / 160);
          px += dx * pull;
          py += dy * pull;
        }
      }

      // Color: primary (inner) → secondary → accent (outer)
      let cr: number, cg: number, cb: number;
      if (tNorm < 0.5) {
        cr = lerp(c1.r, c2.r, tNorm * 2);
        cg = lerp(c1.g, c2.g, tNorm * 2);
        cb = lerp(c1.b, c2.b, tNorm * 2);
      } else {
        cr = lerp(c2.r, c3.r, (tNorm - 0.5) * 2);
        cg = lerp(c2.g, c3.g, (tNorm - 0.5) * 2);
        cb = lerp(c2.b, c3.b, (tNorm - 0.5) * 2);
      }

      const alpha = Math.floor(bloom.age * lerp(230, 70, tNorm));
      const dotR = Math.max(lerp(2.4, 0.7, tNorm) * scale, 0.5);

      ctx.beginPath();
      ctx.arc(px, py, dotR, 0, Math.PI * 2);
      ctx.fillStyle = rgba(cr, cg, cb, alpha);
      ctx.fill();
    }

    // Center glow
    const glow = ctx.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, 22 * scale);
    glow.addColorStop(0, rgba(c1.r, c1.g, c1.b, Math.floor(bloom.age * 130)));
    glow.addColorStop(1, rgba(c1.r, c1.g, c1.b, 0));
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bloom.x, bloom.y, 22 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function resetFibonacciVortex(
  ctx: CanvasRenderingContext2D,
  state: FibonacciVortexState,
  params: FibonacciVortexParams = {}
): FibonacciVortexState {
  ctx.fillStyle = "rgb(6,4,16)";
  ctx.fillRect(0, 0, state.width, state.height);
  return initFibonacciVortex(state.width, state.height, params);
}

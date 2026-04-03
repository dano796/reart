/**
 * PhotonBurst engine — framework-agnostic Canvas 2D renderer.
 *
 * Photons drift through a cosmic void following slow Perlin noise currents,
 * glowing with an aurora-like spectral palette. The cursor acts as a
 * gravitational body that bends nearby photon paths. Clicking anywhere
 * detonates a radial burst of photons — each assigned a hue based on its
 * emission angle so the explosion blooms as a full spectral rainbow.
 *
 * All photons — ambient and burst-spawned — share the same interface,
 * physics, and lifecycle. No special cases.
 */

import { PerlinNoise, SeededRandom, clamp, rgba } from "../utils/noise";
import type { PhotonBurstParams } from "../schemas";
import { photonBurstDefaults } from "../schemas";

// ── Internal types ──────────────────────────────────────────────────────────

interface Photon {
  x:       number;
  y:       number;
  prevX:   number;
  prevY:   number;
  vx:      number;
  vy:      number;
  hue:     number;   // 0–360
  age:     number;
  maxLife: number;
  size:    number;
}

export interface PhotonBurstState {
  photons:  Photon[];
  noise:    PerlinNoise;
  rng:      SeededRandom;
  z:        number;    // noise z-slice, advances each frame
  width:    number;
  height:   number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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

/** Wrap a coordinate back into [0, size] with a soft margin. */
function wrapCoord(v: number, size: number): number {
  if (v < -20)      return size + 10;
  if (v > size + 20) return -10;
  return v;
}

function spawnAmbientPhoton(rng: SeededRandom, w: number, h: number): Photon {
  return {
    x:       rng.range(0, w),
    y:       rng.range(0, h),
    prevX:   0, prevY: 0,   // set after creation
    vx:      rng.range(-0.3, 0.3),
    vy:      rng.range(-0.3, 0.3),
    hue:     rng.range(160, 480) % 360,   // cool blues / teals / purples by default
    age:     rng.range(0, 200),           // stagger ages so not all die at once
    maxLife: rng.range(300, 700),
    size:    rng.range(1.0, 2.5),
  };
}

// ── Engine functions ─────────────────────────────────────────────────────────

export function initPhotonBurst(
  width: number,
  height: number,
  params: PhotonBurstParams = {}
): PhotonBurstState {
  const p   = { ...photonBurstDefaults, ...params };
  const rng = new SeededRandom(p.seed);
  const noise = new PerlinNoise(p.seed);

  const photons: Photon[] = [];
  for (let i = 0; i < p.count; i++) {
    const ph = spawnAmbientPhoton(rng, width, height);
    ph.prevX = ph.x;
    ph.prevY = ph.y;
    photons.push(ph);
  }

  return { photons, noise, rng, z: 0, width, height };
}

export function drawPhotonBurst(
  ctx: CanvasRenderingContext2D,
  state: PhotonBurstState,
  params: PhotonBurstParams = {},
  mouse?: { x: number; y: number }
): void {
  const p = { ...photonBurstDefaults, ...params };
  const { photons, noise, width: W, height: H } = state;

  // Fade layer — creates the glowing trail effect
  ctx.fillStyle = rgba(6, 6, 16, p.trailOpacity);
  ctx.fillRect(0, 0, W, H);

  state.z += 0.0003 * p.speed;

  // Additive blending — photons glow and stack like real light
  ctx.globalCompositeOperation = "screen";

  const noiseScale = p.noiseScale;
  const accelMax   = 0.08 * p.speed;
  const maxSpeed   = 2.8  * p.speed;
  const gravR      = 160;   // cursor influence radius
  const gravStr    = p.cursorGravity;

  for (let i = photons.length - 1; i >= 0; i--) {
    const ph = photons[i];
    ph.age++;

    // ── Respawn if expired ───────────────────────────────────────────────
    if (ph.age > ph.maxLife) {
      const fresh  = spawnAmbientPhoton(state.rng, W, H);
      fresh.prevX  = fresh.x;
      fresh.prevY  = fresh.y;
      photons[i]   = fresh;
      continue;
    }

    // ── Noise-driven acceleration ────────────────────────────────────────
    const angle = noise.get(ph.x * noiseScale, ph.y * noiseScale, state.z) * Math.PI * 4;
    ph.vx += Math.cos(angle) * accelMax;
    ph.vy += Math.sin(angle) * accelMax;

    // ── Cursor gravitational pull ─────────────────────────────────────────
    if (mouse) {
      const dx   = mouse.x - ph.x;
      const dy   = mouse.y - ph.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < gravR) {
        const strength = gravStr * (1 - dist / gravR) * (1 - dist / gravR);
        ph.vx += (dx / dist) * strength;
        ph.vy += (dy / dist) * strength;
      }
    }

    // ── Speed cap + drag ──────────────────────────────────────────────────
    const speed = Math.hypot(ph.vx, ph.vy);
    if (speed > maxSpeed) {
      ph.vx = (ph.vx / speed) * maxSpeed;
      ph.vy = (ph.vy / speed) * maxSpeed;
    }
    ph.vx *= 0.97;
    ph.vy *= 0.97;

    // ── Advance position ──────────────────────────────────────────────────
    ph.prevX = ph.x;
    ph.prevY = ph.y;
    ph.x    += ph.vx;
    ph.y    += ph.vy;

    // Wrap at canvas edges
    ph.x = wrapCoord(ph.x, W);
    ph.y = wrapCoord(ph.y, H);
    if (ph.x !== ph.prevX + ph.vx || ph.y !== ph.prevY + ph.vy) {
      ph.prevX = ph.x;  // prevent cross-edge streak
      ph.prevY = ph.y;
    }

    // ── Fade with age ─────────────────────────────────────────────────────
    const lifeT  = ph.age / ph.maxLife;
    const fadeIn = clamp(ph.age / 30, 0, 1);         // fade in over 30 frames
    const alpha  = fadeIn * (1 - lifeT * lifeT);     // peaks early, decays

    const [r, g, b] = hslToRgb(ph.hue, 0.85, 0.55 + alpha * 0.2);

    // ── Draw glowing streak ───────────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(ph.prevX, ph.prevY);
    ctx.lineTo(ph.x, ph.y);
    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
    ctx.lineWidth   = ph.size * (0.5 + alpha * 0.8);
    ctx.stroke();

    // Bright core dot
    ctx.beginPath();
    ctx.arc(ph.x, ph.y, ph.size * 0.6 * alpha, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.min(r + 80, 255)},${Math.min(g + 80, 255)},${Math.min(b + 80, 255)},${(alpha * 0.9).toFixed(3)})`;
    ctx.fill();
  }

  ctx.globalCompositeOperation = "source-over";
}

export function spawnAtClick(
  state: PhotonBurstState,
  x: number,
  y: number,
  params: PhotonBurstParams = {}
): void {
  const p          = { ...photonBurstDefaults, ...params };
  const burstCount = p.burstSize;

  for (let i = 0; i < burstCount; i++) {
    const angle  = (i / burstCount) * Math.PI * 2;
    const speed  = 1.8 + state.rng.range(0, 2.0);
    // Hue = emission angle mapped to full spectrum (0° → red, 360° → back to red)
    const hue    = (angle / (Math.PI * 2)) * 360;
    const life   = 180 + state.rng.range(0, 120);

    state.photons.push({
      x,    y,
      prevX: x, prevY: y,
      vx:   Math.cos(angle) * speed,
      vy:   Math.sin(angle) * speed,
      hue,
      age:     0,
      maxLife: life,
      size:    state.rng.range(1.5, 3.0),
    });
  }

  // Cap at ambient count + 4 bursts to prevent unbounded growth
  const max = p.count + burstCount * 4;
  if (state.photons.length > max) {
    state.photons.splice(0, state.photons.length - max);
  }
}

export function resetPhotonBurst(
  ctx: CanvasRenderingContext2D,
  state: PhotonBurstState,
  params: PhotonBurstParams = {}
): PhotonBurstState {
  ctx.fillStyle = "rgb(6,6,16)";
  ctx.fillRect(0, 0, state.width, state.height);
  return initPhotonBurst(state.width, state.height, params);
}

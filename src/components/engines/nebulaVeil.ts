/**
 * NebulaVeil engine — OGL (WebGL wrapper) background.
 *
 * Renders three superimposed simplex noise planes at different frequencies
 * that interfere to produce a volumetric, cloud-like nebula curtain.
 * Unlike a single aurora sweep, NebulaVeil uses a radial gradient mapped
 * through the interference pattern — the center of mass of the three noise
 * planes determines luminosity, creating depth through layering rather than
 * a horizontal band.
 *
 * Architecture: OGL Renderer + Program + Mesh (Triangle geometry).
 * The Renderer is created inside init and stored in state. The React wrapper
 * receives a container HTMLElement; OGL appends its canvas to it.
 * No context is passed to draw/reset — the renderer is self-contained in state.
 */

import { Renderer, Program, Mesh, Triangle } from "ogl";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToArr(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// ─── GLSL Sources ─────────────────────────────────────────────────────────────

// OGL does NOT prepend "#version 300 es" — it compiles shader source as-is.
// Use GLSL ES 1.00 syntax: "attribute" for vertex input, "gl_FragColor" for output.
// GLSL ES 1.00 is backward-compatible with WebGL2 contexts.
const VERT = /* glsl */ `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Three-layer simplex-like value noise nebula shader.
// Algorithm:
//   Layer A — low frequency noise → large luminous cloud structures
//   Layer B — medium frequency, phase-shifted in time → mid-scale wisps
//   Layer C — high frequency, opposing phase → fine nebula texture
//   Interference: sum the three layers, apply radial gradient for depth.
//   Color: map the summed intensity through a three-stop palette.
const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform float uAmplitude;
uniform float uDensity;
uniform float uBlend;

// ---- Value noise ----
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0,0)), hash(i + vec2(1,0)), u.x),
    mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
    u.y
  );
}

// Two-octave fBm
float fbm(vec2 p) {
  return noise(p) * 0.6 + noise(p * 2.1 + vec2(5.2, 1.3)) * 0.3 + noise(p * 4.3 + vec2(2.7, 8.1)) * 0.1;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  // Center-origin, aspect-corrected
  vec2 centered = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  float d = uDensity;

  // Layer A — large structures, slow drift
  float layerA = fbm(centered * d + vec2(uTime * 0.07, uTime * 0.04));

  // Layer B — medium wisps, different axis
  float layerB = fbm(centered * d * 1.8 + vec2(-uTime * 0.05 + 3.1, uTime * 0.09 + 7.3));

  // Layer C — fine texture, opposing motion
  float layerC = fbm(centered * d * 3.2 + vec2(uTime * 0.03 + 9.7, -uTime * 0.06 + 4.1));

  // Interference sum — weighted blend controlled by uBlend
  float nebula = layerA * (1.0 - uBlend * 0.4)
               + layerB * uBlend * 0.3
               + layerC * (1.0 - uBlend) * 0.2;

  nebula = clamp(nebula * uAmplitude, 0.0, 1.0);

  // Radial vignette — attenuates at edges for depth illusion
  float r = length(centered);
  float vignette = 1.0 - smoothstep(0.35, 0.9, r);
  nebula *= vignette;

  // Three-stop color gradient through intensity
  vec3 col;
  if (nebula < 0.5) {
    col = mix(uColorA, uColorB, nebula * 2.0);
  } else {
    col = mix(uColorB, uColorC, (nebula - 0.5) * 2.0);
  }

  // Dark background with nebula on top
  vec3 bg = vec3(0.02, 0.02, 0.05);
  col = mix(bg, col, nebula);

  gl_FragColor = vec4(col, 1.0);
}
`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NebulaVeilParams {
  colorA?: string;
  colorB?: string;
  colorC?: string;
  speed?: number;
  amplitude?: number;
  density?: number;
  blend?: number;
}

export interface NebulaVeilState {
  renderer: Renderer;
  mesh: Mesh;
  program: Program;
  time: number;
  width: number;
  height: number;
}

export const nebulaVeilDefaults: Required<NebulaVeilParams> = {
  colorA: "#0a0a2e",
  colorB: "#7b2fbe",
  colorC: "#00d4ff",
  speed: 1.0,
  amplitude: 2.0,
  density: 2.2,
  blend: 0.6,
};

// ─── Engine functions ─────────────────────────────────────────────────────────

export function initNebulaVeil(
  container: HTMLElement,
  width: number,
  height: number,
  params: NebulaVeilParams = {}
): NebulaVeilState {
  const p = { ...nebulaVeilDefaults, ...params };

  const renderer = new Renderer({ alpha: false, antialias: false });
  const gl = renderer.gl;
  renderer.setSize(width, height);
  container.appendChild(gl.canvas);

  const geometry = new Triangle(gl);

  const caArr = hexToArr(p.colorA);
  const cbArr = hexToArr(p.colorB);
  const ccArr = hexToArr(p.colorC);

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime:       { value: 0 },
      uResolution: { value: [width, height] },
      uColorA:     { value: caArr },
      uColorB:     { value: cbArr },
      uColorC:     { value: ccArr },
      uAmplitude:  { value: p.amplitude },
      uDensity:    { value: p.density },
      uBlend:      { value: p.blend },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  return { renderer, mesh, program, time: 0, width, height };
}

export function drawNebulaVeil(
  state: NebulaVeilState,
  params: NebulaVeilParams = {}
): void {
  const p = { ...nebulaVeilDefaults, ...params };

  state.time += 0.016 * p.speed;

  state.program.uniforms.uTime.value = state.time;
  state.program.uniforms.uAmplitude.value = p.amplitude;
  state.program.uniforms.uDensity.value = p.density;
  state.program.uniforms.uBlend.value = p.blend;
  state.program.uniforms.uColorA.value = hexToArr(p.colorA);
  state.program.uniforms.uColorB.value = hexToArr(p.colorB);
  state.program.uniforms.uColorC.value = hexToArr(p.colorC);

  state.renderer.render({ scene: state.mesh });
}

export function resetNebulaVeil(
  state: NebulaVeilState,
  params: NebulaVeilParams = {}
): NebulaVeilState {
  const container = state.renderer.gl.canvas.parentElement!;
  // Release GPU context and remove the canvas OGL appended
  state.renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
  if (state.renderer.gl.canvas.parentNode === container) {
    container.removeChild(state.renderer.gl.canvas);
  }
  return initNebulaVeil(container, state.width, state.height, params);
}

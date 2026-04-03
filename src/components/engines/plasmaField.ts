/**
 * PlasmaField engine — WebGL2 fragment shader background.
 *
 * Renders domain-warped fractional Brownian motion (fBm) at true pixel
 * resolution via a fullscreen triangle. Three color stops are blended
 * through the noise field and modulated over time, producing luminous
 * plasma-like shifting gradients impossible to achieve at quality in Canvas 2D.
 *
 * Architecture: pure WebGL2 — no external dependencies. The React wrapper
 * acquires the context and passes it to init/draw/reset. Engine holds
 * compiled shader program, cached uniform locations, and a VAO.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`PlasmaField shader compile error: ${info}`);
  }
  return shader;
}

function compileProgram(
  gl: WebGL2RenderingContext,
  vert: string,
  frag: string
): WebGLProgram {
  const program = gl.createProgram()!;
  const vs = compileShader(gl, gl.VERTEX_SHADER, vert);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, frag);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`PlasmaField program link error: ${info}`);
  }
  return program;
}

// ─── GLSL Sources ─────────────────────────────────────────────────────────────

const VERT = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Domain-warped fBm plasma shader.
// Algorithm:
//   1. Compute a base noise field n1 using 3D value noise (seeded by uSeed).
//   2. Use n1 to warp the UV coordinates (domain warp), then compute n2.
//   3. Mix colorA, colorB, colorC through the warped field.
//   4. Animate by evolving the z-slice of the noise over uTime.
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;
uniform float uScale;
uniform float uContrast;
uniform float uSeed;

out vec4 fragColor;

// ---- Permutation hash (no textures needed) ----
vec3 hash3(vec3 p) {
  p = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6))
  );
  return fract(sin(p) * 43758.5453123);
}

float hash(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

// ---- 3D value noise ----
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f); // smoothstep

  return mix(
    mix(
      mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), u.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), u.x),
      u.y
    ),
    mix(
      mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), u.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), u.x),
      u.y
    ),
    u.z
  );
}

// ---- fBm (3 octaves) ----
float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  vec3  shift = vec3(100.0);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p  = p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  // aspect-correct, centered
  uv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

  // seed offset applied to noise coordinates
  vec3 q = vec3(uv * uScale + uSeed * 0.01, uTime * 0.12);

  // First noise pass
  float n1 = fbm(q);

  // Domain warp: offset UV by n1 before second pass
  vec3 r = vec3(
    uv * uScale + vec2(n1 * 1.7 + 9.2, n1 * 1.2 + 2.4) + uSeed * 0.01,
    uTime * 0.08 + 5.2
  );
  float n2 = fbm(r);

  // Apply contrast
  float v = clamp(n2 * uContrast, 0.0, 1.0);

  // Three-stop color gradient
  vec3 col;
  if (v < 0.5) {
    col = mix(uColorA, uColorB, v * 2.0);
  } else {
    col = mix(uColorB, uColorC, (v - 0.5) * 2.0);
  }

  // Subtle radial vignette for depth
  float vignette = 1.0 - smoothstep(0.4, 1.1, length(uv * 0.8));
  col *= vignette;

  fragColor = vec4(col, 1.0);
}
`;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PlasmaFieldParams {
  seed?: number;
  speed?: number;
  scale?: number;
  contrast?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export interface PlasmaFieldState {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uniforms: {
    uTime: WebGLUniformLocation;
    uResolution: WebGLUniformLocation;
    uColorA: WebGLUniformLocation;
    uColorB: WebGLUniformLocation;
    uColorC: WebGLUniformLocation;
    uScale: WebGLUniformLocation;
    uContrast: WebGLUniformLocation;
    uSeed: WebGLUniformLocation;
  };
  time: number;
  width: number;
  height: number;
}

export const plasmaFieldDefaults: Required<PlasmaFieldParams> = {
  seed: 42,
  speed: 1.0,
  scale: 2.5,
  contrast: 2.2,
  colorA: "#0d1b6e",
  colorB: "#c0146c",
  colorC: "#f5a623",
};

// ─── Engine functions ─────────────────────────────────────────────────────────

export function initPlasmaField(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  params: PlasmaFieldParams = {}
): PlasmaFieldState {
  const p = { ...plasmaFieldDefaults, ...params };

  const program = compileProgram(gl, VERT, FRAG);

  // Fullscreen triangle: 3 vertices covering all of NDC clip space
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);

  const posBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const posLoc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  // Cache uniform locations (done once, reused every frame)
  const uniforms = {
    uTime:       gl.getUniformLocation(program, "uTime")!,
    uResolution: gl.getUniformLocation(program, "uResolution")!,
    uColorA:     gl.getUniformLocation(program, "uColorA")!,
    uColorB:     gl.getUniformLocation(program, "uColorB")!,
    uColorC:     gl.getUniformLocation(program, "uColorC")!,
    uScale:      gl.getUniformLocation(program, "uScale")!,
    uContrast:   gl.getUniformLocation(program, "uContrast")!,
    uSeed:       gl.getUniformLocation(program, "uSeed")!,
  };

  gl.viewport(0, 0, width, height);

  // Set seed and scale once (structural params that don't change frame-to-frame)
  gl.useProgram(program);
  gl.uniform1f(uniforms.uSeed, p.seed);
  gl.uniform1f(uniforms.uScale, p.scale);
  gl.useProgram(null);

  return { gl, program, vao, uniforms, time: 0, width, height };
}

export function drawPlasmaField(
  gl: WebGL2RenderingContext,
  state: PlasmaFieldState,
  params: PlasmaFieldParams = {}
): void {
  const p = { ...plasmaFieldDefaults, ...params };

  state.time += 0.016 * p.speed;

  gl.useProgram(state.program);

  gl.uniform1f(state.uniforms.uTime, state.time);
  gl.uniform2f(state.uniforms.uResolution, state.width, state.height);
  gl.uniform1f(state.uniforms.uScale, p.scale);
  gl.uniform1f(state.uniforms.uContrast, p.contrast);
  gl.uniform1f(state.uniforms.uSeed, p.seed);

  const ca = hexToVec3(p.colorA);
  const cb = hexToVec3(p.colorB);
  const cc = hexToVec3(p.colorC);
  gl.uniform3f(state.uniforms.uColorA, ca[0], ca[1], ca[2]);
  gl.uniform3f(state.uniforms.uColorB, cb[0], cb[1], cb[2]);
  gl.uniform3f(state.uniforms.uColorC, cc[0], cc[1], cc[2]);

  gl.bindVertexArray(state.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindVertexArray(null);

  gl.useProgram(null);
}

export function resetPlasmaField(
  gl: WebGL2RenderingContext,
  state: PlasmaFieldState,
  params: PlasmaFieldParams = {}
): PlasmaFieldState {
  // Recompile with new structural params (seed/scale may affect program constants)
  gl.deleteProgram(state.program);
  gl.deleteVertexArray(state.vao);
  return initPlasmaField(gl, state.width, state.height, params);
}

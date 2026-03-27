/**
 * Seeded Perlin noise — direct port of p5.js internal noise implementation.
 * Returns values in [0, 1] range (same as p5.noise).
 * Default 4 octaves, 0.5 amplitude falloff (matches p5.js defaults).
 */

const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;
const PERLIN_OCTAVES_DEFAULT = 4;
const PERLIN_AMP_FALLOFF_DEFAULT = 0.5;

function scaledCosine(i: number): number {
  return 0.5 * (1.0 - Math.cos(i * Math.PI));
}

export class PerlinNoise {
  private perlin: Float32Array;
  private octaves: number;
  private falloff: number;

  constructor(seed = 0, octaves = PERLIN_OCTAVES_DEFAULT, falloff = PERLIN_AMP_FALLOFF_DEFAULT) {
    this.octaves = octaves;
    this.falloff = falloff;
    this.perlin = new Float32Array(PERLIN_SIZE + 1);
    this.seed(seed);
  }

  seed(s: number): void {
    let rng = s >>> 0;
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      this.perlin[i] = rng / 0x100000000;
    }
  }

  get(x: number, y = 0, z = 0): number {
    if (x < 0) x = -x;
    if (y < 0) y = -y;
    if (z < 0) z = -z;

    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;

    let r = 0;
    let ampl = 0.5;

    for (let o = 0; o < this.octaves; o++) {
      const of_ = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

      const rxf = scaledCosine(xf);
      const ryf = scaledCosine(yf);

      let n1 = this.perlin[of_ & PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of_ + 1) & PERLIN_SIZE] - n1);

      let n2 = this.perlin[(of_ + PERLIN_YWRAP) & PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of_ + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);

      n1 += ryf * (n2 - n1);

      const of2 = of_ + PERLIN_ZWRAP;
      n2 = this.perlin[of2 & PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of2 + 1) & PERLIN_SIZE] - n2);

      let n3 = this.perlin[(of2 + PERLIN_YWRAP) & PERLIN_SIZE];
      n3 += rxf * (this.perlin[(of2 + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += scaledCosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this.falloff;

      xi <<= 1; xf *= 2;
      yi <<= 1; yf *= 2;
      zi <<= 1; zf *= 2;

      if (xf >= 1.0) { xi++; xf--; }
      if (yf >= 1.0) { yi++; yf--; }
      if (zf >= 1.0) { zi++; zf--; }
    }

    return r;
  }
}

/**
 * Simple seeded PRNG — LCG matching p5.js randomSeed behavior.
 * Returns values in [0, 1).
 */
export class SeededRandom {
  private state: number;

  constructor(seed = 0) {
    this.state = seed >>> 0;
  }

  seed(s: number): void {
    this.state = s >>> 0;
  }

  next(): number {
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  random(): number {
    return this.next();
  }

  range(lo: number, hi: number): number {
    return lo + this.next() * (hi - lo);
  }

  floor(lo: number, hi: number): number {
    return Math.floor(this.range(lo, hi));
  }

  bool(): boolean {
    return this.next() > 0.5;
  }
}

/** Parse "#rrggbb" → { r, g, b } */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : { r: 200, g: 200, b: 200 };
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function map(v: number, a: number, b: number, c: number, d: number): number {
  return c + ((v - a) / (b - a)) * (d - c);
}

export function rgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r | 0},${g | 0},${b | 0},${(a / 255).toFixed(3)})`;
}

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initPrismaticWave,
  drawPrismaticWave,
  resetPrismaticWave,
  spawnAtClick as prismaticSpawnAtClick,
  type PrismaticWaveState,
} from "../engines/prismaticWave";

// ── Params ───────────────────────────────────────────────────────────────────

export interface PrismaticWaveParams {
  /** Seed for deterministic source placement. */
  seed?: number;
  /** Number of circular wave sources. */
  sources?: number;
  /** Base wave spatial frequency. */
  frequency?: number;
  /** Wave propagation speed. */
  waveSpeed?: number;
  /** Pixel grid cell size (lower = sharper, heavier). */
  resolution?: number;
  /** Hue range swept across the wave amplitude (degrees). */
  dispersion?: number;
  /** Starting hue offset (degrees, 0–360). */
  hueOffset?: number;
  /** Colour saturation 0–1. */
  saturation?: number;
  /** Peak pixel lightness 0–1. */
  brightness?: number;
  /** Cursor lens warp strength (0 = off). */
  lensStrength?: number;
}

export const prismaticWaveDefaults: Required<PrismaticWaveParams> = {
  seed:         42731,
  sources:      5,
  frequency:    0.012,
  waveSpeed:    0.025,
  resolution:   6,
  dispersion:   300,
  hueOffset:    0,
  saturation:   0.9,
  brightness:   0.65,
  lensStrength: 1.0,
};

// ── Props ────────────────────────────────────────────────────────────────────

export interface PrismaticWaveProps extends PrismaticWaveParams {
  className?: string;
  style?: CSSProperties;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * PrismaticWave — wave-interference background with spectral colour dispersion.
 *
 * Multiple circular wave sources drift and interfere; their superposition is
 * mapped to a full spectral hue sweep (red → violet), like white light through
 * a prism. Move the cursor to bend the chromatic bands with a diverging lens
 * warp. Click anywhere to plant a new persistent wave source.
 *
 * @example
 * <PrismaticWave
 *   sources={6}
 *   dispersion={280}
 *   lensStrength={1.2}
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function PrismaticWave(props: PrismaticWaveProps) {
  const { className, style, ...params } = props;
  const merged = { ...prismaticWaveDefaults, ...params };

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<PrismaticWaveState | null>(null);
  const paramsRef  = useRef(merged);
  paramsRef.current = merged;

  // EFFECT 1 — setup loop, observers, and pointer listeners (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running   = true;
    let isVisible = false;

    // Plain mutable object — lives inside the closure, no React hook call needed
    const mouse: { pos: { x: number; y: number } | undefined } = { pos: undefined };

    function resizeCanvas() {
      const w = canvas!.clientWidth  * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
        ctx!.fillStyle = "rgb(6,6,14)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initPrismaticWave(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initPrismaticWave(canvas.width, canvas.height, paramsRef.current);

    // ── Pointer listeners ──────────────────────────────────────────────────

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top)  * window.devicePixelRatio,
      };
    };
    const onMouseLeave = () => { mouse.pos = undefined; };

    const onClick = (e: MouseEvent) => {
      if (!stateRef.current) return;
      const rect = canvas.getBoundingClientRect();
      prismaticSpawnAtClick(
        stateRef.current,
        (e.clientX - rect.left) * window.devicePixelRatio,
        (e.clientY - rect.top)  * window.devicePixelRatio,
        paramsRef.current
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (t.clientX - rect.left) * window.devicePixelRatio,
        y: (t.clientY - rect.top)  * window.devicePixelRatio,
      };
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!stateRef.current) return;
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      prismaticSpawnAtClick(
        stateRef.current,
        (t.clientX - rect.left) * window.devicePixelRatio,
        (t.clientY - rect.top)  * window.devicePixelRatio,
        paramsRef.current
      );
    };

    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click",      onClick);
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    // ── Animation loop ─────────────────────────────────────────────────────

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawPrismaticWave(ctx, stateRef.current, paramsRef.current, mouse.pos);
      }
      animId = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (typeof animId !== "undefined") cancelAnimationFrame(animId);
          animId = requestAnimationFrame(loop);
        }
      });
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click",      onClick);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // EFFECT 2 — structural reset when seed or source count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetPrismaticWave(ctx, stateRef.current, merged);
  }, [merged.seed, merged.sources]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

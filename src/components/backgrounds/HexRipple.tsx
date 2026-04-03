import { useEffect, useRef, type CSSProperties } from "react";
import {
  initHexRipple,
  drawHexRipple,
  resetHexRipple,
  addSource,
  type HexRippleState,
} from "../engines/hexRipple";

// ── Params ────────────────────────────────────────────────────────────────────

export interface HexRippleParams {
  seed?: number;
  /** Hex cell circumradius in pixels. */
  cellSize?: number;
  /** Wave animation speed multiplier. */
  waveSpeed?: number;
  /** Spatial wave frequency (smaller = wider rings). */
  frequency?: number;
  /** Exponential decay rate with distance. */
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

// ── Props ─────────────────────────────────────────────────────────────────────

export interface HexRippleProps extends HexRippleParams {
  className?: string;
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * HexRipple — hexagonal tessellation with multi-source wave interference.
 *
 * Wave sources emit concentric sinusoidal ripples across a hex grid; cells are
 * colored by the superposition of all active wave fronts, producing chromatic
 * interference patterns and standing-wave nodes. Mouse hover highlights the cell
 * under the cursor. Click anywhere to plant a new wave source (oldest evicted
 * when the source cap is reached).
 *
 * @example
 * <HexRipple
 *   cellSize={26}
 *   frequency={0.03}
 *   colorCrest="#ffaa00"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function HexRipple(props: HexRippleProps) {
  const { className, style, ...params } = props;
  const merged = { ...hexRippleDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<HexRippleState | null>(null);
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  // EFFECT 1 — setup loop, observers, pointer listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running   = true;
    let isVisible = false;

    const mouse: { pos: { x: number; y: number } | undefined } = { pos: undefined };

    function resizeCanvas() {
      const w = canvas!.clientWidth  * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
        stateRef.current = initHexRipple(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initHexRipple(canvas.width, canvas.height, paramsRef.current);

    // Pointer handlers
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
      addSource(
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
      addSource(
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

    // Animation loop
    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawHexRipple(ctx, stateRef.current, paramsRef.current, mouse.pos);
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

  // EFFECT 2 — structural reset when grid params change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetHexRipple(ctx, stateRef.current, merged);
  }, [merged.seed, merged.cellSize]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

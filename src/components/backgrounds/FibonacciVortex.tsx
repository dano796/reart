import { useEffect, useRef, type CSSProperties } from "react";
import {
  initFibonacciVortex,
  drawFibonacciVortex,
  resetFibonacciVortex,
  addBloom,
  type FibonacciVortexState,
} from "../engines/fibonacciVortex";

// ── Params ────────────────────────────────────────────────────────────────────

export interface FibonacciVortexParams {
  seed?: number;
  /** Number of spiral arms per bloom (snapped to nearest Fibonacci: 3, 5, 8, 13). */
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

// ── Props ─────────────────────────────────────────────────────────────────────

export interface FibonacciVortexProps extends FibonacciVortexParams {
  className?: string;
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * FibonacciVortex — golden spiral arms animated as particle streams.
 *
 * Particles travel along golden spiral arms (r = k·φ^(θ/½π)) radiating from one
 * or more "bloom" centers. Arm count is snapped to a Fibonacci number (3, 5, 8, 13).
 * Move the cursor to bend nearby particle paths with gravitational pull.
 * Click anywhere to plant a new bloom origin — oldest one drops when the cap is reached.
 *
 * @example
 * <FibonacciVortex
 *   numArms={8}
 *   particlesPerArm={50}
 *   mouseStrength={0.18}
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function FibonacciVortex(props: FibonacciVortexProps) {
  const { className, style, ...params } = props;
  const merged = { ...fibonacciVortexDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<FibonacciVortexState | null>(null);
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
        ctx!.fillStyle = "rgb(6,4,16)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initFibonacciVortex(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initFibonacciVortex(canvas.width, canvas.height, paramsRef.current);

    // Pointer handlers
    const onMouseMove = (e: MouseEvent) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (e.clientX - rect.left) * dpr,
        y: (e.clientY - rect.top) * dpr,
      };
    };
    const onMouseLeave = () => { mouse.pos = undefined; };

    const onClick = (e: MouseEvent) => {
      if (!stateRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      addBloom(
        stateRef.current,
        (e.clientX - rect.left) * dpr,
        (e.clientY - rect.top) * dpr,
        paramsRef.current
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (t.clientX - rect.left) * dpr,
        y: (t.clientY - rect.top) * dpr,
      };
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!stateRef.current) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      addBloom(
        stateRef.current,
        (t.clientX - rect.left) * dpr,
        (t.clientY - rect.top) * dpr,
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
        drawFibonacciVortex(ctx, stateRef.current, paramsRef.current, mouse.pos);
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

  // EFFECT 2 — structural reset when seed/numArms/particlesPerArm change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetFibonacciVortex(ctx, stateRef.current, merged);
  }, [merged.seed, merged.numArms, merged.particlesPerArm]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

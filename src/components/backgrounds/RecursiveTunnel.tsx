import { useEffect, useRef, type CSSProperties } from "react";
import {
  initRecursiveTunnel,
  drawRecursiveTunnel,
  resetRecursiveTunnel,
  toggleTwist,
  type RecursiveTunnelState,
} from "../engines/recursiveTunnel";

// ── Params ────────────────────────────────────────────────────────────────────

export interface RecursiveTunnelParams {
  seed?: number;
  /** Number of polygon sides (3–12). */
  sides?: number;
  /** Number of concentric ring layers. */
  layers?: number;
  /** Zoom speed (fraction of max radius added per frame). */
  zoomSpeed?: number;
  /** Additional rotation per layer (radians). Higher = tighter spiral. */
  twistPerLayer?: number;
  /** Inner / hot ring color. */
  colorInner?: string;
  /** Mid-depth ring color. */
  colorMid?: string;
  /** Outer / cool ring color. */
  colorOuter?: string;
  /** How far the vanishing point follows the mouse [0–1]. */
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

// ── Props ─────────────────────────────────────────────────────────────────────

export interface RecursiveTunnelProps extends RecursiveTunnelParams {
  className?: string;
  style?: CSSProperties;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * RecursiveTunnel — concentric nested polygons zooming inward with parallax.
 *
 * N polygon rings fly toward the viewer each frame, each inner ring rotated
 * more than the outer ones by a cumulative twist factor — producing a hypnotic
 * barrel-scroll that deepens the sense of recursive depth. The vanishing point
 * smoothly follows the mouse, adding binocular parallax. Click anywhere to
 * reverse the twist direction for an instant perceptual flip.
 *
 * @example
 * <RecursiveTunnel
 *   sides={5}
 *   twistPerLayer={0.15}
 *   colorInner="#ff6a00"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function RecursiveTunnel(props: RecursiveTunnelProps) {
  const { className, style, ...params } = props;
  const merged = { ...recursiveTunnelDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<RecursiveTunnelState | null>(null);
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
        ctx!.fillStyle = "rgb(4,4,12)";
        ctx!.fillRect(0, 0, w, h);
        if (stateRef.current) {
          // Preserve twist sign and phase across resize
          const prev = stateRef.current;
          stateRef.current = initRecursiveTunnel(w, h, paramsRef.current);
          stateRef.current.twistSign = prev.twistSign;
          stateRef.current.phase     = prev.phase;
        } else {
          stateRef.current = initRecursiveTunnel(w, h, paramsRef.current);
        }
      }
    }

    resizeCanvas();
    stateRef.current = initRecursiveTunnel(canvas.width, canvas.height, paramsRef.current);

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

    const onClick = () => {
      if (!stateRef.current) return;
      toggleTwist(stateRef.current);
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
      toggleTwist(stateRef.current);
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
        drawRecursiveTunnel(ctx, stateRef.current, paramsRef.current, mouse.pos);
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

  // EFFECT 2 — structural reset when sides or layers change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetRecursiveTunnel(ctx, stateRef.current, merged);
  }, [merged.sides, merged.layers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

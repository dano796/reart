import { useEffect, useRef, type CSSProperties } from "react";
import {
  initFlowCurrents,
  drawFlowCurrents,
  resetFlowCurrents,
  type FlowCurrentsState,
} from "../engines/flowCurrents";

export interface FlowCurrentsParams {
  seed?: number;
  count?: number;
  speed?: number;
  noiseScale?: number;
  trailOpacity?: number;
  noiseEvol?: number;
  colorWarm?: string;
  colorCool?: string;
  colorAccent?: string;
}

export const flowCurrentsDefaults: Required<FlowCurrentsParams> = {
  seed: 42731, count: 3000, speed: 1.0, noiseScale: 0.004,
  trailOpacity: 8, noiseEvol: 0.0005,
  colorWarm: "#e8855a", colorCool: "#5a9bcc", colorAccent: "#a0c878",
};

export interface FlowCurrentsProps extends FlowCurrentsParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * FlowCurrents — Perlin-noise particle flow field background.
 *
 * Drop-in React component. Fills its container, handles resize, and
 * cleans up on unmount. Zero external dependencies beyond React.
 *
 * @example
 * <FlowCurrents
 *   speed={1.2}
 *   count={2500}
 *   colorWarm="#e8855a"
 *   colorCool="#5a9bcc"
 *   colorAccent="#a0c878"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function FlowCurrents(props: FlowCurrentsProps) {
  const { className, style, ...params } = props;
  const merged = { ...flowCurrentsDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<FlowCurrentsState | null>(null);
  // Always-current params ref — loop reads this, no restart needed
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  // Bootstrap: create canvas context, start loop, handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running = true;
    let isVisible = false;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        ctx!.fillStyle = "rgb(12,12,20)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initFlowCurrents(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initFlowCurrents(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawFlowCurrents(ctx, stateRef.current, paramsRef.current);
      }
      animId = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (typeof animId !== "undefined") {
            cancelAnimationFrame(animId);
          }
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
    };
  }, []); // intentionally empty — loop reads paramsRef

  // Reinit on structural param changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetFlowCurrents(ctx, stateRef.current, merged);
  }, [merged.seed, merged.count]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

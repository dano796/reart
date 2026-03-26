import { useEffect, useRef, CSSProperties } from "react";
import {
  initGeoPulse,
  drawGeoPulse,
  resetGeoPulse,
  type GeoPulseState,
} from "./engines/geoPulse";

export interface GeoPulseParams {
  seed?: number;
  layers?: number;
  sides?: number;
  rotSpeed?: number;
  pulse?: number;
  connect?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorAccent?: string;
}

export const geoPulseDefaults: Required<GeoPulseParams> = {
  seed: 42731, layers: 7, sides: 6, rotSpeed: 0.008, pulse: 0.12, connect: 0.4,
  colorPrimary: "#d97757", colorSecondary: "#6a9bcc", colorAccent: "#e8d87a",
};

export interface GeoPulseProps extends GeoPulseParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * GeoPulse — nested rotating parametric polygon background.
 *
 * @example
 * <GeoPulse
 *   layers={8}
 *   sides={6}
 *   pulse={0.15}
 *   colorPrimary="#d97757"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function GeoPulse(props: GeoPulseProps) {
  const { className, style, ...params } = props;
  const merged = { ...geoPulseDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GeoPulseState | null>(null);
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running = true;

    function resizeCanvas() {
      const w = canvas!.clientWidth * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        ctx!.fillStyle = "rgb(10,10,18)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initGeoPulse(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initGeoPulse(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running) return;
      if (stateRef.current) {
        drawGeoPulse(ctx, stateRef.current, paramsRef.current);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetGeoPulse(ctx, stateRef.current, merged);
  }, [merged.seed, merged.layers, merged.sides, merged.connect]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

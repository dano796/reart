/**
 * Spirograph
 * Hypotrochoid curves from rolling circles
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initSpirograph,
  drawSpirograph,
  resetSpirograph,
  type SpirographState,
} from "../../engines/archived/spirograph";

export interface SpirographParams {
  seed?: number;
  R?: number;
  r?: number;
  d?: number;
  speed?: number;
  lineWeight?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export const spirographDefaults: Required<SpirographParams> = {
  seed: 42731,
  R: 120,
  r: 45,
  d: 70,
  speed: 1.0,
  lineWeight: 1.2,
  bgColor: "#0a0a0a",
  colorA: "#ff6b35",
  colorB: "#f7931e",
  colorC: "#fdc830",
};

export interface SpirographProps extends SpirographParams {
  className?: string;
  style?: CSSProperties;
}

export function Spirograph(props: SpirographProps) {
  const { className, style, ...params } = props;
  const merged = { ...spirographDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SpirographState | null>(null);
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let running = true;
    let isVisible = false;

    function resizeCanvas() {
      const w = canvas!.clientWidth * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        stateRef.current = initSpirograph(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initSpirograph(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawSpirograph(ctx, stateRef.current, paramsRef.current);
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
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    resetSpirograph(stateRef.current, paramsRef.current);
  }, [merged.seed, merged.R, merged.r, merged.d]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

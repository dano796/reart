import { useEffect, useRef, type CSSProperties } from "react";
import {
  initTideHarmonics,
  drawTideHarmonics,
  resetTideHarmonics,
  type TideHarmonicsState,
  type TideHarmonicsParams,
} from "../engines/tideHarmonics";

export const tideHarmonicsDefaults: TideHarmonicsParams = {
  seed: 8888,
  waveCount: 5,
  gridRows: 35,
  frequency: 1.0,
  amplitude: 45,
  speed: 1.0,
  bgColor: "#0a0e14",
  colorA: "#50b8e8",
  colorB: "#e850b8",
};

export interface TideHarmonicsProps extends Partial<TideHarmonicsParams> {
  className?: string;
  style?: CSSProperties;
}

export function TideHarmonics(props: TideHarmonicsProps) {
  const { className, style, ...params } = props;
  const merged = { ...tideHarmonicsDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<TideHarmonicsState | null>(null);
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

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
        stateRef.current = initTideHarmonics(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initTideHarmonics(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawTideHarmonics(ctx, stateRef.current, paramsRef.current);
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
    if (!stateRef.current) return;
    resetTideHarmonics(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

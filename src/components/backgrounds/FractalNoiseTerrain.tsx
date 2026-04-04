import { useEffect, useRef, type CSSProperties } from "react";
import {
  initFractalNoiseTerrain,
  drawFractalNoiseTerrain,
  resetFractalNoiseTerrain,
  type FractalNoiseTerrainState,
  type FractalNoiseTerrainParams,
} from "../engines/fractalNoiseTerrain";

export const fractalNoiseTerrainDefaults: FractalNoiseTerrainParams = {
  seed: 3333,
  octaves: 6,
  persistence: 0.5,
  lacunarity: 2.0,
  scale: 4.0,
  contrast: 1.2,
  lighting: 2.5,
  driftSpeed: 0.8,
  resolution: 120,
  bgColor: "#0a0e14",
  colorA: "#1a2332",
  colorB: "#2d4a5a",
  colorC: "#5a7a6a",
  colorD: "#d4e8e0",
};

export interface FractalNoiseTerrainProps extends Partial<FractalNoiseTerrainParams> {
  className?: string;
  style?: CSSProperties;
}

export function FractalNoiseTerrain(props: FractalNoiseTerrainProps) {
  const { className, style, ...params } = props;
  const merged = { ...fractalNoiseTerrainDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<FractalNoiseTerrainState | null>(null);
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
        stateRef.current = initFractalNoiseTerrain(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initFractalNoiseTerrain(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawFractalNoiseTerrain(ctx, stateRef.current, paramsRef.current);
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
    resetFractalNoiseTerrain(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

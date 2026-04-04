/**
 * Phyllotaxis Dream
 * Golden angle spiral growth
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initPhyllotaxisDream,
  drawPhyllotaxisDream,
  resetPhyllotaxisDream,
  type PhyllotaxisDreamState,
} from "../engines/phyllotaxisDream";

export interface PhyllotaxisDreamParams {
  seed?: number;
  numPoints?: number;
  spread?: number;
  angleScale?: number;
  morph?: number;
  rotSpeed?: number;
  dotSize?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export const phyllotaxisDreamDefaults: Required<PhyllotaxisDreamParams> = {
  seed: 42731,
  numPoints: 800,
  spread: 4.5,
  angleScale: 1.0,
  morph: 1.0,
  rotSpeed: 1.0,
  dotSize: 6,
  bgColor: "#0a0a0a",
  colorA: "#ff6b35",
  colorB: "#f7931e",
  colorC: "#fdc830",
};

export interface PhyllotaxisDreamProps extends PhyllotaxisDreamParams {
  className?: string;
  style?: CSSProperties;
}

export function PhyllotaxisDream(props: PhyllotaxisDreamProps) {
  const { className, style, ...params } = props;
  const merged = { ...phyllotaxisDreamDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PhyllotaxisDreamState | null>(null);
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas!.clientWidth * dpr);
      const h = Math.floor(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        stateRef.current = initPhyllotaxisDream(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initPhyllotaxisDream(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawPhyllotaxisDream(ctx, stateRef.current, paramsRef.current);
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
    resetPhyllotaxisDream(stateRef.current, paramsRef.current);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

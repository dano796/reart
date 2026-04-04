/**
 * Lissajous Weave
 * Harmonic phase tapestry
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initLissajousWeave,
  drawLissajousWeave,
  resetLissajousWeave,
  type LissajousWeaveState,
} from "../engines/lissajousWeave";

export interface LissajousWeaveParams {
  seed?: number;
  curveCount?: number;
  freqMax?: number;
  radius?: number;
  phaseSpeed?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export const lissajousWeaveDefaults: Required<LissajousWeaveParams> = {
  seed: 42731,
  curveCount: 12,
  freqMax: 5,
  radius: 180,
  phaseSpeed: 1.0,
  bgColor: "#0a0a0a",
  colorA: "#ff6b35",
  colorB: "#f7931e",
  colorC: "#fdc830",
};

export interface LissajousWeaveProps extends LissajousWeaveParams {
  className?: string;
  style?: CSSProperties;
}

export function LissajousWeave(props: LissajousWeaveProps) {
  const { className, style, ...params } = props;
  const merged = { ...lissajousWeaveDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<LissajousWeaveState | null>(null);
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
        stateRef.current = initLissajousWeave(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initLissajousWeave(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawLissajousWeave(ctx, stateRef.current, paramsRef.current);
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
    resetLissajousWeave(stateRef.current, paramsRef.current);
  }, [merged.seed, merged.curveCount, merged.freqMax]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

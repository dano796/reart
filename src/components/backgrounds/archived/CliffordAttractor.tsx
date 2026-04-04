/**
 * Clifford Attractor
 * Strange attractor density visualization
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initCliffordAttractor,
  drawCliffordAttractor,
  resetCliffordAttractor,
  type CliffordAttractorState,
} from "../../engines/archived/cliffordAttractor";

export interface CliffordAttractorParams {
  seed?: number;
  pA?: number;
  pB?: number;
  pC?: number;
  pD?: number;
  pointsPerFrame?: number;
  brightness?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
}

export const cliffordAttractorDefaults: Required<CliffordAttractorParams> = {
  seed: 42731,
  pA: -1.4,
  pB: 1.6,
  pC: 1.0,
  pD: 0.7,
  pointsPerFrame: 8000,
  brightness: 1.0,
  bgColor: "#0a0a0a",
  colorA: "#1a1a2e",
  colorB: "#00d4ff",
};

export interface CliffordAttractorProps extends CliffordAttractorParams {
  className?: string;
  style?: CSSProperties;
}

export function CliffordAttractor(props: CliffordAttractorProps) {
  const { className, style, ...params } = props;
  const merged = { ...cliffordAttractorDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CliffordAttractorState | null>(null);
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
        stateRef.current = initCliffordAttractor(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initCliffordAttractor(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawCliffordAttractor(ctx, stateRef.current, paramsRef.current);
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
    resetCliffordAttractor(stateRef.current, paramsRef.current);
  }, [merged.seed, merged.pA, merged.pB, merged.pC, merged.pD]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

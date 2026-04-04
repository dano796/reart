import { useEffect, useRef, type CSSProperties } from "react";
import {
  initRecursiveSubdivision,
  drawRecursiveSubdivision,
  resetRecursiveSubdivision,
  type RecursiveSubdivisionState,
  type RecursiveSubdivisionParams,
} from "../engines/recursiveSubdivision";

export const recursiveSubdivisionDefaults: RecursiveSubdivisionParams = {
  seed: 2222,
  maxDepth: 6,
  splitProbability: 0.85,
  minSize: 30,
  maxStroke: 4,
  minStroke: 0.5,
  colorMode: 0,
  animated: true,
  animSpeed: 1.5,
  bgColor: "#0a0e14",
  colorA: "#50b8e8",
  colorB: "#e8b850",
  colorC: "#e850b8",
};

export interface RecursiveSubdivisionProps extends Partial<RecursiveSubdivisionParams> {
  className?: string;
  style?: CSSProperties;
}

export function RecursiveSubdivision(props: RecursiveSubdivisionProps) {
  const { className, style, ...params } = props;
  const merged = { ...recursiveSubdivisionDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<RecursiveSubdivisionState | null>(null);
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
        stateRef.current = initRecursiveSubdivision(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initRecursiveSubdivision(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawRecursiveSubdivision(ctx, stateRef.current, paramsRef.current);
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
    resetRecursiveSubdivision(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

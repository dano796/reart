import { useEffect, useRef, type CSSProperties } from "react";
import {
  initDoublePendulum,
  drawDoublePendulum,
  resetDoublePendulum,
  type DoublePendulumState,
  type DoublePendulumParams,
} from "../../engines/archived/doublePendulum";

export const doublePendulumDefaults: DoublePendulumParams = {
  seed: 7777,
  numPendulums: 9,
  length1: 180,
  length2: 180,
  gravity: 1.2,
  simSpeed: 1.5,
  fadeRate: 8,
  bgColor: "#0a0e14",
  colorA: "#e8b850",
  colorB: "#50e8b8",
  colorC: "#b850e8",
};

export interface DoublePendulumProps extends Partial<DoublePendulumParams> {
  className?: string;
  style?: CSSProperties;
}

export function DoublePendulum(props: DoublePendulumProps) {
  const { className, style, ...params } = props;
  const merged = { ...doublePendulumDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<DoublePendulumState | null>(null);
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
      const w = canvas!.clientWidth * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        stateRef.current = initDoublePendulum(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initDoublePendulum(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawDoublePendulum(ctx, stateRef.current, paramsRef.current);
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
    resetDoublePendulum(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

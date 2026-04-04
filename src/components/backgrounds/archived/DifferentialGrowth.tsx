import { useEffect, useRef, type CSSProperties } from "react";
import {
  initDifferentialGrowth,
  drawDifferentialGrowth,
  resetDifferentialGrowth,
  type DifferentialGrowthState,
  type DifferentialGrowthParams,
} from "../../engines/archived/differentialGrowth";

export const differentialGrowthDefaults: DifferentialGrowthParams = {
  seed: 4242,
  growthRate: 0.8,
  repelRadius: 12,
  repelStrength: 0.4,
  maxEdge: 8,
  maxNodes: 2800,
  stepsPerFrame: 3,
  fadeRate: 18,
  lineWeight: 1.8,
  bgColor: "#0a0e14",
  colorA: "#50b8e8",
  colorB: "#e850b8",
};

export interface DifferentialGrowthProps extends Partial<DifferentialGrowthParams> {
  className?: string;
  style?: CSSProperties;
}

export function DifferentialGrowth(props: DifferentialGrowthProps) {
  const { className, style, ...params } = props;
  const merged = { ...differentialGrowthDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<DifferentialGrowthState | null>(null);
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
        stateRef.current = initDifferentialGrowth(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initDifferentialGrowth(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawDifferentialGrowth(ctx, stateRef.current, paramsRef.current);
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
    resetDifferentialGrowth(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

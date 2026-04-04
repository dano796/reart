import { useEffect, useRef, type CSSProperties } from "react";
import {
  initMoireLattice,
  drawMoireLattice,
  resetMoireLattice,
  type MoireLatticeState,
  type MoireLatticeParams,
} from "../engines/moireLattice";

export const moireLatticeDefaults: MoireLatticeParams = {
  seed: 5555,
  gridCount: 5,
  lineSpacing: 18,
  lineWeight: 0.8,
  lineAlpha: 85,
  rotSpeed: 1.0,
  bgColor: "#0a0e14",
  colorA: "#50b8e8",
  colorB: "#e8b850",
  colorC: "#e850b8",
};

export interface MoireLatticeProps extends Partial<MoireLatticeParams> {
  className?: string;
  style?: CSSProperties;
}

export function MoireLattice(props: MoireLatticeProps) {
  const { className, style, ...params } = props;
  const merged = { ...moireLatticeDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<MoireLatticeState | null>(null);
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
        stateRef.current = initMoireLattice(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initMoireLattice(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawMoireLattice(ctx, stateRef.current, paramsRef.current);
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
    resetMoireLattice(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

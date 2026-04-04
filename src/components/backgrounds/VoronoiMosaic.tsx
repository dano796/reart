import { useEffect, useRef, type CSSProperties } from "react";
import {
  initVoronoiMosaic,
  drawVoronoiMosaic,
  resetVoronoiMosaic,
  type VoronoiMosaicState,
  type VoronoiMosaicParams,
} from "../engines/voronoiMosaic";

export const voronoiMosaicDefaults: VoronoiMosaicParams = {
  seed: 4444,
  seedCount: 25,
  moveSpeed: 0.5,
  edgeContrast: 1.2,
  bgColor: "#0a0e14",
};

export interface VoronoiMosaicProps extends Partial<VoronoiMosaicParams> {
  className?: string;
  style?: CSSProperties;
}

export function VoronoiMosaic(props: VoronoiMosaicProps) {
  const { className, style, ...params } = props;
  const merged = { ...voronoiMosaicDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<VoronoiMosaicState | null>(null);
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
        stateRef.current = initVoronoiMosaic(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initVoronoiMosaic(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawVoronoiMosaic(ctx, stateRef.current, paramsRef.current);
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
    resetVoronoiMosaic(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

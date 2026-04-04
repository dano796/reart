import { useEffect, useRef, type CSSProperties } from "react";
import {
  initOrbitalResonance,
  drawOrbitalResonance,
  resetOrbitalResonance,
  type OrbitalResonanceState,
  type OrbitalResonanceParams,
} from "../engines/orbitalResonance";

export const orbitalResonanceDefaults: OrbitalResonanceParams = {
  seed: 9999,
  bodyCount: 5,
  resonanceRatios: [1, 2, 3, 5, 8],
  simSpeed: 1.0,
  trailLength: 200,
  trailWeight: 1.5,
  bodySize: 8,
  centerSize: 12,
  fadeTrails: true,
  fadeAmount: 8,
  bgColor: "#0a0a0a",
  colorA: "#ff6b35",
  colorB: "#f7931e",
  colorC: "#fdc830",
  colorD: "#50b8e8",
};

export interface OrbitalResonanceProps extends Partial<OrbitalResonanceParams> {
  className?: string;
  style?: CSSProperties;
}

export function OrbitalResonance(props: OrbitalResonanceProps) {
  const { className, style, ...params } = props;
  const merged = { ...orbitalResonanceDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<OrbitalResonanceState | null>(null);
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
        stateRef.current = initOrbitalResonance(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initOrbitalResonance(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawOrbitalResonance(ctx, stateRef.current, paramsRef.current);
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
    resetOrbitalResonance(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initGravityStorm,
  drawGravityStorm,
  resetGravityStorm,
  type GravityStormState,
} from "../../engines/archived/gravityStorm";

export interface GravityStormParams {
  seed?: number;
  count?: number;
  attractors?: number;
  gravity?: number;
  turbulence?: number;
  orbitSpeed?: number;
  colorCore?: string;
  colorTrail?: string;
}

export const gravityStormDefaults: Required<GravityStormParams> = {
  seed: 42731, count: 1200, attractors: 3, gravity: 1.0,
  turbulence: 0.5, orbitSpeed: 0.008,
  colorCore: "#ff6b35", colorTrail: "#7b5ea7",
};

export interface GravityStormProps extends GravityStormParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * GravityStorm — n-body attractor particle system background.
 *
 * @example
 * <GravityStorm
 *   attractors={4}
 *   gravity={1.2}
 *   colorCore="#ff6b35"
 *   colorTrail="#7b5ea7"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function GravityStorm(props: GravityStormProps) {
  const { className, style, ...params } = props;
  const merged = { ...gravityStormDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GravityStormState | null>(null);
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
        ctx!.fillStyle = "rgb(8,6,18)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initGravityStorm(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initGravityStorm(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawGravityStorm(ctx, stateRef.current, paramsRef.current);
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
    stateRef.current = resetGravityStorm(ctx, stateRef.current, merged);
  }, [merged.seed, merged.count, merged.attractors]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

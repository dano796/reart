/**
 * Ember Cascade
 * Thermal particle system with turbulent ascent
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initEmberCascade,
  drawEmberCascade,
  resetEmberCascade,
  type EmberCascadeState,
} from "../../engines/archived/emberCascade";

export interface EmberCascadeParams {
  seed?: number;
  particleCount?: number;
  sourceCount?: number;
  riseSpeed?: number;
  turbulence?: number;
  glowSize?: number;
  bgColor?: string;
  hotColor?: string;
  midColor?: string;
  coolColor?: string;
}

export const emberCascadeDefaults: Required<EmberCascadeParams> = {
  seed: 42731,
  particleCount: 800,
  sourceCount: 3,
  riseSpeed: 1.2,
  turbulence: 1.0,
  glowSize: 1.0,
  bgColor: "#0a0a0a",
  hotColor: "#ffaa33",
  midColor: "#ff5533",
  coolColor: "#aa2233",
};

export interface EmberCascadeProps extends EmberCascadeParams {
  className?: string;
  style?: CSSProperties;
}

export function EmberCascade(props: EmberCascadeProps) {
  const { className, style, ...params } = props;
  const merged = { ...emberCascadeDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<EmberCascadeState | null>(null);
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
        ctx!.fillStyle = paramsRef.current.bgColor;
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initEmberCascade(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initEmberCascade(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawEmberCascade(ctx, stateRef.current, paramsRef.current);
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
    resetEmberCascade(stateRef.current, paramsRef.current);
  }, [merged.seed, merged.particleCount, merged.sourceCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

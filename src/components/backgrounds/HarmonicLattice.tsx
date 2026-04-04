/**
 * Harmonic Lattice
 * Two-dimensional standing wave interference patterns
 */

import { useEffect, useRef, type CSSProperties } from "react";
import {
  initHarmonicLattice,
  drawHarmonicLattice,
  resetHarmonicLattice,
  type HarmonicLatticeState,
} from "../engines/harmonicLattice";

export interface HarmonicLatticeParams {
  seed?: number;
  modeCount?: number;
  maxModeNumber?: number;
  baseFrequency?: number;
  timeSpeed?: number;
  resolution?: number;
  nodeThreshold?: number;
  contrastPower?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export const harmonicLatticeDefaults: Required<HarmonicLatticeParams> = {
  seed: 42731,
  modeCount: 6,
  maxModeNumber: 5,
  baseFrequency: 1.0,
  timeSpeed: 1.0,
  resolution: 80,
  nodeThreshold: 0.15,
  contrastPower: 1.5,
  bgColor: "#0a0a0a",
  colorA: "#ff6b35",
  colorB: "#f7931e",
  colorC: "#fdc830",
};

export interface HarmonicLatticeProps extends HarmonicLatticeParams {
  className?: string;
  style?: CSSProperties;
}

export function HarmonicLattice(props: HarmonicLatticeProps) {
  const { className, style, ...params } = props;
  const merged = { ...harmonicLatticeDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<HarmonicLatticeState | null>(null);
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
        stateRef.current = initHarmonicLattice(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initHarmonicLattice(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawHarmonicLattice(ctx, stateRef.current, paramsRef.current);
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
    resetHarmonicLattice(stateRef.current, paramsRef.current);
  }, [merged.seed, merged.modeCount, merged.maxModeNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

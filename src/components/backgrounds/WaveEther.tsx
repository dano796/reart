import { useEffect, useRef, type CSSProperties } from "react";
import {
  initWaveEther,
  drawWaveEther,
  resetWaveEther,
  type WaveEtherState,
} from "../engines/waveEther";
export interface WaveEtherParams {
  seed?: number;
  sources?: number;
  frequency?: number;
  amplitude?: number;
  waveSpeed?: number;
  resolution?: number;
  colorCrest?: string;
  colorTrough?: string;
  colorMid?: string;
}

export const waveEtherDefaults: Required<WaveEtherParams> = {
  seed: 42731, sources: 3, frequency: 0.018, amplitude: 1.0,
  waveSpeed: 0.025, resolution: 8,
  colorCrest: "#00d4ff", colorTrough: "#0a0a2e", colorMid: "#7b2fff",
};

export interface WaveEtherProps extends WaveEtherParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * WaveEther — multi-source interference wave background.
 *
 * @example
 * <WaveEther
 *   sources={4}
 *   frequency={0.02}
 *   colorCrest="#00d4ff"
 *   colorTrough="#0a0a2e"
 *   colorMid="#7b2fff"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function WaveEther(props: WaveEtherProps) {
  const { className, style, ...params } = props;
  const merged = { ...waveEtherDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<WaveEtherState | null>(null);
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
        stateRef.current = initWaveEther(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initWaveEther(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawWaveEther(ctx, stateRef.current, paramsRef.current);
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
    if (!canvas || !stateRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    stateRef.current = resetWaveEther(ctx, stateRef.current, merged);
  }, [merged.seed, merged.sources]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

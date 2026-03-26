import { useEffect, useRef, CSSProperties } from "react";
import {
  initWaveEther,
  drawWaveEther,
  resetWaveEther,
  type WaveEtherState,
} from "./engines/waveEther";
import type { WaveEtherParams } from "./schemas";
import { waveEtherDefaults } from "./schemas";

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

    function resizeCanvas() {
      const w = canvas!.clientWidth * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        stateRef.current = initWaveEther(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initWaveEther(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running) return;
      if (stateRef.current) {
        drawWaveEther(ctx, stateRef.current, paramsRef.current);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
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

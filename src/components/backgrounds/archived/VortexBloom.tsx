import { useEffect, useRef, type CSSProperties } from "react";
import {
  initVortexBloom,
  drawVortexBloom,
  resetVortexBloom,
  type VortexBloomState,
} from "../../engines/archived//vortexBloom";

export interface VortexBloomParams {
  seed?: number;
  vortexCount?: number;
  particleCount?: number;
  orbitStrength?: number;
  spiralTightness?: number;
  fadeRate?: number;
  trailWeight?: number;
  bgColor?: string;
  colorA?: string;
  colorB?: string;
  colorC?: string;
}

export const vortexBloomDefaults: Required<VortexBloomParams> = {
  seed: 12345,
  vortexCount: 4,
  particleCount: 3000,
  orbitStrength: 1.2,
  spiralTightness: 0.9,
  fadeRate: 4,
  trailWeight: 0.7,
  bgColor: "#080810",
  colorA: "#d97757",
  colorB: "#6a9bcc",
  colorC: "#e8c46a",
};

export interface VortexBloomProps extends VortexBloomParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * VortexBloom — Orbital crystallization background.
 *
 * Particles spiral under competing vortex attractors, accumulating into
 * mandala-like formations.
 *
 * @example
 * <VortexBloom
 *   vortexCount={4}
 *   particleCount={3000}
 *   orbitStrength={1.2}
 *   spiralTightness={0.9}
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function VortexBloom(props: VortexBloomProps) {
  const { className, style, ...params } = props;
  const merged = { ...vortexBloomDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<VortexBloomState | null>(null);
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
        const bg = paramsRef.current.bgColor;
        ctx!.fillStyle = bg;
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initVortexBloom(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initVortexBloom(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawVortexBloom(ctx, stateRef.current, paramsRef.current);
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
    stateRef.current = resetVortexBloom(ctx, stateRef.current, merged);
  }, [merged.seed, merged.vortexCount, merged.particleCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

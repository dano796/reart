import { useEffect, useRef, type CSSProperties } from "react";
import {
  initCrystallineDrift,
  drawCrystallineDrift,
  resetCrystallineDrift,
  type CrystallineDriftState,
} from "../../engines/archived/crystallineDrift";

export interface CrystallineDriftParams {
  seed?: number;
  symmetry?: number;
  maxDepth?: number;
  angleVariance?: number;
  segmentLength?: number;
  branchInterval?: number;
  bgColor?: string;
  crystalColor?: string;
  glowColor?: string;
}

export const crystallineDriftDefaults: Required<CrystallineDriftParams> = {
  seed: 7777,
  symmetry: 6,
  maxDepth: 7,
  angleVariance: 0.5,
  segmentLength: 6,
  branchInterval: 12,
  bgColor: "#050a14",
  crystalColor: "#6ab8e8",
  glowColor: "#c4e8ff",
};

export interface CrystallineDriftProps extends CrystallineDriftParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * CrystallineDrift — Symmetric dendrite growth background.
 *
 * Recursive branching arms grow from the center, guided by noise,
 * forming snowflake-like crystal mandala structures.
 *
 * @example
 * <CrystallineDrift
 *   symmetry={6}
 *   maxDepth={7}
 *   crystalColor="#6ab8e8"
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function CrystallineDrift(props: CrystallineDriftProps) {
  const { className, style, ...params } = props;
  const merged = { ...crystallineDriftDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<CrystallineDriftState | null>(null);
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
        stateRef.current = initCrystallineDrift(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    const bg = merged.bgColor;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stateRef.current = initCrystallineDrift(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawCrystallineDrift(ctx, stateRef.current, paramsRef.current);
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
    stateRef.current = resetCrystallineDrift(ctx, stateRef.current, merged);
  }, [merged.seed, merged.symmetry, merged.maxDepth]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

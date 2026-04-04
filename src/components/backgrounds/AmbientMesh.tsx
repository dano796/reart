import { useEffect, useRef, type CSSProperties } from "react";
import {
  initAmbientMesh,
  drawAmbientMesh,
  resetAmbientMesh,
  type AmbientMeshState,
} from "../engines/ambientMesh";

export interface AmbientMeshParams {
  seed?: number;
  nodeCount?: number;
  connectionDistance?: number;
  motionSpeed?: number;
  noiseScale?: number;
  breatheSpeed?: number;
  breatheAmount?: number;
  edgeOpacity?: number;
  nodeSize?: number;
  nodeGlow?: number;
  bgOpacity?: number;
  bgColor?: string;
  nodeColor?: string;
  edgeColor?: string;
}

export const ambientMeshDefaults: Required<AmbientMeshParams> = {
  seed: 8888,
  nodeCount: 80,
  connectionDistance: 150,
  motionSpeed: 0.3,
  noiseScale: 2.0,
  breatheSpeed: 0.5,
  breatheAmount: 0.15,
  edgeOpacity: 0.75,
  nodeSize: 4,
  nodeGlow: 0.8,
  bgOpacity: 0.5,
  bgColor: "#0a0e14",
  nodeColor: "#50b8e8",
  edgeColor: "#50b8e8",
};

export interface AmbientMeshProps extends AmbientMeshParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * AmbientMesh — Breathing network topology background.
 *
 * Nodes drift through noise fields, forming dynamic connections —
 * a living network designed as a subtle, aesthetic background.
 *
 * @example
 * <AmbientMesh
 *   nodeCount={80}
 *   connectionDistance={150}
 *   motionSpeed={0.3}
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function AmbientMesh(props: AmbientMeshProps) {
  const { className, style, ...params } = props;
  const merged = { ...ambientMeshDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<AmbientMeshState | null>(null);
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
        stateRef.current = initAmbientMesh(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initAmbientMesh(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawAmbientMesh(ctx, stateRef.current, paramsRef.current);
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
    stateRef.current = resetAmbientMesh(ctx, stateRef.current, merged);
  }, [merged.seed, merged.nodeCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

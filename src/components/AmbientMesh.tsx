import { useEffect, useRef, CSSProperties } from "react";
import {
  initAmbientMesh,
  drawAmbientMesh,
  resetAmbientMesh,
  type AmbientMeshState,
} from "./engines/ambientMesh";

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
  edgeOpacity: 0.3,
  nodeSize: 4,
  nodeGlow: 0.8,
  bgOpacity: 0.05,
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

    function resizeCanvas() {
      const w = canvas!.clientWidth * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        stateRef.current = initAmbientMesh(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initAmbientMesh(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running) return;
      if (stateRef.current) {
        drawAmbientMesh(ctx, stateRef.current, paramsRef.current);
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

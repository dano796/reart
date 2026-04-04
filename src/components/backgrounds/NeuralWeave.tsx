import { useEffect, useRef, type CSSProperties } from "react";
import {
  initNeuralWeave,
  drawNeuralWeave,
  resetNeuralWeave,
  type NeuralWeaveState,
  type NeuralWeaveParams,
} from "../engines/neuralWeave";

export const neuralWeaveDefaults: NeuralWeaveParams = {
  seed: 6666,
  nodeCount: 45,
  connectionRadius: 180,
  signalCount: 8,
  signalSpeed: 1.2,
  nodeSize: 5,
  bgColor: "#0a0e14",
  nodeColor: "#50b8e8",
  edgeColor: "#50b8e8",
  signalColor: "#e8b850",
};

export interface NeuralWeaveProps extends Partial<NeuralWeaveParams> {
  className?: string;
  style?: CSSProperties;
}

export function NeuralWeave(props: NeuralWeaveProps) {
  const { className, style, ...params } = props;
  const merged = { ...neuralWeaveDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<NeuralWeaveState | null>(null);
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
        stateRef.current = initNeuralWeave(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initNeuralWeave(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawNeuralWeave(ctx, stateRef.current, paramsRef.current);
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
    resetNeuralWeave(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

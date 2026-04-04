import { useEffect, useRef, type CSSProperties } from "react";
import {
  initReactionDiffusion,
  drawReactionDiffusion,
  resetReactionDiffusion,
  type ReactionDiffusionState,
  type ReactionDiffusionParams,
} from "../../engines/archived/reactionDiffusion";

export const reactionDiffusionDefaults: ReactionDiffusionParams = {
  seed: 1111,
  Da: 1.0,
  Db: 0.5,
  f: 0.055,
  k: 0.062,
  stepsPerFrame: 10,
  bgColor: "#0a0a0a",
  colorA: "#1a1a2e",
  colorB: "#00d4ff",
};

export interface ReactionDiffusionProps extends Partial<ReactionDiffusionParams> {
  className?: string;
  style?: CSSProperties;
}

export function ReactionDiffusion(props: ReactionDiffusionProps) {
  const { className, style, ...params } = props;
  const merged = { ...reactionDiffusionDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<ReactionDiffusionState | null>(null);
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
        stateRef.current = initReactionDiffusion(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initReactionDiffusion(canvas.width, canvas.height, paramsRef.current);

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawReactionDiffusion(ctx, stateRef.current, paramsRef.current);
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
    resetReactionDiffusion(stateRef.current, merged);
  }, [merged.seed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

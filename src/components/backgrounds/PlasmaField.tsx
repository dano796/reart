import { useEffect, useRef, type CSSProperties } from "react";
import {
  initPlasmaField,
  drawPlasmaField,
  resetPlasmaField,
  plasmaFieldDefaults,
  type PlasmaFieldState,
  type PlasmaFieldParams,
} from "../engines/plasmaField";

export type { PlasmaFieldParams };

export interface PlasmaFieldProps extends PlasmaFieldParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * PlasmaField — WebGL2 domain-warped fBm plasma background.
 *
 * Renders a full-screen fragment shader: three-octave fractional Brownian
 * motion with domain warping at true pixel resolution. Color shifts
 * smoothly through three parameterizable stops over time.
 *
 * Requires WebGL2 support (all modern browsers since 2017). Gracefully
 * renders nothing on unsupported environments with a console warning.
 *
 * @example
 * <PlasmaField
 *   style={{ position: "absolute", inset: 0 }}
 *   colorA="#0d1b6e"
 *   colorB="#c0146c"
 *   colorC="#f5a623"
 *   speed={1.2}
 * />
 */
export function PlasmaField(props: PlasmaFieldProps) {
  const { className, style, ...params } = props;
  const merged = { ...plasmaFieldDefaults, ...params };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<PlasmaFieldState | null>(null);
  // Always-current params ref — loop reads this, no loop restart needed
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  // EFFECT 1: Setup — runs once. Acquires WebGL2 context, starts loop,
  // attaches ResizeObserver and IntersectionObserver.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.warn(
        "PlasmaField: WebGL2 is not supported in this environment. " +
          "The component will not render."
      );
      return;
    }

    let animId: number;
    let running = true;
    let isVisible = false;

    function resizeCanvas() {
      const w = Math.floor(canvas!.clientWidth * window.devicePixelRatio);
      const h = Math.floor(canvas!.clientHeight * window.devicePixelRatio);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        if (stateRef.current) {
          stateRef.current.width = w;
          stateRef.current.height = h;
        } else {
          stateRef.current = initPlasmaField(gl!, w, h, paramsRef.current);
        }
      }
    }

    resizeCanvas();
    if (!stateRef.current) {
      stateRef.current = initPlasmaField(gl, canvas.width, canvas.height, paramsRef.current);
    }

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawPlasmaField(gl, stateRef.current, paramsRef.current);
      }
      animId = requestAnimationFrame(loop);
    };

    // Pause when off-screen
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (typeof animId !== "undefined") cancelAnimationFrame(animId);
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
      // Null state so remount (React Strict Mode) re-initializes cleanly.
      // Do NOT call loseContext() here — it permanently invalidates the canvas
      // context, causing shader compile failures on remount.
      stateRef.current = null;
    };
  }, []); // intentionally empty — loop reads paramsRef

  // EFFECT 2: Structural reset — re-initializes when seed or scale change,
  // as these are baked into the shader's noise domain.
  // Visual-only params (colors, speed, contrast) update live via paramsRef.
  const isFirstPlasmaRender = useRef(true);
  useEffect(() => {
    if (isFirstPlasmaRender.current) {
      isFirstPlasmaRender.current = false;
      return;
    }
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2");
    if (!canvas || !gl || !stateRef.current) return;
    stateRef.current = resetPlasmaField(gl, stateRef.current, merged);
  }, [merged.seed, merged.scale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

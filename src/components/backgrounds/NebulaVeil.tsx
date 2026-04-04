import { useEffect, useRef, type CSSProperties } from "react";
import {
  initNebulaVeil,
  drawNebulaVeil,
  resetNebulaVeil,
  nebulaVeilDefaults,
  type NebulaVeilState,
  type NebulaVeilParams,
} from "../engines/nebulaVeil";

export type { NebulaVeilParams };

export interface NebulaVeilProps extends NebulaVeilParams {
  className?: string;
  style?: CSSProperties;
}

/**
 * NebulaVeil — OGL (WebGL) three-layer nebula background.
 *
 * Three superimposed simplex noise planes at different frequencies interfere
 * to create a volumetric, luminous cloud curtain. A radial gradient maps the
 * interference pattern into depth. Color transitions smoothly through three
 * parameterizable stops.
 *
 * Requires the `ogl` package: `npm install ogl`
 *
 * @example
 * <NebulaVeil
 *   style={{ position: "absolute", inset: 0 }}
 *   colorA="#0a0a2e"
 *   colorB="#7b2fbe"
 *   colorC="#00d4ff"
 *   amplitude={2.0}
 * />
 */
export function NebulaVeil(props: NebulaVeilProps) {
  const { className, style, ...params } = props;
  const merged = { ...nebulaVeilDefaults, ...params };

  // OGL appends its own canvas — we manage a container div, not a canvas element
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<NebulaVeilState | null>(null);
  // Always-current params ref — loop reads this, no loop restart needed
  const paramsRef = useRef(merged);
  paramsRef.current = merged;

  // EFFECT 1: Setup — runs once. Creates OGL renderer, starts loop,
  // attaches ResizeObserver and IntersectionObserver.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let running = true;
    let isVisible = false;

    function resizeRenderer() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(container!.clientWidth * dpr);
      const h = Math.floor(container!.clientHeight * dpr);
      if (stateRef.current) {
        const { renderer } = stateRef.current;
        if (stateRef.current.width !== w || stateRef.current.height !== h) {
          renderer.setSize(w, h);
          renderer.gl.canvas.style.width = "100%";
          renderer.gl.canvas.style.height = "100%";
          stateRef.current.width = w;
          stateRef.current.height = h;
          stateRef.current.program.uniforms.uResolution.value = [w, h];
        }
      } else {
        stateRef.current = initNebulaVeil(container!, w, h, paramsRef.current);
        // Make OGL's canvas fill the container
        const canvas = stateRef.current.renderer.gl.canvas as HTMLCanvasElement;
        canvas.style.cssText = "display:block;width:100%;height:100%;";
      }
    }

    resizeRenderer();

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawNebulaVeil(stateRef.current, paramsRef.current);
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
    io.observe(container);

    const ro = new ResizeObserver(resizeRenderer);
    ro.observe(container);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      if (stateRef.current) {
        // Remove OGL's canvas so remount (React Strict Mode) starts with a clean container.
        // Do NOT call loseContext() — it permanently invalidates the context and causes
        // failures on remount. Let GC release GPU resources when state is dereferenced.
        const oglCanvas = stateRef.current.renderer.gl.canvas;
        if (oglCanvas.parentNode === container) {
          container.removeChild(oglCanvas);
        }
        stateRef.current = null;
      }
    };
  }, []); // intentionally empty — loop reads paramsRef

  // EFFECT 2: Structural reset — density changes the noise domain, requiring reinit.
  // Colors, speed, amplitude, and blend update live via paramsRef.
  const isFirstNebulaRender = useRef(true);
  useEffect(() => {
    if (isFirstNebulaRender.current) {
      isFirstNebulaRender.current = false;
      return;
    }
    const container = containerRef.current;
    if (!container || !stateRef.current) return;
    stateRef.current = resetNebulaVeil(stateRef.current, merged);
    // Re-apply canvas sizing after reset creates a new canvas element
    const canvas = stateRef.current.renderer.gl.canvas as HTMLCanvasElement;
    canvas.style.cssText = "display:block;width:100%;height:100%;";
  }, [merged.density]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

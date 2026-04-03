import { useEffect, useRef, type CSSProperties } from "react";
import {
  initPhotonBurst,
  drawPhotonBurst,
  resetPhotonBurst,
  spawnAtClick as photonSpawnAtClick,
  type PhotonBurstState,
} from "../engines/photonBurst";

// ── Params ───────────────────────────────────────────────────────────────────

export interface PhotonBurstParams {
  /** Seed for initial photon placement. */
  seed?: number;
  /** Ambient photon count. */
  count?: number;
  /** Overall animation speed multiplier. */
  speed?: number;
  /** Noise field scale (affects drift pattern size). */
  noiseScale?: number;
  /** Trail fade opacity per frame (lower = longer trails). */
  trailOpacity?: number;
  /** Particles emitted per click burst. */
  burstSize?: number;
  /** Cursor gravitational pull strength. */
  cursorGravity?: number;
}

export const photonBurstDefaults: Required<PhotonBurstParams> = {
  seed:          42731,
  count:         800,
  speed:         1.0,
  noiseScale:    0.0025,
  trailOpacity:  12,
  burstSize:     28,
  cursorGravity: 0.18,
};

// ── Props ────────────────────────────────────────────────────────────────────

export interface PhotonBurstProps extends PhotonBurstParams {
  className?: string;
  style?: CSSProperties;
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * PhotonBurst — cosmic photon particle background with click-to-burst.
 *
 * Ambient photons drift through a dark void following Perlin noise currents,
 * glowing with a spectral aurora palette. Move the cursor to bend nearby
 * photon paths with gravitational pull. Click anywhere to detonate a radial
 * burst of photons whose hues cycle through the full visible spectrum as they
 * radiate outward.
 *
 * @example
 * <PhotonBurst
 *   count={1000}
 *   burstSize={36}
 *   cursorGravity={0.25}
 *   style={{ position: "absolute", inset: 0 }}
 * />
 */
export function PhotonBurst(props: PhotonBurstProps) {
  const { className, style, ...params } = props;
  const merged = { ...photonBurstDefaults, ...params };

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const stateRef   = useRef<PhotonBurstState | null>(null);
  const paramsRef  = useRef(merged);
  paramsRef.current = merged;

  // EFFECT 1 — setup loop, observers, pointer listeners (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running   = true;
    let isVisible = false;

    // Mutable closure object — tracks cursor position in canvas pixel space
    const mouse: { pos: { x: number; y: number } | undefined } = { pos: undefined };

    function resizeCanvas() {
      const w = canvas!.clientWidth  * window.devicePixelRatio;
      const h = canvas!.clientHeight * window.devicePixelRatio;
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width  = w;
        canvas!.height = h;
        ctx!.fillStyle = "rgb(6,6,16)";
        ctx!.fillRect(0, 0, w, h);
        stateRef.current = initPhotonBurst(w, h, paramsRef.current);
      }
    }

    resizeCanvas();
    stateRef.current = initPhotonBurst(canvas.width, canvas.height, paramsRef.current);

    // ── Pointer listeners ──────────────────────────────────────────────────

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top)  * window.devicePixelRatio,
      };
    };
    const onMouseLeave = () => { mouse.pos = undefined; };

    const onClick = (e: MouseEvent) => {
      if (!stateRef.current) return;
      const rect = canvas.getBoundingClientRect();
      photonSpawnAtClick(
        stateRef.current,
        (e.clientX - rect.left) * window.devicePixelRatio,
        (e.clientY - rect.top)  * window.devicePixelRatio,
        paramsRef.current
      );
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.pos = {
        x: (t.clientX - rect.left) * window.devicePixelRatio,
        y: (t.clientY - rect.top)  * window.devicePixelRatio,
      };
    };
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!stateRef.current) return;
      const t    = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      photonSpawnAtClick(
        stateRef.current,
        (t.clientX - rect.left) * window.devicePixelRatio,
        (t.clientY - rect.top)  * window.devicePixelRatio,
        paramsRef.current
      );
    };

    canvas.addEventListener("mousemove",  onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click",      onClick);
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });

    // ── Animation loop ─────────────────────────────────────────────────────

    const loop = () => {
      if (!running || !isVisible) return;
      if (stateRef.current) {
        drawPhotonBurst(ctx, stateRef.current, paramsRef.current, mouse.pos);
      }
      animId = requestAnimationFrame(loop);
    };

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
      canvas.removeEventListener("mousemove",  onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click",      onClick);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // EFFECT 2 — structural reset when seed or count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext("2d");
    if (!canvas || !ctx || !stateRef.current) return;
    stateRef.current = resetPhotonBurst(ctx, stateRef.current, merged);
  }, [merged.seed, merged.count]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}

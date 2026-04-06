import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { RecursiveTunnel } from "@dano796/react-reart";
import { navigate } from "../../lib/navigate";
import { CLI_PACKAGE, studioRoute } from "../../lib/constants";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const cmd = `npx ${CLI_PACKAGE} add recursive-tunnel`;

  const copyCmd = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative h-svh min-h-150 flex items-center justify-center overflow-hidden">
      {/* Live canvas background */}
      <RecursiveTunnel
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        sides={5}
        layers={22}
        zoomSpeed={0.05}
        twistPerLayer={0.11}
        parallaxStrength={0.28}
        colorInner="#d5ff0b"
        colorMid="#1e1e30"
        colorOuter="#d5ff0b"
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(12,12,20,0.2)_0%,rgba(12,12,20,0.72)_65%,rgba(12,12,20,0.97)_100%)]" />

      {/* Content */}
      <div className="relative text-center w-full max-w-190 px-4 md:px-6">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.25 bg-accent-soft border border-accent-border rounded-full text-[11px] text-accent font-semibold mb-7 font-mono uppercase">
          Zero Dependencies · Copy-paste Ready
        </div>

        {/* Headline */}
        <h1 className="hero-h1 font-display font-extrabold text-ink mb-6.5 leading-[0.92] text-[clamp(52px,9vw,96px)]">
          ReArt
          <br />
          <span className="text-accent">for React</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub text-muted font-sans font-light leading-[1.65] mx-auto mb-10 max-w-full md:max-w-135 text-[clamp(15px,2vw,19px)]">
          Animated canvas backgrounds inspired by algorithmic concepts. Install
          with one command, customize every parameter, ship without
          dependencies.
        </p>

        {/* CTA buttons */}
        <div className="hero-ctas flex gap-3 justify-center flex-wrap mb-7">
          <a
            href={studioRoute("recursive-tunnel")}
            onClick={(e) => {
              e.preventDefault();
              navigate(studioRoute("recursive-tunnel"));
            }}
            className="px-7.5 py-3.25 bg-accent border-none rounded-[10px] text-[#1a1a1a] text-[15px] font-bold font-display cursor-pointer hover:opacity-90 transition-opacity no-underline inline-block"
          >
            Open Studio
          </a>
          <a
            href="#gallery"
            className="px-7 py-3.25 bg-white/4 border border-border rounded-[10px] text-ink text-[15px] font-medium cursor-pointer no-underline font-sans inline-block hover:border-accent"
          >
            See Backgrounds
          </a>
        </div>

        {/* Install command pill */}
        <div className="hero-cmd">
          <button
            onClick={copyCmd}
            className="inline-flex items-center gap-3 px-4.5 py-2.5 bg-black/45 backdrop-blur-sm border border-border rounded-[9px] text-muted cursor-pointer font-mono text-[13px] hover:border-accent max-w-full"
          >
            <span className="text-accent select-none shrink-0">$</span>
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
              {cmd}
            </span>
            <span
              className={`shrink-0 transition-colors duration-200 ${copied ? "text-green" : "text-muted"}`}
            >
              {copied ? (
                <Check size={13} aria-hidden="true" />
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-7.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="animate-[scrollBounce_2.4s_ease-in-out_infinite] flex flex-col items-center gap-1.5">
          <div className="w-px h-9 bg-linear-to-b from-muted to-transparent" />
          <span className="text-[11px] text-muted font-mono uppercase">
            scroll
          </span>
        </div>
      </div>
    </section>
  );
}

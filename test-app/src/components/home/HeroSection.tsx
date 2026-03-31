import { useState } from "react";
import { Check } from "lucide-react";
import { FlowCurrents } from "alg-art-backgrounds";
import { navigate } from "../../lib/navigate";
import { ROUTES, CLI_PACKAGE } from "../../lib/constants";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const cmd = `npx ${CLI_PACKAGE} add flow-currents`;

  const copyCmd = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative h-svh min-h-150 flex items-center justify-center overflow-hidden">
      {/* Live canvas background */}
      <FlowCurrents
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        count={2200}
        speed={0.75}
        colorWarm="#d97757"
        colorCool="#6a9bcc"
        colorAccent="#788c5d"
        trailOpacity={6}
        noiseEvol={0.0004}
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(12,12,20,0.2)_0%,rgba(12,12,20,0.72)_65%,rgba(12,12,20,0.97)_100%)]" />

      {/* Content */}
      <div className="relative text-center max-w-190 px-6">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.25 bg-accent-soft border border-accent-border rounded-full text-[11px] text-accent font-semibold tracking-[0.08em] mb-7 font-mono uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block animate-[pulseDot_1.8s_ease-in-out_infinite]" />
          Zero Dependencies · Copy-paste · shadcn/ui Style
        </div>

        {/* Headline */}
        <h1 className="hero-h1 font-display font-extrabold text-ink mb-6.5 leading-[0.92] tracking-[-0.045em] text-[clamp(52px,9vw,96px)]">
          Algorithmic Art
          <br />
          <span className="text-accent">for React</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub text-muted font-sans font-light leading-[1.65] mx-auto mb-10 max-w-135 text-[clamp(16px,2vw,19px)]">
          24 animated canvas backgrounds you own forever. Install with one
          command, customize every parameter, ship without adding a single npm
          dependency.
        </p>

        {/* CTA buttons */}
        <div className="hero-ctas flex gap-3 justify-center flex-wrap mb-7">
          <a
            href={ROUTES.studio}
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.studio);
            }}
            className="px-7.5 py-3.25 bg-accent border-none rounded-[10px] text-[#1a1a1a] text-[15px] font-bold cursor-pointer font-display tracking-[0.01em] hover:opacity-90 transition-opacity no-underline inline-block"
          >
            Open Studio →
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
            className="inline-flex items-center gap-3 px-4.5 py-2.5 bg-black/45 backdrop-blur-sm border border-border rounded-[9px] text-muted cursor-pointer font-mono text-[13px] hover:border-accent"
          >
            <span className="text-accent select-none">$</span>
            <span>{cmd}</span>
            <span
              className={`px-2.25 py-0.5 bg-faint rounded text-[11px] shrink-0 transition-colors duration-200 ${copied ? "text-green" : "text-muted"}`}
            >
              {copied ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={11} aria-hidden="true" /> copied
                </span>
              ) : (
                "copy"
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-7.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <div className="animate-[scrollBounce_2.4s_ease-in-out_infinite] flex flex-col items-center gap-1.5">
          <div className="w-px h-9 bg-linear-to-b from-muted to-transparent" />
          <span className="text-[10px] text-muted tracking-[0.14em] font-mono uppercase">
            scroll
          </span>
        </div>
      </div>
    </section>
  );
}

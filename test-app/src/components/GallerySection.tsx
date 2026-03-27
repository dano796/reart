import { useState, type CSSProperties } from "react";
import {
  FlowCurrents,
  WaveEther,
  GravityStorm,
  GeoPulse,
  VortexBloom,
  CrystallineDrift,
  AmbientMesh,
} from "alg-art-backgrounds";

type BgComponentProps = { style?: CSSProperties; [key: string]: unknown };

const GALLERY_ITEMS: Array<{
  id: string;
  name: string;
  desc: string;
  tag: string;
  Component: React.ComponentType<BgComponentProps>;
  props: BgComponentProps;
}> = [
  {
    id: "flow-currents",
    name: "Flow Currents",
    tag: "Perlin Noise · Particles",
    desc: "Thousands of particles trace Perlin noise vector fields, forming organic density maps that slowly evolve over time.",
    Component: FlowCurrents as React.ComponentType<BgComponentProps>,
    props: {
      count: 1600, speed: 0.8, trailOpacity: 6,
      colorWarm: "#d97757", colorCool: "#6a9bcc", colorAccent: "#788c5d",
    },
  },
  {
    id: "wave-ether",
    name: "Wave Ether",
    tag: "Interference Waves · Grid",
    desc: "Multi-source sine wave interference patterns ripple across a pixel grid, shifting between crest and trough colors.",
    Component: WaveEther as React.ComponentType<BgComponentProps>,
    props: {
      sources: 3, frequency: 0.018, waveSpeed: 0.025,
      colorCrest: "#00d4ff", colorTrough: "#0a0a2e", colorMid: "#7b2fff",
    },
  },
  {
    id: "gravity-storm",
    name: "Gravity Storm",
    tag: "N-Body · Attractors",
    desc: "Particles orbit moving gravitational attractors, trails painting a choreography of orbital dynamics on the canvas.",
    Component: GravityStorm as React.ComponentType<BgComponentProps>,
    props: {
      count: 900, attractors: 3, gravity: 1.0, turbulence: 0.5,
      colorCore: "#ff6b35", colorTrail: "#7b5ea7",
    },
  },
  {
    id: "geo-pulse",
    name: "Geo Pulse",
    tag: "Geometry · Rotation",
    desc: "Nested rotating polygons at prime-ratio angular velocities, pulsing in scale and connecting vertices across layers.",
    Component: GeoPulse as React.ComponentType<BgComponentProps>,
    props: {
      layers: 7, sides: 6, rotSpeed: 0.008, pulse: 0.12, connect: 0.4,
      colorPrimary: "#d97757", colorSecondary: "#6a9bcc", colorAccent: "#e8d87a",
    },
  },
  {
    id: "vortex-bloom",
    name: "Vortex Bloom",
    tag: "Vortex · Orbital",
    desc: "Particles spiral under competing vortex attractors, accumulating into mandala-like formations through orbital crystallization.",
    Component: VortexBloom as React.ComponentType<BgComponentProps>,
    props: {
      vortexCount: 4, particleCount: 2000, orbitStrength: 1.2, spiralTightness: 0.9,
      fadeRate: 4, trailWeight: 0.7,
      colorA: "#d97757", colorB: "#6a9bcc", colorC: "#e8c46a",
    },
  },
  {
    id: "crystalline-drift",
    name: "Crystalline Drift",
    tag: "Fractal · Symmetry",
    desc: "Recursive branching arms grow from the center, guided by noise, forming snowflake-like crystal mandala structures.",
    Component: CrystallineDrift as React.ComponentType<BgComponentProps>,
    props: {
      symmetry: 6, maxDepth: 7, angleVariance: 0.5, segmentLength: 6, branchInterval: 12,
      crystalColor: "#6ab8e8", glowColor: "#c4e8ff",
    },
  },
  {
    id: "ambient-mesh",
    name: "Ambient Mesh",
    tag: "Network · Subtle",
    desc: "Nodes drift through noise fields, forming dynamic connections — a living network designed as a subtle, aesthetic background.",
    Component: AmbientMesh as React.ComponentType<BgComponentProps>,
    props: {
      nodeCount: 80, connectionDistance: 150, motionSpeed: 0.3, breatheSpeed: 0.5,
      edgeOpacity: 0.3, nodeSize: 4, nodeGlow: 0.8,
      nodeColor: "#50b8e8", edgeColor: "#50b8e8",
    },
  },
];

function GalleryCard({
  item,
  index,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const cmd = `npx alg-art-backgrounds add ${item.id}`;

  return (
    <div
      className="bg-surface border border-border rounded-[18px] overflow-hidden transition-[border-color,transform,box-shadow] duration-[220ms] hover:-translate-y-[3px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-border-hover"
      style={{
        animation: "cardIn 0.5s ease both",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Live canvas preview */}
      <div className="relative h-[220px] bg-bg">
        <item.Component
          {...item.props}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        {/* Bottom fade-out */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
        {/* Tag chip */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-bg/75 backdrop-blur-sm border border-border rounded-full text-[10px] text-muted font-mono tracking-[0.04em]">
          {item.tag}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-[18px] pb-5">
        <div className="font-display font-bold text-[18px] text-ink mb-2 tracking-[-0.02em]">
          {item.name}
        </div>
        <p className="text-[13px] text-muted leading-[1.65] mb-[18px] font-sans font-light">
          {item.desc}
        </p>

        {/* Copy install command */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="w-full flex items-center gap-2 px-[13px] py-[9px] bg-bg border border-border rounded-lg cursor-pointer font-mono text-[12px] text-muted text-left transition-colors hover:border-border-hover"
        >
          <span className="text-accent shrink-0 select-none">$</span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{cmd}</span>
          <span
            className="text-[13px] shrink-0 transition-colors duration-200"
            style={{ color: copied ? "var(--color-green)" : "var(--color-muted)" }}
          >
            {copied ? "✓" : "⎘"}
          </span>
        </button>
      </div>
    </div>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="py-[110px] px-10 max-w-[1120px] mx-auto">
      {/* Section header */}
      <div className="mb-[60px] max-w-[580px]">
        <div className="font-mono text-[11px] text-accent tracking-[0.12em] font-medium mb-[14px] uppercase">
          Backgrounds
        </div>
        <h2
          className="font-display font-extrabold text-ink leading-none tracking-[-0.04em] mb-[18px]"
          style={{ fontSize: "clamp(32px, 5vw, 52px)" }}
        >
          Seven distinct systems.
          <br />
          <span className="text-muted font-semibold">Infinite configurations.</span>
        </h2>
        <p className="text-[15px] text-muted leading-[1.7] font-sans font-light">
          Each background is a self-contained canvas renderer. Install one or all
          — you get the full source directly in your project with no npm dependency.
        </p>
      </div>

      {/* 2×2 grid */}
      <div className="grid gap-[22px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {GALLERY_ITEMS.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

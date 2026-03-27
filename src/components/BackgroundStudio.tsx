/**
 * BackgroundStudio — interactive playground for alg-art-backgrounds.
 *
 * Left panel: background selector + live parameter controls (auto-generated
 * from schema). Right panel: full canvas preview. Bottom sheet: code export.
 *
 * No external UI library dependencies — inline styles only.
 */

import { useState, useCallback, CSSProperties } from "react";
import { FlowCurrents } from "./FlowCurrents";
import { GravityStorm } from "./GravityStorm";
import { GeoPulse } from "./GeoPulse";
import { WaveEther } from "./WaveEther";
import { VortexBloom } from "./VortexBloom";
import { CrystallineDrift } from "./CrystallineDrift";
import { AmbientMesh } from "./AmbientMesh";
import {
  flowCurrentsSchema,
  flowCurrentsDefaults,
  gravityStormSchema,
  gravityStormDefaults,
  geoPulseSchema,
  geoPulseDefaults,
  waveEtherSchema,
  waveEtherDefaults,
  vortexBloomSchema,
  vortexBloomDefaults,
  crystallineDriftSchema,
  crystallineDriftDefaults,
  ambientMeshSchema,
  ambientMeshDefaults,
  type ParamSchema,
  type FlowCurrentsParams,
  type GravityStormParams,
  type GeoPulseParams,
  type WaveEtherParams,
  type VortexBloomParams,
  type CrystallineDriftParams,
  type AmbientMeshParams,
} from "./schemas";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type BackgroundId = "flow-currents" | "gravity-storm" | "geo-pulse" | "wave-ether" | "vortex-bloom" | "crystalline-drift" | "ambient-mesh";
type AnyParams = Record<string, number | string | boolean>;

interface BackgroundEntry {
  id: BackgroundId;
  label: string;
  schema: ParamSchema[];
  defaults: AnyParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.ComponentType<any>;
  description: string;
  installId: string;
}

const BACKGROUNDS: BackgroundEntry[] = [
  {
    id: "flow-currents",
    label: "Flow Currents",
    schema: flowCurrentsSchema,
    defaults: flowCurrentsDefaults as AnyParams,
    Component: FlowCurrents,
    description: "Particles trace Perlin noise vector fields.",
    installId: "flow-currents",
  },
  {
    id: "gravity-storm",
    label: "Gravity Storm",
    schema: gravityStormSchema,
    defaults: gravityStormDefaults as AnyParams,
    Component: GravityStorm,
    description: "Orbital particle choreography around moving attractors.",
    installId: "gravity-storm",
  },
  {
    id: "geo-pulse",
    label: "Geo Pulse",
    schema: geoPulseSchema,
    defaults: geoPulseDefaults as AnyParams,
    Component: GeoPulse,
    description: "Nested rotating polygons at prime-ratio angular velocities.",
    installId: "geo-pulse",
  },
  {
    id: "wave-ether",
    label: "Wave Ether",
    schema: waveEtherSchema,
    defaults: waveEtherDefaults as AnyParams,
    Component: WaveEther,
    description: "Multi-source interference waves across a pixel grid.",
    installId: "wave-ether",
  },
  {
    id: "vortex-bloom",
    label: "Vortex Bloom",
    schema: vortexBloomSchema,
    defaults: vortexBloomDefaults as AnyParams,
    Component: VortexBloom,
    description: "Particles spiral under competing vortex attractors.",
    installId: "vortex-bloom",
  },
  {
    id: "crystalline-drift",
    label: "Crystalline Drift",
    schema: crystallineDriftSchema,
    defaults: crystallineDriftDefaults as AnyParams,
    Component: CrystallineDrift,
    description: "Recursive branching arms form snowflake-like crystals.",
    installId: "crystalline-drift",
  },
  {
    id: "ambient-mesh",
    label: "Ambient Mesh",
    schema: ambientMeshSchema,
    defaults: ambientMeshDefaults as AnyParams,
    Component: AmbientMesh,
    description: "Nodes drift through noise fields forming dynamic connections.",
    installId: "ambient-mesh",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Token system
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  dark: "#0c0c14",
  panel: "#13131f",
  border: "#1e1e30",
  accent: "#d97757",
  accentHover: "#c86641",
  text: "#e8e6dc",
  muted: "#6b6a78",
  input: "#1a1a28",
  white: "#ffffff",
  blue: "#6a9bcc",
  green: "#788c5d",
};

// ─────────────────────────────────────────────────────────────────────────────
// Code export generator
// ─────────────────────────────────────────────────────────────────────────────

function generateUsageSnippet(bg: BackgroundEntry, params: AnyParams): string {
  const componentName = bg.id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

  const changedProps = bg.schema
    .filter((s) => params[s.name] !== s.default)
    .map((s) => {
      const val = params[s.name];
      if (s.type === "color" || s.type === "select") return `  ${s.name}="${val}"`;
      return `  ${s.name}={${val}}`;
    });

  if (changedProps.length === 0) return `<${componentName} />`;
  return `<${componentName}\n${changedProps.join("\n")}\n/>`;
}

function generateFullComponent(bg: BackgroundEntry): string {
  const componentName = bg.id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
  return (
    `import { ${componentName} } from "alg-art-backgrounds";\n\n` +
    `export default function MyPage() {\n` +
    `  return (\n` +
    `    <div style={{ position: "relative", height: "100vh" }}>\n` +
    `      <${componentName}\n` +
    `        style={{ position: "absolute", inset: 0 }}\n` +
    `      />\n` +
    `      <div style={{ position: "relative", zIndex: 1 }}>\n` +
    `        {/* your content here */}\n` +
    `      </div>\n` +
    `    </div>\n` +
    `  );\n` +
    `}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const displayVal = step < 0.01 ? value.toFixed(4) : step < 0.1 ? value.toFixed(3) : step < 1 ? value.toFixed(2) : String(value);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace" }}>{displayVal}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: T.accent, cursor: "pointer" }}
      />
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 12, color: T.text, flex: 1 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: 28, height: 28, border: "none", borderRadius: 6, cursor: "pointer", background: "none", padding: 0 }}
        />
        <span style={{ fontSize: 11, color: T.muted, fontFamily: "monospace" }}>{value}</span>
      </div>
    </div>
  );
}

function CodeBlock({ code, onCopy }: { code: string; onCopy: () => void }) {
  return (
    <div style={{ position: "relative" }}>
      <pre
        style={{
          background: T.dark,
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          padding: "16px 48px 16px 16px",
          fontSize: 12,
          lineHeight: 1.6,
          color: T.text,
          overflowX: "auto",
          fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace",
          margin: 0,
          whiteSpace: "pre",
        }}
      >
        {code}
      </pre>
      <button
        onClick={onCopy}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: T.border,
          border: "none",
          borderRadius: 4,
          color: T.muted,
          fontSize: 11,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        copy
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export function BackgroundStudio() {
  const [activeId, setActiveId] = useState<BackgroundId>("flow-currents");
  const [paramMap, setParamMap] = useState<Record<BackgroundId, AnyParams>>({
    "flow-currents": { ...(flowCurrentsDefaults as AnyParams) },
    "gravity-storm": { ...(gravityStormDefaults as AnyParams) },
    "geo-pulse": { ...(geoPulseDefaults as AnyParams) },
    "wave-ether": { ...(waveEtherDefaults as AnyParams) },
    "vortex-bloom": { ...(vortexBloomDefaults as AnyParams) },
    "crystalline-drift": { ...(crystallineDriftDefaults as AnyParams) },
    "ambient-mesh": { ...(ambientMeshDefaults as AnyParams) },
  });
  const [exportOpen, setExportOpen] = useState(false);
  const [exportTab, setExportTab] = useState<"usage" | "full">("usage");
  const [copied, setCopied] = useState(false);

  const bg = BACKGROUNDS.find((b) => b.id === activeId)!;
  const params = paramMap[activeId];

  const setParam = useCallback(
    (name: string, value: number | string | boolean) => {
      setParamMap((prev) => ({
        ...prev,
        [activeId]: { ...prev[activeId], [name]: value },
      }));
    },
    [activeId]
  );

  const resetParams = useCallback(() => {
    setParamMap((prev) => ({ ...prev, [activeId]: { ...bg.defaults } }));
  }, [activeId, bg.defaults]);

  const randomSeed = useCallback(() => {
    setParam("seed", Math.floor(Math.random() * 999999) + 1);
  }, [setParam]);

  const exportCode =
    exportTab === "usage"
      ? generateUsageSnippet(bg, params)
      : generateFullComponent(bg);

  const copyCode = () => {
    navigator.clipboard.writeText(exportCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const { Component } = bg;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: T.dark,
        fontFamily: "'Inter', system-ui, sans-serif",
        color: T.text,
        overflow: "hidden",
      }}
    >
      {/* ── SIDEBAR ────────────────────────────────────────────── */}
      <div
        style={{
          width: 280,
          flexShrink: 0,
          background: T.panel,
          borderRight: `1px solid ${T.border}`,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 16px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Background Studio</div>
          <div style={{ fontSize: 11, color: T.muted }}>alg-art-backgrounds</div>
        </div>

        <div style={{ borderBottom: `1px solid ${T.border}` }} />

        {/* Background selector */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Background
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
            {BACKGROUNDS.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveId(b.id)}
                style={{
                  background: activeId === b.id ? T.accent : T.input,
                  border: `1px solid ${activeId === b.id ? T.accent : T.border}`,
                  borderRadius: 6,
                  padding: "8px 6px",
                  color: activeId === b.id ? T.white : T.muted,
                  fontSize: 11,
                  fontWeight: activeId === b.id ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "center",
                  lineHeight: 1.3,
                  transition: "all 0.15s",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 11, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>
            {bg.description}
          </div>
        </div>

        <div style={{ borderBottom: `1px solid ${T.border}` }} />

        {/* Parameters */}
        <div style={{ padding: "16px 16px 0", flex: 1 }}>
          <div style={{ fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
            Parameters
          </div>

          {bg.schema.map((s) => {
            const val = params[s.name];
            if (s.type === "number") {
              return (
                <Slider
                  key={s.name}
                  label={s.label}
                  value={val as number}
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  onChange={(v) => setParam(s.name, v)}
                />
              );
            }
            if (s.type === "color") {
              return (
                <ColorPicker
                  key={s.name}
                  label={s.label}
                  value={val as string}
                  onChange={(v) => setParam(s.name, v)}
                />
              );
            }
            return null;
          })}
        </div>

        {/* Actions */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={randomSeed}
              style={btnStyle(T.blue)}
            >
              ↻ Random Seed
            </button>
            <button
              onClick={resetParams}
              style={btnStyle(T.input, T.muted)}
            >
              Reset
            </button>
          </div>
          <button
            onClick={() => setExportOpen((o) => !o)}
            style={btnStyle(T.accent)}
          >
            {exportOpen ? "Hide" : "Export"} Code
          </button>
        </div>
      </div>

      {/* ── PREVIEW ────────────────────────────────────────────── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Component {...params} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

        {/* Install hint */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 11,
            color: T.muted,
            fontFamily: "monospace",
          }}
        >
          npx alg-art-backgrounds add {bg.installId}
        </div>

        {/* Export panel */}
        {exportOpen && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(13,13,21,0.97)",
              backdropFilter: "blur(12px)",
              borderTop: `1px solid ${T.border}`,
              padding: 20,
              maxHeight: "45%",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Code Export</div>
              <div style={{ flex: 1 }} />
              {(["usage", "full"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExportTab(tab)}
                  style={{
                    background: exportTab === tab ? T.accent : T.input,
                    border: "none",
                    borderRadius: 4,
                    color: exportTab === tab ? T.white : T.muted,
                    fontSize: 11,
                    padding: "4px 10px",
                    cursor: "pointer",
                    fontWeight: exportTab === tab ? 600 : 400,
                  }}
                >
                  {tab === "usage" ? "Usage" : "Full File"}
                </button>
              ))}
              <button
                onClick={() => setExportOpen(false)}
                style={{ background: "none", border: "none", color: T.muted, fontSize: 16, cursor: "pointer", padding: "0 4px" }}
              >
                ×
              </button>
            </div>

            <CodeBlock code={exportCode} onCopy={copyCode} />

            <div style={{ marginTop: 12, fontSize: 11, color: T.muted }}>
              {copied ? (
                <span style={{ color: T.green }}>Copied to clipboard</span>
              ) : (
                <>
                  CLI install:{" "}
                  <code
                    style={{ fontFamily: "monospace", background: T.input, padding: "2px 6px", borderRadius: 4 }}
                  >
                    npx alg-art-backgrounds add {bg.installId}
                  </code>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, color = "#ffffff"): CSSProperties {
  return {
    flex: 1,
    background: bg,
    border: "none",
    borderRadius: 6,
    color,
    fontSize: 12,
    fontWeight: 500,
    padding: "8px 10px",
    cursor: "pointer",
    fontFamily: "inherit",
  };
}

import { useState, useEffect, useRef } from "react";
import { Monitor, Code2 } from "lucide-react";
import type { DocEntry } from "./registry";
import { navigate } from "../../lib/navigate";
import { studioRoute, CLI_PACKAGE } from "../../lib/constants";
import { PropsTable } from "./PropsTable";
import { CodeBlock } from "./CodeBlock";
import { generateFullSnippet } from "./generateSnippet";
import { DemoContentOverlay } from "../shared/DemoContentOverlay";

type Tab = "preview" | "code";

export function BackgroundView({
  entry,
  params,
  onParamChange: _onParamChange,
}: {
  entry: DocEntry;
  params: Record<string, unknown>;
  onParamChange: (name: string, value: unknown) => void;
}) {
  const [showContent, setShowContent] = useState(true);
  const [tab, setTab] = useState<Tab>("preview");
  const [inView, setInView] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Once visible, stay visible — prevents "Loading…" on tab switch
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fullSnippet = generateFullSnippet(entry.id, entry.schema, params);

  return (
    <div>
      {/* Title */}
      <h1 className="font-display font-extrabold text-ink tracking-[-0.04em] leading-[1.05] mb-6 text-[clamp(28px,4vw,42px)]">
        {entry.name}
      </h1>

      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          {(["preview", "code"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-sans cursor-pointer border-0 bg-transparent transition-colors -mb-px border-b-2 ${tab === t ? "text-ink font-medium border-b-accent" : "text-muted font-normal border-b-transparent"}`}
            >
              {t === "preview" ? (
                <Monitor size={14} aria-hidden="true" />
              ) : (
                <Code2 size={14} aria-hidden="true" />
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => navigate(studioRoute(entry.id))}
          className="flex items-center gap-1 px-2.5 py-1.25 text-[12px] rounded-md text-[#1a1a1a] font-semibold font-display bg-accent hover:opacity-90 transition-opacity cursor-pointer border-0 mb-px"
        >
          Open in Studio
        </button>
      </div>

      {/* ── PREVIEW TAB ── */}
      <div className={tab === "preview" ? "block" : "hidden"}>
        {/* Canvas */}
        <div
          ref={previewRef}
          className="relative bg-bg overflow-hidden mt-2 rounded-xl h-105"
        >
          {inView && (
            <entry.Component
              {...params}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          )}
          {!inView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted text-[12px] font-mono">Loading…</span>
            </div>
          )}

          {/* Demo content overlay */}
          {showContent && <DemoContentOverlay />}
        </div>

        {/* Demo Content toggle — below the canvas */}
        <div className="flex items-center justify-end gap-2.5 border-b border-border py-2.5 px-3.5">
          <span className="text-[12px] font-sans text-muted">Demo Content</span>
          <button
            onClick={() => setShowContent((v) => !v)}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer border-0 shrink-0 ${showContent ? "bg-accent" : "bg-faint"}`}
          >
            <span
              className={`absolute w-3.5 h-3.5 top-0.75 left-0.75 rounded-full bg-white transition-transform duration-200 ${showContent ? "translate-x-4" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Props section */}
        <div className="mt-10 mb-10">
          <h2 className="font-display font-bold text-ink tracking-[-0.02em] mb-5 text-[clamp(20px,2.5vw,28px)]">
            Props
          </h2>
          <PropsTable schema={entry.schema} />
        </div>
      </div>

      {/* ── CODE TAB ── */}
      <div className={`${tab === "code" ? "block" : "hidden"} pt-9`}>
        <h2 className="font-display font-bold text-ink tracking-[-0.02em] mb-4 text-[clamp(20px,2.5vw,28px)]">
          Install
        </h2>
        <CodeBlock
          code={`npx ${CLI_PACKAGE} add ${entry.id}`}
          label="terminal"
        />

        <h2 className="font-display font-bold text-ink tracking-[-0.02em] mb-4 text-[clamp(20px,2.5vw,28px)]">
          Usage
        </h2>
        <CodeBlock code={fullSnippet} label={`${entry.name}.tsx`} />
      </div>
    </div>
  );
}

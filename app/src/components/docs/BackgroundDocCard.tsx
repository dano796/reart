import { useState, useEffect, useRef, useCallback } from "react";
import type { DocEntry } from "./registry";
import { ParamControls } from "./controls/ParamControls";
import { PropsTable } from "./PropsTable";
import { CodeBlock } from "./CodeBlock";
import { generateSnippet } from "./generateSnippet";
import { navigate } from "../../lib/navigate";
import { studioRoute } from "../../lib/constants";

export function BackgroundDocCard({ entry }: { entry: DocEntry }) {
  const [params, setParams] = useState<Record<string, unknown>>(() => ({
    ...entry.defaults,
  }));
  const [showContent, setShowContent] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lazy-mount canvas — only animate when near the viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "200px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleChange = useCallback((name: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setParams({ ...entry.defaults });
  }, [entry.defaults]);

  const snippet = generateSnippet(entry.id, entry.schema, params);

  return (
    <div
      ref={cardRef}
      id={`docs-bg-${entry.id}`}
      data-doc-section
      className="bg-surface border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <h3 className="font-display font-bold text-[18px] text-ink">
          {entry.name}
        </h3>
        <span className="px-2.5 py-1 bg-bg border border-border rounded-full text-[10px] text-muted font-mono">
          {entry.tag}
        </span>
      </div>

      {/* Preview */}
      <div className="border-b border-border">
        <div className="relative bg-bg overflow-hidden h-70">
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

          {/* With-content overlay */}
          {showContent && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-8">
              <h2 className="font-display font-bold text-center text-ink text-[clamp(20px,4vw,28px)] [text-shadow:0_2px_16px_rgba(0,0,0,0.6)]">
                Your Page Heading
              </h2>
              <p className="text-[14px] text-ink/80 text-center font-sans max-w-75 leading-[1.6] [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                Content layers naturally on top. The background fills the
                container behind it.
              </p>
              <button className="px-5 py-2 bg-accent rounded-lg text-white text-[13px] font-semibold font-display hover:opacity-90 transition-opacity">
                Call to Action
              </button>
            </div>
          )}
        </div>

        {/* Preview toggle */}
        <div className="flex items-center gap-1 px-4 py-3">
          <span className="text-[11px] text-muted font-mono mr-2">
            Preview:
          </span>
          {(["bare", "with content"] as const).map((mode) => {
            const active = mode === "bare" ? !showContent : showContent;
            return (
              <button
                key={mode}
                onClick={() => setShowContent(mode === "with content")}
                className={`px-3 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${active ? "bg-accent-soft border-accent-border text-accent" : "bg-transparent border-border text-muted"}`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <span className="text-[11px] text-muted font-mono uppercase">
            Customize
          </span>
          <button
            onClick={handleReset}
            className="text-[11px] text-muted font-mono hover:text-ink transition-colors cursor-pointer bg-transparent border-0 px-0"
          >
            Reset to defaults
          </button>
        </div>
        <ParamControls
          schema={entry.schema}
          params={params}
          onChange={handleChange}
        />
      </div>

      {/* Action row */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <button
          onClick={() => navigate(studioRoute(entry.id))}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent rounded-lg text-[#1a1a1a] text-[13px] font-semibold font-display hover:opacity-90 transition-opacity cursor-pointer border-0"
        >
          Open in Studio
          <span className="text-[11px] opacity-80">↗</span>
        </button>
        <button
          onClick={() => setShowCode((v) => !v)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold font-display transition-colors cursor-pointer border ${showCode ? "bg-accent-soft border-accent-border text-accent" : "bg-transparent border-border text-muted"}`}
        >
          View Code
          <span className="text-[11px]">{showCode ? "▲" : "▼"}</span>
        </button>
      </div>

      {/* Code snippet (collapsible) */}
      {showCode && (
        <div className="px-6 py-5 border-b border-border">
          <CodeBlock code={snippet} label={`${entry.name}.tsx`} />
        </div>
      )}

      {/* Props table */}
      <div className="px-0 py-0">
        <div className="px-6 py-3 border-b border-border/50">
          <span className="text-[11px] text-muted font-mono uppercase">
            Props
          </span>
        </div>
        <PropsTable schema={entry.schema} />
      </div>
    </div>
  );
}

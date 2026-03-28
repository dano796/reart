import { useState, useEffect, useRef } from "react";
import type { DocEntry } from "../docRegistry";
import { PropsTable } from "../PropsTable";
import { CodeBlock } from "../CodeBlock";
import { generateFullSnippet } from "../generateSnippet";

type Tab = "preview" | "code";

const IconMonitor = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconCode = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export function BackgroundPage({
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
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const fullSnippet = generateFullSnippet(entry.id, entry.schema, params);

  return (
    <div>
      {/* Title */}
      <h1
        className="docs-in font-display font-extrabold text-ink tracking-[-0.04em] leading-[1.05] mb-6"
        style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
      >
        {entry.name}
      </h1>

      {/* Tab bar */}
      <div className="docs-in-1 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          {(["preview", "code"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-sans cursor-pointer border-0 bg-transparent transition-colors"
              style={{
                color: tab === t ? "var(--color-ink)" : "var(--color-muted)",
                fontWeight: tab === t ? 500 : 400,
                borderBottom: tab === t ? "2px solid var(--color-accent)" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t === "preview" ? <IconMonitor /> : <IconCode />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            sessionStorage.setItem("studio-initial-bg", entry.id);
            window.history.pushState({}, "", "/Studio");
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          className="flex items-center gap-1 rounded-md text-white font-semibold font-display hover:opacity-90 transition-opacity cursor-pointer border-0 mb-px"
          style={{ padding: "5px 10px", fontSize: 12, background: "var(--color-accent)" }}
        >
          Open in Studio
        </button>
      </div>

      {/* ── PREVIEW TAB ── */}
      <div className="docs-in-2" style={{ display: tab === "preview" ? "block" : "none" }}>
        {/* Canvas */}
        <div
          ref={previewRef}
          className="relative bg-bg overflow-hidden mt-2 rounded-xl"
          style={{ height: 420, marginBottom: 0 }}
        >
          {inView && (
            <entry.Component
              {...params}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            />
          )}
          {!inView && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-muted text-[12px] font-mono">Loading…</span>
            </div>
          )}

          {/* Demo content overlay — raw content directly on canvas */}
          {showContent && (
            <div className="absolute inset-0 z-10 flex flex-col">
              {/* Fake navbar pinned to top */}
              <div
                className="flex items-center justify-between px-5 shrink-0"
                style={{
                  height: 44,
                  background: "rgba(12,12,20,0.35)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-md flex items-center justify-center text-white font-bold font-display shrink-0"
                    style={{ width: 20, height: 20, background: "var(--color-accent)", fontSize: 10 }}
                  >
                    A
                  </div>
                  <span className="text-[12px] font-display font-semibold text-ink">
                    YourBrand
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  {["Home", "About", "Docs"].map((link) => (
                    <span
                      key={link}
                      className="text-[12px] font-sans cursor-default"
                      style={{ color: "rgba(232,230,220,0.65)" }}
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>

              {/* Centered hero content */}
              <div className="flex-1 flex flex-col items-center justify-center gap-5">
                <div
                  className="font-mono mb-1"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    color: "var(--color-accent)",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ New Background
                </div>
                <h2
                  className="font-display font-bold text-ink text-center"
                  style={{
                    fontSize: "clamp(20px, 3.5vw, 30px)",
                    lineHeight: 1.15,
                    textShadow: "0 2px 24px rgba(0,0,0,0.8)",
                    maxWidth: 360,
                  }}
                >
                  The web, made fluid<br />at your fingertips.
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-lg text-white font-semibold font-display cursor-default border-0"
                    style={{ padding: "9px 22px", fontSize: 13, background: "var(--color-accent)" }}
                  >
                    Get Started
                  </button>
                  <button
                    className="rounded-lg font-semibold font-display cursor-default"
                    style={{
                      padding: "9px 22px",
                      fontSize: 13,
                      color: "rgba(232,230,220,0.85)",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Content toggle — below the canvas */}
        <div
          className="flex items-center justify-end gap-2.5 border-b border-border"
          style={{ padding: "10px 14px" }}
        >
          <span className="text-[12px] font-sans" style={{ color: "var(--color-muted)" }}>
            Demo Content
          </span>
          <button
            onClick={() => setShowContent((v) => !v)}
            className="relative rounded-full transition-colors duration-200 cursor-pointer border-0 shrink-0"
            style={{
              width: 36,
              height: 20,
              background: showContent ? "var(--color-accent)" : "var(--color-faint)",
            }}
          >
            <span
              className="absolute rounded-full bg-white transition-transform duration-200"
              style={{
                width: 14,
                height: 14,
                top: 3,
                left: 3,
                transform: showContent ? "translateX(16px)" : "translateX(0px)",
              }}
            />
          </button>
        </div>

        {/* Props section */}
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <h2
            className="font-display font-bold text-ink tracking-[-0.02em] mb-5"
            style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
          >
            Props
          </h2>
          <PropsTable schema={entry.schema} />
        </div>
      </div>

      {/* ── CODE TAB ── */}
      <div style={{ display: tab === "code" ? "block" : "none", paddingTop: 36 }}>
        <h2
          className="font-display font-bold text-ink tracking-[-0.02em] mb-4"
          style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
        >
          Install
        </h2>
        <CodeBlock
          code={`npx alg-art-backgrounds add ${entry.id}`}
          label="terminal"
        />

        <h2
          className="font-display font-bold text-ink tracking-[-0.02em] mb-4"
          style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
        >
          Usage
        </h2>
        <CodeBlock code={fullSnippet} label={`${entry.name}.tsx`} />
      </div>
    </div>
  );
}

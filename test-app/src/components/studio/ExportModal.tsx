import { useState, useEffect } from "react";
import { Copy, Check, X } from "lucide-react";
import type { BackgroundEntry, AnyParams } from "./types";
import { generateUsageSnippet, generateFullComponent } from "./codeGenerators";
import { CodeBlock } from "./CodeBlock";

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyBtn({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-md border cursor-pointer transition-all duration-150 ${
        copied
          ? "bg-green/10 border-green/20 text-green"
          : "bg-transparent border-border/60 text-muted hover:text-ink hover:border-border-hover"
      }`}
    >
      {copied ? (
        <Check size={13} aria-hidden="true" />
      ) : (
        <Copy size={13} aria-hidden="true" />
      )}
    </button>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ExportModalProps {
  bg: BackgroundEntry;
  params: AnyParams;
  onClose: () => void;
}

export function ExportModal({ bg, params, onClose }: ExportModalProps) {
  const [codeTab, setCodeTab] = useState<"usage" | "full">("usage");
  const [copiedInstall, setCopiedInstall] = useState(false);

  const installCmd = `npx alg-art-backgrounds add ${bg.id}`;
  const displayCode =
    codeTab === "usage"
      ? generateUsageSnippet(bg, params)
      : generateFullComponent(bg, params);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const copyInstall = () =>
    navigator.clipboard.writeText(installCmd).then(() => {
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 1500);
    });

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 pt-17.5 md:p-6 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-surface border border-border rounded-2xl w-160 max-w-full h-[min(760px,calc(100vh-5rem))] md:h-[min(760px,90vh)] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[16px] font-bold font-display text-ink tracking-[-0.01em]">
            Export Your Background
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-faint cursor-pointer bg-transparent border border-transparent hover:border-border transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 px-6 py-5 flex flex-col gap-5 overflow-hidden">
          {/* Step 1 */}
          <div>
            <h3 className="mb-3 text-[16px] font-bold font-display text-ink tracking-[-0.01em]">
              Step 1: Install via CLI
            </h3>

            <div className="flex items-center gap-3 bg-bg border border-border rounded-xl px-4 py-3">
              <code className="text-[13px] font-mono text-ink/90 flex-1 truncate">
                {installCmd}
              </code>
              <CopyBtn copied={copiedInstall} onClick={copyInstall} />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[16px] font-bold font-display text-ink tracking-[-0.02em]">
                Step 2: Copy Code
              </h3>
              <div className="flex bg-bg border border-border font-display rounded-lg p-0.5 tracking-[-0.02em]">
                {(["usage", "full"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCodeTab(tab)}
                    className={`text-[11px] px-3 py-1.5 rounded-md cursor-pointer border-none font-mono transition-all duration-150 ${
                      codeTab === tab
                        ? "bg-faint text-ink font-medium"
                        : "bg-transparent text-muted hover:text-ink"
                    }`}
                  >
                    {tab === "usage" ? "Usage" : "Full File"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              <CodeBlock
                code={displayCode}
                label={codeTab === "usage" ? "component.tsx" : "page.tsx"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Check } from "lucide-react";

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between px-4 py-2.25 bg-faint rounded-t-[9px] border-b border-border">
        <span className="text-[12px] text-muted font-mono">{label}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={`bg-transparent border border-border rounded-[5px] text-[11px] px-2.5 py-0.5 cursor-pointer font-sans transition-colors duration-200 ${copied ? "text-green" : "text-muted"}`}
        >
          {copied ? (
            <span className="inline-flex items-center gap-1">
              <Check size={11} aria-hidden="true" /> copied
            </span>
          ) : (
            "copy"
          )}
        </button>
      </div>
      <pre className="flex-1 min-h-0 bg-surface border border-border border-t-0 rounded-b-[9px] px-6 py-5 text-[12px] leading-[1.75] text-ink overflow-auto font-mono m-0 whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

import { CLI_PACKAGE } from "../../lib/constants";

const META_TAGS = ["MIT License", "Zero dependencies", "Copy-paste install"];

export function Footer() {
  return (
    <footer className="border-t border-border px-5 md:px-10 py-7 flex items-center justify-between flex-wrap gap-4 bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-[12px] font-bold text-[#1a1a1a] font-display">
          A
        </div>
        <span className="text-[13px] text-muted font-display font-semibold">
          {CLI_PACKAGE}
        </span>
      </div>

      {/* Meta tags */}
      <div className="flex gap-2.5 flex-wrap items-center">
        {META_TAGS.map((t) => (
          <span
            key={t}
            className="text-[11px] text-muted font-mono px-2.5 py-0.5 border border-border rounded-full"
          >
            {t}
          </span>
        ))}
      </div>
    </footer>
  );
}

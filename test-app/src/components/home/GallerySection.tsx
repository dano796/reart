import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { DOC_REGISTRY } from "../docs/registry";
import { CLI_PACKAGE } from "../../lib/constants";

function GalleryCard({
  item,
  index,
}: {
  item: (typeof DOC_REGISTRY)[0];
  index: number;
}) {
  const [copied, setCopied] = useState(false);
  const cmd = `npx ${CLI_PACKAGE} add ${item.id}`;

  return (
    <div
      className="bg-surface border border-border rounded-[18px] overflow-hidden hover:border-accent focus-within:border-accent animate-[cardIn_0.5s_ease_both]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Live canvas preview */}
      <div className="relative h-55 bg-bg">
        <item.Component
          {...item.galleryProps}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {/* Bottom fade-out */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-surface to-transparent pointer-events-none" />
        {/* Tag chip */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-bg/75 backdrop-blur-sm border border-border rounded-full text-[10px] text-muted font-mono tracking-[0.04em]">
          {item.tag}
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 pt-4.5 pb-5">
        <div className="font-display font-bold text-[18px] text-ink mb-2 tracking-[-0.02em]">
          {item.name}
        </div>
        <p className="text-[13px] text-muted leading-[1.65] mb-4.5 font-sans font-light">
          {item.desc}
        </p>

        {/* Copy install command */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(cmd);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="w-full flex items-center gap-2 px-3.25 py-2.25 bg-bg border border-border rounded-lg cursor-pointer font-mono text-[12px] text-muted text-left hover:border-accent focus-visible:border-accent focus-visible:outline-none"
        >
          <span className="text-accent shrink-0 select-none">$</span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
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
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="py-27.5 px-10 max-w-280 mx-auto">
      {/* Section header */}
      <div className="mb-15 max-w-145">
        <div className="font-mono text-[11px] text-accent tracking-[0.12em] font-medium mb-3.5 uppercase">
          Backgrounds
        </div>
        <h2 className="font-display font-extrabold text-ink leading-none tracking-[-0.04em] mb-4.5 text-[clamp(32px,5vw,52px)]">
          24 distinct systems.
          <br />
          <span className="text-muted font-semibold">
            Infinite configurations.
          </span>
        </h2>
        <p className="text-[15px] text-muted leading-[1.7] font-sans font-light">
          Each background is a self-contained canvas renderer. Install one or
          all — you get the full source directly in your project with no npm
          dependency.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-5.5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {DOC_REGISTRY.map((item, i) => (
          <GalleryCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

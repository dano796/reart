import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { DOC_REGISTRY } from "../docs/registry";
import { CLI_PACKAGE, docsRoute } from "../../lib/constants";
import { navigate } from "../../lib/navigate";

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
      className="group bg-surface border border-border rounded-[18px] overflow-hidden hover:border-accent transition-[border-color] duration-300 ease-out animate-[cardIn_0.5s_ease_both]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Live canvas preview — clickable */}
      <div
        className="relative h-55 bg-bg cursor-pointer"
        onClick={() => navigate(docsRoute(item.id))}
        role="link"
        tabIndex={0}
        aria-label={`View docs for ${item.name}`}
        onKeyDown={(e) => e.key === "Enter" && navigate(docsRoute(item.id))}
      >
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
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-bg/75 backdrop-blur-sm border border-border rounded-full text-[10px] text-muted font-mono">
          {item.tag}
        </div>
        {/* Hover overlay — responds to card-level hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Card body */}
      <div className="px-5 pt-4.5 pb-5">
        <div
          className="font-display font-bold text-[18px] text-ink mb-2 cursor-pointer hover:text-accent transition-colors duration-150"
          onClick={() => navigate(docsRoute(item.id))}
        >
          {item.name}
        </div>
        <p className="text-[14px] text-muted leading-[1.65] mb-4.5 font-sans font-light">
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
    <section
      id="gallery"
      className="py-16 md:py-27.5 px-5 md:px-10 max-w-280 mx-auto"
    >
      {/* Section header */}
      <div className="mb-15 max-w-145">
        <div className="font-mono text-[12px] text-accent font-medium mb-3.5 uppercase">
          Backgrounds
        </div>
        <h2 className="font-display font-extrabold text-ink leading-none mb-4.5 text-[clamp(32px,5vw,52px)]">
          20+ Distinct Systems,
          <br />
          <span className="text-muted font-semibold">
            Infinite Configurations
          </span>
        </h2>
        <p className="text-[16px] text-muted leading-[1.7] font-sans font-light">
          Each background is a self-contained canvas renderer. Explore the
          gallery and pick the one you vibe with. Clic on any background to see
          its docs and customize it in the studio.
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

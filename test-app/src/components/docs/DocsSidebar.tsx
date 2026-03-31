import { useState } from "react";
import { Search, X } from "lucide-react";
import { DOC_REGISTRY } from "./registry";

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-[13px] font-sans cursor-pointer border-0 bg-transparent rounded-md flex items-center transition-[color,background,padding-left,border-color] duration-150 py-1.5 mb-1 pr-2.5 border-l-2 ${
        active
          ? "text-ink font-medium pl-2.5 border-l-accent bg-accent-soft"
          : "text-muted font-normal pl-3 border-l-transparent hover:text-ink hover:pl-3.5"
      }`}
    >
      <span className="truncate">{label}</span>
    </button>
  );
}

export function DocsSidebar({
  activePage,
  onNavigate,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? DOC_REGISTRY.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.tag.toLowerCase().includes(search.toLowerCase()),
      )
    : DOC_REGISTRY;

  return (
    <aside className="hidden lg:flex flex-col scrollbar-none sticky top-14.5 h-[calc(100vh-58px)] overflow-y-auto bg-bg">
      {/* Search */}
      <div className="border-b border-border pt-3 pb-3 pl-8">
        <div className="relative flex items-center">
          <Search size={12} aria-hidden="true" className="absolute left-2.5 shrink-0 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-mono text-[12px] outline-none rounded-md bg-surface border border-border text-ink pt-1.5 pr-2 pb-1.5 pl-7"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 text-muted hover:text-ink transition-colors cursor-pointer bg-transparent border-0 flex items-center"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="pt-6 pr-4 pb-8 pl-8">
        {/* Get Started group — hidden when searching */}
        {!search && (
          <div className="mb-6">
            <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] mb-3 text-muted px-2.5">
              Get Started
            </div>
            <SidebarItem
              label="Introduction"
              active={activePage === "introduction"}
              onClick={() => onNavigate("introduction")}
            />
            <SidebarItem
              label="Installation"
              active={activePage === "installation"}
              onClick={() => onNavigate("installation")}
            />
          </div>
        )}

        {/* Backgrounds group */}
        <div>
          {!search && (
            <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] mb-3 text-muted px-2.5">
              Backgrounds
              <span className="ml-2 px-2 py-0.5 font-mono text-[10px] rounded-xl text-accent bg-accent-soft">
                {DOC_REGISTRY.length}
              </span>
            </div>
          )}
          {search && filtered.length === 0 && (
            <p className="text-[12px] font-sans text-muted px-3 py-4 text-center">
              No results for "{search}"
            </p>
          )}
          {filtered.map((entry) => (
            <SidebarItem
              key={entry.id}
              label={entry.name}
              active={activePage === `bg-${entry.id}`}
              onClick={() => onNavigate(`bg-${entry.id}`)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

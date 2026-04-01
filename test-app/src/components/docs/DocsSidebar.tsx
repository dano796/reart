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
  isOpen,
  onClose,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? DOC_REGISTRY.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.tag.toLowerCase().includes(search.toLowerCase()),
      )
    : DOC_REGISTRY;

  const handleNavigate = (page: string) => {
    onNavigate(page);
    onClose?.();
  };

  return (
    <aside
      className={`
        fixed top-14.5 bottom-0 left-0 z-40 w-72 bg-bg flex flex-col scrollbar-none overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:top-auto lg:bottom-auto lg:w-auto lg:z-auto lg:translate-x-0 lg:flex
      `}
    >
      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-[13px] font-semibold text-ink font-display">Navigation</span>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-7 h-7 rounded-md text-muted hover:text-ink cursor-pointer bg-transparent border-0"
          aria-label="Cerrar navegación"
        >
          <X size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-border pt-3 pb-3 px-4 lg:pl-8 lg:pr-4 shrink-0">
        <div className="relative flex items-center">
          <Search
            size={12}
            aria-hidden="true"
            className="absolute left-2.5 shrink-0 text-muted"
          />
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

      <div className="pt-6 pr-4 pb-8 pl-8 flex-1 overflow-y-auto scrollbar-none">
        {/* Get Started group — hidden when searching */}
        {!search && (
          <div className="mb-6">
            <div className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] mb-3 text-muted px-2.5">
              Get Started
            </div>
            <SidebarItem
              label="Introduction"
              active={activePage === "introduction"}
              onClick={() => handleNavigate("introduction")}
            />
            <SidebarItem
              label="Installation"
              active={activePage === "installation"}
              onClick={() => handleNavigate("installation")}
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
              onClick={() => handleNavigate(`bg-${entry.id}`)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

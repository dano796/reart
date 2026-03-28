import { useState } from "react";
import { DOC_REGISTRY } from "./docRegistry";

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
      className="w-full text-left text-[13px] font-sans cursor-pointer border-0 bg-transparent rounded-md flex items-center"
      style={{
        color: active ? "var(--color-ink)" : "var(--color-muted)",
        fontWeight: active ? 500 : 400,
        padding: active ? "5px 10px 5px 10px" : "5px 10px 5px 12px",
        borderLeft: active
          ? "2px solid var(--color-accent)"
          : "2px solid transparent",
        background: active ? "var(--color-accent-soft)" : "transparent",
        transition: "color 0.15s ease, background 0.15s ease, transform 0.15s ease, padding-left 0.15s ease, border-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-ink)";
          (e.currentTarget as HTMLButtonElement).style.paddingLeft = "14px";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-muted)";
          (e.currentTarget as HTMLButtonElement).style.paddingLeft = "12px";
        }
      }}
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
          e.tag.toLowerCase().includes(search.toLowerCase())
      )
    : DOC_REGISTRY;

  return (
    <aside
      className="hidden lg:flex flex-col scrollbar-none"
      style={{
        position: "sticky",
        top: 58,
        height: "calc(100vh - 58px)",
        overflowY: "auto",
        background: "var(--color-bg)",
      }}
    >
      {/* Search */}
      <div
        className="border-b border-border"
        style={{ padding: "12px 16px 12px 32px" }}
      >
        <div className="relative flex items-center">
          <svg
            className="absolute left-2.5 shrink-0"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--color-muted)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-mono text-[12px] outline-none rounded-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-ink)",
              padding: "6px 8px 6px 28px",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 text-muted hover:text-ink transition-colors cursor-pointer bg-transparent border-0"
              style={{ fontSize: 14, lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 16px 28px 32px" }}>
        {/* Get Started group — hidden when searching */}
        {!search && (
          <div className="mb-5">
            <div
              className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--color-muted)", padding: "0 10px" }}
            >
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
            <div
              className="text-[12px] font-mono font-semibold uppercase tracking-[0.14em] mb-2"
              style={{ color: "var(--color-muted)", padding: "0 10px" }}
            >
              Backgrounds
              <span
                className="ml-2 px-2 py-0.5 font-mono text-[10px] rounded-xl"
                style={{
                  color: "var(--color-accent)",
                  background: "var(--color-accent-soft)",
                }}
              >
                {DOC_REGISTRY.length}
              </span>
            </div>
          )}
          {search && filtered.length === 0 && (
            <p
              className="text-[12px] font-sans px-3 py-4 text-center"
              style={{ color: "var(--color-muted)" }}
            >
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

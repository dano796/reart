import { useState } from "react";
import {
  RotateCcw,
  Share2,
  SquareArrowOutUpRight,
  ChevronDown,
  Check,
  X,
  CodeXml,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ParamSchema } from "@dano796/react-reart";
import type { BackgroundEntry, AnyParams, BackgroundId } from "./types";
import {
  SliderRow,
  ColorRow,
  BooleanRow,
  SelectRow,
  type NumberParam,
  type ColorParam,
  type BooleanParam,
  type SelectParam,
} from "./ParamControls";

interface SidebarProps {
  bg: BackgroundEntry;
  params: AnyParams;
  isDisabled?: boolean;
  activeId: BackgroundId;
  dropdownOpen: boolean;
  searchQuery: string;
  filtered: BackgroundEntry[];
  onSelectBg: (id: BackgroundId) => void;
  onToggleDropdown: () => void;
  onSearchChange: (q: string) => void;
  onParamChange: (name: string, value: number | string | boolean) => void;
  onReset: () => void;
  onRandomSeed: () => void;
  onExport: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  bg,
  params,
  isDisabled = false,
  activeId,
  dropdownOpen,
  searchQuery,
  filtered,
  onSelectBg,
  onToggleDropdown,
  onSearchChange,
  onParamChange,
  onReset,
  onExport,
  isOpen,
  onClose,
}: SidebarProps) {
  const [copied, setCopied] = useState(false);

  return (
    <motion.aside
      aria-disabled={isDisabled}
      className={`fixed top-14.5 bottom-0 left-0 z-40 w-72 bg-bg flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:top-auto md:bottom-auto md:translate-x-0 md:w-64 md:ml-4 md:shrink-0 md:z-auto ${isDisabled ? "opacity-70" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {isDisabled && (
        <div
          className="absolute inset-0 z-20 cursor-not-allowed"
          title="Controls are disabled while recording video"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mx-5 md:mx-4 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-bold font-display">
            Background Studio
          </span>
        </div>
        <button
          className="md:hidden flex items-center justify-center w-7 h-7 rounded-md text-muted hover:text-ink"
          onClick={onClose}
          aria-label="Close controls"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* Background selector + parameters */}
        <div className="px-5 md:px-4 pt-4 pb-3">
          <div className="text-[12px] text-muted font-semibold uppercase font-mono mb-2.5">
            Background
          </div>

          <button
            onClick={onToggleDropdown}
            className={`w-full flex items-center justify-between px-3 py-2 bg-faint border rounded-lg cursor-pointer transition-colors text-left ${
              dropdownOpen
                ? "border-border-hover"
                : "border-border hover:border-border-hover"
            }`}
          >
            <span className="text-[12px] text-ink font-medium">{bg.label}</span>
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted flex items-center"
            >
              <ChevronDown size={12} aria-hidden="true" />
            </motion.span>
          </button>

          {dropdownOpen && (
            <div className="mt-1.5">
              <input
                type="text"
                placeholder="Search backgrounds…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-faint border border-border rounded-lg px-3 py-2 text-[12px] text-ink font-sans outline-none mb-1.5 focus:border-border-hover transition-colors"
              />
              <div className="max-h-56 overflow-y-auto border border-border rounded-lg bg-bg">
                {filtered.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelectBg(b.id)}
                    className={`w-full text-left px-3 py-2 text-[12px] cursor-pointer transition-colors border-b border-border last:border-0 ${
                      activeId === b.id
                        ? "bg-accent text-[#1a1a1a] font-semibold"
                        : "text-ink hover:bg-faint"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Parameters — inline, no extra header */}
          <div className="mt-3">
            {bg.schema.map((s: ParamSchema) => {
              const v = params[s.name];
              const onChange = onParamChange as (
                name: string,
                value: unknown,
              ) => void;
              switch (s.type) {
                case "number":
                  return (
                    <SliderRow
                      key={s.name}
                      param={s as NumberParam}
                      value={v as number}
                      onChange={onChange}
                    />
                  );
                case "color":
                  return (
                    <ColorRow
                      key={s.name}
                      param={s as ColorParam}
                      value={v as string}
                      onChange={onChange}
                    />
                  );
                case "boolean":
                  return (
                    <BooleanRow
                      key={s.name}
                      param={s as BooleanParam}
                      value={v as boolean}
                      onChange={onChange}
                    />
                  );
                case "select":
                  return (
                    <SelectRow
                      key={s.name}
                      param={s as SelectParam}
                      value={v as string}
                      onChange={onChange}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mx-5 md:mx-4 py-4 border-t border-border shrink-0 flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-current rounded-lg text-[12px] text-muted py-2 cursor-pointer hover:text-ink transition-colors font-sans"
          >
            <RotateCcw size={12} aria-hidden="true" /> Reset
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 bg-transparent border border-current rounded-lg text-[12px] py-2 cursor-pointer transition-colors font-sans ${copied ? "text-green" : "text-muted hover:text-ink"}`}
          >
            {copied ? (
              <>
                <Check size={12} aria-hidden="true" /> copied
              </>
            ) : (
              <>
                <Share2 size={12} aria-hidden="true" /> Share
              </>
            )}
          </button>
        </div>

        <a
          href="/docs"
          className="flex items-center justify-center gap-1.5 bg-transparent border border-current rounded-lg text-[12px] text-muted py-2 cursor-pointer hover:text-ink transition-colors font-sans no-underline"
        >
          <SquareArrowOutUpRight size={13} aria-hidden="true" /> Read Full Docs
        </a>

        <button
          onClick={onExport}
          className="w-full bg-accent border-none rounded-lg text-[#1a1a1a] text-[13px] font-semibold py-2.5 cursor-pointer hover:opacity-90 transition-opacity font-display flex items-center justify-center gap-1.5"
        >
          <CodeXml size={13} aria-hidden="true" /> Export Code
        </button>
      </div>
    </motion.aside>
  );
}

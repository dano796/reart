import type { ParamSchema } from "alg-art-backgrounds";
import { X } from "lucide-react";
import type { DocEntry } from "./registry";
import {
  SliderRow,
  ColorRow,
  BooleanRow,
  SelectRow,
  type NumberParam,
  type ColorParam,
  type BooleanParam,
  type SelectParam,
} from "../shared/ParamRows";

export function ControlsPanel({
  entry,
  params,
  onChange,
  onReset,
  isOpen,
  onClose,
}: {
  entry: DocEntry;
  params: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  onReset: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside
      className={`
        fixed top-14.5 bottom-0 right-0 z-40 w-72 bg-bg flex flex-col scrollbar-none overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        lg:relative lg:top-auto lg:bottom-auto lg:w-auto lg:z-auto lg:translate-x-0 lg:flex lg:pr-4
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 pt-3.5 pb-3.5 mx-5 sticky top-0 bg-bg z-1 border-b border-border">
        <span className="text-[12px] font-mono font-semibold text-muted uppercase tracking-[0.14em]">
          Customize
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-[12px] font-mono text-muted transition-colors cursor-pointer bg-transparent border-0 hover:text-ink"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md text-muted hover:text-ink cursor-pointer bg-transparent border-0"
            aria-label="Cerrar controles"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="pt-1 px-5 pb-7">
        {entry.schema.map((param: ParamSchema) => {
          switch (param.type) {
            case "number":
              return (
                <SliderRow
                  key={param.name}
                  param={param as NumberParam}
                  value={params[param.name] as number}
                  onChange={onChange}
                />
              );
            case "color":
              return (
                <ColorRow
                  key={param.name}
                  param={param as ColorParam}
                  value={params[param.name] as string}
                  onChange={onChange}
                />
              );
            case "boolean":
              return (
                <BooleanRow
                  key={param.name}
                  param={param as BooleanParam}
                  value={params[param.name] as boolean}
                  onChange={onChange}
                />
              );
            case "select":
              return (
                <SelectRow
                  key={param.name}
                  param={param as SelectParam}
                  value={params[param.name] as string}
                  onChange={onChange}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </aside>
  );
}

import type { ParamSchema } from "alg-art-backgrounds";
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
}: {
  entry: DocEntry;
  params: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  onReset: () => void;
}) {
  return (
    <aside className="hidden lg:flex flex-col scrollbar-none sticky top-14.5 h-[calc(100vh-58px)] overflow-y-auto bg-bg pr-4">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0 pt-3.5 pb-3.5 mx-4 sticky top-0 bg-bg z-1 border-b border-border">
        <span className="text-[12px] font-mono font-semibold text-muted uppercase tracking-[0.14em]">
          Customize
        </span>
        <button
          onClick={onReset}
          className="text-[12px] font-mono text-muted transition-colors cursor-pointer bg-transparent border-0 hover:text-ink"
        >
          Reset
        </button>
      </div>

      {/* Controls */}
      <div className="pt-1 px-4 pb-7">
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

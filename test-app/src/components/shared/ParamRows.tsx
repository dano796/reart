import type { ParamSchema } from "alg-art-backgrounds";

export type NumberParam = Extract<ParamSchema, { type: "number" }>;
export type ColorParam  = Extract<ParamSchema, { type: "color" }>;
export type BooleanParam = Extract<ParamSchema, { type: "boolean" }>;
export type SelectParam  = Extract<ParamSchema, { type: "select" }>;

export type OnParamChange = (name: string, value: unknown) => void;

const rowBase = "py-2.5 border-b border-border/40 last:border-0";
const labelCls = "text-[12px] text-ink font-sans truncate mr-2";

export function SliderRow({
  param,
  value,
  onChange,
}: {
  param: NumberParam;
  value: number;
  onChange: OnParamChange;
}) {
  const display =
    param.step < 0.01 ? value.toFixed(4) :
    param.step < 0.1  ? value.toFixed(3) :
    param.step < 1    ? value.toFixed(2) :
    String(value);

  return (
    <div className={rowBase}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={labelCls}>{param.label}</span>
        <span className="text-[11px] font-mono text-accent bg-accent-soft rounded px-1.5 py-0.5 shrink-0">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => onChange(param.name, parseFloat(e.target.value))}
        className="w-full cursor-pointer accent-accent"
      />
    </div>
  );
}

export function ColorRow({
  param,
  value,
  onChange,
}: {
  param: ColorParam;
  value: string;
  onChange: OnParamChange;
}) {
  return (
    <div className={`flex items-center justify-between ${rowBase}`}>
      <span className={labelCls}>{param.label}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-muted font-mono">{value}</span>
        <div className="w-6 h-6 rounded-md border border-border/60 overflow-hidden cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(param.name, e.target.value)}
            className="w-8 h-8 p-0 -ml-1 -mt-1 cursor-pointer border-0 block"
          />
        </div>
      </div>
    </div>
  );
}

export function BooleanRow({
  param,
  value,
  onChange,
}: {
  param: BooleanParam;
  value: boolean;
  onChange: OnParamChange;
}) {
  return (
    <div className={`flex items-center justify-between ${rowBase}`}>
      <span className={labelCls}>{param.label}</span>
      <button
        onClick={() => onChange(param.name, !value)}
        className={`relative w-8 h-4.5 rounded-full border-0 cursor-pointer shrink-0 transition-colors duration-200 ${value ? "bg-accent" : "bg-faint"}`}
      >
        <span className={`absolute w-3.5 h-3.5 top-0.5 left-0.5 rounded-full bg-white transition-transform duration-200 ${value ? "translate-x-3.5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

export function SelectRow({
  param,
  value,
  onChange,
}: {
  param: SelectParam;
  value: string;
  onChange: OnParamChange;
}) {
  return (
    <div className={`flex items-center justify-between ${rowBase}`}>
      <span className={labelCls}>{param.label}</span>
      <select
        value={value}
        onChange={(e) => onChange(param.name, e.target.value)}
        className="text-[11px] font-mono text-ink bg-faint border border-border rounded-md px-2 py-1 cursor-pointer outline-none shrink-0"
      >
        {param.options.map((opt: { value: string; label: string }) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

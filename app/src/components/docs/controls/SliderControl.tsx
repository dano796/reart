import type { ParamSchema } from "@dano796/react-reart";

type NumberParam = Extract<ParamSchema, { type: "number" }>;

export function SliderControl({
  param,
  value,
  onChange,
}: {
  param: NumberParam;
  value: number;
  onChange: (name: string, value: unknown) => void;
}) {
  const displayVal =
    param.step < 0.01
      ? value.toFixed(4)
      : param.step < 0.1
        ? value.toFixed(3)
        : param.step < 1
          ? value.toFixed(2)
          : String(value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-ink font-sans font-medium">
          {param.label}
        </span>
        <span className="text-[11px] text-muted font-mono">{displayVal}</span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => onChange(param.name, parseFloat(e.target.value))}
        className="w-full cursor-pointer"
        style={{ accentColor: "var(--color-accent)" }}
      />
    </div>
  );
}

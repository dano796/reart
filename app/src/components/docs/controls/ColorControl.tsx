import type { ParamSchema } from "@dano796/react-reart";

type ColorParam = Extract<ParamSchema, { type: "color" }>;

export function ColorControl({
  param,
  value,
  onChange,
}: {
  param: ColorParam;
  value: string;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-ink font-sans font-medium flex-1 min-w-0 truncate">
        {param.label}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(param.name, e.target.value)}
          className="cursor-pointer rounded border-0"
          style={{ width: 26, height: 26, padding: 0, background: "none" }}
        />
        <span className="text-[11px] text-muted font-mono">{value}</span>
      </div>
    </div>
  );
}

import type { ParamSchema } from "@dano796/react-reart";

type SelectParam = Extract<ParamSchema, { type: "select" }>;

export function SelectControl({
  param,
  value,
  onChange,
}: {
  param: SelectParam;
  value: string;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-ink font-sans font-medium flex-1 min-w-0 truncate">
        {param.label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(param.name, e.target.value)}
        className="text-[12px] font-mono text-ink bg-faint border border-border rounded-md px-2 py-1 cursor-pointer outline-none shrink-0"
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

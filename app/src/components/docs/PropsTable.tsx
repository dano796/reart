import type { ParamSchema } from "@dano796/react-reart";

export function PropsTable({ schema }: { schema: ParamSchema[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] font-sans border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 px-3 text-muted font-medium text-[12px] uppercase tracking-[0.06em]">
              Prop
            </th>
            <th className="hidden md:table-cell text-left py-2.5 px-3 text-muted font-medium text-[12px] uppercase tracking-[0.06em]">
              Type
            </th>
            <th className="text-left py-2.5 px-3 text-muted font-medium text-[12px] uppercase tracking-[0.06em]">
              Default
            </th>
            <th className="text-left py-2.5 px-3 text-muted font-medium text-[12px] uppercase tracking-[0.06em]">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {schema.map((param) => (
            <tr
              key={param.name}
              className="border-b border-border/50 hover:bg-faint/50 transition-colors"
            >
              <td className="py-2.5 px-3 font-mono text-accent text-[12px] whitespace-nowrap">
                {param.name}
              </td>
              <td className="hidden md:table-cell py-2.5 px-3 font-mono text-[12px] whitespace-nowrap text-blue">
                {param.type === "number"
                  ? "number"
                  : param.type === "color"
                    ? "string"
                    : param.type === "boolean"
                      ? "boolean"
                      : "string"}
              </td>
              <td className="py-2.5 px-3 font-mono text-muted text-[12px] whitespace-nowrap">
                {param.type === "color" ? (
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-3 h-3 rounded-sm border border-border/80 shrink-0"
                      style={{ background: String(param.default) }}
                    />
                    {String(param.default)}
                  </span>
                ) : (
                  String(param.default)
                )}
              </td>
              <td className="py-2.5 px-3 text-muted text-[13px]">
                {param.label}
                {"min" in param && "max" in param && (
                  <span className="text-[11px] text-muted/60 font-mono ml-1.5">
                    [{(param as { min: number }).min}–
                    {(param as { max: number }).max}]
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

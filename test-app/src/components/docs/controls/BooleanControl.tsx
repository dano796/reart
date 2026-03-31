import { motion } from "framer-motion";
import type { ParamSchema } from "alg-art-backgrounds";

type BooleanParam = Extract<ParamSchema, { type: "boolean" }>;

export function BooleanControl({
  param,
  value,
  onChange,
}: {
  param: BooleanParam;
  value: boolean;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[12px] text-ink font-sans font-medium">
        {param.label}
      </span>
      <button
        onClick={() => onChange(param.name, !value)}
        className="relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer border-0"
        style={{
          background: value ? "var(--color-accent)" : "var(--color-faint)",
        }}
      >
        <motion.span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
          animate={{ x: value ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </button>
    </div>
  );
}

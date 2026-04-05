import type { ParamSchema } from "@dano796/react-reart";
import { SliderControl } from "./SliderControl";
import { ColorControl } from "./ColorControl";
import { BooleanControl } from "./BooleanControl";
import { SelectControl } from "./SelectControl";

type NumberParam = Extract<ParamSchema, { type: "number" }>;
type ColorParam = Extract<ParamSchema, { type: "color" }>;
type BooleanParam = Extract<ParamSchema, { type: "boolean" }>;
type SelectParam = Extract<ParamSchema, { type: "select" }>;

export function ParamControls({
  schema,
  params,
  onChange,
}: {
  schema: ParamSchema[];
  params: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
}) {
  return (
    <div
      className="grid gap-4 p-5"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
    >
      {schema.map((param) => {
        switch (param.type) {
          case "number":
            return (
              <SliderControl
                key={param.name}
                param={param as NumberParam}
                value={params[param.name] as number}
                onChange={onChange}
              />
            );
          case "color":
            return (
              <ColorControl
                key={param.name}
                param={param as ColorParam}
                value={params[param.name] as string}
                onChange={onChange}
              />
            );
          case "boolean":
            return (
              <BooleanControl
                key={param.name}
                param={param as BooleanParam}
                value={params[param.name] as boolean}
                onChange={onChange}
              />
            );
          case "select":
            return (
              <SelectControl
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
  );
}

import type { ParamSchema } from "@dano796/react-reart";

export function idToComponentName(id: string): string {
  return id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

/** Snippet showing only props that differ from defaults. Used for live preview. */
export function generateSnippet(
  id: string,
  schema: ParamSchema[],
  params: Record<string, unknown>,
): string {
  const componentName = idToComponentName(id);

  const changedProps = schema
    .filter((s) => params[s.name] !== s.default)
    .map((s) => {
      const val = params[s.name];
      if (s.type === "color" || s.type === "select")
        return `  ${s.name}="${val}"`;
      return `  ${s.name}={${val}}`;
    });

  const importLine = `import { ${componentName} } from "@/components/backgrounds/${componentName}";`;
  const jsxTag =
    changedProps.length === 0
      ? `<${componentName} style={{ position: "absolute", inset: 0 }} />`
      : `<${componentName}\n  style={{ position: "absolute", inset: 0 }}\n${changedProps.join("\n")}\n/>`;

  return `${importLine}

// Wrap in a positioned container so the background fills it:
<div style={{ position: "relative", height: "100vh" }}>
  ${jsxTag}
  <div style={{ position: "relative", zIndex: 1 }}>
    {/* your content */}
  </div>
</div>`;
}

/** Full snippet showing all props with their current values. Used in the Code tab. */
export function generateFullSnippet(
  id: string,
  schema: ParamSchema[],
  params: Record<string, unknown>,
): string {
  const componentName = idToComponentName(id);

  const allProps = schema.map((s) => {
    const val = params[s.name];
    if (s.type === "color" || s.type === "select")
      return `  ${s.name}="${val}"`;
    return `  ${s.name}={${val}}`;
  });

  const importLine = `import { ${componentName} } from "@/components/backgrounds/${componentName}";`;
  const jsxTag =
    allProps.length === 0
      ? `<${componentName} style={{ position: "absolute", inset: 0 }} />`
      : `<${componentName}\n  style={{ position: "absolute", inset: 0 }}\n${allProps.join("\n")}\n/>`;

  return `${importLine}

<div style={{ position: "relative", height: "100vh" }}>
  ${jsxTag}
  <div style={{ position: "relative", zIndex: 1 }}>
    {/* your content */}
  </div>
</div>`;
}

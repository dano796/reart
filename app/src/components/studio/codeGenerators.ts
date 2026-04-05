import type { BackgroundEntry, AnyParams } from "./types";

export function toComponentName(id: string): string {
  return id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

export function generateUsageSnippet(
  bg: BackgroundEntry,
  params: AnyParams,
): string {
  const name = toComponentName(bg.id);
  const allProps = bg.schema.map((s) => {
    const v = params[s.name];
    return s.type === "color" || s.type === "select"
      ? `  ${s.name}="${v}"`
      : `  ${s.name}={${v}}`;
  });
  return (
    `<div style={{ width: '100%', height: '100%', position: 'relative' }}>\n` +
    `  <${name}\n` +
    allProps.map((p) => `  ${p}`).join("\n") +
    "\n" +
    `  />\n` +
    `</div>`
  );
}

export function generateFullComponent(
  bg: BackgroundEntry,
  params: AnyParams,
): string {
  const name = toComponentName(bg.id);
  const allProps = bg.schema.map((s) => {
    const v = params[s.name];
    return s.type === "color" || s.type === "select"
      ? `        ${s.name}="${v}"`
      : `        ${s.name}={${v}}`;
  });
  return (
    `import { ${name} } from "@dano796/react-reart";\n\n` +
    `export default function MyPage() {\n` +
    `  return (\n` +
    `    <div style={{ position: "relative", height: "100vh" }}>\n` +
    `      <${name}\n` +
    allProps.join("\n") +
    "\n" +
    `        style={{ position: "absolute", inset: 0 }}\n` +
    `      />\n` +
    `      <div style={{ position: "relative", zIndex: 1 }}>\n` +
    `        {/* your content here */}\n` +
    `      </div>\n` +
    `    </div>\n` +
    `  );\n` +
    `}`
  );
}

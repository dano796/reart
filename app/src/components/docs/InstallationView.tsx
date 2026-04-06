import { CodeBlock } from "./CodeBlock";
import { CLI_PACKAGE } from "../../lib/constants";

const CLI_CODE = `# List all available backgrounds
npx ${CLI_PACKAGE} list

# Add a single background
npx ${CLI_PACKAGE} add flow-currents

# Preview what files will be added (dry run)
npx ${CLI_PACKAGE} add flow-currents --dry-run

# See files and description for a background
npx ${CLI_PACKAGE} info flow-currents

# Re-fetch a component (with confirmation)
npx ${CLI_PACKAGE} update flow-currents

# Add everything, including the interactive studio
npx ${CLI_PACKAGE} add background-studio`;

export function InstallationView() {
  return (
    <div className="max-w-170">
      <h1 className="docs-in font-display font-extrabold text-ink leading-[1.05] mb-6 text-[clamp(32px,5vw,48px)]">
        Installation
      </h1>

      <p className="docs-in-1 text-[15px] text-muted leading-[1.8] font-sans mb-10">
        Use the CLI to add any background directly into your project. No npm
        package is installed — the CLI copies plain TypeScript source files that
        you own.
      </p>

      <h2 className="docs-in-2 font-display font-bold text-ink mb-4 text-[clamp(20px,3vw,28px)]">
        CLI
      </h2>

      <p className="docs-in-2 text-[14px] text-muted leading-[1.7] font-sans mb-5">
        Run any of the commands below. Each background is copied as source files
        — no runtime dependency is added to your{" "}
        <code className="font-mono text-[12px] px-1.5 py-0.5 bg-faint rounded text-ink">
          package.json
        </code>
        .
      </p>

      <div className="docs-in-3 mb-14">
        <CodeBlock code={CLI_CODE} label="terminal" />
      </div>

      <h2 className="docs-in-4 font-display font-bold text-ink mb-4 text-[clamp(20px,3vw,28px)]">
        Usage
      </h2>

      <p className="docs-in-4 text-[14px] text-muted leading-[1.7] font-sans mb-5">
        Once installed, import the component from your{" "}
        <code className="font-mono text-[12px] px-1.5 py-0.5 bg-faint rounded text-ink">
          components/backgrounds/
        </code>{" "}
        directory and place it behind your content:
      </p>

      <div className="docs-in-5">
        <CodeBlock
          code={`import { FlowCurrents } from "./components/backgrounds/FlowCurrents";

export default function Hero() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <FlowCurrents style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* your content */}
      </div>
    </div>
  );
}`}
          label="tsx"
        />
      </div>
    </div>
  );
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build (compiles TypeScript + regenerates cli/registry.json)
npm run build

# Type-check without emitting
npm run typecheck

# Watch mode during development
npm run dev

# Rebuild registry only (when registry/index.ts changes)
npm run build:registry

# Run the test app (from test-app/ directory)
cd test-app && npm run dev
```

No test suite exists yet. To manually test the CLI:
```bash
node cli/index.js list
node cli/index.js add wave-ether --dry-run
```

## Architecture

This project distributes algorithmic art React components in a **shadcn/ui-style copy-paste model** — users run `npx alg-art-backgrounds add <id>` and the CLI downloads source files directly into their project. There is no runtime npm dependency.

### Three-Layer Component Architecture

Each background is split into three layers:

1. **Engine** (`src/components/engines/*.ts`) — Pure TypeScript, framework-agnostic. Exports three functions: `init*()`, `draw*()`, `reset*()`. Receives a `CanvasRenderingContext2D` and a params object. No React imports.

2. **Component** (`src/components/*.tsx`) — React wrapper. Manages canvas lifecycle via two `useEffect` hooks:
   - First effect: initializes the animation loop, attaches `ResizeObserver` and `IntersectionObserver` (pauses `requestAnimationFrame` when off-screen), returns cleanup.
   - Second effect: watches seed/structural params that require full re-initialization.
   - Uses `paramsRef` pattern: live params stored in a ref so the animation loop always reads current values without re-triggering the effect.

3. **Schema** (`src/components/schemas/index.ts`) — `ParamSchema[]` union type defining UI controls (number sliders, color pickers, toggles, selects). Drives `BackgroundStudio`'s auto-generated UI and serves as parameter documentation.

### Registry and CLI

- `src/registry/index.ts` is the **source of truth** for all components. Each `RegistryEntry` lists the component's `files[]` array (paths relative to `src/`) that the CLI will fetch and copy.
- `cli/build-registry.mjs` converts the TypeScript registry to `cli/registry.json` at build time.
- The CLI (`cli/index.js`) has zero external dependencies — uses only Node.js built-ins (`fs`, `path`, `https`, `readline`).
- By default, files are fetched from GitHub raw URLs. Override with the `ALG_ART_BACKGROUNDS_REGISTRY` environment variable.

### Rendering Tiers

The `tier` field on `RegistryEntry` determines the rendering API:

- **`canvas2d`** (default/undefined) — standard pattern above. Engine receives `CanvasRenderingContext2D`.
- **`webgl2`** — engine receives `WebGL2RenderingContext` and manages its own shader programs, VAO, and uniforms. `utils/noise.ts` is **not** included in `files[]` (shaders handle noise in GLSL). See `PlasmaField` for reference.
- **`ogl`** — engine receives a container `HTMLElement`; OGL's `Renderer` creates and appends its own `<canvas>`. Requires the `ogl` peer dependency. No context is passed to `draw*`/`reset*` — state is fully self-contained in the engine. See `NebulaVeil` for reference.

WebGL2 and OGL components are **not included** in `BackgroundStudio`'s `files[]` and are absent from the studio UI.

### Interactive Components

Some components (e.g. `PrismaticWave`, `PhotonBurst`, `FibonacciVortex`, `HexRipple`, `RecursiveTunnel`) support cursor and click interaction. Their engines export additional functions (e.g. `spawnAtClick`, `onMouseMove`) that the React wrapper attaches as event listeners on the canvas element inside the first `useEffect` — alongside the animation loop setup.

For these components, `Params` and `defaults` are defined directly in the `.tsx` file (not the engine), and the engine imports the `Params` type from the component file to keep the installed file self-contained.

### Shared Utilities

`src/components/utils/noise.ts` contains seeded Perlin noise, `SeededRandom` (LCG-based), and math helpers (`lerp`, `clamp`, `map`, `hexToRgb`, `rgba`). These are copied into every user project alongside each component, so they must remain self-contained.

### Dual Registry Sync

The TypeScript registry (`src/registry/index.ts`) and the generated JSON (`cli/registry.json`) must stay in sync. Always run `npm run build` (or at minimum `npm run build:registry`) after modifying the registry.

The `background-studio` registry entry hard-codes its `files[]` list and does **not** auto-include new components — it must be updated manually whenever a new component is added.

### Adding a New Component

Touch these 5 places in order:
1. `src/components/engines/<camelCase>.ts` — pure TS engine (`init*`, `draw*`, `reset*`)
2. `src/components/backgrounds/<PascalCase>.tsx` — React wrapper following the two-effect + paramsRef + IntersectionObserver pattern
3. `src/components/schemas/index.ts` — add `<name>Schema` and `<name>Defaults`, export both
4. `src/registry/index.ts` — add a `RegistryEntry` (import schema/defaults, list all 4 files including `utils/noise.ts` and `schemas/index.ts`); re-export the component at the bottom
5. Run `npm run build` to regenerate `cli/registry.json`

Also add the new component + engine to the `background-studio` entry's `files[]` array in `src/registry/index.ts`, and export it from `src/index.ts`.

### Distribution Files

When installed by users, files land in `components/backgrounds/` with this structure:
```
components/backgrounds/
  <ComponentName>.tsx       # React component
  engines/<engine>.ts       # Pure TS engine
  schemas/index.ts          # Shared param types
  utils/noise.ts            # Shared math utilities
```

The `components/` directory at the repo root contains example installed versions used for testing.

## Key Files

- `src/registry/index.ts` — add new components here (drives everything else)
- `src/components/engines/` — pure rendering logic, no React
- `cli/index.js` — CLI implementation, no build step needed
- `cli/build-registry.mjs` — run after registry changes
- `test-app/` — Vite dev app for testing components interactively
- `ENGINEERING_REVIEW.md` — known issues and improvement roadmap

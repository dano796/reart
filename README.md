# ReArt

Algorithmic background components for React — installed like shadcn/ui, owned by you.

```bash
npx react-reart add wave-ether
```

The component source is copied directly into your project. No runtime dependency. Full ownership of the code.

---

## How it works

Inspired by [shadcn/ui](https://ui.shadcn.com/): instead of importing from a package, you install the component source files into your own project. You can read, edit, and extend them freely.

---

## Requirements

- React 18 or 19
- A bundler that handles `.tsx` files (Next.js, Vite, Remix, CRA, Astro, etc.)

No other runtime dependencies. Components use only React and browser APIs (`canvas`, `requestAnimationFrame`, `ResizeObserver`).

---

## Installation

Run from your project root:

```bash
npx react-reart add <component-id>
```

This copies the component files into `components/backgrounds/` in your project. Adjust the import path to match your file structure.

---

## Commands

```bash
npx react-reart list                   # Browse all available backgrounds
npx react-reart info <id>              # See files and description for a component
npx react-reart add <id>               # Install a component
npx react-reart add <id> --force       # Overwrite existing files
npx react-reart add <id> --dry-run         # Preview which files would be written
npx react-reart update <id>               # Re-fetch a component (with confirmation)
npx react-reart add background-studio     # Install all components + the studio playground
```

---

## Components

### `background-studio`

Interactive playground to explore and configure all backgrounds with live preview and code export. Installs all four background components in one command.

```bash
npx react-reart add background-studio
```

```tsx
import { BackgroundStudio } from "./components/backgrounds/BackgroundStudio";

<BackgroundStudio />
```

> **Note:** BackgroundStudio is a dev tool — use it locally to discover parameters, then drop the individual background component into production.

---

### `wave-ether`

Sine waves from multiple drifting sources interfere to create standing waves and moiré patterns.

```tsx
import { WaveEther } from "./components/backgrounds/WaveEther";

<WaveEther
  sources={4}
  frequency={0.02}
  colorCrest="#00d4ff"
  colorTrough="#0a0a2e"
  colorMid="#7b2fff"
  style={{ position: "absolute", inset: 0 }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sources` | `number` | `3` | Number of wave sources (1–6) |
| `frequency` | `number` | `0.018` | Wave spatial frequency |
| `amplitude` | `number` | `1.0` | Wave height scale |
| `waveSpeed` | `number` | `0.025` | Animation speed |
| `resolution` | `number` | `8` | Pixel grid size (higher = faster) |
| `colorCrest` | `string` | `"#00d4ff"` | Color at wave peaks |
| `colorTrough` | `string` | `"#0a0a2e"` | Color at wave troughs |
| `colorMid` | `string` | `"#7b2fff"` | Color at zero crossings |
| `seed` | `number` | `42731` | RNG seed for source positions |

---

### `flow-currents`

Thousands of particles trace Perlin noise vector fields forming organic density maps.

```tsx
import { FlowCurrents } from "./components/backgrounds/FlowCurrents";

<FlowCurrents
  count={3000}
  speed={1.2}
  colorWarm="#e8855a"
  colorCool="#5a9bcc"
  colorAccent="#a0c878"
  style={{ position: "absolute", inset: 0 }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `3000` | Particle count (500–6000) |
| `speed` | `number` | `1.0` | Flow speed multiplier |
| `noiseScale` | `number` | `0.004` | Noise field scale |
| `trailOpacity` | `number` | `8` | Trail fade amount (2–30) |
| `noiseEvol` | `number` | `0.0005` | How fast the field evolves |
| `colorWarm` | `string` | `"#e8855a"` | Warm region color |
| `colorCool` | `string` | `"#5a9bcc"` | Cool region color |
| `colorAccent` | `string` | `"#a0c878"` | Accent region color |
| `seed` | `number` | `42731` | RNG seed |

---

### `gravity-storm`

Multiple gravitational attractors pull a particle swarm into complex orbital patterns.

```tsx
import { GravityStorm } from "./components/backgrounds/GravityStorm";

<GravityStorm
  attractors={4}
  gravity={1.2}
  colorCore="#ff6b35"
  colorTrail="#7b5ea7"
  style={{ position: "absolute", inset: 0 }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | `number` | `1200` | Particle count (200–3000) |
| `attractors` | `number` | `3` | Number of gravity wells (1–8) |
| `gravity` | `number` | `1.0` | Gravity strength |
| `turbulence` | `number` | `0.5` | Random velocity perturbation |
| `orbitSpeed` | `number` | `0.008` | Attractor drift speed |
| `colorCore` | `string` | `"#ff6b35"` | High-velocity particle color |
| `colorTrail` | `string` | `"#7b5ea7"` | Low-velocity particle color |
| `seed` | `number` | `42731` | RNG seed |

---

### `geo-pulse`

Nested parametric polygons rotating at prime-ratio angular velocities.

```tsx
import { GeoPulse } from "./components/backgrounds/GeoPulse";

<GeoPulse
  layers={8}
  sides={6}
  pulse={0.15}
  colorPrimary="#d97757"
  style={{ position: "absolute", inset: 0 }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layers` | `number` | `7` | Number of polygon layers (3–12) |
| `sides` | `number` | `6` | Polygon vertex count (3–12) |
| `rotSpeed` | `number` | `0.008` | Base rotation speed |
| `pulse` | `number` | `0.12` | Breathing amplitude (0–0.4) |
| `connect` | `number` | `0.4` | Cross-layer connection density |
| `colorPrimary` | `string` | `"#d97757"` | Primary line color |
| `colorSecondary` | `string` | `"#6a9bcc"` | Secondary line color |
| `colorAccent` | `string` | `"#e8d87a"` | Accent line color |
| `seed` | `number` | `42731` | RNG seed |

---

## Usage in Next.js

Canvas APIs require a browser environment. Mark any page or component that uses these as a Client Component:

```tsx
"use client";
import { WaveEther } from "./components/backgrounds/WaveEther";
```

---

## Usage in Vite / plain React

No special setup needed. Import and use directly.

---

## Setting a custom registry (for development)

```bash
REACT_REART_REGISTRY=http://localhost:3000/registry.json npx react-reart list
```

---

## License

MIT

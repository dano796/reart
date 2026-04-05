#!/usr/bin/env node
/**
 * ReArt CLI — shadcn/ui-style component installer.
 *
 * Usage:
 *   npx @dano796/react-reart add <component-id> [--force] [--dry-run]
 *   npx @dano796/react-reart update <component-id>
 *   npx @dano796/react-reart list
 *   npx @dano796/react-reart info <component-id>
 *
 * Copies component source directly into the user's project — no runtime
 * dependency, full ownership of the code (same philosophy as shadcn/ui).
 */

import fs from "fs";
import path from "path";
import https from "https";
import readline from "readline";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY_URL =
  process.env.ALG_ART_BACKGROUNDS_REGISTRY ||
  "https://raw.githubusercontent.com/dano796/reart/main/cli/registry.json";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetchText(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function log(msg, color = "reset") {
  const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    dim: "\x1b[2m",
    bold: "\x1b[1m",
  };
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function confirm(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      const a = answer.trim().toLowerCase();
      resolve(a === "y" || a === "yes");
    });
  });
}

async function fetchRegistry() {
  const json = await fetchText(REGISTRY_URL);
  return JSON.parse(json);
}

function toExportName(id) {
  return id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");
}

/**
 * Rewrite relative imports in a downloaded file so they point to the correct
 * installed locations instead of the monorepo source layout.
 *
 * For every `import`/`export … from "./…"` or `"../…"` statement the function:
 *   1. Resolves the specifier relative to the SOURCE file's directory.
 *   2. Looks up the resolved path in the source→target map.
 *   3. If found, computes a new relative path from the TARGET file's directory
 *      to the dependency's target path and replaces the specifier.
 *   4. Non-relative or unmapped imports are left untouched.
 *
 * @param {string} content   - Downloaded source text
 * @param {string} srcFile   - Registry source path  (e.g. "src/components/backgrounds/WaveEther.tsx")
 * @param {string} tgtFile   - Install target path   (e.g. "components/backgrounds/WaveEther.tsx")
 * @param {Array}  allFiles  - Full comp.files array  [{source, target}, …]
 * @returns {string}         - Content with corrected import paths
 */
function rewriteImports(content, srcFile, tgtFile, allFiles) {
  const posix = (p) => p.replace(/\\/g, "/");
  const stripExt = (p) => p.replace(/\.(tsx?|jsx?)$/, "");

  const srcDir = path.posix.dirname(posix(srcFile));
  const tgtDir = path.posix.dirname(posix(tgtFile));

  // Build a map: stripped-source-path → stripped-target-path
  const depMap = new Map();
  for (const f of allFiles) {
    depMap.set(stripExt(posix(f.source)), stripExt(posix(f.target)));
  }

  // Matches: import … from "./…" | export … from "../…" | import("…")
  const importRe = /((?:import|export)[^'"]*?from\s*|import\s*)(['"])(\.\.?\/[^'"]+)(\2)/g;

  return content.replace(importRe, (match, kw, q, importPath, _q2) => {
    const resolved = stripExt(
      path.posix.normalize(path.posix.join(srcDir, importPath))
    );
    const targetDep = depMap.get(resolved);
    if (!targetDep) return match; // not one of our files — leave unchanged

    let rel = path.posix.relative(tgtDir, targetDep);
    if (!rel.startsWith(".")) rel = "." + path.posix.sep + rel;
    return `${kw}${q}${rel}${q}`;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────────────────────

async function cmdList() {
  log("\nFetching registry...", "dim");
  const registry = await fetchRegistry();

  log("\nAvailable backgrounds:\n", "bold");
  for (const comp of registry.components) {
    log(`  ${comp.id.padEnd(20)} ${comp.name}`, "cyan");
    log(`  ${"".padEnd(20)} ${comp.description}`, "dim");
    console.log();
  }
  log(`Install with: npx @dano796/react-reart add <id>\n`, "dim");
}

async function cmdInfo(id) {
  if (!id) {
    log("\nUsage: npx @dano796/react-reart info <component-id>\n", "yellow");
    process.exit(1);
  }

  const registry = await fetchRegistry();
  const comp = registry.components.find((c) => c.id === id);

  if (!comp) {
    log(`\nComponent "${id}" not found. Run \`npx @dano796/react-reart list\` to see available components.\n`, "red");
    process.exit(1);
  }

  log(`\n${comp.name}`, "bold");
  log(comp.description, "dim");
  log(`\nTags: ${comp.tags.join(", ")}`, "cyan");
  log("\nFiles that will be added to your project:", "dim");
  for (const f of comp.files) {
    log(`  ${f.target}`, "cyan");
  }
  if (comp.peerDependencies?.length > 0) {
    log(`\nRequired peer packages:`, "yellow");
    log(`  npm install ${comp.peerDependencies.join(" ")}`, "cyan");
    log(`  # or: yarn add / pnpm add ${comp.peerDependencies.join(" ")}`, "dim");
  }
  log(`\nInstall: npx @dano796/react-reart add ${comp.id}\n`, "dim");
}

async function cmdAdd(id, { force = false, dryRun = false } = {}) {
  if (!id) {
    log("\nUsage: npx @dano796/react-reart add <component-id> [--force] [--dry-run]\n", "yellow");
    log("Run `npx @dano796/react-reart list` to see available components.\n", "dim");
    process.exit(1);
  }

  log(`\nFetching registry...`, "dim");
  const registry = await fetchRegistry();
  const comp = registry.components.find((c) => c.id === id);

  if (!comp) {
    log(`\nComponent "${id}" not found.\n`, "red");
    log("Available: " + registry.components.map((c) => c.id).join(", "), "dim");
    process.exit(1);
  }

  const projectRoot = process.cwd();

  if (dryRun) {
    log(`\n[dry-run] Would add ${comp.name} to ${projectRoot}:\n`, "bold");
    for (const file of comp.files) {
      const targetPath = path.join(projectRoot, file.target);
      const exists = fs.existsSync(targetPath);
      if (exists && !force) {
        log(`  ~ ${file.target}  (skipped — already exists)`, "yellow");
      } else if (exists && force) {
        log(`  ↺ ${file.target}  (would overwrite)`, "cyan");
      } else {
        log(`  + ${file.target}`, "green");
      }
    }
    console.log();
    return;
  }

  log(`\nAdding ${comp.name} to project at ${projectRoot}...\n`, "bold");

  const written = [];
  const skipped = [];

  for (const file of comp.files) {
    const sourceUrl = `${registry.baseUrl}/${file.source}`;
    const targetPath = path.join(projectRoot, file.target);

    if (fs.existsSync(targetPath) && !force) {
      skipped.push(file.target);
      continue;
    }

    try {
      log(`  Downloading ${file.source}...`, "dim");
      let content = await fetchText(sourceUrl);
      content = rewriteImports(content, file.source, file.target, comp.files);
      ensureDir(targetPath);
      fs.writeFileSync(targetPath, content, "utf-8");
      written.push(targetPath);
    } catch (err) {
      log(`\n  Failed to fetch ${file.source}: ${err.message}`, "red");
      if (written.length > 0) {
        log("  Cleaning up partial install...", "yellow");
        for (const p of written) {
          try { fs.unlinkSync(p); } catch { /* already gone */ }
        }
      }
      process.exit(1);
    }
  }

  // Report
  if (written.length > 0) {
    log("\nAdded:", "green");
    for (const f of written) log(`  + ${path.relative(projectRoot, f)}`, "green");
  }
  if (skipped.length > 0) {
    log("\nSkipped (already exist — use --force to overwrite):", "yellow");
    for (const f of skipped) log(`  ~ ${f}`, "yellow");
  }

  if (written.length === 0 && skipped.length > 0) {
    log(`\nNothing written. Run with --force to overwrite existing files.\n`, "dim");
    return;
  }

  const exportName = toExportName(id);
  log(`\nDone! Usage:\n`, "bold");

  if (comp.peerDependencies?.length > 0) {
    log(`\nThis component requires additional packages:`, "yellow");
    log(`  npm install ${comp.peerDependencies.join(" ")}`, "cyan");
    log(`  # or: yarn add / pnpm add ${comp.peerDependencies.join(" ")}`, "dim");
  }

  if (id === "background-studio") {
    log(
      `  // Adjust the import path relative to your file:\n` +
        `  import { BackgroundStudio } from "./components/backgrounds/BackgroundStudio";\n` +
        `\n` +
        `  <BackgroundStudio />\n`,
      "cyan"
    );
  } else {
    log(
      `  // Adjust the import path relative to your file:\n` +
        `  import { ${exportName} } from "./components/backgrounds/${exportName}";\n` +
        `\n` +
        `  <${exportName}\n` +
        `    style={{ position: "absolute", inset: 0 }}\n` +
        `  />\n`,
      "cyan"
    );
  }
}

async function cmdUpdate(id) {
  if (!id) {
    log("\nUsage: npx @dano796/react-reart update <component-id>\n", "yellow");
    log("Run `npx @dano796/react-reart list` to see available components.\n", "dim");
    process.exit(1);
  }

  log(`\nFetching registry...`, "dim");
  const registry = await fetchRegistry();
  const comp = registry.components.find((c) => c.id === id);

  if (!comp) {
    log(`\nComponent "${id}" not found.\n`, "red");
    log("Available: " + registry.components.map((c) => c.id).join(", "), "dim");
    process.exit(1);
  }

  const projectRoot = process.cwd();

  // Show which files will be overwritten
  log(`\nUpdating ${comp.name} (will overwrite existing files):\n`, "bold");
  for (const file of comp.files) {
    const targetPath = path.join(projectRoot, file.target);
    const exists = fs.existsSync(targetPath);
    log(`  ${exists ? "↺" : "+"} ${file.target}`, exists ? "yellow" : "green");
  }

  const ok = await confirm("\nContinue? (y/N) ");
  if (!ok) {
    log("\nAborted.\n", "dim");
    process.exit(0);
  }

  const written = [];
  for (const file of comp.files) {
    const sourceUrl = `${registry.baseUrl}/${file.source}`;
    const targetPath = path.join(projectRoot, file.target);

    try {
      log(`  Downloading ${file.source}...`, "dim");
      let content = await fetchText(sourceUrl);
      content = rewriteImports(content, file.source, file.target, comp.files);
      ensureDir(targetPath);
      fs.writeFileSync(targetPath, content, "utf-8");
      written.push(targetPath);
    } catch (err) {
      log(`\n  Failed to fetch ${file.source}: ${err.message}`, "red");
      log("  Partial update — some files may have been overwritten.", "yellow");
      process.exit(1);
    }
  }

  log("\nUpdated:", "green");
  for (const f of written) log(`  ↺ ${path.relative(projectRoot, f)}`, "green");

  const exportName = toExportName(id);
  log(`\nDone! ${exportName} is up to date.\n`, "bold");
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith("--")));
const positional = rawArgs.filter((a) => !a.startsWith("--"));
const [command, arg] = positional;

const force = flags.has("--force");
const dryRun = flags.has("--dry-run");

const commands = {
  list:   () => cmdList(),
  add:    () => cmdAdd(arg, { force, dryRun }),
  update: () => cmdUpdate(arg),
  info:   () => cmdInfo(arg),
};

if (!command || command === "help" || command === "--help" || command === "-h") {
  log("\nReArt — algorithmic background components\n", "bold");
  log("Commands:", "dim");
  log("  list                       List all available backgrounds", "cyan");
  log("  add <id>                   Copy a background into your project", "cyan");
  log("  add background-studio      Install all backgrounds + the studio playground", "cyan");
  log("  add <id> --force           Overwrite existing files", "cyan");
  log("  add <id> --dry-run         Preview which files would be written", "cyan");
  log("  update <id>                Re-fetch a component, overwriting local files", "cyan");
  log("  info <id>                  Show details about a background\n", "cyan");
  process.exit(0);
}

if (!commands[command]) {
  log(`\nUnknown command: "${command}". Run --help for usage.\n`, "red");
  process.exit(1);
}

commands[command]().catch((err) => {
  log(`\nError: ${err.message}\n`, "red");
  process.exit(1);
});

#!/usr/bin/env node
/**
 * kinetic-arcana CLI — shadcn/ui-style component installer.
 *
 * Usage:
 *   npx kinetic-arcana add <component-id>
 *   npx kinetic-arcana list
 *   npx kinetic-arcana info <component-id>
 *
 * Copies component source directly into the user's project — no runtime
 * dependency, full ownership of the code (same philosophy as shadcn/ui).
 */

import fs from "fs";
import path from "path";
import https from "https";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY_URL =
  process.env.KINETIC_ARCANA_REGISTRY ||
  "https://raw.githubusercontent.com/dano796/alg-art-backgrounds/main/cli/registry.json";

const BASE_URL =
  process.env.KINETIC_ARCANA_BASE_URL ||
  "https://raw.githubusercontent.com/dano796/alg-art-backgrounds/main";

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

function detectCwd() {
  // Use the directory where the command is run — users must run from project root.
  return process.cwd();
}

// ─────────────────────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────────────────────

async function cmdList() {
  log("\nFetching registry...", "dim");
  const registryJson = await fetchText(REGISTRY_URL);
  const registry = JSON.parse(registryJson);

  log("\nAvailable backgrounds:\n", "bold");
  for (const comp of registry.components) {
    log(`  ${comp.id.padEnd(20)} ${comp.name}`, "cyan");
    log(`  ${"".padEnd(20)} ${comp.description}`, "dim");
    console.log();
  }
  log(`Install with: npx kinetic-arcana add <id>\n`, "dim");
}

async function cmdInfo(id) {
  const registryJson = await fetchText(REGISTRY_URL);
  const registry = JSON.parse(registryJson);
  const comp = registry.components.find((c) => c.id === id);

  if (!comp) {
    log(`\nComponent "${id}" not found. Run \`npx kinetic-arcana list\` to see available components.\n`, "red");
    process.exit(1);
  }

  log(`\n${comp.name}`, "bold");
  log(comp.description, "dim");
  log(`\nTags: ${comp.tags.join(", ")}`, "cyan");
  log("\nFiles that will be added to your project:", "dim");
  for (const f of comp.files) {
    log(`  ${f.target}`, "cyan");
  }
  log(`\nInstall: npx kinetic-arcana add ${comp.id}\n`, "dim");
}

async function cmdAdd(id) {
  if (!id) {
    log("\nUsage: npx kinetic-arcana add <component-id>\n", "yellow");
    log("Run `npx kinetic-arcana list` to see available components.\n", "dim");
    process.exit(1);
  }

  log(`\nFetching registry...`, "dim");
  const registryJson = await fetchText(REGISTRY_URL);
  const registry = JSON.parse(registryJson);
  const comp = registry.components.find((c) => c.id === id);

  if (!comp) {
    log(`\nComponent "${id}" not found.\n`, "red");
    log("Available: " + registry.components.map((c) => c.id).join(", "), "dim");
    process.exit(1);
  }

  const projectRoot = detectCwd();
  log(`\nAdding ${comp.name} to project at ${projectRoot}...\n`, "bold");

  const written = [];
  const skipped = [];

  for (const file of comp.files) {
    const sourceUrl = `${registry.baseUrl}/${file.source}`;
    const targetPath = path.join(projectRoot, file.target);

    // Skip if file already exists (don't overwrite user edits)
    if (fs.existsSync(targetPath)) {
      skipped.push(file.target);
      continue;
    }

    try {
      log(`  Downloading ${file.source}...`, "dim");
      const content = await fetchText(sourceUrl);
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
    log("\nSkipped (already exist):", "yellow");
    for (const f of skipped) log(`  ~ ${f}`, "yellow");
  }

  // Usage hint
  const exportName = id
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

  log(`\nDone! Usage:\n`, "bold");
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

// ─────────────────────────────────────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────────────────────────────────────

const [, , command, arg] = process.argv;

const commands = {
  list: () => cmdList(),
  add: () => cmdAdd(arg),
  info: () => cmdInfo(arg),
};

if (!command || command === "help" || command === "--help" || command === "-h") {
  log("\nkinetic-arcana — algorithmic background components\n", "bold");
  log("Commands:", "dim");
  log("  list                  List all available backgrounds", "cyan");
  log("  add <id>              Copy a background into your project", "cyan");
  log("  info <id>             Show details about a background\n", "cyan");
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

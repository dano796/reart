/**
 * Ambient Mesh engine — framework-agnostic Canvas 2D renderer.
 *
 * Nodes drift through noise fields, forming dynamic connections —
 * a living network designed as a subtle, aesthetic background.
 */

import { PerlinNoise, SeededRandom, hexToRgb, rgba } from "../utils/noise";
import type { AmbientMeshParams } from "../schemas";
import { ambientMeshDefaults } from "../schemas";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  connections: number;
}

export interface AmbientMeshState {
  nodes: Node[];
  noise: PerlinNoise;
  rng: SeededRandom;
  time: number;
  width: number;
  height: number;
  initialized: boolean;
}

export function initAmbientMesh(
  width: number,
  height: number,
  params: AmbientMeshParams = {}
): AmbientMeshState {
  const p = { ...ambientMeshDefaults, ...params };
  const noise = new PerlinNoise(p.seed);
  const rng = new SeededRandom(p.seed);

  const nodes: Node[] = [];
  for (let i = 0; i < p.nodeCount; i++) {
    nodes.push({
      x: rng.range(0, width),
      y: rng.range(0, height),
      vx: 0,
      vy: 0,
      noiseOffsetX: rng.range(0, 1000),
      noiseOffsetY: rng.range(1000, 2000),
      connections: 0,
    });
  }

  return {
    nodes,
    noise,
    rng,
    time: 0,
    width,
    height,
    initialized: true,
  };
}

export function drawAmbientMesh(
  ctx: CanvasRenderingContext2D,
  state: AmbientMeshState,
  params: AmbientMeshParams = {}
): void {
  const p = { ...ambientMeshDefaults, ...params };
  const { nodes, noise, width, height } = state;

  // Background with optional transparency
  const bg = hexToRgb(p.bgColor);
  ctx.fillStyle = rgba(bg.r, bg.g, bg.b, p.bgOpacity * 255);
  ctx.fillRect(0, 0, width, height);

  // Update time for breathing effect
  state.time += 0.01 * p.breatheSpeed;
  const breathe = 1 + Math.sin(state.time) * p.breatheAmount;
  const currentConnectionDist = p.connectionDistance * breathe;

  // Reset connection counts
  for (const node of nodes) {
    node.connections = 0;
  }

  // Update node positions using noise field
  for (const node of nodes) {
    const noiseX = noise.get(
      node.x * p.noiseScale * 0.001 + node.noiseOffsetX,
      node.y * p.noiseScale * 0.001,
      state.time * 0.1
    );
    const noiseY = noise.get(
      node.x * p.noiseScale * 0.001,
      node.y * p.noiseScale * 0.001 + node.noiseOffsetY,
      state.time * 0.1
    );

    // Convert noise to velocity
    const angle = noiseX * Math.PI * 2;
    const speed = noiseY * p.motionSpeed;

    node.vx = Math.cos(angle) * speed;
    node.vy = Math.sin(angle) * speed;

    // Update position
    node.x += node.vx;
    node.y += node.vy;

    // Wrap around edges
    if (node.x < 0) node.x = width;
    if (node.x > width) node.x = 0;
    if (node.y < 0) node.y = height;
    if (node.y > height) node.y = 0;
  }

  // Draw edges and count connections
  const edgeCol = hexToRgb(p.edgeColor);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < currentConnectionDist) {
        // Calculate edge opacity based on distance
        const distRatio = 1 - dist / currentConnectionDist;
        const alpha = distRatio * p.edgeOpacity * 255;

        ctx.strokeStyle = rgba(edgeCol.r, edgeCol.g, edgeCol.b, alpha);
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();

        nodes[i].connections++;
        nodes[j].connections++;
      }
    }
  }

  // Draw nodes
  const nodeCol = hexToRgb(p.nodeColor);
  ctx.fillStyle = "transparent";

  for (const node of nodes) {
    // Node brightness based on connectivity
    const connectivityBoost = Math.min(node.connections / 5, 1);
    const baseAlpha = 100 + connectivityBoost * 155;

    // Draw glow halo
    if (p.nodeGlow > 0) {
      const glowSize = p.nodeSize * 3 * p.nodeGlow;
      ctx.fillStyle = rgba(nodeCol.r, nodeCol.g, nodeCol.b, baseAlpha * 0.2);
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw node
    ctx.fillStyle = rgba(nodeCol.r, nodeCol.g, nodeCol.b, baseAlpha);
    ctx.beginPath();
    ctx.arc(node.x, node.y, p.nodeSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function resetAmbientMesh(
  ctx: CanvasRenderingContext2D,
  state: AmbientMeshState,
  params: AmbientMeshParams = {}
): AmbientMeshState {
  const p = { ...ambientMeshDefaults, ...params };
  const bg = hexToRgb(p.bgColor);
  ctx.fillStyle = `rgb(${bg.r},${bg.g},${bg.b})`;
  ctx.fillRect(0, 0, state.width, state.height);
  return initAmbientMesh(state.width, state.height, p);
}

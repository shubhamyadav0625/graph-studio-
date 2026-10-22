// src/data/exampleGraphs.ts
import type { Graph } from '../types/graph';

export const examples: Record<string, Graph> = {
  // Mockup Graph: 6 vertices, 8 edges (as shown in Graph Studio workspace)
  wheel6: {
    vertices: ['1', '2', '3', '4', '5', '6'],
    edges: [
      { source: '1', target: '2' },
      { source: '1', target: '3' },
      { source: '1', target: '6' },
      { source: '2', target: '4' },
      { source: '2', target: '6' },
      { source: '3', target: '5' },
      { source: '3', target: '6' },
      { source: '4', target: '5' },
    ],
  },
  // 1. Valid tree (a simple three‑node tree)
  validTree: {
    vertices: ['v1', 'v2', 'v3'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v1', target: 'v3' },
    ],
  },
  // 2. Graph containing a cycle (triangle)
  cycleGraph: {
    vertices: ['v1', 'v2', 'v3'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v2', target: 'v3' },
      { source: 'v3', target: 'v1' },
    ],
  },
  // 3. Disconnected graph (two components)
  disconnected: {
    vertices: ['v1', 'v2', 'v3', 'v4'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v3', target: 'v4' },
    ],
  },
  // 4. Single‑vertex tree
  singleVertex: {
    vertices: ['v1'],
    edges: [],
  },
  // 5. Path graph (4 vertices in a line)
  pathGraph: {
    vertices: ['v1', 'v2', 'v3', 'v4'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v2', target: 'v3' },
      { source: 'v3', target: 'v4' },
    ],
  },
  // 6. Star tree (center v1 connected to four leaves)
  starTree: {
    vertices: ['v1', 'v2', 'v3', 'v4', 'v5'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v1', target: 'v3' },
      { source: 'v1', target: 'v4' },
      { source: 'v1', target: 'v5' },
    ],
  },
  // 7. V‑1 edges but disconnected (two components, 4 vertices, 3 edges)
  vMinusOneDisconnected: {
    vertices: ['v1', 'v2', 'v3', 'v4'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v2', target: 'v3' },
    ],
  },
};

export type ExampleKey = keyof typeof examples;

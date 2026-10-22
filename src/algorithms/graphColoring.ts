// src/algorithms/graphColoring.ts
import type { Graph, VertexId } from '../types/graph';

export interface ColoringResult {
  chromaticNumber: number;
  coloring: Record<VertexId, number>;
  colorNames: Record<number, string>;
  sortedVertices: VertexId[];
}

const PALETTE = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#14b8a6', // Teal
];

/**
 * Welsh-Powell Greedy Vertex Coloring Algorithm.
 * Sorts vertices in descending order of degree, then assigns the minimum available
 * color to each vertex such that no adjacent vertices share the same color.
 * Upper bounds chromatic number chi(G) <= Delta(G) + 1.
 */
export function greedyColoring(graph: Graph): ColoringResult {
  if (graph.vertices.length === 0) {
    return {
      chromaticNumber: 0,
      coloring: {},
      colorNames: {},
      sortedVertices: [],
    };
  }

  const adj: Record<VertexId, Set<VertexId>> = {};
  const degrees: Record<VertexId, number> = {};
  for (const v of graph.vertices) {
    adj[v] = new Set();
    degrees[v] = 0;
  }

  for (const edge of graph.edges) {
    adj[edge.source]?.add(edge.target);
    adj[edge.target]?.add(edge.source);
    degrees[edge.source] = (degrees[edge.source] || 0) + 1;
    degrees[edge.target] = (degrees[edge.target] || 0) + 1;
  }

  // Sort vertices by degree descending (Welsh-Powell heuristic)
  const sortedVertices = [...graph.vertices].sort(
    (a, b) => degrees[b] - degrees[a]
  );

  const coloring: Record<VertexId, number> = {};
  let maxColorUsed = 0;

  for (const u of sortedVertices) {
    // Find colors already taken by neighbors
    const neighborColors = new Set<number>();
    for (const neighbor of adj[u]) {
      if (coloring[neighbor] !== undefined) {
        neighborColors.add(coloring[neighbor]);
      }
    }

    // Assign lowest unused color index (1-based)
    let color = 1;
    while (neighborColors.has(color)) {
      color++;
    }

    coloring[u] = color;
    if (color > maxColorUsed) {
      maxColorUsed = color;
    }
  }

  const colorNames: Record<number, string> = {};
  for (let c = 1; c <= maxColorUsed; c++) {
    colorNames[c] = PALETTE[(c - 1) % PALETTE.length];
  }

  return {
    chromaticNumber: maxColorUsed,
    coloring,
    colorNames,
    sortedVertices,
  };
}

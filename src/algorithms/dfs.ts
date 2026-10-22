// src/algorithms/dfs.ts
import type { Graph, VertexId } from '../types/graph';

/**
 * Depth‑first search (recursive) returning visitation order and predecessor map.
 */
export function dfs(graph: Graph, start: VertexId): {
  order: VertexId[];
  predecessor: Record<VertexId, VertexId | undefined>;
} {
  const visited = new Set<VertexId>();
  const order: VertexId[] = [];
  const predecessor: Record<VertexId, VertexId | undefined> = {};
  const adjacency = buildAdjacencyMap(graph);

  function visit(v: VertexId, parent: VertexId | undefined) {
    visited.add(v);
    order.push(v);
    predecessor[v] = parent;
    for (const nb of adjacency.get(v) ?? []) {
      if (!visited.has(nb)) visit(nb, v);
    }
  }

  visit(start, undefined);
  return { order, predecessor };
}

function buildAdjacencyMap(graph: Graph): Map<VertexId, VertexId[]> {
  const map = new Map<VertexId, VertexId[]>();
  for (const v of graph.vertices) map.set(v, []);
  for (const { source, target } of graph.edges) {
    map.get(source)!.push(target);
    map.get(target)!.push(source);
  }
  return map;
}

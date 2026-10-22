// src/algorithms/bfs.ts
import type { Graph, VertexId } from '../types/graph';

/**
 * Breadth‑first search that returns the order of visited vertices.
 * Also returns a map of each vertex's predecessor (undefined for the start).
 */
export function bfs(graph: Graph, start: VertexId): {
  order: VertexId[];
  predecessor: Record<VertexId, VertexId | undefined>;
} {
  const visited = new Set<VertexId>();
  const queue: VertexId[] = [];
  const order: VertexId[] = [];
  const predecessor: Record<VertexId, VertexId | undefined> = {};

  visited.add(start);
  queue.push(start);
  predecessor[start] = undefined;

  const adjacency = buildAdjacencyMap(graph);

  while (queue.length) {
    const v = queue.shift()!;
    order.push(v);
    for (const nb of adjacency.get(v) ?? []) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        predecessor[nb] = v;
      }
    }
  }

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

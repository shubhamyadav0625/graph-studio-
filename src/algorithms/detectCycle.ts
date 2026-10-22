// src/algorithms/detectCycle.ts
import type { Graph, VertexId } from '../types/graph';

/**
 * Detects whether the undirected graph contains any cycle.
 * Returns an array of vertices that belong to one found cycle (in order),
 * or an empty array if no cycle exists.
 */
export function detectCycle(graph: Graph): VertexId[] {
  const visited = new Set<VertexId>();
  const parent = new Map<VertexId, VertexId | null>();
  const adjacency = buildAdjacencyMap(graph);

  function dfs(v: VertexId, p: VertexId | null): VertexId[] | null {
    visited.add(v);
    parent.set(v, p);
    for (const nb of adjacency.get(v) ?? []) {
      if (!visited.has(nb)) {
        const res = dfs(nb, v);
        if (res) return res;
      } else if (nb !== p) {
        // found a back edge -> build cycle path
        const cycle: VertexId[] = [];
        let cur: VertexId | null = v;
        while (cur && cur !== nb) {
          cycle.push(cur);
          cur = parent.get(cur) ?? null;
        }
        cycle.push(nb);
        cycle.reverse(); // optional ordering from nb to v
        return cycle;
      }
    }
    return null;
  }

  for (const v of graph.vertices) {
    if (!visited.has(v)) {
      const result = dfs(v, null);
      if (result) return result;
    }
  }
  return [];
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

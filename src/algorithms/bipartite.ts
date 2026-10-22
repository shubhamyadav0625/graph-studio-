// src/algorithms/bipartite.ts
import type { Graph, VertexId } from '../types/graph';

export interface BipartiteResult {
  isBipartite: boolean;
  partitionA: VertexId[];
  partitionB: VertexId[];
  oddCycle?: VertexId[];
}

/**
 * Checks whether an undirected graph is bipartite using 2-coloring BFS.
 * If not bipartite, identifies an odd-length cycle proving it cannot be 2-colored.
 */
export function checkBipartite(graph: Graph): BipartiteResult {
  const adj: Record<VertexId, VertexId[]> = {};
  for (const v of graph.vertices) {
    adj[v] = [];
  }
  for (const edge of graph.edges) {
    if (adj[edge.source] && !adj[edge.source].includes(edge.target)) {
      adj[edge.source].push(edge.target);
    }
    if (adj[edge.target] && !adj[edge.target].includes(edge.source)) {
      adj[edge.target].push(edge.source);
    }
  }

  const color: Record<VertexId, number> = {}; // 0 or 1
  const parent: Record<VertexId, VertexId | null> = {};

  for (const root of graph.vertices) {
    if (color[root] !== undefined) continue;

    color[root] = 0;
    parent[root] = null;
    const queue: VertexId[] = [root];

    while (queue.length > 0) {
      const u = queue.shift()!;
      const neighbors = adj[u] || [];

      for (const v of neighbors) {
        if (v === u) {
          // Self-loop makes it non-bipartite immediately
          return {
            isBipartite: false,
            partitionA: [],
            partitionB: [],
            oddCycle: [u, u],
          };
        }

        if (color[v] === undefined) {
          color[v] = 1 - color[u];
          parent[v] = u;
          queue.push(v);
        } else if (color[v] === color[u]) {
          // Found an odd cycle!
          // Reconstruct cycle from u and v to their common ancestor
          const pathU: VertexId[] = [u];
          let currU: VertexId | null = u;
          while (currU && parent[currU] !== null) {
            currU = parent[currU];
            if (currU) pathU.push(currU);
          }

          const pathV: VertexId[] = [v];
          let currV: VertexId | null = v;
          while (currV && parent[currV] !== null) {
            currV = parent[currV];
            if (currV) pathV.push(currV);
          }

          // Find lowest common ancestor
          let lca: VertexId | null = null;
          for (const node of pathU) {
            if (pathV.includes(node)) {
              lca = node;
              break;
            }
          }

          const oddCycle: VertexId[] = [];
          if (lca) {
            const idxU = pathU.indexOf(lca);
            const idxV = pathV.indexOf(lca);
            const part1 = pathU.slice(0, idxU + 1);
            const part2 = pathV.slice(0, idxV).reverse();
            oddCycle.push(...part1, ...part2);
          } else {
            oddCycle.push(u, v);
          }

          return {
            isBipartite: false,
            partitionA: [],
            partitionB: [],
            oddCycle,
          };
        }
      }
    }
  }

  const partitionA: VertexId[] = [];
  const partitionB: VertexId[] = [];

  for (const v of graph.vertices) {
    if (color[v] === 0) {
      partitionA.push(v);
    } else {
      partitionB.push(v);
    }
  }

  return {
    isBipartite: true,
    partitionA,
    partitionB,
  };
}

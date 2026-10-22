// src/algorithms/bipartiteSteps.ts
import type { Graph, VertexId, Edge } from '../types/graph';

export interface BipartiteStepState {
  step: number;
  currentVertex: VertexId | null;
  queue: VertexId[];
  visited: Set<VertexId>;
  colors: Record<VertexId, 0 | 1>;
  partitionA: VertexId[];
  partitionB: VertexId[];
  isBipartite: boolean;
  conflictingEdge?: Edge;
  oddCycle?: VertexId[];
  message: string;
  isComplete: boolean;
}

/**
 * Step-by-step generator for Bipartite 2-Coloring BFS.
 * Supports disconnected graphs, isolates odd-cycle witness if not bipartite.
 */
export function* bipartiteSteps(graph: Graph): Generator<BipartiteStepState> {
  let step = 0;
  const colors: Record<VertexId, 0 | 1> = {};
  const visited = new Set<VertexId>();
  const partitionA: VertexId[] = [];
  const partitionB: VertexId[] = [];
  const parent: Record<VertexId, VertexId | null> = {};

  if (graph.vertices.length === 0) {
    yield {
      step: 0,
      currentVertex: null,
      queue: [],
      visited: new Set(),
      colors: {},
      partitionA: [],
      partitionB: [],
      isBipartite: true,
      message: 'Empty graph is trivially bipartite.',
      isComplete: true,
    };
    return;
  }

  // Build adjacency
  const adj: Record<VertexId, VertexId[]> = {};
  for (const v of graph.vertices) {
    adj[v] = [];
  }
  for (const e of graph.edges) {
    if (adj[e.source] && !adj[e.source].includes(e.target)) {
      adj[e.source].push(e.target);
    }
    if (adj[e.target] && !adj[e.target].includes(e.source)) {
      adj[e.target].push(e.source);
    }
  }

  // Iterate over all components
  for (const root of graph.vertices) {
    if (visited.has(root)) continue;

    // Start component BFS
    colors[root] = 0;
    visited.add(root);
    partitionA.push(root);
    parent[root] = null;
    const queue: VertexId[] = [root];

    step++;
    yield {
      step,
      currentVertex: root,
      queue: [...queue],
      visited: new Set(visited),
      colors: { ...colors },
      partitionA: [...partitionA],
      partitionB: [...partitionB],
      isBipartite: true,
      message: `Starting component exploration from vertex ${root} (assigned to Partition A / Color 0).`,
      isComplete: false,
    };

    while (queue.length > 0) {
      const u = queue.shift()!;
      const uColor = colors[u];
      const nextColor: 0 | 1 = uColor === 0 ? 1 : 0;

      step++;
      yield {
        step,
        currentVertex: u,
        queue: [...queue],
        visited: new Set(visited),
        colors: { ...colors },
        partitionA: [...partitionA],
        partitionB: [...partitionB],
        isBipartite: true,
        message: `Exploring neighbors of vertex ${u} (Color ${uColor}).`,
        isComplete: false,
      };

      const neighbors = adj[u] || [];
      for (const v of neighbors) {
        if (v === u) {
          // Self-loop: immediate odd cycle of length 1
          step++;
          yield {
            step,
            currentVertex: u,
            queue: [...queue],
            visited: new Set(visited),
            colors: { ...colors },
            partitionA: [...partitionA],
            partitionB: [...partitionB],
            isBipartite: false,
            conflictingEdge: { source: u, target: u },
            oddCycle: [u, u],
            message: `Conflict detected: Self-loop at vertex ${u}. Not bipartite!`,
            isComplete: true,
          };
          return;
        }

        if (!visited.has(v)) {
          visited.add(v);
          colors[v] = nextColor;
          parent[v] = u;
          if (nextColor === 0) {
            partitionA.push(v);
          } else {
            partitionB.push(v);
          }
          queue.push(v);

          step++;
          yield {
            step,
            currentVertex: v,
            queue: [...queue],
            visited: new Set(visited),
            colors: { ...colors },
            partitionA: [...partitionA],
            partitionB: [...partitionB],
            isBipartite: true,
            message: `Colored neighbor ${v} with Color ${nextColor} (Partition ${nextColor === 0 ? 'A' : 'B'}) and queued it.`,
            isComplete: false,
          };
        } else if (colors[v] === uColor) {
          // Conflict: adjacent vertices share the same color!
          const conflictingEdge: Edge = { source: u, target: v };

          // Trace cycle
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
            oddCycle.push(...part1, ...part2, u);
          } else {
            oddCycle.push(u, v, u);
          }

          step++;
          yield {
            step,
            currentVertex: v,
            queue: [...queue],
            visited: new Set(visited),
            colors: { ...colors },
            partitionA: [...partitionA],
            partitionB: [...partitionB],
            isBipartite: false,
            conflictingEdge,
            oddCycle,
            message: `Color conflict: Vertices ${u} and ${v} share Color ${uColor} across edge (${u}, ${v}). Odd cycle witness detected!`,
            isComplete: true,
          };
          return;
        }
      }
    }
  }

  step++;
  yield {
    step,
    currentVertex: null,
    queue: [],
    visited: new Set(visited),
    colors: { ...colors },
    partitionA: [...partitionA],
    partitionB: [...partitionB],
    isBipartite: true,
    message: `Graph is verified Bipartite (2-colorable). Partition A: [${partitionA.join(', ')}], Partition B: [${partitionB.join(', ')}].`,
    isComplete: true,
  };
}

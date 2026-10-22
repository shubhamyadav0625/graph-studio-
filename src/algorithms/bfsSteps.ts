// src/algorithms/bfsSteps.ts
import type { Graph, VertexId } from '../types/graph';

export interface BFSState {
  visited: Set<VertexId>;
  queue: VertexId[];
  step: number;
}

/**
 * Generate step‑by‑step BFS states for a given start vertex.
 * Each state includes the visited set and the current queue snapshot.
 */
export function* bfsSteps(graph: Graph, start: VertexId): Generator<BFSState> {
  const visited = new Set<VertexId>();
  const queue: VertexId[] = [];
  visited.add(start);
  queue.push(start);
  let step = 0;
  while (queue.length > 0) {
    const snapshot: BFSState = {
      visited: new Set(visited),
      queue: [...queue],
      step,
    };
    yield snapshot;
    const current = queue.shift()!;
    // explore neighbours
    const neighbours = graph.edges
      .filter((e) => e.source === current || e.target === current)
      .map((e) => (e.source === current ? e.target : e.source));
    for (const nb of neighbours) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
    step++;
  }
  // final state after queue empty
  yield { visited: new Set(visited), queue: [], step };
}

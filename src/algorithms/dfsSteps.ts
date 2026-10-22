// src/algorithms/dfsSteps.ts
// Generator that yields step‑by‑step state for a depth‑first traversal.
// The state mirrors the BFS visualiser but uses a *stack* to represent the recursion
// call‑stack. Each yielded value contains:
//   visited: Set<VertexId> – vertices that have been discovered (i.e. pushed on stack).
//   stack: VertexId[]      – current call stack, top at the end of the array.
//   current?: VertexId    – vertex that is being processed in this step (top of stack).
//   step: number          – incremental step counter.

import type { Graph, VertexId } from "../types/graph";

export function* dfsSteps(graph: Graph, start: VertexId) {
  const adjacency = buildAdjacencyMap(graph);
  const visited = new Set<VertexId>();
  const stack: VertexId[] = [];
  let step = 0;

  // initialise with the start vertex
  stack.push(start);
  visited.add(start);
  yield { visited: new Set(visited), stack: [...stack], current: start, step: ++step };

  while (stack.length) {
    const v = stack[stack.length - 1]; // peek
    // find the first unvisited neighbour
    const neighbours = adjacency.get(v) ?? [];
    const next = neighbours.find((n) => !visited.has(n));
    if (next) {
      // go deeper
      stack.push(next);
      visited.add(next);
      yield { visited: new Set(visited), stack: [...stack], current: next, step: ++step };
    } else {
      // backtrack
      stack.pop();
      const newCurrent = stack[stack.length - 1];
      yield { visited: new Set(visited), stack: [...stack], current: newCurrent, step: ++step };
    }
  }
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

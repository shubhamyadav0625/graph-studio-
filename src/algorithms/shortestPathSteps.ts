// src/algorithms/shortestPathSteps.ts
import type { Graph, VertexId, Edge } from '../types/graph';

export interface ShortestPathStepState {
  step: number;
  currentVertex: VertexId | null;
  queue: VertexId[];
  visited: Set<VertexId>;
  distances: Record<VertexId, number>;
  parents: Record<VertexId, VertexId | null>;
  exploredEdges: Edge[];
  shortestPath: VertexId[];
  shortestPathEdges: Edge[];
  pathLength: number | null;
  isFound: boolean;
  message: string;
  isComplete: boolean;
}

/**
 * Step-by-step BFS Shortest Path generator for unweighted undirected graphs.
 * Finds the minimum edge path between source and target vertex.
 */
export function* shortestPathSteps(
  graph: Graph,
  source: VertexId,
  target: VertexId
): Generator<ShortestPathStepState> {
  let step = 0;

  // Empty graph check
  if (graph.vertices.length === 0) {
    yield {
      step: 0,
      currentVertex: null,
      queue: [],
      visited: new Set(),
      distances: {},
      parents: {},
      exploredEdges: [],
      shortestPath: [],
      shortestPathEdges: [],
      pathLength: null,
      isFound: false,
      message: 'Graph is empty.',
      isComplete: true,
    };
    return;
  }

  // Invalid vertex check
  if (!graph.vertices.includes(source) || !graph.vertices.includes(target)) {
    yield {
      step: 0,
      currentVertex: null,
      queue: [],
      visited: new Set(),
      distances: {},
      parents: {},
      exploredEdges: [],
      shortestPath: [],
      shortestPathEdges: [],
      pathLength: null,
      isFound: false,
      message: `Invalid selection: source (${source}) or target (${target}) does not exist in graph.`,
      isComplete: true,
    };
    return;
  }

  // Source equals destination
  if (source === target) {
    yield {
      step: 1,
      currentVertex: source,
      queue: [],
      visited: new Set([source]),
      distances: { [source]: 0 },
      parents: { [source]: null },
      exploredEdges: [],
      shortestPath: [source],
      shortestPathEdges: [],
      pathLength: 0,
      isFound: true,
      message: `Source and destination are identical (${source}). Shortest path length is 0 edges.`,
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

  const visited = new Set<VertexId>();
  const distances: Record<VertexId, number> = {};
  const parents: Record<VertexId, VertexId | null> = {};
  const exploredEdges: Edge[] = [];
  const queue: VertexId[] = [];

  visited.add(source);
  distances[source] = 0;
  parents[source] = null;
  queue.push(source);

  step++;
  yield {
    step,
    currentVertex: source,
    queue: [...queue],
    visited: new Set(visited),
    distances: { ...distances },
    parents: { ...parents },
    exploredEdges: [...exploredEdges],
    shortestPath: [],
    shortestPathEdges: [],
    pathLength: null,
    isFound: false,
    message: `Initialized BFS at source vertex ${source} (distance 0). Target is ${target}.`,
    isComplete: false,
  };

  let targetFound = false;

  while (queue.length > 0) {
    const curr = queue.shift()!;

    step++;
    yield {
      step,
      currentVertex: curr,
      queue: [...queue],
      visited: new Set(visited),
      distances: { ...distances },
      parents: { ...parents },
      exploredEdges: [...exploredEdges],
      shortestPath: [],
      shortestPathEdges: [],
      pathLength: null,
      isFound: false,
      message: `Dequeued vertex ${curr} (distance ${distances[curr]}). Exploring incident neighbors.`,
      isComplete: false,
    };

    const neighbors = adj[curr] || [];
    for (const nb of neighbors) {
      if (!visited.has(nb)) {
        visited.add(nb);
        distances[nb] = distances[curr] + 1;
        parents[nb] = curr;
        exploredEdges.push({ source: curr, target: nb });
        queue.push(nb);

        if (nb === target) {
          targetFound = true;
          break;
        }

        step++;
        yield {
          step,
          currentVertex: nb,
          queue: [...queue],
          visited: new Set(visited),
          distances: { ...distances },
          parents: { ...parents },
          exploredEdges: [...exploredEdges],
          shortestPath: [],
          shortestPathEdges: [],
          pathLength: null,
          isFound: false,
          message: `Discovered neighbor ${nb} at distance ${distances[nb]} via edge (${curr}, ${nb}).`,
          isComplete: false,
        };
      }
    }

    if (targetFound) break;
  }

  // If path found, backtrack
  if (targetFound) {
    const path: VertexId[] = [];
    const pathEdges: Edge[] = [];
    let curr: VertexId | null = target;

    while (curr !== null) {
      path.unshift(curr);
      const parent: VertexId | null = parents[curr];
      if (parent !== null) {
        pathEdges.unshift({ source: parent, target: curr });
      }
      curr = parent;
    }

    step++;
    yield {
      step,
      currentVertex: target,
      queue: [...queue],
      visited: new Set(visited),
      distances: { ...distances },
      parents: { ...parents },
      exploredEdges: [...exploredEdges],
      shortestPath: path,
      shortestPathEdges: pathEdges,
      pathLength: pathEdges.length,
      isFound: true,
      message: `Shortest path found: ${path.join(' → ')} (${pathEdges.length} edge${pathEdges.length === 1 ? '' : 's'}).`,
      isComplete: true,
    };
  } else {
    // Target unreachable
    step++;
    yield {
      step,
      currentVertex: null,
      queue: [],
      visited: new Set(visited),
      distances: { ...distances },
      parents: { ...parents },
      exploredEdges: [...exploredEdges],
      shortestPath: [],
      shortestPathEdges: [],
      pathLength: null,
      isFound: false,
      message: `No path exists: Target vertex ${target} is unreachable from source ${source} (different connected components).`,
      isComplete: true,
    };
  }
}

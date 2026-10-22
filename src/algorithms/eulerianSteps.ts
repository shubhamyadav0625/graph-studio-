// src/algorithms/eulerianSteps.ts
import type { Graph, VertexId } from '../types/graph';
import { checkEulerian } from './eulerian';

export interface EulerianStepState {
  step: number;
  currentVertex: VertexId | null;
  stack: VertexId[];
  consumedEdgeIds: Set<string>;
  eulerianTrail: VertexId[];
  eulerianEdgeTrail: string[];
  isEulerian: boolean;
  message: string;
  isComplete: boolean;
}

interface InternalEdge {
  id: string;
  source: VertexId;
  target: VertexId;
}

/**
 * Step-by-step Hierholzer's algorithm generator for Eulerian circuits and trails.
 * Tracks edges by unique IDs and respects degrees and component connectivity.
 */
export function* eulerianSteps(graph: Graph): Generator<EulerianStepState> {
  let step = 0;

  if (graph.vertices.length === 0) {
    yield {
      step: 0,
      currentVertex: null,
      stack: [],
      consumedEdgeIds: new Set(),
      eulerianTrail: [],
      eulerianEdgeTrail: [],
      isEulerian: true,
      message: 'Empty graph has an empty Eulerian circuit.',
      isComplete: true,
    };
    return;
  }

  // Pre-validate Eulerian properties using checkEulerian
  const preCheck = checkEulerian(graph);
  if (!preCheck.hasEulerianPath) {
    yield {
      step: 0,
      currentVertex: null,
      stack: [],
      consumedEdgeIds: new Set(),
      eulerianTrail: [],
      eulerianEdgeTrail: [],
      isEulerian: false,
      message: `Graph does not admit an Eulerian path or circuit: ${preCheck.explanation}`,
      isComplete: true,
    };
    return;
  }

  // If no edges, it's a single vertex or isolated vertices
  if (graph.edges.length === 0) {
    const v = graph.vertices[0];
    yield {
      step: 1,
      currentVertex: v,
      stack: [],
      consumedEdgeIds: new Set(),
      eulerianTrail: [v],
      eulerianEdgeTrail: [],
      isEulerian: true,
      message: 'Trivial Eulerian trail with 0 edges.',
      isComplete: true,
    };
    return;
  }

  // Create unique internal edge references
  const internalEdges: InternalEdge[] = graph.edges.map((e, idx) => ({
    id: `edge_${idx}_${e.source}_${e.target}`,
    source: e.source,
    target: e.target,
  }));

  // Build adjacency with edge references
  const adj: Record<VertexId, InternalEdge[]> = {};
  for (const v of graph.vertices) {
    adj[v] = [];
  }
  for (const ie of internalEdges) {
    adj[ie.source]?.push(ie);
    adj[ie.target]?.push(ie);
  }

  // Starting vertex: if there are odd-degree vertices (semi-Eulerian), start at one.
  // Otherwise, start at any vertex with degree > 0.
  let startVertex: VertexId = graph.vertices[0];
  if (preCheck.oddDegreeVertices.length === 2) {
    startVertex = preCheck.oddDegreeVertices[0];
  } else {
    const vWithEdges = graph.vertices.find((v) => (adj[v]?.length || 0) > 0);
    if (vWithEdges) startVertex = vWithEdges;
  }

  const stack: VertexId[] = [startVertex];
  const consumedEdgeIds = new Set<string>();
  const circuitVertices: VertexId[] = [];
  const circuitEdges: string[] = [];

  step++;
  yield {
    step,
    currentVertex: startVertex,
    stack: [...stack],
    consumedEdgeIds: new Set(consumedEdgeIds),
    eulerianTrail: [...circuitVertices],
    eulerianEdgeTrail: [...circuitEdges],
    isEulerian: true,
    message: `Initialized Hierholzer traversal at vertex ${startVertex} (${preCheck.eulerianType}).`,
    isComplete: false,
  };

  // Stack of edge IDs used in the current forward exploration
  const edgeStack: string[] = [];

  while (stack.length > 0) {
    const curr = stack[stack.length - 1];

    // Find an unconsumed incident edge
    const availableEdgeIndex = adj[curr].findIndex(
      (edge) => !consumedEdgeIds.has(edge.id)
    );

    if (availableEdgeIndex !== -1) {
      const edge = adj[curr][availableEdgeIndex];
      consumedEdgeIds.add(edge.id);
      edgeStack.push(edge.id);

      const nextVert = edge.source === curr ? edge.target : edge.source;
      stack.push(nextVert);

      step++;
      yield {
        step,
        currentVertex: nextVert,
        stack: [...stack],
        consumedEdgeIds: new Set(consumedEdgeIds),
        eulerianTrail: [...circuitVertices].reverse(),
        eulerianEdgeTrail: [...circuitEdges].reverse(),
        isEulerian: true,
        message: `Traversed edge (${curr}, ${nextVert}), pushing ${nextVert} to stack.`,
        isComplete: false,
      };
    } else {
      // Backtrack: no more unconsumed edges incident to curr
      const poppedVertex = stack.pop()!;
      circuitVertices.push(poppedVertex);

      if (edgeStack.length > 0) {
        circuitEdges.push(edgeStack.pop()!);
      }

      step++;
      yield {
        step,
        currentVertex: poppedVertex,
        stack: [...stack],
        consumedEdgeIds: new Set(consumedEdgeIds),
        eulerianTrail: [...circuitVertices].reverse(),
        eulerianEdgeTrail: [...circuitEdges].reverse(),
        isEulerian: true,
        message: `No further unused edges from ${poppedVertex}. Added to Eulerian trail.`,
        isComplete: false,
      };
    }
  }

  const finalTrail = circuitVertices.reverse();
  const finalEdgeTrail = circuitEdges.reverse();

  step++;
  yield {
    step,
    currentVertex: finalTrail[finalTrail.length - 1] ?? null,
    stack: [],
    consumedEdgeIds: new Set(consumedEdgeIds),
    eulerianTrail: finalTrail,
    eulerianEdgeTrail: finalEdgeTrail,
    isEulerian: true,
    message: `Hierholzer complete! Found Eulerian ${preCheck.eulerianType}: ${finalTrail.join(' → ')}. All ${consumedEdgeIds.size} edges visited.`,
    isComplete: true,
  };
}

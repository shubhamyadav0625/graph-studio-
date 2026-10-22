// src/algorithms/bipartiteMatchingSteps.ts
import type { Graph, VertexId, Edge } from '../types/graph';
import { checkBipartite } from './bipartite';

export interface MatchingStepState {
  step: number;
  currentVertex: VertexId | null;
  partitionA: VertexId[];
  partitionB: VertexId[];
  matchedPairs: Array<{ u: VertexId; v: VertexId }>;
  matchedEdges: Edge[];
  unmatchedVertices: VertexId[];
  currentAugmentingPath?: VertexId[];
  isBipartite: boolean;
  maxMatchingSize: number;
  message: string;
  isComplete: boolean;
}

/**
 * Step-by-step generator for Bipartite Maximum Matching (Augmenting Path / DFS).
 */
export function* bipartiteMatchingSteps(graph: Graph): Generator<MatchingStepState> {
  let step = 0;

  if (graph.vertices.length === 0) {
    yield {
      step: 0,
      currentVertex: null,
      partitionA: [],
      partitionB: [],
      matchedPairs: [],
      matchedEdges: [],
      unmatchedVertices: [],
      isBipartite: true,
      maxMatchingSize: 0,
      message: 'Empty graph has a trivial matching of size 0.',
      isComplete: true,
    };
    return;
  }

  const bip = checkBipartite(graph);
  if (!bip.isBipartite) {
    yield {
      step: 0,
      currentVertex: null,
      partitionA: [],
      partitionB: [],
      matchedPairs: [],
      matchedEdges: [],
      unmatchedVertices: [...graph.vertices],
      isBipartite: false,
      maxMatchingSize: 0,
      message: `Graph is not bipartite (contains odd cycle [${bip.oddCycle?.join(' → ')}]). Matching theorem requires a bipartite graph.`,
      isComplete: true,
    };
    return;
  }

  const { partitionA, partitionB } = bip;

  // Build adjacency
  const adjA: Record<VertexId, VertexId[]> = {};
  for (const u of partitionA) adjA[u] = [];
  for (const edge of graph.edges) {
    if (adjA[edge.source] && partitionB.includes(edge.target)) {
      if (!adjA[edge.source].includes(edge.target)) adjA[edge.source].push(edge.target);
    } else if (adjA[edge.target] && partitionB.includes(edge.source)) {
      if (!adjA[edge.target].includes(edge.source)) adjA[edge.target].push(edge.source);
    }
  }

  const matchB: Record<VertexId, VertexId | null> = {};
  for (const v of partitionB) matchB[v] = null;

  step++;
  yield {
    step,
    currentVertex: null,
    partitionA: [...partitionA],
    partitionB: [...partitionB],
    matchedPairs: [],
    matchedEdges: [],
    unmatchedVertices: [...graph.vertices],
    isBipartite: true,
    maxMatchingSize: 0,
    message: `Initialized bipartite partitions: V₁ = [${partitionA.join(', ')}], V₂ = [${partitionB.join(', ')}].`,
    isComplete: false,
  };

  function getCurrentMatches() {
    const pairs: Array<{ u: VertexId; v: VertexId }> = [];
    const edges: Edge[] = [];
    const matched = new Set<VertexId>();
    for (const v of partitionB) {
      const u = matchB[v];
      if (u !== null) {
        pairs.push({ u, v });
        edges.push({ source: u, target: v });
        matched.add(u);
        matched.add(v);
      }
    }
    const unmatched = graph.vertices.filter((x) => !matched.has(x));
    return { pairs, edges, unmatched, size: pairs.length };
  }

  // Augmenting DFS
  function findAugmentingPath(u: VertexId, visited: Set<VertexId>, path: VertexId[]): boolean {
    for (const v of adjA[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        path.push(u, v);

        if (matchB[v] === null) {
          matchB[v] = u;
          return true;
        }

        const prevU = matchB[v]!;
        if (findAugmentingPath(prevU, visited, path)) {
          matchB[v] = u;
          return true;
        }
        path.pop();
        path.pop();
      }
    }
    return false;
  }

  for (const u of partitionA) {
    const visited = new Set<VertexId>();
    const path: VertexId[] = [];
    const found = findAugmentingPath(u, visited, path);

    const curr = getCurrentMatches();
    step++;

    if (found) {
      yield {
        step,
        currentVertex: u,
        partitionA: [...partitionA],
        partitionB: [...partitionB],
        matchedPairs: curr.pairs,
        matchedEdges: curr.edges,
        unmatchedVertices: curr.unmatched,
        currentAugmentingPath: path,
        isBipartite: true,
        maxMatchingSize: curr.size,
        message: `Found augmenting path from ${u}: [${path.join(' → ')}]. Matching size augmented to ${curr.size}.`,
        isComplete: false,
      };
    } else {
      yield {
        step,
        currentVertex: u,
        partitionA: [...partitionA],
        partitionB: [...partitionB],
        matchedPairs: curr.pairs,
        matchedEdges: curr.edges,
        unmatchedVertices: curr.unmatched,
        isBipartite: true,
        maxMatchingSize: curr.size,
        message: `No augmenting path found from vertex ${u}. Current matching maintained.`,
        isComplete: false,
      };
    }
  }

  const finalMatches = getCurrentMatches();
  step++;
  yield {
    step,
    currentVertex: null,
    partitionA: [...partitionA],
    partitionB: [...partitionB],
    matchedPairs: finalMatches.pairs,
    matchedEdges: finalMatches.edges,
    unmatchedVertices: finalMatches.unmatched,
    isBipartite: true,
    maxMatchingSize: finalMatches.size,
    message: `Maximum Matching Complete! Maximum Cardinality |M*| = ${finalMatches.size}. Matched ${finalMatches.pairs.map((p) => `(${p.u}, ${p.v})`).join(', ') || 'None'}.`,
    isComplete: true,
  };
}

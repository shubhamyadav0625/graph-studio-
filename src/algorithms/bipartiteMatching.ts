// src/algorithms/bipartiteMatching.ts
import type { Graph, VertexId, Edge } from '../types/graph';
import { checkBipartite } from './bipartite';

export interface MatchingResult {
  isBipartite: boolean;
  maxMatchingSize: number;
  matchedPairs: Array<{ u: VertexId; v: VertexId }>;
  matchedEdges: Edge[];
  unmatchedVertices: VertexId[];
  isPerfect: boolean;
  explanation: string;
}

/**
 * Computes Maximum Cardinality Bipartite Matching using Augmenting Path Algorithm (Hopcroft-Karp / DFS).
 * - Pre-validates that graph is bipartite. If not, returns explanation with odd cycle conflict.
 * - Computes maximum matching M* satisfying Berge's Lemma.
 */
export function bipartiteMatching(graph: Graph): MatchingResult {
  if (graph.vertices.length === 0) {
    return {
      isBipartite: true,
      maxMatchingSize: 0,
      matchedPairs: [],
      matchedEdges: [],
      unmatchedVertices: [],
      isPerfect: true,
      explanation: 'Empty graph has a trivial matching of size 0.',
    };
  }

  const bipCheck = checkBipartite(graph);
  if (!bipCheck.isBipartite) {
    return {
      isBipartite: false,
      maxMatchingSize: 0,
      matchedPairs: [],
      matchedEdges: [],
      unmatchedVertices: graph.vertices,
      isPerfect: false,
      explanation: `Graph is not bipartite (contains odd-length cycle [${bipCheck.oddCycle?.join(' → ')}]). Matching theorem applies strictly to bipartite graphs.`,
    };
  }

  const { partitionA, partitionB } = bipCheck;

  // Build adjacency from partitionA to partitionB
  const adjA: Record<VertexId, VertexId[]> = {};
  for (const u of partitionA) {
    adjA[u] = [];
  }
  for (const edge of graph.edges) {
    if (adjA[edge.source] && partitionB.includes(edge.target)) {
      if (!adjA[edge.source].includes(edge.target)) adjA[edge.source].push(edge.target);
    } else if (adjA[edge.target] && partitionB.includes(edge.source)) {
      if (!adjA[edge.target].includes(edge.source)) adjA[edge.target].push(edge.source);
    }
  }

  // matchB[v] stores vertex u in partitionA matched with v in partitionB
  const matchB: Record<VertexId, VertexId | null> = {};
  for (const v of partitionB) {
    matchB[v] = null;
  }

  // DFS to find augmenting path
  function dfs(u: VertexId, visited: Set<VertexId>): boolean {
    for (const v of adjA[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        // If v is unmatched, or if matched predecessor can find another match
        if (matchB[v] === null || dfs(matchB[v]!, visited)) {
          matchB[v] = u;
          return true;
        }
      }
    }
    return false;
  }

  let matchingSize = 0;
  for (const u of partitionA) {
    const visited = new Set<VertexId>();
    if (dfs(u, visited)) {
      matchingSize++;
    }
  }

  const matchedPairs: Array<{ u: VertexId; v: VertexId }> = [];
  const matchedEdges: Edge[] = [];
  const matchedSet = new Set<VertexId>();

  for (const v of partitionB) {
    const u = matchB[v];
    if (u !== null) {
      matchedPairs.push({ u, v });
      matchedEdges.push({ source: u, target: v });
      matchedSet.add(u);
      matchedSet.add(v);
    }
  }

  const unmatchedVertices = graph.vertices.filter((v) => !matchedSet.has(v));
  const isPerfect = matchingSize > 0 && unmatchedVertices.length === 0;

  let explanation = `Maximum bipartite matching size is |M*| = ${matchingSize}.`;
  if (isPerfect) {
    explanation += ' This is a Perfect Matching covering all vertices.';
  } else if (matchingSize === partitionA.length && matchingSize < partitionB.length) {
    explanation += ` Hall's condition satisfied: Complete matching from partition A (${partitionA.length} vertices) into B (${partitionB.length} vertices).`;
  } else if (matchingSize === partitionB.length && matchingSize < partitionA.length) {
    explanation += ` Complete matching from partition B (${partitionB.length} vertices) into A.`;
  }

  return {
    isBipartite: true,
    maxMatchingSize: matchingSize,
    matchedPairs,
    matchedEdges,
    unmatchedVertices,
    isPerfect,
    explanation,
  };
}

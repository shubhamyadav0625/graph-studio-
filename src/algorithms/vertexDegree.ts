// src/algorithms/vertexDegree.ts
import type { Graph, VertexId } from '../types/graph';

/**
 * Returns a map from each vertex to its degree (number of incident edges).
 */
export function vertexDegree(graph: Graph): Record<VertexId, number> {
  const degree: Record<VertexId, number> = {};
  for (const v of graph.vertices) degree[v] = 0;
  for (const { source, target } of graph.edges) {
    degree[source]++;
    degree[target]++;
  }
  return degree;
}

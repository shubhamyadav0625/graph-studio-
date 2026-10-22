// src/algorithms/eulerian.ts
import type { Graph, VertexId } from '../types/graph';
import { connectedComponents } from './connectedComponents';

export interface EulerianResult {
  hasEulerianCircuit: boolean;
  hasEulerianPath: boolean;
  oddDegreeVertices: VertexId[];
  eulerianType: 'None' | 'Eulerian Circuit' | 'Eulerian Path (Semi-Eulerian)';
  explanation: string;
}

/**
 * Checks Eulerian circuit and trail conditions according to Euler's Theorem.
 * Undirected Graph:
 * - All vertices with non-zero degree belong to a single connected component.
 * - Eulerian Circuit: Every vertex has an even degree.
 * - Eulerian Path: Exactly 0 or 2 vertices have an odd degree.
 */
export function checkEulerian(graph: Graph): EulerianResult {
  if (graph.vertices.length === 0) {
    return {
      hasEulerianCircuit: false,
      hasEulerianPath: false,
      oddDegreeVertices: [],
      eulerianType: 'None',
      explanation: 'Graph is empty.',
    };
  }

  // Calculate degrees
  const degrees: Record<VertexId, number> = {};
  for (const v of graph.vertices) {
    degrees[v] = 0;
  }
  for (const edge of graph.edges) {
    degrees[edge.source] = (degrees[edge.source] || 0) + 1;
    degrees[edge.target] = (degrees[edge.target] || 0) + 1;
  }

  const oddDegreeVertices: VertexId[] = [];
  let nonZeroDegreeCount = 0;
  for (const v of graph.vertices) {
    if (degrees[v] > 0) nonZeroDegreeCount++;
    if (degrees[v] % 2 !== 0) {
      oddDegreeVertices.push(v);
    }
  }

  // If no edges, it's trivially an Eulerian circuit if 1 vertex or 0 vertices
  if (graph.edges.length === 0) {
    return {
      hasEulerianCircuit: true,
      hasEulerianPath: true,
      oddDegreeVertices: [],
      eulerianType: 'Eulerian Circuit',
      explanation: 'Trivially Eulerian (no edges).',
    };
  }

  // Check connectivity of non-isolated vertices
  const components = connectedComponents(graph);
  const componentsWithEdges = components.filter(comp =>
    comp.some(v => degrees[v] > 0)
  );

  if (componentsWithEdges.length > 1) {
    return {
      hasEulerianCircuit: false,
      hasEulerianPath: false,
      oddDegreeVertices,
      eulerianType: 'None',
      explanation: 'Vertices with edges belong to multiple disconnected components.',
    };
  }

  if (oddDegreeVertices.length === 0) {
    return {
      hasEulerianCircuit: true,
      hasEulerianPath: true,
      oddDegreeVertices: [],
      eulerianType: 'Eulerian Circuit',
      explanation: 'All vertices have even degrees and non-isolated vertices are connected. Contains an Eulerian circuit.',
    };
  } else if (oddDegreeVertices.length === 2) {
    return {
      hasEulerianCircuit: false,
      hasEulerianPath: true,
      oddDegreeVertices,
      eulerianType: 'Eulerian Path (Semi-Eulerian)',
      explanation: `Exactly 2 vertices (${oddDegreeVertices.join(', ')}) have odd degree. Contains an Eulerian path between them.`,
    };
  } else {
    return {
      hasEulerianCircuit: false,
      hasEulerianPath: false,
      oddDegreeVertices,
      eulerianType: 'None',
      explanation: `${oddDegreeVertices.length} vertices have odd degree (Eulerian paths require 0 or 2 odd-degree vertices).`,
    };
  }
}

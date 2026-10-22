// src/algorithms/planarity.ts
import type { Graph, VertexId } from '../types/graph';
import { connectedComponents } from './connectedComponents';

export interface PlanarityResult {
  isPlanarBoundSatisfied: boolean;
  facesIfPlanar: number | null;
  eulerFormulaFormula: string;
  explanation: string;
  maxEdgesAllowed: number;
  hasTriangles: boolean;
}

/**
 * Checks planar graph necessary conditions and Euler's Polyhedral Formula (V - E + F = 2).
 * Edge-bound theorem:
 * - If V >= 3 and graph is planar and simple: E <= 3V - 6
 * - If graph has no triangles (girth >= 4) and V >= 3: E <= 2V - 4
 * Euler's Formula for connected planar graph: F = E - V + 2
 * General for k components: F = E - V + 1 + k
 */
export function checkPlanarity(graph: Graph): PlanarityResult {
  const v = graph.vertices.length;
  const e = graph.edges.length;

  if (v <= 2) {
    const k = connectedComponents(graph).length || 1;
    const f = Math.max(1, e - v + 1 + k);
    return {
      isPlanarBoundSatisfied: true,
      facesIfPlanar: f,
      eulerFormulaFormula: `F = E - V + 1 + k = ${e} - ${v} + 1 + ${k} = ${f}`,
      explanation: 'Small graphs with <= 2 vertices are always planar.',
      maxEdgesAllowed: 1,
      hasTriangles: false,
    };
  }

  // Check if graph has any triangles (cycles of length 3)
  const adj: Record<VertexId, Set<VertexId>> = {};
  for (const vert of graph.vertices) {
    adj[vert] = new Set();
  }
  for (const edge of graph.edges) {
    adj[edge.source]?.add(edge.target);
    adj[edge.target]?.add(edge.source);
  }

  let hasTriangles = false;
  for (const u of graph.vertices) {
    const neighbors = Array.from(adj[u] || []);
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (adj[neighbors[i]]?.has(neighbors[j])) {
          hasTriangles = true;
          break;
        }
      }
      if (hasTriangles) break;
    }
    if (hasTriangles) break;
  }

  const maxEdgesAllowed = hasTriangles ? 3 * v - 6 : 2 * v - 4;
  const components = connectedComponents(graph);
  const k = components.length || 1;
  const faces = e - v + 1 + k;

  if (e > maxEdgesAllowed) {
    return {
      isPlanarBoundSatisfied: false,
      facesIfPlanar: null,
      eulerFormulaFormula: `E (${e}) > ${hasTriangles ? '3V - 6' : '2V - 4 (triangle-free)'} (${maxEdgesAllowed})`,
      explanation: `Violates planar edge bound: has ${e} edges, but maximum for a planar graph with ${v} vertices is ${maxEdgesAllowed}. Hence, not planar.`,
      maxEdgesAllowed,
      hasTriangles,
    };
  }

  return {
    isPlanarBoundSatisfied: true,
    facesIfPlanar: Math.max(1, faces),
    eulerFormulaFormula: `F = E - V + 1 + k = ${e} - ${v} + 1 + ${k} = ${Math.max(1, faces)}`,
    explanation: `Satisfies edge bounds (E <= ${maxEdgesAllowed}). By Euler's formula, planar embedding has ${Math.max(1, faces)} face(s).`,
    maxEdgesAllowed,
    hasTriangles,
  };
}

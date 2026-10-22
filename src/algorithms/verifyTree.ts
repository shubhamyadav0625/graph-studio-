// src/algorithms/verifyTree.ts
import type { Graph } from '../types/graph';
import { connectedComponents } from './connectedComponents';
import { detectCycle } from './detectCycle';
import { vertexDegree } from './vertexDegree';

export interface TreeVerificationResult {
  isTree: boolean;
  reasons: string[]; // explanations why it is or is not a tree
  metrics: {
    vertexCount: number;
    edgeCount: number;
    connectedComponents: number;
    hasCycle: boolean;
    edgeCountCondition: boolean; // E === V-1
    degrees: Record<string, number>;
  };
}

/**
 * Verifies whether an undirected simple graph is a tree.
 * Uses mathematical criteria and provides explanatory reasons.
 */
export function verifyTree(graph: Graph): TreeVerificationResult {
  const V = graph.vertices.length;
  const E = graph.edges.length;
  const components = connectedComponents(graph);
  const numComponents = components.length;
  const hasCycle = detectCycle(graph).length > 0;
  const edgeCountCondition = E === V - 1;
  const degrees = vertexDegree(graph);

  const reasons: string[] = [];
  let isTree = true;

  // Empty graph is NOT a tree
  if (V === 0) {
    isTree = false;
    reasons.push('The graph is empty, which cannot be a tree.');
    // early return
    return { isTree, reasons, metrics: { vertexCount: V, edgeCount: E, connectedComponents: numComponents, hasCycle, edgeCountCondition, degrees } };
  }

  // Single vertex with no edges is a valid tree
  if (V === 1 && E === 0) {
    reasons.push('A single isolated vertex with no edges is a valid tree.');
    return { isTree: true, reasons, metrics: { vertexCount: V, edgeCount: E, connectedComponents: numComponents, hasCycle, edgeCountCondition, degrees } };
  }

  // Check edge count condition
  if (!edgeCountCondition) {
    isTree = false;
    reasons.push(`Edge count condition failed: E (${E}) ≠ V‑1 (${V - 1}).`);
  } else {
    reasons.push(`Edge count condition holds: E = V‑1 = ${E}.`);
  }

  // Connectivity
  if (numComponents !== 1) {
    isTree = false;
    reasons.push(`Graph is disconnected (${numComponents} components).`);
  } else {
    reasons.push('Graph is connected (single component).');
  }

  // Cycle detection
  if (hasCycle) {
    isTree = false;
    reasons.push('Graph contains a cycle, which disqualifies it from being a tree.');
  } else {
    reasons.push('Graph is acyclic (no cycles detected).');
  }

  if (isTree) {
    reasons.unshift('All tree criteria satisfied – the graph IS a tree.');
  } else {
    reasons.unshift('One or more tree criteria failed – the graph is NOT a tree.');
  }

  return {
    isTree,
    reasons,
    metrics: {
      vertexCount: V,
      edgeCount: E,
      connectedComponents: numComponents,
      hasCycle,
      edgeCountCondition,
      degrees,
    },
  };
}

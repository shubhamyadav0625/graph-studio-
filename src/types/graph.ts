// src/types/graph.ts
export type VertexId = string;

export interface Edge {
  source: VertexId;
  target: VertexId;
}

export interface Graph {
  vertices: VertexId[];
  edges: Edge[];
}

export type AlgorithmType = 'bfs' | 'dfs' | 'bipartite' | 'coloring' | 'eulerian';

export interface AlgorithmHighlightState {
  mode: AlgorithmType;
  visitedNodes?: VertexId[];
  frontierNodes?: VertexId[];
  rootNode?: VertexId | null;
  currentNode?: VertexId | null;
  // Bipartite specifics
  partitionA?: VertexId[];
  partitionB?: VertexId[];
  conflictingEdge?: Edge;
  oddCycle?: VertexId[];
  // Coloring specifics
  nodeColors?: Record<VertexId, string>;
  // Eulerian specifics
  activeEdgeIds?: string[];
  eulerianTrail?: VertexId[];
}

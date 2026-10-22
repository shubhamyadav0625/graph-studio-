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

export type AlgorithmType = 'bfs' | 'dfs' | 'shortestPath' | 'bipartite' | 'coloring' | 'eulerian' | 'matching';

export interface AlgorithmHighlightState {
  mode: AlgorithmType;
  visitedNodes?: VertexId[];
  frontierNodes?: VertexId[];
  rootNode?: VertexId | null;
  targetNode?: VertexId | null;
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
  // Matching specifics
  matchedEdgeIds?: string[];
  augmentingPathNodes?: VertexId[];
  // Shortest Path specifics
  exploredEdgeIds?: string[];
  pathEdgeIds?: string[];
  pathNodes?: VertexId[];
}

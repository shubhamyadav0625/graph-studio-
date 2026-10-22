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

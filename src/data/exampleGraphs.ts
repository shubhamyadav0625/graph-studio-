// src/data/exampleGraphs.ts
import type { Graph } from '../types/graph';

export const examples: Record<string, Graph> = {
  // Reference Image Wheel (W6): 6 vertices A, B, C, D, E, F with 9 edges
  wheel6: {
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'A', target: 'D' },
      { source: 'B', target: 'D' },
      { source: 'B', target: 'E' },
      { source: 'C', target: 'D' },
      { source: 'C', target: 'F' },
      { source: 'D', target: 'E' },
      { source: 'D', target: 'F' },
    ],
  },
  // Complete Bipartite (K3,3)
  k33Bipartite: {
    vertices: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3'],
    edges: [
      { source: 'A1', target: 'B1' },
      { source: 'A1', target: 'B2' },
      { source: 'A1', target: 'B3' },
      { source: 'A2', target: 'B1' },
      { source: 'A2', target: 'B2' },
      { source: 'A2', target: 'B3' },
      { source: 'A3', target: 'B1' },
      { source: 'A3', target: 'B2' },
      { source: 'A3', target: 'B3' },
    ],
  },
  // House with roof (Eulerian envelope)
  eulerianEnvelope: {
    vertices: ['1', '2', '3', '4', '5'],
    edges: [
      { source: '1', target: '2' },
      { source: '2', target: '3' },
      { source: '3', target: '4' },
      { source: '4', target: '1' },
      { source: '1', target: '3' },
      { source: '2', target: '4' },
      { source: '2', target: '5' },
      { source: '3', target: '5' },
    ],
  },
  // Petersen Graph (3-regular, non-planar, non-Eulerian)
  petersen: {
    vertices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    edges: [
      { source: '0', target: '1' },
      { source: '1', target: '2' },
      { source: '2', target: '3' },
      { source: '3', target: '4' },
      { source: '4', target: '0' },
      { source: '0', target: '5' },
      { source: '1', target: '6' },
      { source: '2', target: '7' },
      { source: '3', target: '8' },
      { source: '4', target: '9' },
      { source: '5', target: '7' },
      { source: '7', target: '9' },
      { source: '9', target: '6' },
      { source: '6', target: '8' },
      { source: '8', target: '5' },
    ],
  },
  // Valid tree
  validTree: {
    vertices: ['v1', 'v2', 'v3', 'v4'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v1', target: 'v3' },
      { source: 'v2', target: 'v4' },
    ],
  },
  // Triangle Cycle (C3)
  cycleGraph: {
    vertices: ['1', '2', '3'],
    edges: [
      { source: '1', target: '2' },
      { source: '2', target: '3' },
      { source: '3', target: '1' },
    ],
  },
};

export type ExampleKey = keyof typeof examples;

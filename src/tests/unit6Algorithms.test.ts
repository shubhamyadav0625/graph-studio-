// src/tests/unit6Algorithms.test.ts
import { describe, it, expect } from 'vitest';
import { checkBipartite } from '../algorithms/bipartite';
import { checkEulerian } from '../algorithms/eulerian';
import { checkPlanarity } from '../algorithms/planarity';
import { greedyColoring } from '../algorithms/graphColoring';
import type { Graph } from '../types/graph';

describe('Unit 6 Discrete Mathematics Graph Algorithms', () => {
  describe('Bipartite Graph & 2-Colorability', () => {
    it('identifies an even cycle C4 as bipartite', () => {
      const c4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
        ],
      };
      const res = checkBipartite(c4);
      expect(res.isBipartite).toBe(true);
      expect(res.partitionA.length).toBe(2);
      expect(res.partitionB.length).toBe(2);
    });

    it('identifies an odd cycle C3 (triangle) as non-bipartite and finds odd cycle', () => {
      const c3: Graph = {
        vertices: ['1', '2', '3'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '1' },
        ],
      };
      const res = checkBipartite(c3);
      expect(res.isBipartite).toBe(false);
      expect(res.oddCycle).toBeDefined();
    });
  });

  describe('Eulerian Graphs', () => {
    it('detects Eulerian Circuit on C4 (all degrees = 2)', () => {
      const c4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
        ],
      };
      const res = checkEulerian(c4);
      expect(res.hasEulerianCircuit).toBe(true);
      expect(res.oddDegreeVertices.length).toBe(0);
      expect(res.eulerianType).toBe('Eulerian Circuit');
    });

    it('detects Eulerian Path on line graph P3 (2 vertices with degree 1)', () => {
      const p3: Graph = {
        vertices: ['1', '2', '3'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
        ],
      };
      const res = checkEulerian(p3);
      expect(res.hasEulerianCircuit).toBe(false);
      expect(res.hasEulerianPath).toBe(true);
      expect(res.oddDegreeVertices.length).toBe(2);
      expect(res.eulerianType).toBe('Eulerian Path (Semi-Eulerian)');
    });
  });

  describe('Planarity & Edge Bounds', () => {
    it('validates planar bound for K4 (V=4, E=6, max=3*4-6=6)', () => {
      const k4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '1', target: '3' },
          { source: '1', target: '4' },
          { source: '2', target: '3' },
          { source: '2', target: '4' },
          { source: '3', target: '4' },
        ],
      };
      const res = checkPlanarity(k4);
      expect(res.isPlanarBoundSatisfied).toBe(true);
      expect(res.facesIfPlanar).toBe(4); // F = 6 - 4 + 2 = 4
    });

    it('detects non-planarity bound violation for complete bipartite K3,3 (triangle-free, V=6, max=2*6-4=8, E=9)', () => {
      const k33: Graph = {
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
      };
      const res = checkPlanarity(k33);
      expect(res.isPlanarBoundSatisfied).toBe(false);
      expect(res.maxEdgesAllowed).toBe(8);
    });
  });

  describe('Greedy Graph Coloring (Welsh-Powell)', () => {
    it('colors a triangle K3 with chromatic number 3', () => {
      const k3: Graph = {
        vertices: ['1', '2', '3'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '1' },
        ],
      };
      const res = greedyColoring(k3);
      expect(res.chromaticNumber).toBe(3);
      expect(new Set(Object.values(res.coloring)).size).toBe(3);
    });

    it('colors a bipartite cycle C4 with chromatic number 2', () => {
      const c4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
        ],
      };
      const res = greedyColoring(c4);
      expect(res.chromaticNumber).toBe(2);
    });
  });
});

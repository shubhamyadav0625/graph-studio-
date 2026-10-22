// src/tests/stepGenerators.test.ts
import { describe, it, expect } from 'vitest';
import { bipartiteSteps } from '../algorithms/bipartiteSteps';
import { graphColoringSteps } from '../algorithms/graphColoringSteps';
import { eulerianSteps } from '../algorithms/eulerianSteps';
import type { Graph } from '../types/graph';

describe('Step Generators for Interactive Graph Algorithms', () => {
  describe('Bipartite BFS Step Generator', () => {
    it('handles empty graph', () => {
      const g: Graph = { vertices: [], edges: [] };
      const steps = Array.from(bipartiteSteps(g));
      expect(steps.length).toBe(1);
      expect(steps[0].isBipartite).toBe(true);
      expect(steps[0].isComplete).toBe(true);
    });

    it('handles isolated vertices (disconnected)', () => {
      const g: Graph = { vertices: ['A', 'B', 'C'], edges: [] };
      const steps = Array.from(bipartiteSteps(g));
      const last = steps[steps.length - 1];
      expect(last.isBipartite).toBe(true);
      expect(last.isComplete).toBe(true);
      expect(last.partitionA.length + last.partitionB.length).toBe(3);
    });

    it('correctly partitions a bipartite cycle C4', () => {
      const c4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
        ],
      };
      const steps = Array.from(bipartiteSteps(c4));
      const last = steps[steps.length - 1];
      expect(last.isBipartite).toBe(true);
      expect(last.isComplete).toBe(true);
      expect(last.partitionA.length).toBe(2);
      expect(last.partitionB.length).toBe(2);
    });

    it('detects odd cycle in triangle C3 and yields conflicting edge and oddCycle witness', () => {
      const c3: Graph = {
        vertices: ['1', '2', '3'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '1' },
        ],
      };
      const steps = Array.from(bipartiteSteps(c3));
      const last = steps[steps.length - 1];
      expect(last.isBipartite).toBe(false);
      expect(last.isComplete).toBe(true);
      expect(last.conflictingEdge).toBeDefined();
      expect(last.oddCycle).toBeDefined();
      expect(last.oddCycle!.length).toBeGreaterThanOrEqual(3);
    });

    it('detects self-loop as non-bipartite', () => {
      const g: Graph = {
        vertices: ['1', '2'],
        edges: [
          { source: '1', target: '1' },
          { source: '1', target: '2' },
        ],
      };
      const steps = Array.from(bipartiteSteps(g));
      const last = steps[steps.length - 1];
      expect(last.isBipartite).toBe(false);
      expect(last.isComplete).toBe(true);
    });
  });

  describe('Welsh-Powell Graph Coloring Step Generator', () => {
    it('handles empty graph', () => {
      const g: Graph = { vertices: [], edges: [] };
      const steps = Array.from(graphColoringSteps(g));
      expect(steps.length).toBe(1);
      expect(steps[0].chromaticUpperBound).toBe(0);
      expect(steps[0].isComplete).toBe(true);
    });

    it('determines deterministic ordering by descending degree', () => {
      // Star graph: center '0' degree 3, leaves '1','2','3' degree 1
      const star: Graph = {
        vertices: ['1', '2', '0', '3'],
        edges: [
          { source: '0', target: '1' },
          { source: '0', target: '2' },
          { source: '0', target: '3' },
        ],
      };
      const steps = Array.from(graphColoringSteps(star));
      const first = steps[0];
      expect(first.ordering[0]).toBe('0'); // Highest degree first
      const last = steps[steps.length - 1];
      expect(last.chromaticUpperBound).toBe(2);
      expect(last.assignedColors['0']).toBe(1);
      expect(last.assignedColors['1']).toBe(2);
      expect(last.assignedColors['2']).toBe(2);
      expect(last.assignedColors['3']).toBe(2);
    });

    it('produces valid coloring where no adjacent vertices have the same color', () => {
      const k4: Graph = {
        vertices: ['A', 'B', 'C', 'D'],
        edges: [
          { source: 'A', target: 'B' },
          { source: 'A', target: 'C' },
          { source: 'A', target: 'D' },
          { source: 'B', target: 'C' },
          { source: 'B', target: 'D' },
          { source: 'C', target: 'D' },
        ],
      };
      const steps = Array.from(graphColoringSteps(k4));
      const last = steps[steps.length - 1];
      expect(last.chromaticUpperBound).toBe(4);
      for (const edge of k4.edges) {
        expect(last.assignedColors[edge.source]).not.toBe(
          last.assignedColors[edge.target]
        );
      }
    });
  });

  describe('Hierholzer Eulerian Steps Generator', () => {
    it('handles empty graph', () => {
      const g: Graph = { vertices: [], edges: [] };
      const steps = Array.from(eulerianSteps(g));
      expect(steps.length).toBe(1);
      expect(steps[0].isEulerian).toBe(true);
    });

    it('rejects disconnected components with edges', () => {
      const g: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '3', target: '4' },
        ],
      };
      const steps = Array.from(eulerianSteps(g));
      expect(steps[0].isEulerian).toBe(false);
      expect(steps[0].isComplete).toBe(true);
    });

    it('rejects graph with 4 odd degree vertices', () => {
      // Star graph with 4 leaves
      const star4: Graph = {
        vertices: ['0', '1', '2', '3', '4'],
        edges: [
          { source: '0', target: '1' },
          { source: '0', target: '2' },
          { source: '0', target: '3' },
          { source: '0', target: '4' },
        ],
      };
      const steps = Array.from(eulerianSteps(star4));
      expect(steps[0].isEulerian).toBe(false);
      expect(steps[0].isComplete).toBe(true);
    });

    it('finds Eulerian circuit on cycle C4', () => {
      const c4: Graph = {
        vertices: ['1', '2', '3', '4'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
          { source: '3', target: '4' },
          { source: '4', target: '1' },
        ],
      };
      const steps = Array.from(eulerianSteps(c4));
      const last = steps[steps.length - 1];
      expect(last.isEulerian).toBe(true);
      expect(last.isComplete).toBe(true);
      expect(last.consumedEdgeIds.size).toBe(4);
      // Circuit must start and end at same vertex and contain 5 nodes (4 edges)
      expect(last.eulerianTrail.length).toBe(5);
      expect(last.eulerianTrail[0]).toBe(last.eulerianTrail[4]);
    });

    it('finds Eulerian path on line graph P3', () => {
      const p3: Graph = {
        vertices: ['1', '2', '3'],
        edges: [
          { source: '1', target: '2' },
          { source: '2', target: '3' },
        ],
      };
      const steps = Array.from(eulerianSteps(p3));
      const last = steps[steps.length - 1];
      expect(last.isEulerian).toBe(true);
      expect(last.isComplete).toBe(true);
      expect(last.consumedEdgeIds.size).toBe(2);
      expect(last.eulerianTrail.length).toBe(3);
    });
  });
});

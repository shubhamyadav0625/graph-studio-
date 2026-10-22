// src/tests/bipartiteMatching.test.ts
import { describe, it, expect } from 'vitest';
import { bipartiteMatching } from '../algorithms/bipartiteMatching';
import { bipartiteMatchingSteps } from '../algorithms/bipartiteMatchingSteps';
import type { Graph } from '../types/graph';

describe('Bipartite Maximum Matching (Augmenting Path / Hopcroft-Karp)', () => {
  it('handles empty graph', () => {
    const g: Graph = { vertices: [], edges: [] };
    const res = bipartiteMatching(g);
    expect(res.isBipartite).toBe(true);
    expect(res.maxMatchingSize).toBe(0);
    expect(res.isPerfect).toBe(true);
  });

  it('rejects non-bipartite odd cycle graph', () => {
    const triangle: Graph = {
      vertices: ['1', '2', '3'],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '1' },
      ],
    };
    const res = bipartiteMatching(triangle);
    expect(res.isBipartite).toBe(false);
    expect(res.maxMatchingSize).toBe(0);
  });

  it('finds maximum matching on path graph P4 (|M*| = 2)', () => {
    // 1 - 2 - 3 - 4 (bipartite: {1, 3} and {2, 4})
    const p4: Graph = {
      vertices: ['1', '2', '3', '4'],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
      ],
    };
    const res = bipartiteMatching(p4);
    expect(res.isBipartite).toBe(true);
    expect(res.maxMatchingSize).toBe(2);
    expect(res.isPerfect).toBe(true);
    expect(res.unmatchedVertices.length).toBe(0);
  });

  it('finds maximum matching on complete bipartite K3,3 (|M*| = 3)', () => {
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
    const res = bipartiteMatching(k33);
    expect(res.isBipartite).toBe(true);
    expect(res.maxMatchingSize).toBe(3);
    expect(res.isPerfect).toBe(true);
    expect(res.matchedPairs.length).toBe(3);
  });

  it('step generator yields augmenting path progression', () => {
    const c4: Graph = {
      vertices: ['1', '2', '3', '4'],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '4', target: '1' },
      ],
    };
    const steps = Array.from(bipartiteMatchingSteps(c4));
    expect(steps.length).toBeGreaterThan(1);
    const last = steps[steps.length - 1];
    expect(last.isComplete).toBe(true);
    expect(last.maxMatchingSize).toBe(2);
  });
});

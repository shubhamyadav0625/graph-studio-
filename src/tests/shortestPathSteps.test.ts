// src/tests/shortestPathSteps.test.ts
import { describe, it, expect } from 'vitest';
import { shortestPathSteps } from '../algorithms/shortestPathSteps';
import type { Graph } from '../types/graph';

describe('Shortest Path (BFS) Step Generator', () => {
  it('handles empty graph', () => {
    const g: Graph = { vertices: [], edges: [] };
    const steps = Array.from(shortestPathSteps(g, 'A', 'B'));
    expect(steps.length).toBe(1);
    expect(steps[0].isFound).toBe(false);
    expect(steps[0].isComplete).toBe(true);
    expect(steps[0].pathLength).toBeNull();
  });

  it('handles invalid vertex selection', () => {
    const g: Graph = { vertices: ['A', 'B'], edges: [{ source: 'A', target: 'B' }] };
    const steps = Array.from(shortestPathSteps(g, 'A', 'Z'));
    expect(steps.length).toBe(1);
    expect(steps[0].isFound).toBe(false);
    expect(steps[0].message).toContain('Invalid selection');
  });

  it('handles source equal to destination (path length 0)', () => {
    const g: Graph = {
      vertices: ['1', '2', '3'],
      edges: [{ source: '1', target: '2' }],
    };
    const steps = Array.from(shortestPathSteps(g, '2', '2'));
    expect(steps.length).toBe(1);
    expect(steps[0].isFound).toBe(true);
    expect(steps[0].pathLength).toBe(0);
    expect(steps[0].shortestPath).toEqual(['2']);
    expect(steps[0].shortestPathEdges).toEqual([]);
  });

  it('finds optimal unweighted shortest path on cycle C5', () => {
    // 1 - 2 - 3 - 4 - 5 - 1
    // Shortest path between 1 and 4 should be 1 -> 5 -> 4 (length 2 edges), not 1 -> 2 -> 3 -> 4 (length 3 edges)
    const c5: Graph = {
      vertices: ['1', '2', '3', '4', '5'],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '4', target: '5' },
        { source: '5', target: '1' },
      ],
    };

    const steps = Array.from(shortestPathSteps(c5, '1', '4'));
    const last = steps[steps.length - 1];

    expect(last.isFound).toBe(true);
    expect(last.isComplete).toBe(true);
    expect(last.pathLength).toBe(2);
    expect(last.shortestPath).toEqual(['1', '5', '4']);
    expect(last.shortestPathEdges.length).toBe(2);
  });

  it('detects unreachable destination in disconnected graph', () => {
    const disconnected: Graph = {
      vertices: ['A', 'B', 'C', 'D'],
      edges: [
        { source: 'A', target: 'B' },
        { source: 'C', target: 'D' },
      ],
    };

    const steps = Array.from(shortestPathSteps(disconnected, 'A', 'D'));
    const last = steps[steps.length - 1];

    expect(last.isFound).toBe(false);
    expect(last.isComplete).toBe(true);
    expect(last.pathLength).toBeNull();
    expect(last.shortestPath).toEqual([]);
    expect(last.message).toContain('unreachable');
  });

  it('verifies step progression and distance recording', () => {
    const line: Graph = {
      vertices: ['1', '2', '3'],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
      ],
    };

    const steps = Array.from(shortestPathSteps(line, '1', '3'));
    expect(steps.length).toBeGreaterThanOrEqual(3);

    const first = steps[0];
    expect(first.distances['1']).toBe(0);

    const last = steps[steps.length - 1];
    expect(last.distances['3']).toBe(2);
    expect(last.shortestPath).toEqual(['1', '2', '3']);
  });
});

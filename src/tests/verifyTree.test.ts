// src/tests/verifyTree.test.ts
import { expect, test } from 'vitest';
import { verifyTree } from '../algorithms/verifyTree';
import type { Graph } from '../types/graph';

test('single vertex graph is a tree', () => {
  const graph: Graph = { vertices: ['v1'], edges: [] };
  const result = verifyTree(graph);
  expect(result.isTree).toBe(true);
  expect(result.reasons).toContain('A single isolated vertex with no edges is a valid tree.');
});

test('simple tree passes verification', () => {
  const graph: Graph = {
    vertices: ['v1', 'v2', 'v3'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v2', target: 'v3' },
    ],
  };
  const result = verifyTree(graph);
  expect(result.isTree).toBe(true);
  expect(result.reasons).toContain('All tree criteria satisfied – the graph IS a tree.');
});

test('graph with a cycle is not a tree', () => {
  const graph: Graph = {
    vertices: ['v1', 'v2', 'v3'],
    edges: [
      { source: 'v1', target: 'v2' },
      { source: 'v2', target: 'v3' },
      { source: 'v3', target: 'v1' },
    ],
  };
  const result = verifyTree(graph);
  expect(result.isTree).toBe(false);
  expect(result.reasons).toContain('Graph contains a cycle, which disqualifies it from being a tree.');
});

// src/algorithms/connectedComponents.ts
import type { Graph, VertexId } from '../types/graph';

/**
 * Returns an array of components, each component being an array of vertex IDs.
 */
export function connectedComponents(graph: Graph): VertexId[][] {
  const adjacency = buildAdjacencyMap(graph);
  const visited = new Set<VertexId>();
  const components: VertexId[][] = [];

  for (const v of graph.vertices) {
    if (!visited.has(v)) {
      const component: VertexId[] = [];
      const stack: VertexId[] = [v];
      visited.add(v);
      while (stack.length) {
        const cur = stack.pop()!;
        component.push(cur);
        for (const nb of adjacency.get(cur) ?? []) {
          if (!visited.has(nb)) {
            visited.add(nb);
            stack.push(nb);
          }
        }
      }
      components.push(component);
    }
  }
  return components;
}

function buildAdjacencyMap(graph: Graph): Map<VertexId, VertexId[]> {
  const map = new Map<VertexId, VertexId[]>();
  for (const v of graph.vertices) map.set(v, []);
  for (const { source, target } of graph.edges) {
    map.get(source)!.push(target);
    map.get(target)!.push(source);
  }
  return map;
}

// src/components/GraphStatus.tsx
import React from 'react';
import { useGraph } from '../context';

/**
 * Displays basic live statistics of the graph.
 * Shows number of vertices and edges, updating automatically.
 */
const GraphStatus: React.FC = () => {
  const { graph } = useGraph();
  const vertexCount = graph.vertices.length;
  const edgeCount = graph.edges.length;
  return (
    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
      <span>Vertices: {vertexCount}</span>
      <span>Edges: {edgeCount}</span>
    </div>
  );
};

export default GraphStatus;

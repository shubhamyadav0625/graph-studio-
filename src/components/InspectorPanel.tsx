// src/components/InspectorPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { connectedComponents } from '../algorithms/connectedComponents';
import { detectCycle } from '../algorithms/detectCycle';
import { CircleCheck, CircleX, Info } from 'lucide-react';

const InspectorPanel: React.FC = () => {
  const { graph, selected } = useGraph();
  const vertexCount = graph.vertices.length;
  const edgeCount = graph.edges.length;
  const components = connectedComponents(graph);
  const hasCycle = detectCycle(graph);
  const isTree = verifyTree(graph);

  const selectedVertex = selected[0];

  return (
    <div className="w-80 bg-slate-800 text-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Info className="mr-2" size={18} /> Graph Overview
      </h2>
      <ul className="space-y-1 text-sm">
        <li>Vertices: {vertexCount}</li>
        <li>Edges: {edgeCount}</li>
        <li>Components: {components.length}</li>
        <li>Cycle: {hasCycle ? <span className="flex items-center"><CircleX className="text-red-500 mr-1" size={14} /> Yes</span> : <span className="flex items-center"><CircleCheck className="text-green-500 mr-1" size={14} /> No</span>}</li>
        <li>Tree: {isTree ? <span className="flex items-center"><CircleCheck className="text-green-500 mr-1" size={14} /> Yes</span> : <span className="flex items-center"><CircleX className="text-red-500 mr-1" size={14} /> No</span>}</li>
      </ul>
      {selectedVertex && (
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2 flex items-center">
            <Info className="mr-2" size={16} /> Selected Vertex
          </h3>
          <p className="text-sm">ID: {selectedVertex}</p>
        </div>
      )}
    </div>
  );
};

export default InspectorPanel;

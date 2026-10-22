// src/components/Sidebar.tsx
import React from 'react';
import { Plus, Minus, RotateCcw, Eraser, ArrowRight, ClipboardList } from 'lucide-react';
import { useGraph } from '../context';
import type { ExampleKey } from '../data/exampleGraphs';
import { examples } from '../data/exampleGraphs';

const Sidebar: React.FC = () => {
  const { addVertex, addEdge, clearGraph, undo, selected, setGraph } = useGraph();
  const [exampleKey, setExampleKey] = React.useState<ExampleKey | ''>('');

  const handleAddVertex = () => addVertex();
  const handleAddEdge = () => {
    if (selected.length !== 2) {
      alert('Select exactly two vertices to add an edge.');
      return;
    }
    const [a, b] = selected as [string, string];
    addEdge(a, b);
  };
  const handleRemoveSelected = () => {
    // use GraphCanvas delete via window bridge
    (window as any).graphCanvasDeleteSelection?.();
  };
  const handleLoadExample = () => {
    if (!exampleKey) return;
    const ex = examples[exampleKey];
    setGraph({ ...ex });
  };

  return (
    <aside className="w-64 bg-slate-800 text-gray-200 p-4 flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <button onClick={handleAddVertex} className="flex items-center gap-2 p-2 bg-indigo-600 rounded hover:bg-indigo-500">
          <Plus size={16} /> Add Vertex
        </button>
        <button onClick={handleAddEdge} className="flex items-center gap-2 p-2 bg-green-600 rounded hover:bg-green-500">
          <ArrowRight size={16} /> Add Edge
        </button>
        <button onClick={handleRemoveSelected} className="flex items-center gap-2 p-2 bg-red-600 rounded hover:bg-red-500">
          <Minus size={16} /> Remove Selected
        </button>
        <button onClick={clearGraph} className="flex items-center gap-2 p-2 bg-gray-600 rounded hover:bg-gray-500">
          <Eraser size={16} /> Clear Graph
        </button>
        <button onClick={undo} className="flex items-center gap-2 p-2 bg-yellow-600 rounded hover:bg-yellow-500">
          <RotateCcw size={16} /> Undo
        </button>
      </div>
      <div className="mt-4">
        <select value={exampleKey} onChange={e => setExampleKey(e.target.value as ExampleKey)} className="w-full p-2 bg-slate-700 text-white rounded">
          <option value="">Load Example…</option>
          {Object.keys(examples).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <button onClick={handleLoadExample} disabled={!exampleKey} className="mt-2 w-full p-2 bg-indigo-500 rounded hover:bg-indigo-400 disabled:opacity-50">
          <ClipboardList size={16} /> Load
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

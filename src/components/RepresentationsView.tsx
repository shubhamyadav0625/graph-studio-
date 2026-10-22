// src/components/RepresentationsView.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import AdjacencyMatrix from './AdjacencyMatrix';
import AdjacencyList from './AdjacencyList';
import IncidenceMatrix from './IncidenceMatrix';
import { BookOpen } from 'lucide-react';

const RepresentationsView: React.FC = () => {
  const { graph } = useGraph();
  const [activeTab, setActiveTab] = useState<'adjMatrix' | 'adjList' | 'incMatrix'>('adjMatrix');
  const n = graph.vertices.length;

  return (
    <div className="space-y-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Graph Representations
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Different ways to represent a graph in memory
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('adjMatrix')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'adjMatrix'
              ? 'bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Adjacency Matrix
        </button>

        <button
          onClick={() => setActiveTab('adjList')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'adjList'
              ? 'bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Adjacency List
        </button>

        <button
          onClick={() => setActiveTab('incMatrix')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'incMatrix'
              ? 'bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Incidence Matrix
        </button>
      </div>

      {/* Main Grid: Representation Component + About Card */}
      <div className="grid gap-4 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          {activeTab === 'adjMatrix' && <AdjacencyMatrix />}
          {activeTab === 'adjList' && <AdjacencyList />}
          {activeTab === 'incMatrix' && <IncidenceMatrix />}
        </div>

        {/* Right Info Card (matches Screen 3) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-3 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" />
            {activeTab === 'adjMatrix'
              ? 'About Adjacency Matrix'
              : activeTab === 'adjList'
              ? 'About Adjacency List'
              : 'About Incidence Matrix'}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeTab === 'adjMatrix' && (
              <>
                The adjacency matrix is a <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">V × V</span> matrix where <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">matrix[i][j] = 1</span> if there is an edge between vertex <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">i</span> and <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">j</span>, otherwise <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">0</span>.
              </>
            )}
            {activeTab === 'adjList' && (
              <>
                An adjacency list represents a graph as an array of lists. Each index contains a list of adjacent neighbors for vertex <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">v</span>.
              </>
            )}
            {activeTab === 'incMatrix' && (
              <>
                The incidence matrix is a <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">V × E</span> matrix showing relationships between vertices and edges.
              </>
            )}
          </p>

          <div className="pt-2 border-t border-slate-200 dark:border-[#1e2646]">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Matrix Properties
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">• Size:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">
                  {activeTab === 'incMatrix' ? `${n} × ${graph.edges.length}` : `${n} × ${n}`}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">• Type:</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold">
                  {activeTab === 'adjMatrix' ? 'Symmetric' : 'Incidence'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">• Diagonal:</span>
                <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold">All zeros</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">• Graph Type:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Undirected</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentationsView;

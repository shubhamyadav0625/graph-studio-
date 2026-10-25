// src/pages/Theory.tsx
import React, { useState } from 'react';

const topics = [
  { id: 'basics', label: 'Graph Basics' },
  { id: 'representations', label: 'Graph Representations' },
  { id: 'connectivity', label: 'Connectivity' },
  { id: 'cycles', label: 'Cycles & Paths' },
  { id: 'trees', label: 'Trees' },
  { id: 'bipartite', label: 'Bipartite Graphs' },
  { id: 'euler', label: 'Euler & Hamiltonian' },
  { id: 'planar', label: 'Planar Graphs' },
  { id: 'coloring', label: 'Graph Coloring' },
  { id: 'matching', label: 'Matching (Hopcroft-Karp)' },
];

const Theory: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('trees');

  return (
    <div className="space-y-4 max-w-6xl mx-auto select-none">
      {/* Title & Subtitle matching Screen 7 in reference image */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Theory & Learning
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Concepts, definitions and theorems (Unit 6)
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Left Topic Selector matching Screen 7 */}
        <div className="lg:col-span-4 p-3 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-1">
          {topics.map((t) => {
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#5b3bf6] text-white font-semibold shadow-[0_0_12px_rgba(91,59,246,0.6)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#121936]'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Right Theory Content matching Screen 7 */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              {activeTopic === 'trees' && 'Trees'}
              {activeTopic === 'basics' && 'Graph Basics'}
              {activeTopic === 'representations' && 'Graph Representations'}
              {activeTopic === 'connectivity' && 'Connectivity & Components'}
              {activeTopic === 'cycles' && 'Cycles & Paths'}
              {activeTopic === 'bipartite' && 'Bipartite Graphs & 2-Colorability'}
              {activeTopic === 'euler' && 'Eulerian & Hamiltonian Graphs'}
              {activeTopic === 'planar' && 'Planar Graphs & Edge Bounds'}
              {activeTopic === 'coloring' && 'Graph Coloring (Welsh-Powell)'}
              {activeTopic === 'matching' && 'Bipartite Matching (Hopcroft-Karp)'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTopic === 'trees' && 'A tree is a connected and acyclic undirected graph.'}
              {activeTopic === 'basics' && 'A graph G = (V, E) consists of a set of vertices V and edges E.'}
              {activeTopic === 'representations' && 'Standard ways to represent graphs include adjacency matrices, lists, and incidence matrices.'}
              {activeTopic === 'connectivity' && 'A graph is connected if there is a path between every pair of vertices.'}
              {activeTopic === 'cycles' && 'A cycle is a path of edges and vertices wherein a vertex is reachable from itself.'}
              {activeTopic === 'bipartite' && 'A bipartite graph has vertices that can be partitioned into two independent sets.'}
              {activeTopic === 'euler' && 'An Eulerian circuit visits every edge exactly once and returns to the start vertex.'}
              {activeTopic === 'planar' && 'A graph is planar if it can be drawn in a plane without intersecting edges.'}
              {activeTopic === 'coloring' && 'Graph coloring assigns colors to vertices such that no adjacent vertices share a color.'}
              {activeTopic === 'matching' && 'A matching in a graph is a set of edges without common vertices.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="space-y-3 flex-1 text-xs">
              <h3 className="font-semibold text-white">Key Properties</h3>
              <ol className="space-y-2 text-slate-300 text-[11px] list-decimal list-inside leading-relaxed">
                <li>A tree with n vertices has exactly n - 1 edges (|E| = |V| - 1).</li>
                <li>There is exactly one unique simple path between any two vertices.</li>
                <li>Removing any edge disconnects the graph into a forest.</li>
                <li>Adding any edge creates exactly one simple cycle.</li>
              </ol>
            </div>

            {/* Tree Diagram SVG matching Screen 7 */}
            <div className="w-48 h-36 flex items-center justify-center bg-[#080d1e] rounded-xl border border-[#16213e] p-2">
              <svg width="180" height="120" className="overflow-visible">
                <line x1="90" y1="20" x2="50" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="90" y1="20" x2="130" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="50" y1="60" x2="30" y2="100" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="50" y1="60" x2="70" y2="100" stroke="#38bdf8" strokeWidth="2.5" />

                <circle cx="90" cy="20" r="12" fill="#a855f7" stroke="#c084fc" strokeWidth="2" />
                <text x="90" y="24" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">1</text>

                <circle cx="50" cy="60" r="11" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
                <text x="50" y="64" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">2</text>

                <circle cx="130" cy="60" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
                <text x="130" y="64" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">4</text>

                <circle cx="30" cy="100" r="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="30" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">3</text>

                <circle cx="70" cy="100" r="10" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
                <text x="70" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">5</text>
              </svg>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#080d1e] border border-[#172140] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">For a tree T:</span>
            <span className="text-[#38bdf8] font-bold">|E(T)| = |V(T)| - 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theory;

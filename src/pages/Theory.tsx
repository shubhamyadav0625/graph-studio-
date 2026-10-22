// src/pages/Theory.tsx
import React, { useState } from 'react';

const topics = [
  { id: 'intro', label: 'Introduction' },
  { id: 'definitions', label: 'Definitions' },
  { id: 'types', label: 'Types of Graphs' },
  { id: 'paths', label: 'Paths and Cycles' },
  { id: 'components', label: 'Connected Components' },
  { id: 'trees', label: 'Trees' },
  { id: 'bipartite', label: 'Bipartite Graphs' },
  { id: 'planar', label: 'Planar Graphs' },
  { id: 'coloring', label: 'Graph Coloring' },
  { id: 'euler', label: 'Euler & Hamilton' },
  { id: 'applications', label: 'Applications' },
];

const Theory: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState('intro');

  return (
    <div className="space-y-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Theory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Learn the fundamental concepts of graph theory
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 items-start">
        {/* Left Topics Nav */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-1 transition-colors">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTopic === t.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161d36]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-5 transition-colors">
          {activeTopic === 'intro' && (
            <>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Introduction to Graph Theory
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  Graph theory is a branch of discrete mathematics that studies mathematical structures used to model pairwise relationships between objects.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Basic Definition
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  A graph <span className="font-mono text-slate-900 dark:text-white font-semibold">G</span> is an ordered pair{' '}
                  <span className="font-mono text-slate-900 dark:text-white font-semibold">G = (V, E)</span> where:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <li>
                    <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">V</span> is a set of vertices (or nodes)
                  </li>
                  <li>
                    <span className="font-mono text-indigo-600 dark:text-indigo-300 font-semibold">E</span> is a set of edges (or links) between vertices
                  </li>
                </ul>
              </div>

              {/* Visual Diagram Representation (matches Screen 6) */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0d1222] border border-slate-200 dark:border-[#1e2646] space-y-3 transition-colors">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Visual Representation
                </h4>
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                  <svg width="180" height="120" className="overflow-visible">
                    <line x1="90" y1="20" x2="40" y2="60" stroke="#818cf8" strokeWidth="2.5" />
                    <line x1="90" y1="20" x2="140" y2="60" stroke="#818cf8" strokeWidth="2.5" />
                    <line x1="40" y1="60" x2="90" y2="100" stroke="#818cf8" strokeWidth="2.5" />
                    <line x1="140" y1="60" x2="90" y2="100" stroke="#818cf8" strokeWidth="2.5" />

                    <circle cx="90" cy="20" r="14" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                    <text x="90" y="24" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">1</text>
                    <circle cx="40" cy="60" r="14" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                    <text x="40" y="64" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">2</text>
                    <circle cx="140" cy="60" r="14" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                    <text x="140" y="64" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">3</text>
                    <circle cx="90" cy="100" r="14" fill="#4338ca" stroke="#818cf8" strokeWidth="2" />
                    <text x="90" y="104" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">4</text>
                  </svg>

                  <div className="text-xs font-mono space-y-2 text-slate-700 dark:text-slate-300">
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">V</span> = {'{ 1, 2, 3, 4 }'}
                    </div>
                    <div>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">E</span> = {'{ (1,2), (1,3), (2,4), (3,4) }'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTopic === 'definitions' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Graph Definitions</h2>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li><strong className="text-slate-900 dark:text-white">Degree deg(v):</strong> Number of incident edges on vertex v. Handshaking lemma: ∑deg(v) = 2|E|.</li>
                <li><strong className="text-slate-900 dark:text-white">Adjacency:</strong> Two vertices are adjacent if an edge connects them directly.</li>
                <li><strong className="text-slate-900 dark:text-white">Neighborhood N(v):</strong> The set of all neighbors of vertex v.</li>
              </ul>
            </div>
          )}

          {activeTopic === 'types' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Types of Graphs</h2>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li><strong className="text-slate-900 dark:text-white">Undirected Graph:</strong> Edges have no orientation: (u, v) = (v, u).</li>
                <li><strong className="text-slate-900 dark:text-white">Directed Graph (Digraph):</strong> Edges have orientation: (u, v) ≠ (v, u).</li>
                <li><strong className="text-slate-900 dark:text-white">Weighted Graph:</strong> Edges carry assigned numerical costs or capacities.</li>
                <li><strong className="text-slate-900 dark:text-white">Simple Graph:</strong> Contains neither self-loops nor parallel edges.</li>
              </ul>
            </div>
          )}

          {activeTopic === 'paths' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Paths and Cycles</h2>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li><strong className="text-slate-900 dark:text-white">Walk:</strong> An alternating sequence of vertices and connecting edges.</li>
                <li><strong className="text-slate-900 dark:text-white">Path:</strong> A walk in which all vertices and edges are distinct.</li>
                <li><strong className="text-slate-900 dark:text-white">Cycle:</strong> A closed simple path where start and end vertices are identical.</li>
              </ul>
            </div>
          )}

          {activeTopic === 'components' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connected Components</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A connected component of an undirected graph is a maximal connected subgraph. A graph is connected if and only if it consists of exactly 1 connected component.
              </p>
            </div>
          )}

          {activeTopic === 'trees' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tree Theorems</h2>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d1222] border-l-4 border-l-indigo-500 text-xs text-slate-700 dark:text-slate-200">
                <strong>Tree Equivalence:</strong> An undirected graph T with n vertices is a tree if and only if it is connected and has exactly n − 1 edges.
              </div>
            </div>
          )}

          {['bipartite', 'planar', 'coloring', 'euler', 'applications'].includes(activeTopic) && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {topics.find((t) => t.id === activeTopic)?.label}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Foundational topic in Discrete Mathematics curriculum. Try building and inspecting corresponding topologies in the Workspace and Algorithms tabs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Theory;

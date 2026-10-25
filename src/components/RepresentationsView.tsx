// src/components/RepresentationsView.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import { Grid, Info, Sparkles } from 'lucide-react';

const RepresentationsView: React.FC = () => {
  const { graph } = useGraph();
  const [activeTab, setActiveTab] = useState<'list' | 'adjMatrix' | 'incMatrix'>('list');

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;

  // Build Adjacency List
  const adjList: Record<string, string[]> = {};
  graph.vertices.forEach((v) => {
    adjList[v] = [];
  });
  graph.edges.forEach(({ source, target }) => {
    if (adjList[source] && !adjList[source].includes(target)) {
      adjList[source].push(target);
    }
    if (adjList[target] && !adjList[target].includes(source)) {
      adjList[target].push(source);
    }
  });

  // Build Adjacency Matrix
  const adjMatrix: number[][] = graph.vertices.map((u) =>
    graph.vertices.map((v) =>
      graph.edges.some(
        (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
      )
        ? 1
        : 0
    )
  );

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner Row matching exact Reference Screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
            <Grid size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Graph Representations
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              View and analyze different representations of the current graph.
            </p>
          </div>
        </div>

        {/* Top Right Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs font-mono font-semibold text-slate-200">
            |V| = {vCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs font-mono font-semibold text-slate-200">
            |E| = {eCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs font-semibold text-slate-200">
            Type: Undirected
          </div>
        </div>
      </div>

      {/* Selector Tabs matching Reference Screenshot */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'list'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
              : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
          }`}
        >
          Adjacency List
        </button>
        <button
          onClick={() => setActiveTab('adjMatrix')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'adjMatrix'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
              : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
          }`}
        >
          Adjacency Matrix
        </button>
        <button
          onClick={() => setActiveTab('incMatrix')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'incMatrix'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
              : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
          }`}
        >
          Incidence Matrix
        </button>
      </div>

      {/* Main 4-Card Presentation Grid: Current Graph, Adjacency List, Adjacency Matrix, Incidence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Card 1 (span 3): Current Graph SVG */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white mb-2">Current Graph</h3>
          <div className="flex-1 flex items-center justify-center py-2 relative">
            <svg width="200" height="190" viewBox="0 0 220 200" className="overflow-visible">
              <line x1="110" y1="30" x2="45" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="110" y1="30" x2="175" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="45" y1="75" x2="65" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="175" y1="75" x2="155" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="65" y1="165" x2="155" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="110" y1="30" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="45" y1="75" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="175" y1="75" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />

              <circle cx="110" cy="30" r="14" fill="#2563eb" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
              <text x="110" y="34" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>
              <circle cx="45" cy="75" r="14" fill="#0284c7" className="drop-shadow-[0_0_10px_rgba(2,132,199,0.9)]" />
              <text x="45" y="79" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>
              <circle cx="175" cy="75" r="14" fill="#9333ea" className="drop-shadow-[0_0_12px_rgba(147,51,234,0.9)]" />
              <text x="175" y="79" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>
              <circle cx="110" cy="105" r="14" fill="#0284c7" className="drop-shadow-[0_0_10px_rgba(2,132,199,0.9)]" />
              <text x="110" y="109" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">6</text>
              <circle cx="65" cy="165" r="14" fill="#0284c7" className="drop-shadow-[0_0_10px_rgba(2,132,199,0.9)]" />
              <text x="65" y="169" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>
              <circle cx="155" cy="165" r="14" fill="#0284c7" className="drop-shadow-[0_0_10px_rgba(2,132,199,0.9)]" />
              <text x="155" y="169" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">5</text>
            </svg>
          </div>
        </div>

        {/* Card 2 (span 2): Adjacency List Table */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2.5">Adjacency List</h3>
            <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 border-b border-[#141b38] pb-1 mb-1.5">
              <span className="col-span-4">Vertex</span>
              <span className="col-span-8">Neighbors</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              {graph.vertices.map((v, idx) => (
                <div key={v} className="grid grid-cols-12 items-center py-1 px-1.5 rounded-lg bg-[#0d132e]">
                  <div className="col-span-4 flex items-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                        idx === 2 ? 'bg-[#9333ea]' : 'bg-[#2563eb]'
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                  <span className="col-span-8 text-slate-200 text-xs font-semibold">
                    {(adjList[v] || []).join(', ') || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3 (span 3.5): Adjacency Matrix (6 x 6) */}
        <div className="lg:col-span-3.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between overflow-x-auto">
          <div>
            <h3 className="text-xs font-bold text-white mb-2.5">
              Adjacency Matrix ({vCount} × {vCount})
            </h3>
            <table className="w-full text-center border-collapse font-mono text-xs">
              <thead>
                <tr className="text-slate-400 text-[11px]">
                  <th className="p-1"></th>
                  {graph.vertices.map((v) => (
                    <th key={v} className="p-1 font-bold text-slate-300">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-[#121938]">
                    <td className="p-1 font-bold text-slate-400 text-[11px]">{graph.vertices[i]}</td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`p-1.5 text-xs font-semibold ${
                          val === 1 ? 'text-white bg-[#141b3a]' : 'text-slate-500'
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 4 (span 3.5): Incidence Matrix (6 x 8) */}
        <div className="lg:col-span-3.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between overflow-x-auto">
          <div>
            <h3 className="text-xs font-bold text-white mb-2.5">
              Incidence Matrix ({vCount} × {eCount})
            </h3>
            <table className="w-full text-center border-collapse font-mono text-xs">
              <thead>
                <tr className="text-slate-400 text-[10px]">
                  <th className="p-1"></th>
                  {graph.edges.map((_, idx) => (
                    <th key={idx} className="p-1 font-semibold text-slate-300">
                      e{idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graph.vertices.map((v) => (
                  <tr key={v} className="hover:bg-[#121938]">
                    <td className="p-1 font-bold text-slate-400 text-[11px]">{v}</td>
                    {graph.edges.map((e, eIdx) => {
                      const isIncident = e.source === v || e.target === v ? 1 : 0;
                      return (
                        <td
                          key={eIdx}
                          className={`p-1 text-xs font-semibold ${
                            isIncident ? 'text-white bg-[#141b3a]' : 'text-slate-500'
                          }`}
                        >
                          {isIncident}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Row: About Representations & Key Insights matching Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* About Representations (span 6) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-[#6e2bf5]/20 text-[#c084fc]">
              <Info size={14} />
            </div>
            <h3 className="text-xs font-bold text-white">About Representations</h3>
          </div>
          <p className="text-xs text-slate-400">
            Different ways to represent a graph in a computer:
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Adjacency List</strong> – List of neighbors for each vertex.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Adjacency Matrix</strong> – V × V matrix (1 if edge exists, else 0).
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#a855f7] mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Incidence Matrix</strong> – V × E matrix (1 if vertex is incident to edge).
              </span>
            </div>
          </div>
        </div>

        {/* Key Insights (span 6) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-[#a855f7]/20 text-[#c084fc]">
              <Sparkles size={14} />
            </div>
            <h3 className="text-xs font-bold text-white">Key Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d132e] border border-[#182142]">
                <span className="text-slate-400 text-[11px]">Space (Adj. List)</span>
                <span className="text-emerald-400 font-bold">O(V + E)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d132e] border border-[#182142]">
                <span className="text-slate-400 text-[11px]">Space (Adj. Matrix)</span>
                <span className="text-amber-400 font-bold">O(V²)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d132e] border border-[#182142]">
                <span className="text-slate-400 text-[11px]">Space (Inc. Matrix)</span>
                <span className="text-indigo-400 font-bold">O(V × E)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Adjacency list is space efficient for sparse graphs.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Adjacency matrix supports O(1) edge lookup.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Incidence matrix is useful in flow & matching algorithms.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentationsView;

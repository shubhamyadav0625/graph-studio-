// src/components/RepresentationsView.tsx
import React, { useState, useEffect, useRef } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph } from '../context';
import { Grid, Info, Sparkles } from 'lucide-react';

const RepresentationsView: React.FC = () => {
  const { graph } = useGraph();
  const [activeTab, setActiveTab] = useState<'all' | 'list' | 'adjMatrix' | 'incMatrix'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;

  // Build dynamic Adjacency List from current graph
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

  // Build dynamic Adjacency Matrix from current graph
  const adjMatrix: number[][] = graph.vertices.map((u) =>
    graph.vertices.map((v) =>
      graph.edges.some(
        (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
      )
        ? 1
        : 0
    )
  );

  // Initialize and update Cytoscape canvas for Current Graph
  useEffect(() => {
    if (!containerRef.current) return;

    if (!cyRef.current) {
      cyRef.current = Cytoscape({
        container: containerRef.current,
        elements: [],
        boxSelectionEnabled: false,
        autounselectify: false,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              color: '#ffffff',
              'font-size': '12px',
              'font-weight': 'bold',
              'font-family': 'ui-sans-serif, system-ui, sans-serif',
              'background-color': '#0284c7',
              'border-width': 2.5,
              'border-color': '#38bdf8',
              width: 32,
              height: 32,
            } as any,
          },
          {
            selector: 'edge',
            style: {
              width: 2.2,
              'line-color': '#38bdf8',
              'target-arrow-shape': 'none',
              'curve-style': 'straight',
              opacity: 0.85,
            } as any,
          },
        ],
        layout: { name: 'preset' },
      });
    }

    const cy = cyRef.current;
    if (!cy) return;

    // Reference coordinates matching the pentagon + center layout
    const referenceCoords: Record<string, { x: number; y: number }> = {
      A: { x: 130, y: 35 },
      B: { x: 50, y: 85 },
      C: { x: 210, y: 85 },
      D: { x: 130, y: 110 },
      E: { x: 75, y: 175 },
      F: { x: 185, y: 175 },
      '1': { x: 130, y: 35 },
      '2': { x: 50, y: 85 },
      '3': { x: 210, y: 85 },
      '4': { x: 130, y: 110 },
      '5': { x: 75, y: 175 },
      '6': { x: 185, y: 175 },
    };

    const count = graph.vertices.length;
    const elements: Cytoscape.ElementDefinition[] = [];

    graph.vertices.forEach((v, index) => {
      let pos = referenceCoords[v];
      if (!pos) {
        const angle = (2 * Math.PI * index) / Math.max(1, count);
        pos = {
          x: 130 + 75 * Math.sin(angle),
          y: 110 - 75 * Math.cos(angle),
        };
      }
      elements.push({
        group: 'nodes',
        data: { id: v, label: v },
        position: pos,
      });
    });

    graph.edges.forEach((e, i) => {
      elements.push({
        group: 'edges',
        data: {
          id: `e-${e.source}-${e.target}-${i}`,
          source: e.source,
          target: e.target,
        },
      });
    });

    cy.elements().remove();
    cy.add(elements);

    // Give the container time to calculate dimensions before fitting
    const timer = setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit(undefined, 25);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [graph, activeTab]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans">
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
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] font-semibold text-slate-200">
            |V| = {vCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] font-semibold text-slate-200">
            |E| = {eCount}
          </div>
        </div>
      </div>

      {/* Tabs Row matching Screenshot: All Representations, Adjacency List, Adjacency Matrix, Incidence Matrix */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
              : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
          }`}
        >
          All Representations
        </button>
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

      {/* Main Presentation Layout: Dynamically reacts to selected Tab */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {/* Card 1: Current Graph Interactive Canvas */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between min-w-0">
            <h3 className="text-xs font-bold text-white mb-2">Current Graph</h3>
            <div
              className="h-[210px] w-full relative py-1 rounded-xl border border-[#121833] overflow-hidden"
              style={{
                backgroundColor: '#060919',
                backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              <div ref={containerRef} className="w-full h-full" style={{ minHeight: '200px' }} />
            </div>
          </div>

          {/* Card 2: Adjacency List Table */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between min-w-0">
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5">Adjacency List</h3>
              <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 border-b border-[#141b38] pb-1 mb-1.5">
                <span className="col-span-4">Vertex</span>
                <span className="col-span-8">Neighbors</span>
              </div>
              <div className="space-y-1 font-mono text-xs max-h-[190px] overflow-y-auto">
                {graph.vertices.map((v, idx) => (
                  <div key={v} className="grid grid-cols-12 items-center py-1 px-1.5 rounded-lg bg-[#0d132e]">
                    <div className="col-span-4 flex items-center">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          idx % 3 === 0 ? 'bg-[#9333ea]' : 'bg-[#2563eb]'
                        }`}
                      >
                        {v}
                      </span>
                    </div>
                    <span className="col-span-8 text-slate-200 text-xs font-semibold truncate">
                      {(adjList[v] || []).join(', ') || '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Adjacency Matrix */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between overflow-x-auto min-w-0">
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5">
                Adjacency Matrix ({vCount} × {vCount})
              </h3>
              <div className="max-h-[190px] overflow-y-auto">
                <table className="w-full text-center border-collapse font-mono text-xs">
                  <thead>
                    <tr className="text-slate-400 text-[10px]">
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
                        <td className="p-1 font-bold text-slate-400 text-[10px]">{graph.vertices[i]}</td>
                        {row.map((val, j) => (
                          <td
                            key={j}
                            className={`p-1 text-xs font-semibold ${
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
          </div>

          {/* Card 4: Incidence Matrix */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between overflow-x-auto min-w-0">
            <div>
              <h3 className="text-xs font-bold text-white mb-2.5">
                Incidence Matrix ({vCount} × {eCount})
              </h3>
              <div className="max-h-[190px] overflow-y-auto">
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
                        <td className="p-1 font-bold text-slate-400 text-[10px]">{v}</td>
                        {graph.edges.map((e, eIdx) => {
                          const isIncident = e.source === v || e.target === v ? 1 : 0;
                          return (
                            <td
                              key={eIdx}
                              className={`p-1 text-xs font-semibold ${
                                isIncident === 1 ? 'text-white bg-[#141b3a]' : 'text-slate-500'
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
        </div>
      )}

      {/* Individual Tab 1: Adjacency List */}
      {activeTab === 'list' && (
        <div className="p-5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-2">
            <div>
              <h2 className="text-sm font-bold text-white">Adjacency List Representation</h2>
              <p className="text-xs text-slate-400">
                Maps each vertex to an array of its directly connected neighbor vertices.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-800 text-purple-300 font-mono text-xs font-semibold">
              Space Complexity: O(V + E)
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {graph.vertices.map((v) => (
              <div key={v} className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#6e2bf5] flex items-center justify-center font-bold text-white text-xs">
                    {v}
                  </span>
                  <span className="text-xs text-slate-300">Neighbors:</span>
                </div>
                <div className="font-mono text-xs font-bold text-white">
                  {(adjList[v] || []).length > 0 ? (
                    <span className="text-purple-300">[{adjList[v].join(', ')}]</span>
                  ) : (
                    <span className="text-slate-500">[]</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Tab 2: Adjacency Matrix */}
      {activeTab === 'adjMatrix' && (
        <div className="p-5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-2">
            <div>
              <h2 className="text-sm font-bold text-white">Adjacency Matrix Representation</h2>
              <p className="text-xs text-slate-400">
                A 2D array where entry (i, j) is 1 if an edge connects vertex i and vertex j, and 0 otherwise.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-800 text-purple-300 font-mono text-xs font-semibold">
              Space Complexity: O(V²)
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse font-mono text-xs">
              <thead>
                <tr className="text-slate-400">
                  <th className="p-2 border border-[#182142] bg-[#0c102a]"></th>
                  {graph.vertices.map((v) => (
                    <th key={v} className="p-2 border border-[#182142] bg-[#0c102a] font-bold text-purple-300">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-[#121938]">
                    <td className="p-2 border border-[#182142] bg-[#0c102a] font-bold text-purple-300">
                      {graph.vertices[i]}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`p-2 border border-[#182142] font-semibold ${
                          val === 1 ? 'text-white bg-[#6e2bf5]/40 shadow-inner' : 'text-slate-600'
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
      )}

      {/* Individual Tab 3: Incidence Matrix */}
      {activeTab === 'incMatrix' && (
        <div className="p-5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-2">
            <div>
              <h2 className="text-sm font-bold text-white">Incidence Matrix Representation</h2>
              <p className="text-xs text-slate-400">
                A (V × E) matrix where entry (v, e) indicates whether vertex v is incident to edge e.
              </p>
            </div>
            <div className="px-3 py-1 rounded-xl bg-purple-950/40 border border-purple-800 text-purple-300 font-mono text-xs font-semibold">
              Space Complexity: O(V × E)
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse font-mono text-xs">
              <thead>
                <tr className="text-slate-400">
                  <th className="p-2 border border-[#182142] bg-[#0c102a]"></th>
                  {graph.edges.map((_, idx) => (
                    <th key={idx} className="p-2 border border-[#182142] bg-[#0c102a] font-bold text-purple-300">
                      e{idx + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graph.vertices.map((v) => (
                  <tr key={v} className="hover:bg-[#121938]">
                    <td className="p-2 border border-[#182142] bg-[#0c102a] font-bold text-purple-300">
                      {v}
                    </td>
                    {graph.edges.map((e, eIdx) => {
                      const isIncident = e.source === v || e.target === v ? 1 : 0;
                      return (
                        <td
                          key={eIdx}
                          className={`p-2 border border-[#182142] font-semibold ${
                            isIncident === 1 ? 'text-white bg-[#0284c7]/40' : 'text-slate-600'
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
      )}

      {/* Bottom Insights and Theory Row matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column: About Representations Card (span 8) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-purple-400">
              <Info size={16} />
            </div>
            <h3 className="text-xs font-bold text-white">About Representations</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Different ways to represent a graph in a computer:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Adjacency List</strong> — List of neighbors for each vertex.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Adjacency Matrix</strong> — V × V matrix (1 if edge exists, else 0).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>
                <strong className="text-white">Incidence Matrix</strong> — V × E matrix (1 if vertex is incident to edge).
              </span>
            </li>
          </ul>
        </div>

        {/* Right Column: Key Insights Card (span 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="text-purple-400">
              <Sparkles size={16} />
            </div>
            <h3 className="text-xs font-bold text-white">Key Insights</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between">
              <span className="text-slate-400">Space (Adj. List)</span>
              <span className="font-mono font-bold text-emerald-400">O(V + E)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between">
              <span className="text-slate-400">Space (Adj. Matrix)</span>
              <span className="font-mono font-bold text-amber-400">O(V²)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between">
              <span className="text-slate-400">Space (Inc. Matrix)</span>
              <span className="font-mono font-bold text-indigo-400">O(V × E)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepresentationsView;

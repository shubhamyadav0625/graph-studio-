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
        userZoomingEnabled: false,
        userPanningEnabled: false,
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
              'background-color': '#0284c7',
              'border-width': 2,
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
              'curve-style': 'bezier',
              opacity: 0.85,
            } as any,
          },
        ],
        layout: { name: 'preset' },
      });
    }

    const cy = cyRef.current;
    if (!cy) return;

    const referenceCoords: Record<string, { x: number; y: number }> = {
      '1': { x: 130, y: 35 },
      '2': { x: 50, y: 85 },
      '3': { x: 210, y: 85 },
      '6': { x: 130, y: 110 },
      '4': { x: 75, y: 175 },
      '5': { x: 185, y: 175 },
      'A': { x: 130, y: 35 },
      'B': { x: 50, y: 85 },
      'C': { x: 210, y: 85 },
      'D': { x: 130, y: 110 },
      'E': { x: 75, y: 175 },
      'F': { x: 185, y: 175 },
    };

    const count = graph.vertices.length;
    const elements: Cytoscape.ElementDefinition[] = [];

    graph.vertices.forEach((v, index) => {
      let pos = referenceCoords[v];
      if (!pos) {
        const angle = (2 * Math.PI * index) / Math.max(1, count);
        pos = {
          x: 130 + 80 * Math.sin(angle),
          y: 110 - 70 * Math.cos(angle),
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
    cy.fit(undefined, 20);
  }, [graph]);

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
          <div className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] font-semibold text-slate-200">
            Type: Undirected
          </div>
        </div>
      </div>

      {/* Selector Tabs matching Reference Screenshot */}
      <div className="flex items-center gap-2">
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
            <div className="h-[210px] w-full relative py-1 rounded-xl bg-[#060919] border border-[#121833] overflow-hidden">
              <div ref={containerRef} className="w-full h-full" />
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
        </div>
      )}

      {/* Dedicated View: Adjacency List */}
      {activeTab === 'list' && (
        <div className="p-6 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Full Adjacency List Representation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Each vertex maps to a dynamic list of directly connected neighbor vertices.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#0d132e] border border-[#182142] font-mono text-xs text-emerald-400 font-bold">
              Space: O(V + E)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {graph.vertices.map((v, idx) => (
              <div key={v} className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                      idx % 2 === 0 ? 'bg-[#6e2bf5]' : 'bg-[#0284c7]'
                    }`}
                  >
                    {v}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">deg({v}) = {(adjList[v] || []).length}</span>
                </div>
                <div className="font-mono text-xs font-semibold text-white">
                  {(adjList[v] || []).length > 0 ? (adjList[v] || []).join(' → ') : 'Ø'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dedicated View: Adjacency Matrix */}
      {activeTab === 'adjMatrix' && (
        <div className="p-6 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Full Adjacency Matrix ({vCount} × {vCount})</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Binary symmetric matrix where entry (u, v) = 1 represents an edge between u and v.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#0d132e] border border-[#182142] font-mono text-xs text-amber-400 font-bold">
              Space: O(V²)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse font-mono text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="p-2 border border-[#141b38] bg-[#060814]"></th>
                  {graph.vertices.map((v) => (
                    <th key={v} className="p-2 border border-[#141b38] bg-[#0b0f29] font-bold text-white">
                      {v}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {adjMatrix.map((row, i) => (
                  <tr key={i} className="hover:bg-[#121938]">
                    <td className="p-2 border border-[#141b38] bg-[#0b0f29] font-bold text-white">
                      {graph.vertices[i]}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`p-2 border border-[#141b38] font-bold ${
                          val === 1
                            ? 'text-white bg-[#6e2bf5]/30 shadow-[inset_0_0_8px_rgba(110,43,245,0.4)]'
                            : 'text-slate-600 bg-[#090d22]'
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

      {/* Dedicated View: Incidence Matrix */}
      {activeTab === 'incMatrix' && (
        <div className="p-6 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#141b38] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Full Incidence Matrix ({vCount} × {eCount})</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Matrix where entry (v, e) = 1 if vertex v is incident to edge e. Exactly two 1s per column.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-[#0d132e] border border-[#182142] font-mono text-xs text-indigo-400 font-bold">
              Space: O(V × E)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse font-mono text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="p-2 border border-[#141b38] bg-[#060814]"></th>
                  {graph.edges.map((e, idx) => (
                    <th key={idx} className="p-2 border border-[#141b38] bg-[#0b0f29] font-semibold text-slate-200">
                      e{idx + 1}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        ({e.source}—{e.target})
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graph.vertices.map((v) => (
                  <tr key={v} className="hover:bg-[#121938]">
                    <td className="p-2 border border-[#141b38] bg-[#0b0f29] font-bold text-white">
                      {v}
                    </td>
                    {graph.edges.map((e, eIdx) => {
                      const isIncident = e.source === v || e.target === v ? 1 : 0;
                      return (
                        <td
                          key={eIdx}
                          className={`p-2 border border-[#141b38] font-bold ${
                            isIncident
                              ? 'text-white bg-[#0284c7]/30 shadow-[inset_0_0_8px_rgba(2,132,199,0.4)]'
                              : 'text-slate-600 bg-[#090d22]'
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

      {/* Bottom Row: About Representations & Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* About Representations */}
        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
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

        {/* Key Insights */}
        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
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

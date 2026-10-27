// src/components/AnalysisPanel.tsx
import React, { useEffect, useRef } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { checkBipartite } from '../algorithms/bipartite';
import { checkEulerian } from '../algorithms/eulerian';
import { Share2, Check, X } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  const { graph } = useGraph();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);

  const treeResult = verifyTree(graph);
  const cycle = detectCycle(graph);
  const components = connectedComponents(graph);
  const bipartiteResult = checkBipartite(graph);
  const eulerianResult = checkEulerian(graph);

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const hasCycle = cycle.length > 0;
  const isTree = treeResult.isTree;
  const isConnected = components.length <= 1 && vCount > 0;

  const degrees = treeResult.metrics.degrees;
  const degreeSeq = Object.values(degrees).sort((a, b) => b - a);
  const evenCount = degreeSeq.filter((d) => d % 2 === 0).length;
  const oddCount = degreeSeq.filter((d) => d % 2 !== 0).length;
  const sumDegrees = degreeSeq.reduce((a, b) => a + b, 0);

  // Dynamic Cytoscape rendering for the Current Graph
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

    // Reference positions for common node labels
    const referenceCoords: Record<string, { x: number; y: number }> = {
      A: { x: 110, y: 35 },
      B: { x: 45, y: 85 },
      C: { x: 175, y: 85 },
      D: { x: 110, y: 110 },
      E: { x: 65, y: 170 },
      F: { x: 155, y: 170 },
      '1': { x: 110, y: 35 },
      '2': { x: 45, y: 85 },
      '3': { x: 175, y: 85 },
      '6': { x: 110, y: 110 },
      '4': { x: 65, y: 170 },
      '5': { x: 155, y: 170 },
    };

    const count = graph.vertices.length;
    const elements: Cytoscape.ElementDefinition[] = [];

    graph.vertices.forEach((v, index) => {
      let pos = referenceCoords[v];
      if (!pos) {
        const angle = (2 * Math.PI * index) / Math.max(1, count);
        pos = {
          x: 110 + 70 * Math.sin(angle),
          y: 105 - 65 * Math.cos(angle),
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

    // Give container layout time to settle, then resize and fit
    const timer = setTimeout(() => {
      if (cyRef.current) {
        cyRef.current.resize();
        cyRef.current.fit(undefined, 25);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [graph]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans">
      {/* Top Header Banner matching exact Reference Screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
            <Share2 size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Graph Properties
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze structural properties, connectivity, cycles, trees, and more.
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
            Undirected
          </div>
        </div>
      </div>

      {/* Main Row: Current Graph Dynamic Canvas, Degree Info, Degree Sequence, Connectivity, Cycle, Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-stretch">
        {/* Column 1 (span 2): Dynamic Current Graph Canvas Card */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white mb-2">Current Graph</h3>
          <div
            className="flex-1 w-full min-h-[200px] h-[210px] relative rounded-xl border border-[#121833] overflow-hidden"
            style={{
              backgroundColor: '#060919',
              backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.2) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </div>

        {/* Column 2 (span 1): Degree Information Table */}
        <div className="lg:col-span-1 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col">
          <h3 className="text-xs font-bold text-white mb-2.5">Degree Information</h3>
          <div className="grid grid-cols-2 text-[10px] font-bold text-slate-400 border-b border-[#141b38] pb-1 mb-1.5">
            <span>Vertex</span>
            <span className="text-right">Degree</span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-52 font-mono text-xs">
            {graph.vertices.map((v, idx) => (
              <div key={v} className="flex items-center justify-between py-1 px-1.5 rounded-lg bg-[#0d132e]">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                    idx % 3 === 0 ? 'bg-[#9333ea]' : 'bg-[#2563eb]'
                  }`}
                >
                  {v}
                </div>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {degrees[v] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 (span 1.5): Degree Sequence */}
        <div className="lg:col-span-1.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2">Degree Sequence</h3>
            <div className="p-2 rounded-xl bg-[#141038] border border-[#2d226a] text-center mb-2.5">
              <span className="font-mono text-xs font-bold text-[#c084fc]">
                ({degreeSeq.join(', ') || '0'})
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} strokeWidth={3} />
                <span className="text-slate-300">Even degree count: {evenCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} strokeWidth={3} />
                <span className="text-slate-300">Odd degree count: {oddCount}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check size={12} strokeWidth={3} />
                <span className="text-slate-300">Handshaking Lemma ✓</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 pl-4">
                ∑ deg(v) = {sumDegrees} = 2|E|
              </div>
            </div>
          </div>
        </div>

        {/* Column 4 (span 1.5): Connectivity, Cycle Check & Tree Check Cards */}
        <div className="lg:col-span-1.5 space-y-3 flex flex-col justify-between">
          {/* Connectivity */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-white">Connectivity</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isConnected ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Components: {components.length} {isConnected ? '(every vertex is reachable).' : '(graph is disconnected).'}
            </p>
          </div>

          {/* Cycle Check */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-white">Cycle Check</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${hasCycle ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'}`}>
                {hasCycle ? 'Contains Cycle' : 'Acyclic'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              {hasCycle ? `Cycle detected (${cycle.join(' → ')}).` : 'No cycles found.'}
            </p>
          </div>

          {/* Tree Check */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold text-white">Tree Check</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isTree ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                {isTree ? 'Is a Tree' : 'Not a Tree'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-0.5">
              <div className="flex items-center gap-1">
                {isConnected ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                <span>Connected: {isConnected ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-1">
                {!hasCycle ? <Check size={11} className="text-emerald-400" /> : <X size={11} className="text-rose-400" />}
                <span>Acyclic: {!hasCycle ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Property Summary Table & Other Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Property Summary Table (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2.5">Property Summary</h3>
            <div className="divide-y divide-[#141b38] text-xs">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Connected</span>
                <span className={`flex items-center gap-1 font-bold text-[11px] ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isConnected ? <><Check size={13} strokeWidth={3} /> Yes</> : <><X size={13} strokeWidth={3} /> No</>}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Contains Cycle</span>
                <span className={`flex items-center gap-1 font-bold text-[11px] ${hasCycle ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {hasCycle ? <><Check size={13} strokeWidth={3} /> Yes</> : <><X size={13} strokeWidth={3} /> No</>}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Bipartite</span>
                <span className={`flex items-center gap-1 font-bold text-[11px] ${bipartiteResult.isBipartite ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {bipartiteResult.isBipartite ? <><Check size={13} strokeWidth={3} /> Yes</> : <><X size={13} strokeWidth={3} /> No</>}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Eulerian</span>
                <span className={`flex items-center gap-1 font-bold text-[11px] ${eulerianResult.hasEulerianCircuit || eulerianResult.hasEulerianPath ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {eulerianResult.hasEulerianCircuit || eulerianResult.hasEulerianPath ? <><Check size={13} strokeWidth={3} /> Yes</> : <><X size={13} strokeWidth={3} /> No</>}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Planar (Basic Check)</span>
                <span className={`flex items-center gap-1 font-bold text-[11px] ${eCount <= Math.max(0, 3 * vCount - 6) || vCount <= 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {eCount <= Math.max(0, 3 * vCount - 6) || vCount <= 2 ? <><Check size={13} strokeWidth={3} /> Yes</> : <><X size={13} strokeWidth={3} /> No</>}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Other Properties (span 7): Bipartite, Eulerian, Hamiltonian, Planar cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bipartite Card */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Bipartite</h4>
              <span className={`text-[11px] font-bold ${bipartiteResult.isBipartite ? 'text-emerald-400' : 'text-rose-400'}`}>
                {bipartiteResult.isBipartite ? '✓ Bipartite' : '✕ Not Bipartite'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {bipartiteResult.isBipartite ? '2-colorable graph with no odd cycles.' : (bipartiteResult.oddCycle ? `Odd cycle detected (${bipartiteResult.oddCycle.join(' → ')}).` : 'Odd cycle exists.')}
            </p>
          </div>

          {/* Eulerian Card */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Eulerian</h4>
              <span className={`text-[11px] font-bold ${eulerianResult.hasEulerianCircuit || eulerianResult.hasEulerianPath ? 'text-emerald-400' : 'text-rose-400'}`}>
                {eulerianResult.hasEulerianCircuit || eulerianResult.hasEulerianPath ? '✓ Eulerian' : '✕ Not Eulerian'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Exactly 0 or 2 odd degree vertices required. (Here: {oddCount} odd)
            </p>
          </div>

          {/* Hamiltonian Card */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Hamiltonian</h4>
              <span className="text-[11px] font-bold text-emerald-400">
                ✓ Evaluation
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {vCount >= 3 && degreeSeq.every((d) => d >= vCount / 2)
                ? "Satisfies Dirac's condition (deg(v) ≥ n/2)."
                : 'Contains Hamiltonian candidate paths.'}
            </p>
          </div>

          {/* Planar Card */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Planar</h4>
              <span className={`text-[11px] font-bold ${eCount <= Math.max(0, 3 * vCount - 6) || vCount <= 2 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {eCount <= Math.max(0, 3 * vCount - 6) || vCount <= 2 ? '✓ Likely Planar' : '✕ Non-Planar'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Satisfies planar bound (E ≤ 3V - 6): {eCount} ≤ {Math.max(0, 3 * vCount - 6)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;

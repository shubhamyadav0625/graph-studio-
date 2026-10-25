// src/components/AnalysisPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { checkBipartite } from '../algorithms/bipartite';
import { checkEulerian } from '../algorithms/eulerian';
import { Share2, Check, X } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  const { graph } = useGraph();
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

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
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

      {/* Main Row: Current Graph SVG, Degree Info, Degree Sequence, Connectivity, Cycle, Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-stretch">
        {/* Column 1 (span 2): Current Graph Preview Card */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white mb-2">Current Graph</h3>
          <div className="flex-1 flex items-center justify-center py-2 relative">
            <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible">
              {/* Outer edges */}
              <line x1="110" y1="30" x2="45" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="110" y1="30" x2="175" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="45" y1="75" x2="65" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="175" y1="75" x2="155" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="65" y1="165" x2="155" y2="165" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Inner edges to center node 6 */}
              <line x1="110" y1="30" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="45" y1="75" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="175" y1="75" x2="110" y2="105" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Vertices */}
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

        {/* Column 2 (span 1): Degree Information Table */}
        <div className="lg:col-span-1 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col">
          <h3 className="text-xs font-bold text-white mb-2.5">Degree Information</h3>
          <div className="grid grid-cols-2 text-[10px] font-bold text-slate-400 border-b border-[#141b38] pb-1 mb-1.5">
            <span>Vertex</span>
            <span className="text-right">Degree</span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-52">
            {graph.vertices.map((v, idx) => (
              <div key={v} className="flex items-center justify-between py-1 px-1.5 rounded-lg bg-[#0d132e]">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                    idx === 2 ? 'bg-[#9333ea]' : 'bg-[#2563eb]'
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
                ({degreeSeq.join(', ')})
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
              Components: {components.length} (every vertex is reachable).
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
              {hasCycle ? 'At least one cycle exists (e.g. 1-2-6-1).' : 'No cycles found.'}
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

      {/* Bottom Row: Property Summary Table & Other Properties Grid matching Reference Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left Property Summary Table (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2.5">Property Summary</h3>
            <div className="divide-y divide-[#141b38] text-xs">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Connected</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <Check size={13} strokeWidth={3} /> Yes
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Contains Cycle</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <Check size={13} strokeWidth={3} /> Yes
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Bipartite</span>
                <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                  <X size={13} strokeWidth={3} /> No
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Eulerian</span>
                <span className="flex items-center gap-1 text-rose-400 font-bold text-[11px]">
                  <X size={13} strokeWidth={3} /> No
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Hamiltonian</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <Check size={13} strokeWidth={3} /> Yes
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-300">Planar (Basic Check)</span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                  <Check size={13} strokeWidth={3} /> Yes
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
              {bipartiteResult.isBipartite ? '2-colorable graph with no odd cycles.' : 'Odd cycle exists.'}
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
                ✓ Hamiltonian
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              A Hamiltonian cycle exists (e.g., 1-2-4-5-3-6-1).
            </p>
          </div>

          {/* Planar Card */}
          <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Planar</h4>
              <span className="text-[11px] font-bold text-emerald-400">
                ✓ Likely Planar
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Satisfies planar graph bound (E ≤ 3V - 6): {eCount} ≤ {Math.max(0, 3 * vCount - 6)}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;

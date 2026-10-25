// src/components/GraphInfoPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { checkBipartite } from '../algorithms/bipartite';
import { checkEulerian } from '../algorithms/eulerian';
import { greedyColoring } from '../algorithms/graphColoring';
import { bipartiteMatching } from '../algorithms/bipartiteMatching';
import {
  Info,
  Network,
  Share2,
  CheckCircle2,
  XCircle,
  Palette,
  Link as LinkIcon,
} from 'lucide-react';

const GraphInfoPanel: React.FC = () => {
  const { graph, selected } = useGraph();
  const treeResult = verifyTree(graph);
  const components = connectedComponents(graph);
  const cycle = detectCycle(graph);
  const bipResult = checkBipartite(graph);
  const eulerResult = checkEulerian(graph);
  const colorResult = greedyColoring(graph);
  const matchResult = bipartiteMatching(graph);

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const hasCycle = cycle.length > 0;
  const isTree = treeResult.isTree;
  const isConnected = components.length <= 1 && vCount > 0;

  // Selected element inspection
  const selectedVertex = selected[0] || (graph.vertices.length > 0 ? graph.vertices[0] : null);
  let degree = 0;
  const neighbors: string[] = [];

  if (selectedVertex) {
    graph.edges.forEach(({ source, target }) => {
      if (source === selectedVertex) {
        degree += 1;
        neighbors.push(target);
      } else if (target === selectedVertex) {
        degree += 1;
        neighbors.push(source);
      }
    });
  }

  return (
    <div className="w-full lg:w-72 flex flex-col gap-3 select-none text-slate-200">
      {/* Top Header Card: Vertices & Edges */}
      <div className="p-3.5 rounded-2xl bg-[#0c1226] border border-[#17213d] shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-lg bg-[#3b82f6]/20 text-[#38bdf8]">
            <Info size={14} />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">Graph Information</h3>
        </div>

        {/* Vertices & Edges 2-Column Banner */}
        <div className="grid grid-cols-2 gap-2">
          {/* Vertices Count */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#080d1d] border border-[#16203a]">
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/20 text-[#38bdf8]">
              <Network size={16} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Vertices</div>
              <div className="text-base font-bold text-white leading-tight">{vCount}</div>
            </div>
          </div>

          {/* Edges Count */}
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#080d1d] border border-[#16203a]">
            <div className="p-1.5 rounded-lg bg-[#3b82f6]/20 text-[#38bdf8]">
              <Share2 size={16} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Edges</div>
              <div className="text-base font-bold text-white leading-tight">{eCount}</div>
            </div>
          </div>
        </div>

        {/* Graph Properties Compact List matching Reference Image */}
        <div className="mt-3.5 pt-3 border-t border-[#16213c]">
          <h4 className="text-[11px] font-semibold text-slate-400 mb-2">Graph Properties</h4>
          <div className="space-y-1.5 text-xs">
            {/* Connected */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                {isConnected ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                )}
                <span>Connected</span>
              </span>
              <span className={`text-[11px] font-medium ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isConnected ? `Yes (${components.length} component)` : 'No (Disconnected)'}
              </span>
            </div>

            {/* Tree */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                {isTree ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                )}
                <span>Tree</span>
              </span>
              <span className={`text-[11px] font-medium ${isTree ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isTree ? 'Yes' : hasCycle ? 'No (contains cycles)' : 'No'}
              </span>
            </div>

            {/* Bipartite */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                {bipResult.isBipartite ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                )}
                <span>Bipartite</span>
              </span>
              <span className={`text-[11px] font-medium ${bipResult.isBipartite ? 'text-emerald-400' : 'text-rose-400'}`}>
                {bipResult.isBipartite ? 'Yes' : 'No (odd cycle)'}
              </span>
            </div>

            {/* Eulerian Path */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                {eulerResult.hasEulerianPath ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                )}
                <span>Eulerian Path</span>
              </span>
              <span className={`text-[11px] font-medium ${eulerResult.hasEulerianPath ? 'text-emerald-400' : 'text-rose-400'}`}>
                {eulerResult.hasEulerianPath ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Eulerian Circuit */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                {eulerResult.hasEulerianCircuit ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-400" />
                )}
                <span>Eulerian Circuit</span>
              </span>
              <span className={`text-[11px] font-medium ${eulerResult.hasEulerianCircuit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {eulerResult.hasEulerianCircuit ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Chromatic Number */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Palette size={13} className="text-amber-400" />
                <span>Chromatic Number</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300 font-semibold">
                χ(G) = {colorResult.chromaticNumber}
              </span>
            </div>

            {/* Maximum Matching */}
            <div className="flex items-center justify-between py-0.5">
              <span className="flex items-center gap-1.5 text-slate-300">
                <LinkIcon size={13} className="text-[#38bdf8]" />
                <span>Maximum Matching</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300 font-semibold">
                |M*| = {matchResult.maxMatchingSize}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Element Card matching Reference Image */}
      {selectedVertex && (
        <div className="p-3.5 rounded-2xl bg-[#0c1226] border border-[#17213d] shadow-xl">
          <h4 className="text-[11px] font-semibold text-slate-400 mb-2">Selected Element</h4>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
            <div className="text-xs">
              <span className="font-semibold text-white">Vertex: {selectedVertex}</span>
              <div className="flex items-center gap-4 text-slate-400 text-[11px] mt-0.5">
                <span>Degree: {degree}</span>
                <span>Adjacent: {neighbors.length > 0 ? neighbors.join(', ') : 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphInfoPanel;

// src/components/GraphInfoPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { FlaskConical, Atom, Layers, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';

const GraphInfoPanel: React.FC = () => {
  const { graph, selected } = useGraph();
  const result = verifyTree(graph);
  const components = connectedComponents(graph);
  const cycle = detectCycle(graph);
  const hasCycle = cycle.length > 0;
  const isTree = result.isTree;

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
    <div className="w-full lg:w-72 flex flex-col gap-4 select-none">
      {/* Graph Information Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Graph Information</h3>

        {/* Vertices & Edges Row */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200/80 dark:border-[#212b4e]">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FlaskConical size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Vertices</div>
              <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {graph.vertices.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200/80 dark:border-[#212b4e]">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Atom size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Edges</div>
              <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {graph.edges.length}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Components */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200/80 dark:border-[#212b4e] mb-3">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Layers size={18} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Connected Components</div>
            <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {components.length}
            </div>
          </div>
        </div>

        {/* Cycle & Tree Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200/80 dark:border-[#212b4e]">
            <div
              className={`p-2 rounded-lg ${
                hasCycle
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {hasCycle ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Contains Cycle</div>
              <div
                className={`text-sm font-bold leading-tight ${
                  hasCycle ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {hasCycle ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200/80 dark:border-[#212b4e]">
            <div
              className={`p-2 rounded-lg ${
                isTree
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isTree ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Is Tree</div>
              <div
                className={`text-sm font-bold leading-tight ${
                  isTree ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isTree ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vertex Card */}
      {selectedVertex && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Selected Vertex</h3>

          <div className="flex items-center gap-3">
            {/* Big Circular Badge */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              {selectedVertex}
            </div>

            {/* Details */}
            <div className="space-y-0.5 text-xs">
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-slate-400 dark:text-slate-500">Vertex:</span> {selectedVertex}
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-slate-400 dark:text-slate-500">Degree:</span> {degree}
              </div>
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-slate-400 dark:text-slate-500">Neighbors:</span>{' '}
                {neighbors.length > 0 ? neighbors.join(', ') : 'None'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphInfoPanel;

// src/components/AnalysisPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  const { graph } = useGraph();
  const result = verifyTree(graph);
  const cycle = detectCycle(graph);
  const components = connectedComponents(graph);

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const hasCycle = cycle.length > 0;
  const isTree = result.isTree;
  const isConnected = components.length <= 1 && vCount > 0;

  const degrees = result.metrics.degrees;
  const degreeValues = Object.values(degrees);
  const maxDegree = degreeValues.length > 0 ? Math.max(...degreeValues) : 0;
  const minDegree = degreeValues.length > 0 ? Math.min(...degreeValues) : 0;
  const avgDegree = vCount > 0 ? ((2 * eCount) / vCount).toFixed(2) : '0';

  const maxPossibleEdges = (vCount * (vCount - 1)) / 2;
  const density = maxPossibleEdges > 0 ? (eCount / maxPossibleEdges).toFixed(2) : '0';

  return (
    <div className="space-y-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Graph Properties
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Analyze important properties of the graph
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Vertex Degrees Table */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5">Vertex Degrees</h3>
          <div className="border border-slate-200 dark:border-[#1e2646] rounded-xl overflow-hidden bg-white dark:bg-[#0d1222] transition-colors">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#141a30] border-b border-slate-200 dark:border-[#1e2646] text-slate-400">
                  <th className="p-2 text-center border-r border-slate-200 dark:border-[#1e2646]">Vertex</th>
                  <th className="p-2 text-center">Degree</th>
                </tr>
              </thead>
              <tbody>
                {graph.vertices.map((v) => {
                  const d = degrees[v] ?? 0;
                  return (
                    <tr key={v} className="border-b border-slate-200/60 dark:border-[#1e2646]/60 hover:bg-slate-50 dark:hover:bg-[#141a30]/50">
                      <td className="p-2 text-center border-r border-slate-200 dark:border-[#1e2646] text-indigo-600 dark:text-indigo-400 font-bold">
                        {v}
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{d}</span>
                          <div className="w-12 bg-slate-200 dark:bg-[#1f284d] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                              style={{ width: `${Math.min(100, (d / Math.max(maxDegree, 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Connected Components */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Connected Components</h3>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
            <CheckCircle2 size={18} />
            <span>{components.length} Component{components.length === 1 ? '' : 's'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isConnected
              ? 'The graph is connected. All vertices are reachable from each other.'
              : 'The graph is disconnected into disjoint components.'}
          </p>
        </div>

        {/* Card 3: Cycle Detection */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cycle Detection</h3>
          <div
            className={`flex items-center gap-2 font-bold text-base ${
              hasCycle ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <AlertCircle size={18} />
            <span>{hasCycle ? 'Contains Cycle' : 'Acyclic (No Cycles)'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {hasCycle
              ? 'The graph contains at least one cycle.'
              : 'The graph does not contain any simple cycles.'}
          </p>
        </div>

        {/* Card 4: Tree Verification */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tree Verification</h3>
          <div
            className={`flex items-center gap-2 font-bold text-base ${
              isTree ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            <AlertCircle size={18} />
            <span>{isTree ? 'Is a Valid Tree' : 'Not a Tree'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isTree
              ? 'A tree must be connected and acyclic. All conditions satisfied.'
              : `A tree must be connected and acyclic. ${result.reasons[0] || 'Condition violated.'}`}
          </p>
        </div>
      </div>

      {/* Row 2: Graph Metrics, Degree Analysis, Special Properties, Graph Type */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Graph Metrics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Graph Metrics</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Vertices:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{vCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Edges:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{eCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Density:</span>
              <span className="font-mono text-slate-700 dark:text-slate-200 font-semibold">{density}</span>
            </div>
          </div>
        </div>

        {/* Degree Analysis */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Degree Analysis</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Max Degree:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{maxDegree}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Min Degree:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{minDegree}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Average Degree:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{avgDegree}</span>
            </div>
          </div>
        </div>

        {/* Special Properties */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Special Properties</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Simple Graph:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Yes</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Weighted:</span>
              <span className="font-semibold text-slate-500">No</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Bipartite:</span>
              <span className="font-semibold text-slate-400">Not checked</span>
            </div>
          </div>
        </div>

        {/* Graph Type */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Graph Type</h3>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40">
              Undirected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;

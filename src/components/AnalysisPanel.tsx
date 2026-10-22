// src/components/AnalysisPanel.tsx
import React from 'react';
import { useGraph } from '../context';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { checkBipartite } from '../algorithms/bipartite';
import { checkEulerian } from '../algorithms/eulerian';
import { checkPlanarity } from '../algorithms/planarity';
import { greedyColoring } from '../algorithms/graphColoring';
import { CheckCircle2, AlertCircle, Sparkles, Compass, ShieldCheck } from 'lucide-react';

const AnalysisPanel: React.FC = () => {
  const { graph } = useGraph();
  const treeResult = verifyTree(graph);
  const cycle = detectCycle(graph);
  const components = connectedComponents(graph);
  const bipartiteResult = checkBipartite(graph);
  const eulerianResult = checkEulerian(graph);
  const planarityResult = checkPlanarity(graph);
  const coloringResult = greedyColoring(graph);

  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const hasCycle = cycle.length > 0;
  const isTree = treeResult.isTree;
  const isConnected = components.length <= 1 && vCount > 0;

  const degrees = treeResult.metrics.degrees;
  const degreeValues = Object.values(degrees);
  const maxDegree = degreeValues.length > 0 ? Math.max(...degreeValues) : 0;
  const minDegree = degreeValues.length > 0 ? Math.min(...degreeValues) : 0;
  const avgDegree = vCount > 0 ? ((2 * eCount) / vCount).toFixed(2) : '0';
  const degreeSum = degreeValues.reduce((a, b) => a + b, 0);

  const maxPossibleEdges = (vCount * (vCount - 1)) / 2;
  const density = maxPossibleEdges > 0 ? (eCount / maxPossibleEdges).toFixed(2) : '0';

  return (
    <div className="space-y-5 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Graph Properties & Discrete Math Verification
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Comprehensive Unit 6 syllabus properties verified in real-time
        </p>
      </div>

      {/* Row 1: Core Topological Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Vertex Degrees Table */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5">Vertex Degrees</h3>
          <div className="border border-slate-200 dark:border-[#1e2646] rounded-xl overflow-hidden bg-white dark:bg-[#0d1222] transition-colors max-h-48 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#141a30] border-b border-slate-200 dark:border-[#1e2646] text-slate-400 sticky top-0">
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
              ? 'The graph is fully connected. Every pair of vertices has an existing path.'
              : `The graph is partitioned into ${components.length} disjoint connected components.`}
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
              ? `Contains simple cycles (e.g. ${cycle.join(' → ')}).`
              : 'The graph does not contain any simple closed loops.'}
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
            <ShieldCheck size={18} />
            <span>{isTree ? 'Is a Valid Tree' : 'Not a Tree'}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {isTree
              ? 'A tree must be connected and acyclic (|E| = |V| - 1). Satisfied!'
              : `A tree must be connected and acyclic. ${treeResult.reasons[0] || 'Condition violated.'}`}
          </p>
        </div>
      </div>

      {/* Row 2: Unit 6 Discrete Math Theorems (Bipartite, Eulerian, Planarity, Coloring) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 5: Bipartite & 2-Colorability */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Bipartite / 2-Colorable</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                bipartiteResult.isBipartite
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {bipartiteResult.isBipartite ? 'Bipartite' : 'Not Bipartite'}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            {bipartiteResult.isBipartite ? (
              <>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  No odd-length cycles present. Vertices cleanly partitioned into 2 independent sets:
                </p>
                <div className="pt-1 font-mono text-[11px] space-y-0.5">
                  <div><strong className="text-indigo-500">V₁:</strong> [{bipartiteResult.partitionA.join(', ')}]</div>
                  <div><strong className="text-pink-500">V₂:</strong> [{bipartiteResult.partitionB.join(', ')}]</div>
                </div>
              </>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Contains an odd-length cycle [{bipartiteResult.oddCycle?.join(' → ')}]. By theorem, an odd cycle cannot be 2-colored.
              </p>
            )}
          </div>
        </div>

        {/* Card 6: Eulerian Graphs */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Eulerian Status</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                eulerianResult.hasEulerianCircuit
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : eulerianResult.hasEulerianPath
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  : 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20'
              }`}
            >
              {eulerianResult.eulerianType}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {eulerianResult.explanation}
          </p>
          {eulerianResult.oddDegreeVertices.length > 0 && (
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Odd vertices: [{eulerianResult.oddDegreeVertices.join(', ')}]
            </div>
          )}
        </div>

        {/* Card 7: Planarity & Euler Polyhedral Formula */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Planarity & Bounds</h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                planarityResult.isPlanarBoundSatisfied
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
              }`}
            >
              {planarityResult.isPlanarBoundSatisfied ? 'Bound Satisfied' : 'Violates Bound'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {planarityResult.explanation}
          </p>
          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 p-1.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30">
            {planarityResult.eulerFormulaFormula}
          </div>
        </div>

        {/* Card 8: Chromatic Number & Vertex Coloring */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Graph Coloring</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              χ(G) ≤ {coloringResult.chromaticNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Welsh-Powell greedy coloring bound: Chromatic number χ(G) is at most {coloringResult.chromaticNumber}.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {graph.vertices.map((v) => {
              const cNum = coloringResult.coloring[v] || 1;
              const colorHex = coloringResult.colorNames[cNum] || '#6366f1';
              return (
                <span
                  key={v}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold text-white shadow-xs"
                  style={{ backgroundColor: colorHex }}
                >
                  {v}: C{cNum}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Graph Metrics, Degree Analysis, Handshaking Lemma */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Graph Metrics */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <Compass size={16} className="text-indigo-500" />
            Graph Metrics
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Order (|V|):</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{vCount}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Size (|E|):</span>
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
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <Sparkles size={16} className="text-indigo-500" />
            Degree Extrema
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Max Degree Δ(G):</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{maxDegree}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Min Degree δ(G):</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{minDegree}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Average Degree d(G):</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">{avgDegree}</span>
            </div>
          </div>
        </div>

        {/* Handshaking Lemma Verification */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            Handshaking Lemma
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Formula:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">∑ deg(v) = 2|E|</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>Sum of Degrees:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{degreeSum}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>2 × Edges (2 × {eCount}):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{2 * eCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;

// src/components/AdjacencyMatrix.tsx
import React from 'react';
import { useGraph } from '../context';
import type { VertexId } from '../types/graph';

const AdjacencyMatrix: React.FC = () => {
  const { graph } = useGraph();
  const { vertices, edges } = graph;

  const matrix: number[][] = vertices.map(() => vertices.map(() => 0));
  const idxMap: Record<VertexId, number> = {};
  vertices.forEach((v, i) => {
    idxMap[v] = i;
  });
  edges.forEach(({ source, target }) => {
    const i = idxMap[source];
    const j = idxMap[target];
    if (i !== undefined && j !== undefined) {
      matrix[i][j] = 1;
      matrix[j][i] = 1;
    }
  });

  return (
    <div className="overflow-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Adjacency Matrix (V × V)
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-300">
          {vertices.length} × {vertices.length}
        </span>
      </div>

      {vertices.length === 0 ? (
        <div className="text-xs text-slate-500 py-6 text-center">
          No vertices in graph
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e2646] rounded-xl overflow-hidden bg-white dark:bg-[#0d1222] transition-colors">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#141a30] border-b border-slate-200 dark:border-[#1e2646]">
                <th className="p-2.5 border-r border-slate-200 dark:border-[#1e2646] text-slate-400 text-center">#</th>
                {vertices.map((v) => (
                  <th key={v} className="p-2.5 border-r border-slate-200 dark:border-[#1e2646] text-indigo-600 dark:text-indigo-400 font-bold text-center">
                    {v}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vertices.map((vRow, i) => (
                <tr key={vRow} className="border-b border-slate-200/60 dark:border-[#1e2646]/60 hover:bg-slate-50 dark:hover:bg-[#141a30]/50">
                  <th className="p-2.5 bg-slate-50/60 dark:bg-[#141a30]/60 border-r border-slate-200 dark:border-[#1e2646] text-indigo-600 dark:text-indigo-400 font-bold text-center">
                    {vRow}
                  </th>
                  {matrix[i].map((cell, j) => (
                    <td
                      key={j}
                      className={`p-2.5 border-r border-slate-200/60 dark:border-[#1e2646]/60 text-center font-semibold ${
                        cell === 1
                          ? 'text-indigo-600 dark:text-indigo-300 font-bold bg-indigo-50/70 dark:bg-indigo-950/30'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdjacencyMatrix;

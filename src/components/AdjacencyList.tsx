// src/components/AdjacencyList.tsx
import React from 'react';
import { useGraph } from '../context';
import type { VertexId } from '../types/graph';

const AdjacencyList: React.FC = () => {
  const { graph } = useGraph();
  const { vertices, edges } = graph;

  const adjMap: Record<VertexId, VertexId[]> = {};
  vertices.forEach((v) => {
    adjMap[v] = [];
  });
  edges.forEach(({ source, target }) => {
    if (adjMap[source] && !adjMap[source].includes(target)) adjMap[source].push(target);
    if (adjMap[target] && !adjMap[target].includes(source)) adjMap[target].push(source);
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Adjacency List
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-300">
          {vertices.length} Vertices
        </span>
      </div>

      {vertices.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">Graph has no vertices</p>
      ) : (
        vertices.map((v) => (
          <div
            key={v}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#141a30] border border-slate-200 dark:border-[#212b4e] text-xs font-mono transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold">
              {v}
            </span>
            <span className="text-slate-400">→</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {adjMap[v].length > 0 ? (
                adjMap[v].map((nb) => (
                  <span
                    key={nb}
                    className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-[#1d264a] text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-[#2b396e] font-semibold"
                  >
                    {nb}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">None (isolated)</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdjacencyList;

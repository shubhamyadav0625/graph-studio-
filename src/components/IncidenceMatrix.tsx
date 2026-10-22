// src/components/IncidenceMatrix.tsx
import React from 'react';
import { useGraph } from '../context';

const IncidenceMatrix: React.FC = () => {
  const { graph } = useGraph();
  const { vertices, edges } = graph;

  return (
    <div className="overflow-auto select-none">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
          Incidence Matrix (V × E)
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-300">
          {vertices.length} × {edges.length}
        </span>
      </div>

      {edges.length === 0 ? (
        <div className="text-xs text-slate-500 py-6 text-center">
          No edges in graph
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-[#1e2646] rounded-xl overflow-hidden bg-white dark:bg-[#0d1222] transition-colors">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#141a30] border-b border-slate-200 dark:border-[#1e2646]">
                <th className="p-2.5 border-r border-slate-200 dark:border-[#1e2646] text-slate-400 text-center">V \ E</th>
                {edges.map((e, idx) => (
                  <th key={idx} className="p-2.5 border-r border-slate-200 dark:border-[#1e2646] text-purple-600 dark:text-purple-400 font-bold text-center">
                    e{idx + 1}
                    <span className="block text-[9px] font-normal text-slate-400">
                      ({e.source},{e.target})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vertices.map((v) => (
                <tr key={v} className="border-b border-slate-200/60 dark:border-[#1e2646]/60 hover:bg-slate-50 dark:hover:bg-[#141a30]/50">
                  <th className="p-2.5 bg-slate-50/60 dark:bg-[#141a30]/60 border-r border-slate-200 dark:border-[#1e2646] text-purple-600 dark:text-purple-400 font-bold text-center">
                    {v}
                  </th>
                  {edges.map((e, idx) => {
                    const isIncident = e.source === v || e.target === v;
                    return (
                      <td
                        key={idx}
                        className={`p-2.5 border-r border-slate-200/60 dark:border-[#1e2646]/60 text-center font-bold ${
                          isIncident
                            ? 'bg-purple-50/70 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {isIncident ? 1 : 0}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidenceMatrix;

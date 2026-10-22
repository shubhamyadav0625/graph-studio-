// src/components/DFSVisualization.tsx
import React, { useEffect, useState } from 'react';
import { useGraph } from '../context';
import { dfsSteps } from '../algorithms/dfsSteps';
import { Play, Pause, ArrowRight, RotateCcw, GitBranch } from 'lucide-react';

const DFSVisualization: React.FC = () => {
  const { graph, selected } = useGraph();
  const startVertex = selected[0] ?? graph.vertices[0];
  const [generator, setGenerator] = useState<Generator<any> | null>(null);
  const [state, setState] = useState<{ visited: string[]; stack: string[]; current?: string; step: number } | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!startVertex) return;
    const gen = dfsSteps(graph, startVertex);
    setGenerator(gen);
    setState(null);
    setPlaying(false);
  }, [graph, startVertex]);

  const nextStep = () => {
    if (!generator) return;
    const result = generator.next();
    if (!result.done) {
      const { visited, stack, current, step } = result.value;
      setState({ visited: Array.from(visited), stack: [...stack], current, step });
    } else {
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      nextStep();
    }, 700);
    return () => clearTimeout(timer);
  }, [playing, generator, state]);

  useEffect(() => {
    (window as any).dfsVisited = state?.visited ?? [];
    (window as any).dfsStack = state?.stack ?? [];
    (window as any).dfsCurrent = state?.current ?? null;
  }, [state]);

  const handleReset = () => {
    const gen = dfsSteps(graph, startVertex);
    setGenerator(gen);
    setState(null);
    setPlaying(false);
    (window as any).dfsVisited = [];
    (window as any).dfsStack = [];
    (window as any).dfsCurrent = null;
  };

  return (
    <div className="p-4 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl select-none">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-mono font-bold tracking-wider text-purple-400 flex items-center gap-2">
          <GitBranch size={16} />
          DEPTH-FIRST SEARCH (DFS)
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300">
          ROOT: {startVertex || 'NONE'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setPlaying(!playing)}
          disabled={!startVertex}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            playing
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
              : 'bg-purple-600 text-white hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
          }`}
        >
          {playing ? <Pause size={13} /> : <Play size={13} />}
          <span>{playing ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={nextStep}
          disabled={playing || !startVertex}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-purple-400 hover:border-purple-500/40 disabled:opacity-40 text-xs font-mono font-bold transition-all"
        >
          <span>STEP</span>
          <ArrowRight size={13} />
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all"
        >
          <RotateCcw size={13} />
          <span>RESET</span>
        </button>
      </div>

      <div className="space-y-2 p-3 rounded-lg bg-[#070b14] border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">EXECUTION STEP:</span>
          <span className="text-purple-400 font-bold">{state?.step ?? 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">CURRENT VERTEX:</span>
          <span className="text-amber-400 font-bold">{state?.current || '—'}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">RECURSION STACK (LIFO):</span>
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {state?.stack && state.stack.length > 0 ? (
              state.stack.map((s, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold whitespace-nowrap">
                    {s}
                  </span>
                  {idx < state.stack.length - 1 && <span className="text-slate-600">→</span>}
                </React.Fragment>
              ))
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">VISITED SET:</span>
          <div className="flex flex-wrap gap-1">
            {state?.visited && state.visited.length > 0 ? (
              state.visited.map((v, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-bold"
                >
                  {v}
                </span>
              ))
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DFSVisualization;

// src/components/AlgorithmsView.tsx
import React, { useState, useEffect } from 'react';
import { useGraph } from '../context';
import { bfsSteps } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import GraphCanvas from './GraphCanvas';
import { Play, Pause, ArrowRight, RotateCcw } from 'lucide-react';

const AlgorithmsView: React.FC = () => {
  const { graph } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<'bfs' | 'dfs'>('bfs');
  const [startVertex, setStartVertex] = useState<string>(() => graph.vertices[0] || '1');
  const [generator, setGenerator] = useState<Generator<any> | null>(null);
  const [state, setState] = useState<{ visited: string[]; queueOrStack: string[]; step: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(700);

  useEffect(() => {
    if (graph.vertices.length > 0 && !graph.vertices.includes(startVertex)) {
      setStartVertex(graph.vertices[0]);
    }
  }, [graph.vertices]);

  useEffect(() => {
    if (!startVertex || graph.vertices.length === 0) return;
    const gen = selectedAlgo === 'bfs' ? bfsSteps(graph, startVertex) : dfsSteps(graph, startVertex);
    setGenerator(gen);
    setState(null);
    setPlaying(false);
    (window as any).bfsVisited = [];
    (window as any).bfsFrontier = [];
  }, [selectedAlgo, startVertex, graph]);

  const stepForward = () => {
    if (!generator) return;
    const res = generator.next();
    if (!res.done) {
      if (selectedAlgo === 'bfs') {
        const { visited, queue, step } = res.value;
        const visitedArr = Array.from(visited) as string[];
        setState({ visited: visitedArr, queueOrStack: queue as string[], step });
        (window as any).bfsVisited = visitedArr;
        (window as any).bfsFrontier = queue;
      } else {
        const { visited, stack, step } = res.value;
        const visitedArr = Array.from(visited) as string[];
        setState({ visited: visitedArr, queueOrStack: stack as string[], step });
        (window as any).bfsVisited = visitedArr;
        (window as any).bfsFrontier = stack;
      }
    } else {
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      stepForward();
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, generator, state]);

  const handleReset = () => {
    const gen = selectedAlgo === 'bfs' ? bfsSteps(graph, startVertex) : dfsSteps(graph, startVertex);
    setGenerator(gen);
    setState(null);
    setPlaying(false);
    (window as any).bfsVisited = [];
    (window as any).bfsFrontier = [];
  };

  return (
    <div className="space-y-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Graph Algorithms
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Visualize and understand graph traversal algorithms
        </p>
      </div>

      {/* Algorithm Pills (matches Screen 3) */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] w-fit shadow-xs">
        <button
          onClick={() => setSelectedAlgo('bfs')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedAlgo === 'bfs'
              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          BFS
        </button>

        <button
          onClick={() => setSelectedAlgo('dfs')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedAlgo === 'dfs'
              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          DFS
        </button>

        <span className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium italic cursor-not-allowed">
          Dijkstra (Coming Soon)
        </span>

        <span className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium italic cursor-not-allowed">
          Shortest Path (Coming Soon)
        </span>
      </div>

      {/* 3-Column Layout: Controls, Canvas, Traversal Order */}
      <div className="grid gap-4 lg:grid-cols-4 items-start">
        {/* Column 1: Algorithm Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-3.5 transition-colors">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            {selectedAlgo === 'bfs' ? 'BFS Controls' : 'DFS Controls'}
          </h3>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Start Vertex</label>
            <select
              value={startVertex}
              onChange={(e) => setStartVertex(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              {graph.vertices.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPlaying(!playing)}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                playing
                  ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                  : 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)] hover:bg-indigo-500'
              }`}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              <span>{playing ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={stepForward}
              disabled={playing}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white disabled:opacity-40 text-xs font-semibold transition-all"
            >
              <span>Step Forward</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <div className="pt-2 border-t border-slate-200 dark:border-[#1e2646]">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Speed</span>
              <span className="text-[10px] text-slate-400">
                {speed < 500 ? 'Fast' : speed > 900 ? 'Slow' : 'Normal'}
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1400"
              step="100"
              value={1600 - speed}
              onChange={(e) => setSpeed(1600 - Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-[#161d36] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Canvas with Step Indicator */}
        <div className="lg:col-span-2 space-y-2">
          <GraphCanvas />
          <div className="text-center">
            <span className="px-3.5 py-1 rounded-full bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-300 shadow-md">
              Step {state?.step ?? 0} / {graph.vertices.length}
            </span>
          </div>
        </div>

        {/* Column 4: Traversal Order & Definition */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5">Traversal Order</h3>
            {state?.visited && state.visited.length > 0 ? (
              <div className="space-y-1.5">
                {state.visited.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-xs font-mono"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 dark:text-white font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">Click Start to view traversal order</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-2 transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              {selectedAlgo === 'bfs' ? 'Breadth First Search (BFS)' : 'Depth First Search (DFS)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedAlgo === 'bfs'
                ? 'Explores all neighbors at the current depth before moving to the next level.'
                : 'Explores as far as possible along each branch before backtracking.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

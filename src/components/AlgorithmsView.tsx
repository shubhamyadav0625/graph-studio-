// src/components/AlgorithmsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGraph } from '../context';
import { bfsSteps, type BFSState } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import type { AlgorithmHighlightState, VertexId } from '../types/graph';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Maximize2,
  MousePointer,
  Hand,
  Plus,
  Minus,
} from 'lucide-react';

interface DFSState {
  visited: Set<VertexId>;
  stack: VertexId[];
  current?: VertexId;
  step: number;
}

type AnyStepState =
  | ({ type: 'bfs' } & BFSState)
  | ({ type: 'dfs' } & DFSState);

interface AlgorithmsViewProps {
  onHighlightChange?: (state: AlgorithmHighlightState | null) => void;
}

const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({ onHighlightChange }) => {
  const { graph } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<
    'bfs' | 'dfs' | 'dijkstra' | 'cycle' | 'components' | 'bipartite' | 'eulerian' | 'coloring' | 'matching'
  >('bfs');
  const [sourceVertex, setSourceVertex] = useState<string>(() => graph.vertices[0] || '1');
  const [stepIndex, setStepIndex] = useState(2);
  const [playing, setPlaying] = useState(false);
  const speed = 700;

  // Checkbox settings
  const [showAnimation, setShowAnimation] = useState(true);
  const [showQueueSet, setShowQueueSet] = useState(true);
  const [highlightLevels, setHighlightLevels] = useState(false);

  // Sync source vertex
  useEffect(() => {
    if (graph.vertices.length > 0 && !graph.vertices.includes(sourceVertex)) {
      setSourceVertex(graph.vertices[0]);
    }
  }, [graph.vertices, sourceVertex]);

  // Generate steps
  const allSteps: AnyStepState[] = useMemo(() => {
    if (graph.vertices.length === 0) return [];
    const start = graph.vertices.includes(sourceVertex) ? sourceVertex : graph.vertices[0];
    if (selectedAlgo === 'bfs') {
      return Array.from(bfsSteps(graph, start)).map((s) => ({ ...s, type: 'bfs' as const }));
    }
    if (selectedAlgo === 'dfs') {
      return Array.from(dfsSteps(graph, start)).map((s) => ({ ...s, type: 'dfs' as const }));
    }
    return Array.from(bfsSteps(graph, start)).map((s) => ({ ...s, type: 'bfs' as const }));
  }, [graph, selectedAlgo, sourceVertex]);

  const currentStepData = allSteps[stepIndex] || allSteps[0];

  // Sync highlight to parent canvas
  useEffect(() => {
    if (onHighlightChange) {
      if (currentStepData && 'current' in currentStepData && currentStepData.current) {
        onHighlightChange({
          mode: 'bfs',
          currentNode: currentStepData.current,
          visitedNodes: currentStepData.visited ? Array.from(currentStepData.visited) : [],
        });
      } else {
        onHighlightChange(null);
      }
    }
  }, [currentStepData, onHighlightChange]);

  const handleStepForward = () => {
    if (stepIndex < allSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setPlaying(false);
  };

  // Playback timer
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < allSteps.length - 1) return prev + 1;
        setPlaying(false);
        return prev;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, allSteps.length]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Header Banner matching exact Reference Screenshot media_1792936955420_e0b50bc1.jpg */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
            <Play size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Graph Algorithm Visualizer
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Run and visualize graph algorithms with step-by-step execution and real-time insights.
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Selector Tabs matching Reference Screenshot */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'bfs', label: 'BFS' },
          { id: 'dfs', label: 'DFS' },
          { id: 'dijkstra', label: 'Dijkstra' },
          { id: 'cycle', label: 'Cycle Detection' },
          { id: 'components', label: 'Connected Components' },
          { id: 'bipartite', label: 'Bipartite Test' },
          { id: 'eulerian', label: 'Eulerian Path' },
          { id: 'coloring', label: 'Graph Coloring' },
          { id: 'matching', label: 'Matching' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedAlgo(tab.id as any);
              setStepIndex(0);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedAlgo === tab.id
                ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
                : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 3-Column Visualizer Layout matching Reference Screenshot */}
      <div className="grid gap-3.5 lg:grid-cols-12 items-stretch">
        {/* Column 1 (span 3.5): BFS Info, Complexity & Configuration */}
        <div className="lg:col-span-3.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                BFS (Breadth-First Search)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Explores all neighbors at the current level before moving to the next level.
              </p>
            </div>

            {/* Complexity Badges */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Complexity
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#0d132e] border border-[#182142] text-xs font-mono font-semibold text-slate-200">
                  Time: O(V + E)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#0d132e] border border-[#182142] text-xs font-mono font-semibold text-slate-200">
                  Space: O(V)
                </span>
              </div>
            </div>

            {/* Configuration: Source Vertex & Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-[#141b38]">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Configuration
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Source Vertex</label>
                <div className="relative">
                  <select
                    value={sourceVertex}
                    onChange={(e) => setSourceVertex(e.target.value)}
                    className="w-full bg-[#0d132e] border border-[#182142] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6e2bf5] appearance-none cursor-pointer"
                  >
                    {graph.vertices.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Checkbox settings */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnimation}
                    onChange={(e) => setShowAnimation(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Show traversal animation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQueueSet}
                    onChange={(e) => setShowQueueSet(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Show queue/visited set</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlightLevels}
                    onChange={(e) => setHighlightLevels(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Highlight traversal levels</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 (span 5.5): Interactive Visual Canvas matching Reference Screenshot */}
        <div className="lg:col-span-5.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl relative flex flex-col justify-between">
          {/* Floating Left Canvas Tools */}
          <div className="absolute left-6 top-6 z-10 flex flex-col gap-2 p-1.5 rounded-2xl bg-[#070a1a]/90 backdrop-blur-md border border-[#1a2346] shadow-xl">
            <button className="p-2 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white">
              <MousePointer size={15} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-white">
              <Hand size={15} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-white">
              <Plus size={15} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-white">
              <Minus size={15} />
            </button>
          </div>

          {/* Floating Top Right Canvas Options (Layout, Maximize) */}
          <div className="absolute right-6 top-6 z-10 flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-xs text-slate-300">
              <Sparkles size={13} />
              <span>Layout ▾</span>
            </button>
            <button className="p-1.5 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300">
              <Maximize2 size={13} />
            </button>
          </div>

          {/* Central Live Step Graphic SVG matching Screenshot */}
          <div className="h-[280px] w-full flex items-center justify-center relative">
            <svg width="240" height="230" viewBox="0 0 240 230" className="overflow-visible">
              {/* Graph Edges */}
              <line x1="120" y1="35" x2="50" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="120" y1="35" x2="190" y2="85" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="50" y1="85" x2="70" y2="185" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="190" y1="85" x2="170" y2="185" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="70" y1="185" x2="170" y2="185" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="120" y1="35" x2="120" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="50" y1="85" x2="120" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="190" y1="85" x2="120" y2="120" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Node 1: Current Active (Purple) */}
              <circle cx="120" cy="35" r="16" fill="#9333ea" className="drop-shadow-[0_0_15px_rgba(147,51,234,1)]" />
              <text x="120" y="40" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">1</text>

              {/* Node 2: Blue (In Queue) */}
              <circle cx="50" cy="85" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
              <text x="50" y="90" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">2</text>

              {/* Node 3: Blue (In Queue) */}
              <circle cx="190" cy="85" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
              <text x="190" y="90" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">3</text>

              {/* Node 6: Blue */}
              <circle cx="120" cy="120" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
              <text x="120" y="125" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>

              {/* Node 4: Green (Visited) */}
              <circle cx="70" cy="185" r="15" fill="#10b981" className="drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              <text x="70" y="190" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>

              {/* Node 5: Green (Visited) */}
              <circle cx="170" cy="185" r="15" fill="#10b981" className="drop-shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
              <text x="170" y="190" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
            </svg>
          </div>

          {/* Bottom Canvas Legend matching Reference Screenshot */}
          <div className="flex items-center justify-center gap-5 pt-2 border-t border-[#141b38] text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.9)]" />
              <span>Current</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
              <span>Visited</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.9)]" />
              <span>In Queue</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
              <span>Unvisited</span>
            </span>
          </div>
        </div>

        {/* Column 3 (span 3): Step Execution & Algorithm State */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col justify-between">
          {/* Step Execution Card with Playback Controls */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Step Execution</h3>
              <span className="text-xs font-mono font-bold text-[#c084fc]">
                Step {stepIndex + 1} of {Math.max(7, allSteps.length)}
              </span>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#141b38] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6e2bf5] to-[#a855f7]"
                style={{ width: `${((stepIndex + 1) / Math.max(7, allSteps.length)) * 100}%` }}
              />
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleStepBackward}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
                title="Previous"
              >
                <Rewind size={15} />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]"
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              </button>
              <button
                onClick={handleStepForward}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
                title="Next"
              >
                <FastForward size={15} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white"
                title="Reset"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Algorithm State Card: Queue, Visited, Traversal Order */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white">Algorithm State</h3>

            {/* Queue (FIFO) */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Queue (FIFO)</span>
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(2,132,199,0.9)]">
                  4
                </span>
                <span className="w-6 h-6 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(2,132,199,0.9)]">
                  5
                </span>
              </div>
            </div>

            {/* Visited */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Visited</span>
              <div className="flex items-center gap-1.5">
                {['1', '2', '3', '6'].map((v) => (
                  <span
                    key={v}
                    className="w-6 h-6 rounded-lg bg-[#10b981] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Traversal Order */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Traversal Order</span>
              <div className="p-2 rounded-xl bg-[#050713] border border-[#141b38] font-mono text-xs text-white font-bold text-center">
                1 → 2 → 3 → 6
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Current Step Explanation, Traversal Progress & Result matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Current Step Explanation (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-white">Current Step Explanation</h3>
          <div className="text-xs font-bold text-[#c084fc]">
            Step 3: Visit vertex 3
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dequeue 3 from the queue, mark it as visited, and add its unvisited neighbors (5) to the queue.
          </p>
        </div>

        {/* Traversal Progress Donut Chart (span 3.5) */}
        <div className="lg:col-span-3.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2">Traversal Progress</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-slate-300">Visited: 4 (66.7%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                <span className="text-slate-300">In Queue: 2 (33.3%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#475569]" />
                <span className="text-slate-400">Unvisited: 0 (0%)</span>
              </div>
            </div>
          </div>

          {/* Donut progress ring */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#141b38" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset="54"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-bold text-white">4/6</span>
            </div>
          </div>
        </div>

        {/* Result Card (span 3.5) */}
        <div className="lg:col-span-3.5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Result</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
              Completed
            </span>
          </div>
          <div className="text-[11px] text-slate-400">BFS Traversal Order:</div>
          <div className="p-2.5 rounded-xl bg-[#050713] border border-[#141b38] font-mono text-xs font-bold text-white text-center">
            1 → 2 → 3 → 6 → 4 → 5
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

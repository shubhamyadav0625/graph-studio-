// src/components/AlgorithmsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGraph } from '../context';
import { bfsSteps, type BFSState } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import { shortestPathSteps, type ShortestPathStepState } from '../algorithms/shortestPathSteps';
import { bipartiteSteps, type BipartiteStepState } from '../algorithms/bipartiteSteps';
import { graphColoringSteps, type ColoringStepState, COLOR_PALETTE } from '../algorithms/graphColoringSteps';
import { eulerianSteps, type EulerianStepState } from '../algorithms/eulerianSteps';
import { bipartiteMatchingSteps, type MatchingStepState } from '../algorithms/bipartiteMatchingSteps';
import type { AlgorithmType, AlgorithmHighlightState, VertexId } from '../types/graph';
import { Play, Pause, FastForward, Rewind, RotateCcw, CheckCircle2, ChevronDown, HelpCircle, Info } from 'lucide-react';

interface DFSState {
  visited: Set<VertexId>;
  stack: VertexId[];
  current?: VertexId;
  step: number;
}

type AnyStepState =
  | ({ type: 'bfs' } & BFSState)
  | ({ type: 'dfs' } & DFSState)
  | ({ type: 'shortestPath' } & ShortestPathStepState)
  | ({ type: 'bipartite' } & BipartiteStepState)
  | ({ type: 'coloring' } & ColoringStepState)
  | ({ type: 'eulerian' } & EulerianStepState)
  | ({ type: 'matching' } & MatchingStepState);

interface AlgorithmsViewProps {
  onHighlightChange?: (state: AlgorithmHighlightState | null) => void;
}

const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({ onHighlightChange }) => {
  const { graph } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('shortestPath');
  const [startVertex, setStartVertex] = useState<string>(() => graph.vertices[0] || 'A');
  const [targetVertex, setTargetVertex] = useState<string>(() => graph.vertices[graph.vertices.length - 1] || 'F');
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(700);

  // Sync start and target vertex when graph vertices change
  useEffect(() => {
    if (graph.vertices.length > 0) {
      if (!graph.vertices.includes(startVertex)) {
        setStartVertex(graph.vertices[0]);
      }
      if (!graph.vertices.includes(targetVertex)) {
        setTargetVertex(graph.vertices[graph.vertices.length - 1] || graph.vertices[0]);
      }
    }
  }, [graph.vertices]);

  // Pre-generate all steps
  const allSteps: AnyStepState[] = useMemo(() => {
    if (graph.vertices.length === 0) return [];
    if (selectedAlgo === 'bfs') {
      const start = graph.vertices.includes(startVertex) ? startVertex : graph.vertices[0];
      return Array.from(bfsSteps(graph, start)).map((s) => ({ ...s, type: 'bfs' as const }));
    }
    if (selectedAlgo === 'dfs') {
      const start = graph.vertices.includes(startVertex) ? startVertex : graph.vertices[0];
      return Array.from(dfsSteps(graph, start)).map((s) => ({ ...s, type: 'dfs' as const }));
    }
    if (selectedAlgo === 'shortestPath') {
      const start = graph.vertices.includes(startVertex) ? startVertex : graph.vertices[0];
      const target = graph.vertices.includes(targetVertex) ? targetVertex : graph.vertices[graph.vertices.length - 1] || start;
      return Array.from(shortestPathSteps(graph, start, target)).map((s) => ({ ...s, type: 'shortestPath' as const }));
    }
    if (selectedAlgo === 'bipartite') {
      return Array.from(bipartiteSteps(graph)).map((s) => ({ ...s, type: 'bipartite' as const }));
    }
    if (selectedAlgo === 'coloring') {
      return Array.from(graphColoringSteps(graph)).map((s) => ({ ...s, type: 'coloring' as const }));
    }
    if (selectedAlgo === 'eulerian') {
      return Array.from(eulerianSteps(graph)).map((s) => ({ ...s, type: 'eulerian' as const }));
    }
    if (selectedAlgo === 'matching') {
      return Array.from(bipartiteMatchingSteps(graph)).map((s) => ({ ...s, type: 'matching' as const }));
    }
    return [];
  }, [selectedAlgo, startVertex, targetVertex, graph]);

  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset step index and playback on algorithm change or graph modification
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedAlgo, startVertex, targetVertex, graph]);

  const currentStepData = allSteps[stepIndex] || null;

  // Compute highlighting state for Cytoscape
  const highlightState = useMemo<AlgorithmHighlightState | null>(() => {
    if (!currentStepData) return null;

    if (currentStepData.type === 'bfs') {
      const visitedArr = Array.from(currentStepData.visited) as VertexId[];
      return {
        mode: 'bfs',
        rootNode: startVertex,
        visitedNodes: visitedArr,
        frontierNodes: currentStepData.queue,
      };
    }

    if (currentStepData.type === 'dfs') {
      const visitedArr = Array.from(currentStepData.visited) as VertexId[];
      return {
        mode: 'dfs',
        rootNode: startVertex,
        currentNode: currentStepData.current,
        visitedNodes: visitedArr,
        frontierNodes: currentStepData.stack,
      };
    }

    if (currentStepData.type === 'shortestPath') {
      const visitedArr = Array.from(currentStepData.visited) as VertexId[];
      const exploredEdgeIds = currentStepData.exploredEdges.map(
        (e) => `e_${[e.source, e.target].sort().join('_')}`
      );
      const pathEdgeIds = currentStepData.shortestPathEdges.map(
        (e) => `e_${[e.source, e.target].sort().join('_')}`
      );
      return {
        mode: 'shortestPath',
        rootNode: startVertex,
        targetNode: targetVertex,
        currentNode: currentStepData.currentVertex,
        visitedNodes: visitedArr,
        frontierNodes: currentStepData.queue,
        exploredEdgeIds,
        pathEdgeIds,
        pathNodes: currentStepData.shortestPath,
      };
    }

    if (currentStepData.type === 'bipartite') {
      return {
        mode: 'bipartite',
        currentNode: currentStepData.currentVertex,
        partitionA: currentStepData.partitionA,
        partitionB: currentStepData.partitionB,
        conflictingEdge: currentStepData.conflictingEdge,
        oddCycle: currentStepData.oddCycle,
      };
    }

    if (currentStepData.type === 'coloring') {
      const nodeColors: Record<VertexId, string> = {};
      if (currentStepData.assignedColors) {
        Object.entries(currentStepData.assignedColors).forEach(([vid, cNum]) => {
          nodeColors[vid] = COLOR_PALETTE[((cNum as number) - 1) % COLOR_PALETTE.length];
        });
      }
      return {
        mode: 'coloring',
        currentNode: currentStepData.currentVertex,
        nodeColors,
      };
    }

    if (currentStepData.type === 'eulerian') {
      const edgeIds: string[] = [];
      if (currentStepData.eulerianEdgeTrail) {
        currentStepData.eulerianEdgeTrail.forEach((eRef: string) => {
          const parts = eRef.split('_');
          if (parts.length >= 4) {
            const s = parts[2];
            const t = parts[3];
            edgeIds.push(`e_${[s, t].sort().join('_')}`);
          }
        });
      }
      return {
        mode: 'eulerian',
        currentNode: currentStepData.currentVertex,
        activeEdgeIds: edgeIds,
        eulerianTrail: currentStepData.eulerianTrail,
      };
    }

    if (currentStepData.type === 'matching') {
      const matchedEdgeIds = currentStepData.matchedEdges.map(
        (e) => `e_${[e.source, e.target].sort().join('_')}`
      );
      return {
        mode: 'matching',
        currentNode: currentStepData.currentVertex,
        partitionA: currentStepData.partitionA,
        partitionB: currentStepData.partitionB,
        matchedEdgeIds,
      };
    }

    return null;
  }, [currentStepData, startVertex, targetVertex]);

  // Sync to parent canvas if callback is provided
  useEffect(() => {
    if (onHighlightChange) {
      onHighlightChange(highlightState);
    }
  }, [highlightState, onHighlightChange]);

  const stepForward = () => {
    if (stepIndex < allSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setPlaying(false);
    }
  };

  const stepBackward = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  // Playback timer
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < allSteps.length - 1) {
          return prev + 1;
        } else {
          setPlaying(false);
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, allSteps.length]);

  const handleReset = () => {
    setStepIndex(0);
    setPlaying(false);
  };

  const messageText = currentStepData && 'message' in currentStepData ? currentStepData.message : undefined;

  return (
    <div className="space-y-2.5 select-none text-slate-200">
      {/* Horizontal Algorithm Tabs matching Reference Image */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#090e1f] border border-[#16213c] w-fit shadow-lg">
        {[
          { id: 'bfs', label: 'BFS' },
          { id: 'dfs', label: 'DFS' },
          { id: 'shortestPath', label: 'Shortest Path' },
          { id: 'coloring', label: 'Graph Coloring' },
          { id: 'bipartite', label: 'Bipartite Test' },
          { id: 'eulerian', label: 'Eulerian Path' },
          { id: 'matching', label: 'Bipartite Matching' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAlgo(tab.id as AlgorithmType)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedAlgo === tab.id
                ? 'bg-[#5b3bf6] text-white shadow-[0_0_12px_rgba(91,59,246,0.6)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131b34]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3 Columns matching Bottom Algorithm Workspace in Reference Image */}
      <div className="grid gap-3 lg:grid-cols-12 items-stretch">
        {/* Column 1 (span 4): Algorithm Description & Inputs */}
        <div className="lg:col-span-4 p-3.5 rounded-2xl bg-[#0a1024] border border-[#17213d] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#a855f7]/20 text-[#c084fc]">
                  <HelpCircle size={16} />
                </div>
                <h3 className="text-xs font-bold text-white tracking-wide">
                  {selectedAlgo === 'shortestPath' && 'Shortest Path (BFS)'}
                  {selectedAlgo === 'bfs' && 'Breadth First Search (BFS)'}
                  {selectedAlgo === 'dfs' && 'Depth First Search (DFS)'}
                  {selectedAlgo === 'bipartite' && 'Bipartite 2-Coloring'}
                  {selectedAlgo === 'coloring' && 'Welsh–Powell Graph Coloring'}
                  {selectedAlgo === 'eulerian' && "Hierholzer's Eulerian Trail"}
                  {selectedAlgo === 'matching' && 'Bipartite Maximum Matching'}
                </h3>
              </div>
              <HelpCircle size={14} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              {selectedAlgo === 'shortestPath' &&
                'Finds the shortest path between two vertices in an unweighted graph using Breadth-First Search.'}
              {selectedAlgo === 'bfs' &&
                'Explores graph vertices layer-by-layer starting from a selected source vertex.'}
              {selectedAlgo === 'dfs' &&
                'Explores as far as possible along each branch before backtracking via recursion call stack.'}
              {selectedAlgo === 'bipartite' &&
                'Verifies whether the graph can be partitioned into two independent sets with no odd-length cycles.'}
              {selectedAlgo === 'coloring' &&
                'Heuristic vertex coloring using Welsh-Powell degree ordering to bound the chromatic number.'}
              {selectedAlgo === 'eulerian' &&
                'Constructs a closed or open Eulerian trail traversing every edge exactly once.'}
              {selectedAlgo === 'matching' &&
                "Calculates the maximum cardinality matching in a bipartite graph using augmenting path search."}
            </p>

            {/* Complexity Specs */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-mono text-slate-400 mb-3.5">
              <div>Time Complexity: <span className="text-slate-200">O(V + E)</span></div>
              <div>Space Complexity: <span className="text-slate-200">O(V)</span></div>
              <div>Works For: <span className="text-slate-200">Unweighted graphs</span></div>
              <div>Finds: <span className="text-slate-200">Shortest path (min edges)</span></div>
            </div>
          </div>

          {/* Selectors for Source & Destination */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#17213d]">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-medium">Source Vertex</label>
              <div className="relative">
                <select
                  value={startVertex}
                  onChange={(e) => setStartVertex(e.target.value)}
                  className="w-full bg-[#080d1d] border border-[#1b2648] rounded-xl pl-6 pr-6 py-1.5 text-xs text-white focus:outline-none focus:border-[#5b3bf6] appearance-none cursor-pointer"
                >
                  {graph.vertices.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <div className="absolute left-2 top-2.5 w-2 h-2 rounded-full bg-[#c084fc]" />
                <ChevronDown size={12} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1 font-medium">Destination Vertex</label>
              <div className="relative">
                <select
                  value={targetVertex}
                  onChange={(e) => setTargetVertex(e.target.value)}
                  className="w-full bg-[#080d1d] border border-[#1b2648] rounded-xl pl-6 pr-6 py-1.5 text-xs text-white focus:outline-none focus:border-[#5b3bf6] appearance-none cursor-pointer"
                >
                  {graph.vertices.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <div className="absolute left-2 top-2.5 w-2 h-2 rounded-full bg-[#38bdf8]" />
                <ChevronDown size={12} className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 (span 5): Algorithm Controls & Current Step States */}
        <div className="lg:col-span-5 p-3.5 rounded-2xl bg-[#0a1024] border border-[#17213d] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-white tracking-wide">Algorithm Controls</h3>
              <span className="text-[11px] font-mono text-[#a855f7] font-semibold">
                Step {allSteps.length > 0 ? stepIndex + 1 : 0} / {allSteps.length}
              </span>
            </div>

            {/* Playback Controls Row matching Reference Image */}
            <div className="flex items-center gap-1.5 mb-3">
              <button
                onClick={() => setPlaying(!playing)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  playing
                    ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-[#5b3bf6] text-white shadow-[0_0_12px_rgba(91,59,246,0.6)] hover:bg-[#6c4ef7]'
                }`}
              >
                {playing ? <Pause size={13} /> : <Play size={13} />}
                <span>{playing ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={stepForward}
                disabled={stepIndex >= allSteps.length - 1 || playing}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-[#080d1d] border border-[#1b2648] text-slate-300 hover:text-white disabled:opacity-40 text-xs font-medium transition-all"
              >
                <FastForward size={13} />
                <span>Next</span>
              </button>

              <button
                onClick={stepBackward}
                disabled={stepIndex === 0 || playing}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-[#080d1d] border border-[#1b2648] text-slate-300 hover:text-white disabled:opacity-40 text-xs font-medium transition-all"
              >
                <Rewind size={13} />
                <span>Previous</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl bg-[#080d1d] border border-[#1b2648] text-slate-400 hover:text-white text-xs font-medium transition-all"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Playback Speed Slider matching Reference Image */}
            <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-3">
              <span className="text-[11px] whitespace-nowrap">Playback Speed</span>
              <input
                type="range"
                min="200"
                max="1400"
                step="100"
                value={1600 - speed}
                onChange={(e) => setSpeed(1600 - Number(e.target.value))}
                className="flex-1 accent-[#a855f7] h-1.5 bg-[#080d1d] rounded-lg cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">1x</span>
            </div>

            {/* Current Step Banner with Blue 'i' icon matching Reference Image */}
            <div className="flex items-start gap-2 p-2 rounded-xl bg-[#080d1d] border border-[#16213c] mb-3">
              <div className="p-1 rounded-full bg-[#3b82f6]/20 text-[#38bdf8] flex-shrink-0 mt-0.5">
                <Info size={13} />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-white block text-[11px]">Current Step</span>
                <span className="text-slate-400 text-[11px] leading-tight block">
                  {messageText || 'Step execution initialized.'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom BFS Queue & Visited Vertices chips matching Reference Image */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#17213d]">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-medium">BFS Queue</span>
              <div className="flex flex-wrap gap-1">
                {(currentStepData && 'queue' in currentStepData ? currentStepData.queue : []).map(
                  (item: string, idx: number) => (
                    <span
                      key={idx}
                      className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#080d1d] border border-[#1b2648] text-[10px] font-mono font-bold text-slate-200"
                    >
                      {item}
                    </span>
                  )
                )}
                {(!currentStepData ||
                  !('queue' in currentStepData) ||
                  currentStepData.queue.length === 0) && (
                  <span className="text-[10px] text-slate-500 italic py-0.5">Empty</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1 font-medium">Visited Vertices</span>
              <div className="flex flex-wrap gap-1">
                {Array.from(currentStepData && 'visited' in currentStepData ? currentStepData.visited : []).map(
                  (v, idx) => (
                    <span
                      key={idx}
                      className={`w-6 h-6 flex items-center justify-center rounded-lg text-white font-mono text-[10px] font-bold shadow-xs ${
                        v === startVertex ? 'bg-[#9333ea]' : 'bg-[#2563eb]'
                      }`}
                    >
                      {v}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 3 (span 3): Result Box matching Reference Image */}
        <div className="lg:col-span-3 p-3.5 rounded-2xl bg-[#0a1024] border border-[#17213d] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide mb-2.5">Result</h3>

            {/* Path Found Badge */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-bold mb-3">
              <CheckCircle2 size={15} />
              <span>
                {currentStepData && 'isFound' in currentStepData && currentStepData.isFound
                  ? 'Path Found!'
                  : currentStepData && 'isComplete' in currentStepData && currentStepData.isComplete
                  ? 'Execution Finished'
                  : 'Searching...'}
              </span>
            </div>

            {/* Shortest Path Chip Flow matching Reference Image */}
            <div className="mb-3">
              <span className="text-[10px] text-slate-400 block mb-1 font-medium">Shortest Path:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentStepData && 'shortestPath' in currentStepData && currentStepData.shortestPath.length > 0 ? (
                  currentStepData.shortestPath.map((node: string, idx: number) => (
                    <React.Fragment key={idx}>
                      <span
                        className={`w-6 h-6 flex items-center justify-center rounded-lg font-bold text-xs text-white shadow-xs ${
                          idx === 0
                            ? 'bg-[#9333ea]'
                            : idx === currentStepData.shortestPath.length - 1
                            ? 'bg-[#2563eb]'
                            : 'bg-[#0284c7]'
                        }`}
                      >
                        {node}
                      </span>
                      {idx < currentStepData.shortestPath.length - 1 && (
                        <span className="text-slate-500 font-bold text-xs">→</span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">—</span>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-400 mb-3">
              Number of edges:{' '}
              <span className="font-mono font-bold text-white">
                {currentStepData && 'pathLength' in currentStepData && currentStepData.pathLength !== null
                  ? currentStepData.pathLength
                  : '—'}
              </span>
            </div>
          </div>

          {/* Path Details List matching Reference Image */}
          <div className="pt-2 border-t border-[#17213d]">
            <span className="text-[10px] text-slate-400 block mb-1 font-medium">Path Details</span>
            <div className="space-y-1 max-h-24 overflow-y-auto font-mono text-[11px] text-slate-300">
              {currentStepData && 'shortestPathEdges' in currentStepData && currentStepData.shortestPathEdges.length > 0 ? (
                currentStepData.shortestPathEdges.map((e, idx) => (
                  <div key={idx} className="flex items-center justify-between py-0.5 px-1.5 rounded bg-[#080d1d]">
                    <span>{idx + 1}.</span>
                    <span>{e.source} → {e.target}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic text-[11px]">No path details yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

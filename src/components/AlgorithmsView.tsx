// src/components/AlgorithmsView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useGraph } from '../context';
import { bfsSteps, type BFSState } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import { bipartiteSteps, type BipartiteStepState } from '../algorithms/bipartiteSteps';
import { graphColoringSteps, type ColoringStepState, COLOR_PALETTE } from '../algorithms/graphColoringSteps';
import { eulerianSteps, type EulerianStepState } from '../algorithms/eulerianSteps';
import type { AlgorithmType, AlgorithmHighlightState, VertexId } from '../types/graph';
import GraphCanvas from './GraphCanvas';
import { Play, Pause, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface DFSState {
  visited: Set<VertexId>;
  stack: VertexId[];
  current?: VertexId;
  step: number;
}

type AnyStepState =
  | ({ type: 'bfs' } & BFSState)
  | ({ type: 'dfs' } & DFSState)
  | ({ type: 'bipartite' } & BipartiteStepState)
  | ({ type: 'coloring' } & ColoringStepState)
  | ({ type: 'eulerian' } & EulerianStepState);

const AlgorithmsView: React.FC = () => {
  const { graph } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>('bfs');
  const [startVertex, setStartVertex] = useState<string>(() => graph.vertices[0] || '1');
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(700);

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
    if (selectedAlgo === 'bipartite') {
      return Array.from(bipartiteSteps(graph)).map((s) => ({ ...s, type: 'bipartite' as const }));
    }
    if (selectedAlgo === 'coloring') {
      return Array.from(graphColoringSteps(graph)).map((s) => ({ ...s, type: 'coloring' as const }));
    }
    if (selectedAlgo === 'eulerian') {
      return Array.from(eulerianSteps(graph)).map((s) => ({ ...s, type: 'eulerian' as const }));
    }
    return [];
  }, [selectedAlgo, startVertex, graph]);

  const [stepIndex, setStepIndex] = useState<number>(0);

  // Sync start vertex
  useEffect(() => {
    if (graph.vertices.length > 0 && !graph.vertices.includes(startVertex)) {
      setStartVertex(graph.vertices[0]);
    }
  }, [graph.vertices]);

  // Reset step index and playback on algorithm change or graph modification
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedAlgo, startVertex, graph]);

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

    return null;
  }, [currentStepData, startVertex]);

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
    <div className="space-y-4 select-none">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Graph Algorithm Stepper
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Interactive step-by-step visualizations for traversals, coloring, and Eulerian paths
        </p>
      </div>

      {/* Algorithm Mode Selection Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] w-fit shadow-xs">
        {[
          { id: 'bfs', label: 'BFS Traversal' },
          { id: 'dfs', label: 'DFS Traversal' },
          { id: 'bipartite', label: 'Bipartite 2-Coloring' },
          { id: 'coloring', label: 'Welsh–Powell Coloring' },
          { id: 'eulerian', label: 'Eulerian Circuit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAlgo(tab.id as AlgorithmType)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedAlgo === tab.id
                ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3-Column Layout: Controls, Canvas, Status */}
      <div className="grid gap-4 lg:grid-cols-4 items-start">
        {/* Column 1: Algorithm Controls */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-3.5 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Playback Controls
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/40">
              {selectedAlgo.toUpperCase()}
            </span>
          </div>

          {(selectedAlgo === 'bfs' || selectedAlgo === 'dfs') && (
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                Start Vertex
              </label>
              <select
                value={startVertex}
                onChange={(e) => setStartVertex(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                {graph.vertices.map((v) => (
                  <option key={v} value={v}>
                    Vertex {v}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={stepBackward}
              disabled={stepIndex === 0 || playing}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white disabled:opacity-40 text-xs font-semibold transition-all"
            >
              <ArrowLeft size={13} />
              <span>Previous</span>
            </button>

            <button
              onClick={stepForward}
              disabled={stepIndex >= allSteps.length - 1 || playing}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white disabled:opacity-40 text-xs font-semibold transition-all"
            >
              <span>Next</span>
              <ArrowRight size={13} />
            </button>
          </div>

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
          <GraphCanvas highlightState={highlightState} />
          <div className="flex items-center justify-between px-2">
            <span className="px-3.5 py-1 rounded-full bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-300 shadow-md">
              Step {allSteps.length > 0 ? stepIndex + 1 : 0} of {allSteps.length}
            </span>
            {messageText && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 italic truncate max-w-sm">
                {messageText}
              </span>
            )}
          </div>
        </div>

        {/* Column 4: Algorithm Live State & Summary */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5">
              Algorithm State
            </h3>

            {/* BFS State */}
            {currentStepData?.type === 'bfs' && (
              <div className="space-y-3">
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400">FIFO Queue:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.queue.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400"
                      >
                        {item}
                      </span>
                    ))}
                    {currentStepData.queue.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Empty</span>
                    )}
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Discovered Order:</span>
                  <div className="space-y-1 mt-1.5 max-h-36 overflow-y-auto">
                    {Array.from(currentStepData.visited).map((v, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1 rounded-lg bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-xs font-mono"
                      >
                        <span className="flex items-center justify-center w-4 h-4 rounded bg-indigo-600 text-white font-bold text-[9px]">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 dark:text-white font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DFS State */}
            {currentStepData?.type === 'dfs' && (
              <div className="space-y-3">
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Call Stack:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.stack.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400"
                      >
                        {item}
                      </span>
                    ))}
                    {currentStepData.stack.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Empty</span>
                    )}
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Discovered Order:</span>
                  <div className="space-y-1 mt-1.5 max-h-36 overflow-y-auto">
                    {Array.from(currentStepData.visited).map((v, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-1 rounded-lg bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-xs font-mono"
                      >
                        <span className="flex items-center justify-center w-4 h-4 rounded bg-indigo-600 text-white font-bold text-[9px]">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800 dark:text-white font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bipartite State */}
            {currentStepData?.type === 'bipartite' && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Partition A (Indigo):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.partitionA.map((v: string) => (
                      <span key={v} className="px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[11px] font-bold">
                        {v}
                      </span>
                    ))}
                    {currentStepData.partitionA.length === 0 && <span className="text-slate-400 italic">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400">Partition B (Pink):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.partitionB.map((v: string) => (
                      <span key={v} className="px-2 py-0.5 rounded bg-pink-600 text-white font-mono text-[11px] font-bold">
                        {v}
                      </span>
                    ))}
                    {currentStepData.partitionB.length === 0 && <span className="text-slate-400 italic">None</span>}
                  </div>
                </div>

                {currentStepData.oddCycle && (
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs">
                    <strong className="block mb-0.5">Odd-Cycle Conflict:</strong>
                    <div className="font-mono text-[11px]">{currentStepData.oddCycle.join(' → ')}</div>
                  </div>
                )}
              </div>
            )}

            {/* Graph Coloring State */}
            {currentStepData?.type === 'coloring' && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Welsh-Powell Order:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.ordering.map((v: string, idx: number) => {
                      const isProcessed = idx <= currentStepData.currentIndex;
                      return (
                        <span
                          key={v}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isProcessed
                              ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {v}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400">Color Assignments:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {Object.entries(currentStepData.assignedColors).map(([v, c]) => {
                      const hex = COLOR_PALETTE[((c as number) - 1) % COLOR_PALETTE.length];
                      return (
                        <span
                          key={v}
                          className="px-2 py-0.5 rounded text-white font-mono text-[10px] font-bold shadow-xs"
                          style={{ backgroundColor: hex }}
                        >
                          {v}: C{c as number}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-[#1e2646]">
                  <span className="text-slate-500 dark:text-slate-400">Colors Used:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 ml-1.5">
                    {currentStepData.chromaticUpperBound}
                  </span>
                </div>
              </div>
            )}

            {/* Eulerian State */}
            {currentStepData?.type === 'eulerian' && (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Hierholzer Stack:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentStepData.stack.map((v: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {v}
                      </span>
                    ))}
                    {currentStepData.stack.length === 0 && <span className="text-slate-400 italic">Empty</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400">Constructed Trail:</span>
                  <div className="p-2 mt-1 rounded-xl bg-slate-50 dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold break-all">
                    {currentStepData.eulerianTrail.join(' → ') || 'None yet'}
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  Edges traversed: <strong>{currentStepData.consumedEdgeIds.size}</strong> / {graph.edges.length}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-1.5 transition-colors">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Algorithm Description
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedAlgo === 'bfs' && 'Explores all neighbors at the current depth before descending deeper.'}
              {selectedAlgo === 'dfs' && 'Explores as far as possible along each branch before backtracking.'}
              {selectedAlgo === 'bipartite' && 'Uses 2-coloring BFS to partition vertices into two independent sets or isolate an odd-cycle witness.'}
              {selectedAlgo === 'coloring' && 'Welsh–Powell sorts vertices by descending degree and applies greedy coloring to establish an upper bound for χ(G).'}
              {selectedAlgo === 'eulerian' && "Hierholzer's algorithm traces an Eulerian trail by decomposing the graph into closed edge-disjoint cycles."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

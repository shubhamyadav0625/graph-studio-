// src/components/GraphControls.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import { examples } from '../data/exampleGraphs';
import type { ExampleKey } from '../data/exampleGraphs';
import type { VertexId } from '../types/graph';
import {
  MousePointer,
  PlusCircle,
  Share2,
  Trash2,
  Undo2,
  Play,
  Pause,
  Square,
  Network,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { bfsSteps } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import { detectCycle } from '../algorithms/detectCycle';
import { verifyTree } from '../algorithms/verifyTree';

interface GraphControlsProps {
  onStatusChange?: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const GraphControls: React.FC<GraphControlsProps> = ({ onStatusChange }) => {
  const {
    graph,
    addVertex,
    addEdge,
    clearGraph,
    undo,
    selected,
    setGraph,
    clearSelection,
  } = useGraph();

  const [activeTool, setActiveTool] = useState<'move' | 'node' | 'link'>('link');
  const [engineMode, setEngineMode] = useState<'auto' | 'manual'>('auto');
  const [isPlaying, setIsPlaying] = useState(false);
  const [exampleKey, setExampleKey] = useState<ExampleKey | ''>('validTree');

  // Algorithm state
  const [startSector, setStartSector] = useState<string>('');
  const [targetSector, setTargetSector] = useState<string>('');
  const [activeAlgo, setActiveAlgo] = useState<'bfs' | 'dfs' | 'tree' | 'cycle' | null>(null);
  const [algoGenerator, setAlgoGenerator] = useState<Generator<any> | null>(null);

  // Sync start/target sectors when vertices change
  React.useEffect(() => {
    if (graph.vertices.length > 0) {
      if (!startSector || !graph.vertices.includes(startSector)) {
        setStartSector(graph.vertices[0]);
      }
      if (!targetSector || !graph.vertices.includes(targetSector)) {
        setTargetSector(graph.vertices[graph.vertices.length - 1] || graph.vertices[0]);
      }
    } else {
      setStartSector('');
      setTargetSector('');
    }
  }, [graph.vertices]);

  // Handle Add Node
  const handleAddNode = () => {
    setActiveTool('node');
    const newId = `v${graph.vertices.length + 1}`;
    addVertex(newId);
    onStatusChange?.(`SPAWNED NODE ${newId}`, 'info');
  };

  // Handle Link Selected Vertices
  const handleLinkNodes = () => {
    setActiveTool('link');
    if (selected.length !== 2) {
      onStatusChange?.('SELECT EXACTLY 2 NODES TO ESTABLISH LINK', 'warning');
      return;
    }
    const [a, b] = selected as [VertexId, VertexId];
    addEdge(a, b);
    clearSelection();
    onStatusChange?.(`LINK CREATED: ${a} ↔ ${b}`, 'success');
  };

  // Handle Remove Selected
  const handleRemoveSelected = () => {
    if (selected.length === 0) {
      onStatusChange?.('SELECT NODES TO DELETE', 'warning');
      return;
    }
    (window as any).graphCanvasDeleteSelection?.();
    onStatusChange?.(`REMOVED SELECTED SECTORS`, 'info');
  };

  // Handle Load Preset Topology
  const handleLoadExample = (key: ExampleKey) => {
    setExampleKey(key);
    if (!key || !examples[key]) return;
    const ex = examples[key];
    setGraph({ ...ex });
    clearSelection();
    // Reset global state highlights
    (window as any).bfsVisited = [];
    (window as any).bfsFrontier = [];
    (window as any).dfsVisited = [];
    (window as any).dfsStack = [];
    (window as any).dfsCurrent = null;
    setActiveAlgo(null);
    setIsPlaying(false);

    setTimeout(() => {
      (window as any).graphCanvasAutoLayout?.();
    }, 50);

    onStatusChange?.(`LOADED TOPOLOGY: ${key.toUpperCase()}`, 'success');
  };

  // Run BFS
  const runBFS = () => {
    if (!startSector) return;
    setActiveAlgo('bfs');
    const gen = bfsSteps(graph, startSector);
    setAlgoGenerator(gen);

    const first = gen.next();
    if (!first.done) {
      const { visited, queue } = first.value;
      (window as any).bfsVisited = Array.from(visited);
      (window as any).bfsFrontier = queue;
    }
    if (engineMode === 'auto') {
      setIsPlaying(true);
    }
    onStatusChange?.(`BFS ROUTE SIMULATOR STARTED FROM [${startSector}]`, 'info');
  };

  // Run DFS
  const runDFS = () => {
    if (!startSector) return;
    setActiveAlgo('dfs');
    const gen = dfsSteps(graph, startSector);
    setAlgoGenerator(gen);

    const first = gen.next();
    if (!first.done) {
      const { visited, stack, current } = first.value;
      (window as any).dfsVisited = Array.from(visited);
      (window as any).dfsStack = [...stack];
      (window as any).dfsCurrent = current;
    }
    if (engineMode === 'auto') {
      setIsPlaying(true);
    }
    onStatusChange?.(`DFS RECURSIVE ENGINE ENGAGED AT [${startSector}]`, 'info');
  };

  // Run Tree Verification
  const runTreeVerify = () => {
    setActiveAlgo('tree');
    setIsPlaying(false);
    const result = verifyTree(graph);
    if (result.isTree) {
      onStatusChange?.('OPTIMAL TREE VERIFIED: CONNECTED & ACYCLIC (E = V-1)', 'success');
    } else {
      onStatusChange?.(`TREE VERIFICATION FAILED: ${result.reasons[0] || 'Non-tree topology'}`, 'error');
    }
  };

  // Run Cycle Check
  const runCycleCheck = () => {
    setActiveAlgo('cycle');
    setIsPlaying(false);
    const cycle = detectCycle(graph);
    if (cycle.length > 0) {
      (window as any).bfsVisited = cycle;
      onStatusChange?.(`CYCLE DETECTED IN SECTORS: ${cycle.join(' → ')}`, 'warning');
    } else {
      (window as any).bfsVisited = [];
      onStatusChange?.('CYCLE DETECTION PASS: GRAPH IS ACYCLIC', 'success');
    }
  };

  // Advance step
  const handleNextStep = () => {
    if (!algoGenerator) return;
    const res = algoGenerator.next();
    if (!res.done) {
      if (activeAlgo === 'bfs') {
        const { visited, queue } = res.value;
        (window as any).bfsVisited = Array.from(visited);
        (window as any).bfsFrontier = queue;
      } else if (activeAlgo === 'dfs') {
        const { visited, stack, current } = res.value;
        (window as any).dfsVisited = Array.from(visited);
        (window as any).dfsStack = [...stack];
        (window as any).dfsCurrent = current;
      }
    } else {
      setIsPlaying(false);
      onStatusChange?.('ALGORITHM TRAVERSAL COMPLETE', 'success');
    }
  };

  // Auto-play timer
  React.useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      handleNextStep();
    }, 700);
    return () => clearInterval(timer);
  }, [isPlaying, algoGenerator, activeAlgo]);

  // Abort / Reset
  const handleAbort = () => {
    clearGraph();
    (window as any).bfsVisited = [];
    (window as any).bfsFrontier = [];
    (window as any).dfsVisited = [];
    (window as any).dfsStack = [];
    (window as any).dfsCurrent = null;
    setIsPlaying(false);
    setActiveAlgo(null);
    onStatusChange?.('OPERATION ABORTED • GRAPH PURGED', 'error');
  };

  return (
    <div className="w-full lg:w-80 flex flex-col gap-4 text-slate-200 select-none">
      {/* SECTION 1: INTERACTION TOOLKIT */}
      <div className="p-3.5 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 font-semibold uppercase flex items-center gap-1.5">
            <Share2 size={13} className="text-cyan-400" />
            INTERACTION TOOLKIT
          </span>
          <span className="text-[10px] font-mono text-cyan-400/80">
            {selected.length} SELECTED
          </span>
        </div>

        {/* 3 Main Mode Buttons (MOVE, NODE, LINK) */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5">
          <button
            onClick={() => setActiveTool('move')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTool === 'move'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <MousePointer size={16} className="mb-1" />
            <span className="text-[10px]">MOVE</span>
          </button>

          <button
            onClick={handleAddNode}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTool === 'node'
                ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <PlusCircle size={16} className="mb-1 text-emerald-400" />
            <span className="text-[10px]">+ NODE</span>
          </button>

          <button
            onClick={handleLinkNodes}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              activeTool === 'link'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Share2 size={16} className="mb-1 text-purple-400" />
            <span className="text-[10px]">LINK</span>
          </button>
        </div>

        {/* Undo and Delete Selected row */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={undo}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 text-xs font-mono transition-all"
            title="Undo last modification"
          >
            <Undo2 size={13} />
            <span>UNDO</span>
          </button>

          <button
            onClick={handleRemoveSelected}
            disabled={selected.length === 0}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/40 disabled:opacity-40 text-xs font-mono transition-all"
            title="Delete selected vertices"
          >
            <Trash2 size={13} />
            <span>DELETE</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: ENGINE STATE CONTROLS */}
      <div className="p-3.5 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 font-semibold uppercase">
            ENGINE STATE
          </span>

          <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-900 border border-slate-800">
            <button
              onClick={() => setEngineMode('auto')}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                engineMode === 'auto'
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              AUTO
            </button>
            <button
              onClick={() => {
                setEngineMode('manual');
                setIsPlaying(false);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                engineMode === 'manual'
                  ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              MANUAL
            </button>
          </div>
        </div>

        {/* Stepper playback buttons */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!activeAlgo}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={handleNextStep}
            disabled={isPlaying || !activeAlgo}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 disabled:opacity-40 text-xs font-mono font-bold transition-all"
          >
            <span>NEXT</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Abort button in red neon outline */}
        <button
          onClick={handleAbort}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 hover:border-rose-500/60 text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(244,63,94,0.15)]"
        >
          <Square size={13} className="fill-rose-500 text-rose-500" />
          <span>ABORT OPERATION</span>
        </button>
      </div>

      {/* SECTION 3: ROUTE PLANNER / ALGORITHM ENGINE */}
      <div className="p-3.5 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 font-semibold uppercase block mb-2.5">
          ROUTE PLANNER
        </span>

        {/* Sector selection dropdowns */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">
              START SECTOR
            </label>
            <select
              value={startSector}
              onChange={(e) => setStartSector(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            >
              {graph.vertices.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">
              TARGET SECTOR
            </label>
            <select
              value={targetSector}
              onChange={(e) => setTargetSector(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
            >
              {graph.vertices.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Glowing Algorithm Cards (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2">
          {/* BFS */}
          <button
            onClick={runBFS}
            className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              activeAlgo === 'bfs'
                ? 'bg-cyan-950/50 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-slate-300'
            }`}
          >
            <Network size={16} className="text-cyan-400 mb-1" />
            <span className="text-xs font-mono font-bold text-cyan-400">BFS</span>
            <span className="text-[9px] font-mono text-slate-400">BREADTH FIRST</span>
          </button>

          {/* DFS */}
          <button
            onClick={runDFS}
            className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              activeAlgo === 'dfs'
                ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/40 text-slate-300'
            }`}
          >
            <GitBranch size={16} className="text-purple-400 mb-1" />
            <span className="text-xs font-mono font-bold text-purple-400">DFS</span>
            <span className="text-[9px] font-mono text-slate-400">DEPTH FIRST</span>
          </button>

          {/* TREE VERIFY */}
          <button
            onClick={runTreeVerify}
            className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              activeAlgo === 'tree'
                ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 text-slate-300'
            }`}
          >
            <ShieldCheck size={16} className="text-emerald-400 mb-1" />
            <span className="text-xs font-mono font-bold text-emerald-400">TREE VERIFY</span>
            <span className="text-[9px] font-mono text-slate-400">E = V - 1 CHECK</span>
          </button>

          {/* CYCLE CHECK */}
          <button
            onClick={runCycleCheck}
            className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
              activeAlgo === 'cycle'
                ? 'bg-amber-950/50 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40 text-slate-300'
            }`}
          >
            <AlertTriangle size={16} className="text-amber-400 mb-1" />
            <span className="text-xs font-mono font-bold text-amber-400">CYCLE CHECK</span>
            <span className="text-[9px] font-mono text-slate-400">BACK-EDGE PASS</span>
          </button>
        </div>
      </div>

      {/* SECTION 4: PRESET TOPOLOGY SELECTOR */}
      <div className="p-3.5 rounded-xl bg-[#0c1222] border border-slate-800 shadow-xl">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 font-semibold uppercase flex items-center gap-1.5 mb-2">
          <FolderOpen size={13} className="text-indigo-400" />
          PRESET TOPOLOGIES
        </span>

        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(examples).map((k) => (
            <button
              key={k}
              onClick={() => handleLoadExample(k as ExampleKey)}
              className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-mono transition-all truncate border ${
                exampleKey === k
                  ? 'bg-indigo-950/60 border-indigo-500/60 text-indigo-300 font-bold'
                  : 'bg-slate-900/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphControls;

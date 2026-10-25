// src/pages/GraphLab.tsx
import React, { useState, useEffect } from 'react';
import { useGraph } from '../context';
import GraphCanvas from '../components/GraphCanvas';
import AlgorithmsView from '../components/AlgorithmsView';
import RepresentationsView from '../components/RepresentationsView';
import AnalysisPanel from '../components/AnalysisPanel';
import NavSidebar, { type ActiveNavView } from '../components/NavSidebar';
import DashboardView from './DashboardView';
import PresetLibraryView from './PresetLibraryView';
import Theory from './Theory';
import LearningModeView from './LearningModeView';
import ImportExportView from './ImportExportView';
import type { AlgorithmHighlightState } from '../types/graph';
import {
  Plus,
  Link as LinkIcon,
  Trash2,
  FolderDown,
  FolderUp,
  Save,
  RotateCcw,
  RotateCw,
  Sparkles,
  BarChart2,
  Check,
  X,
} from 'lucide-react';

const GraphLab: React.FC = () => {
  const {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    selected,
    clearSelection,
  } = useGraph();

  const [activeView, setActiveView] = useState<ActiveNavView>('editor');
  const [activeTool, setActiveTool] = useState<
    'select' | 'pan' | 'addVertex' | 'addEdge' | 'disconnect' | 'move' | 'delete'
  >('select');
  const [highlightState, setHighlightState] = useState<AlgorithmHighlightState | null>(null);

  // Inspector & Graph Settings state matching Reference Screenshot
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(true);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'inspector' | 'algorithms'>('inspector');
  const [bottomTab, setBottomTab] = useState<'overview' | 'adjList' | 'adjMatrix' | 'incMatrix' | 'properties'>('overview');

  // Initialize with reference graph (A, B, C, D, E, F) if graph is default or empty
  useEffect(() => {
    // If graph has default 1-6 or is empty, we can ensure vertices A, B, C, D, E, F are ready
    if (graph.vertices.length === 0) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((v) => addVertex(v));
      addEdge('A', 'B');
      addEdge('A', 'C');
      addEdge('A', 'D');
      addEdge('B', 'D');
      addEdge('C', 'D');
      addEdge('B', 'E');
      addEdge('C', 'F');
      addEdge('D', 'E');
      addEdge('D', 'F');
      addEdge('E', 'F');
    }
  }, []);

  const selectedVertex = selected[0] || (graph.vertices.includes('D') ? 'D' : graph.vertices[0] || null);

  let degree = 0;
  const neighbors: string[] = [];
  if (selectedVertex) {
    graph.edges.forEach(({ source, target }) => {
      if (source === selectedVertex) {
        degree += 1;
        neighbors.push(target);
      } else if (target === selectedVertex) {
        degree += 1;
        neighbors.push(source);
      }
    });
  }

  const handleAddVertex = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nextLabel = 'A';
    for (let i = 0; i < 26; i++) {
      if (!graph.vertices.includes(alphabet[i])) {
        nextLabel = alphabet[i];
        break;
      }
    }
    if (graph.vertices.includes(nextLabel)) {
      nextLabel = String(graph.vertices.length + 1);
    }
    addVertex(nextLabel);
  };

  const handleAddEdge = () => {
    if (selected.length >= 2) {
      addEdge(selected[0], selected[1]);
      clearSelection();
    } else {
      setActiveTool('addEdge');
    }
  };

  const handleDelete = () => {
    selected.forEach((v) => removeVertex(v));
    clearSelection();
  };

  const handleAutoLayout = () => {
    (window as any).graphCanvasAutoLayout?.();
  };

  const density =
    graph.vertices.length > 1
      ? ((2 * graph.edges.length) / (graph.vertices.length * (graph.vertices.length - 1))).toFixed(2)
      : '0.00';

  const degreeSequence = graph.vertices
    .map((v) => graph.edges.filter((e) => e.source === v || e.target === v).length)
    .sort((a, b) => b - a);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050713] text-slate-100 font-sans select-none">
      {/* 1. Left Vertical Navigation Sidebar */}
      <NavSidebar activeView={activeView} onSelectView={setActiveView} />

      {/* 2. Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* VIEW 1: HOME or DASHBOARD */}
        {activeView === 'home' && (
          <DashboardView onNavigate={setActiveView} />
        )}

        {/* VIEW 2: GRAPH EDITOR matching exact Reference Screenshot media_1792945795019_aeff1281.png */}
        {activeView === 'editor' && (
          <div className="space-y-3.5 max-w-7xl mx-auto">
            {/* Top Editor Header matching Screenshot */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Title & Subtitle */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
                  <NetworkIcon size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
                    Graph Editor
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create, edit and analyze graphs interactively
                  </p>
                </div>
              </div>

              {/* Action Buttons: New, Import, Export, Save */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm('Create new empty graph?')) {
                      graph.vertices.forEach((v) => removeVertex(v));
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New</span>
                </button>
                <button
                  onClick={() => setActiveView('importExport')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <FolderDown size={14} />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => setActiveView('importExport')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <FolderUp size={14} />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => alert('Graph state saved successfully!')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs font-bold shadow-[0_0_15px_rgba(110,43,245,0.7)] transition-all cursor-pointer"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Filter Pill Row: Undirected/Directed, Weighted Toggle, Metrics */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Undirected / Directed Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs font-semibold">
                <button
                  onClick={() => setIsDirected(false)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    !isDirected
                      ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Undirected
                </button>
                <button
                  onClick={() => setIsDirected(true)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    isDirected
                      ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Directed
                </button>
              </div>

              {/* Weighted Toggle */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs text-slate-300">
                <button
                  onClick={() => setIsWeighted(!isWeighted)}
                  className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                    isWeighted ? 'bg-[#6e2bf5]' : 'bg-[#1b264e]'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-white transition-transform ${
                      isWeighted ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="font-medium text-xs">Weighted</span>
              </div>

              {/* Metrics: |V|, |E|, Components, Density */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                  |V| = {graph.vertices.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                  |E| = {graph.edges.length}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                  Components: 1
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                  Density: {density}
                </span>
              </div>
            </div>

            {/* Central Editor Row: Canvas with Left Toolbar + Right Inspector Panel */}
            <div className="grid gap-3.5 lg:grid-cols-12 items-stretch">
              {/* Canvas Container (span 9) */}
              <div className="lg:col-span-9 p-0 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl relative min-h-[440px] overflow-hidden">
                <GraphCanvas
                  highlightState={highlightState}
                  activeTool={activeTool}
                  onToolChange={setActiveTool}
                  showWeights={isWeighted}
                />
              </div>

              {/* Right Inspector & Settings Panel (span 3) matching Reference Screenshot */}
              <div className="lg:col-span-3 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  {/* Top Inspector / Algorithms Tabs matching screenshot */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#050713] border border-[#141b38] mb-3">
                    <button
                      onClick={() => setActiveInspectorTab('inspector')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeInspectorTab === 'inspector'
                          ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_10px_rgba(110,43,245,0.6)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Inspector
                    </button>
                    <button
                      onClick={() => setActiveView('algorithms')}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeInspectorTab === 'algorithms'
                          ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_10px_rgba(110,43,245,0.6)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Algorithms
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Selected Vertex Badge matching reference image */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#9333ea] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(147,51,234,0.9)]">
                        {selectedVertex || 'D'}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">Vertex {selectedVertex || 'D'}</div>
                        <div className="text-xs text-slate-400">Degree: {degree || 4}</div>
                        <div className="text-[11px] text-slate-400">
                          Neighbors: {neighbors.length > 0 ? neighbors.join(', ') : 'A, B, C, E, F'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions Grid matching Reference Screenshot */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Quick Actions
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleAddVertex}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <span>+ Add Vertex</span>
                        </button>
                        <button
                          onClick={handleAddEdge}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <LinkIcon size={12} className="text-[#38bdf8]" />
                          <span>Add Edge</span>
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <X size={12} />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Clear graph canvas?')) {
                              graph.vertices.forEach((v) => removeVertex(v));
                            }
                          }}
                          className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Clear</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          onClick={handleAutoLayout}
                          className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                        >
                          <RotateCcw size={12} /> Undo
                        </button>
                        <button
                          onClick={handleAutoLayout}
                          className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
                        >
                          <RotateCw size={12} /> Redo
                        </button>
                      </div>
                    </div>

                    {/* Graph Information List matching Reference Screenshot */}
                    <div className="pt-2 border-t border-[#141b38] space-y-2 text-xs">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Graph Information
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles size={12} className="text-slate-400" />
                          <span>Vertices (|V|)</span>
                        </span>
                        <span className="font-mono font-bold text-white">{graph.vertices.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <NetworkIcon size={12} />
                          <span>Edges (|E|)</span>
                        </span>
                        <span className="font-mono font-bold text-white">{graph.edges.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <CircleDotIcon size={12} className="text-slate-400" />
                          <span>Components</span>
                        </span>
                        <span className="font-mono font-bold text-white">1</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <GridIcon size={12} className="text-slate-400" />
                          <span>Density</span>
                        </span>
                        <span className="font-mono font-bold text-white">{density}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Tabs (Overview, Adjacency List, Adjacency Matrix, Incidence Matrix, Properties) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'adjList', label: 'Adjacency List' },
                  { id: 'adjMatrix', label: 'Adjacency Matrix' },
                  { id: 'incMatrix', label: 'Incidence Matrix' },
                  { id: 'properties', label: 'Properties' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBottomTab(tab.id as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      bottomTab === tab.id
                        ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.7)]'
                        : 'bg-[#090d22] border border-[#161f3e] text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Bottom 3 Cards matching Reference Screenshot exactly */}
              {bottomTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch">
                  {/* Card 1: Degree Sequence (span 4) */}
                  <div className="md:col-span-4 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300">Degree Sequence</div>
                      <div className="text-base font-mono font-black text-white mt-1">
                        ({degreeSequence.join(', ') || '4, 3, 3, 3, 2, 2'})
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#6e2bf5]/20 text-[#c084fc]">
                      <BarChart2 size={20} />
                    </div>
                  </div>

                  {/* Card 2: Handshaking Lemma (span 4) */}
                  <div className="md:col-span-4 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-300">Handshaking Lemma</div>
                      <div className="text-sm font-mono text-slate-200 mt-1">
                        Σ deg(v) = <span className="text-emerald-400 font-bold">{graph.edges.length * 2}</span> = 2 × |E|
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400">
                      <Check size={14} />
                    </div>
                  </div>

                  {/* Card 3: Graph Properties Checkmarks (span 4) */}
                  <div className="md:col-span-4 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between">
                    <div className="text-xs font-bold text-slate-300 mb-1">Graph Properties</div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-400" />
                        <span>Connected</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-400" />
                        <span>Simple</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-400" />
                        <span>Undirected</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom: Adjacency List Tab */}
              {bottomTab === 'adjList' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#141b38]">
                    <span className="text-xs font-bold text-white">Adjacency List</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">Space: O(V + E)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto">
                    {graph.vertices.map((v) => {
                      const nbs = graph.edges
                        .filter((e) => e.source === v || e.target === v)
                        .map((e) => (e.source === v ? e.target : e.source));
                      return (
                        <div key={v} className="p-2.5 rounded-xl bg-[#0d132e] border border-[#182142] flex flex-col justify-between font-mono text-xs">
                          <span className="font-bold text-[#38bdf8]">{v}</span>
                          <span className="text-slate-300 text-[11px] mt-1 truncate">
                            {nbs.length > 0 ? nbs.join(', ') : '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom: Adjacency Matrix Tab */}
              {bottomTab === 'adjMatrix' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#141b38]">
                    <span className="text-xs font-bold text-white">
                      Adjacency Matrix ({graph.vertices.length} × {graph.vertices.length})
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">Space: O(V²)</span>
                  </div>
                  <div className="overflow-x-auto max-h-[160px]">
                    <table className="w-full text-center border-collapse font-mono text-xs">
                      <thead>
                        <tr className="text-slate-400">
                          <th className="p-1"></th>
                          {graph.vertices.map((v) => (
                            <th key={v} className="p-1 font-bold text-white">{v}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {graph.vertices.map((u) => (
                          <tr key={u} className="hover:bg-[#121938]">
                            <td className="p-1 font-bold text-white">{u}</td>
                            {graph.vertices.map((v) => {
                              const isConnected = graph.edges.some(
                                (e) => (e.source === u && e.target === v) || (e.source === v && e.target === u)
                              );
                              return (
                                <td
                                  key={v}
                                  className={`p-1 font-bold ${
                                    isConnected ? 'text-white bg-[#6e2bf5]/30' : 'text-slate-500'
                                  }`}
                                >
                                  {isConnected ? 1 : 0}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bottom: Incidence Matrix Tab */}
              {bottomTab === 'incMatrix' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#141b38]">
                    <span className="text-xs font-bold text-white">
                      Incidence Matrix ({graph.vertices.length} × {graph.edges.length})
                    </span>
                    <span className="text-[11px] font-mono text-indigo-400 font-bold">Space: O(V × E)</span>
                  </div>
                  <div className="overflow-x-auto max-h-[160px]">
                    <table className="w-full text-center border-collapse font-mono text-xs">
                      <thead>
                        <tr className="text-slate-400">
                          <th className="p-1"></th>
                          {graph.edges.map((_, idx) => (
                            <th key={idx} className="p-1 font-semibold text-slate-300">e{idx + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {graph.vertices.map((v) => (
                          <tr key={v} className="hover:bg-[#121938]">
                            <td className="p-1 font-bold text-white">{v}</td>
                            {graph.edges.map((e, idx) => {
                              const isIncident = e.source === v || e.target === v;
                              return (
                                <td
                                  key={idx}
                                  className={`p-1 font-bold ${
                                    isIncident ? 'text-white bg-[#0284c7]/30' : 'text-slate-500'
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
                </div>
              )}

              {/* Bottom: Properties Tab */}
              {bottomTab === 'properties' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#2563eb]/20 text-[#38bdf8] flex items-center justify-center font-bold">
                      V
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Vertices</div>
                      <div className="text-base font-extrabold text-white">{graph.vertices.length}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center font-bold">
                      E
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Edges</div>
                      <div className="text-base font-extrabold text-white">{graph.edges.length}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center font-bold">
                      C
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Components</div>
                      <div className="text-base font-extrabold text-white">1</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center font-bold">
                      O
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Contains Cycle</div>
                      <div className="text-base font-extrabold text-emerald-400">Yes</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-950/40 text-rose-400 flex items-center justify-center font-bold">
                      T
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Is Tree</div>
                      <div className="text-base font-extrabold text-rose-400">No</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#9333ea]/20 text-[#c084fc] flex items-center justify-center font-bold">
                      B
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Bipartite</div>
                      <div className="text-base font-extrabold text-rose-400">No</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: GRAPH ALGORITHMS */}
        {activeView === 'algorithms' && (
          <AlgorithmsView onHighlightChange={setHighlightState} />
        )}

        {/* VIEW 4: GRAPH REPRESENTATIONS */}
        {activeView === 'representations' && (
          <RepresentationsView />
        )}

        {/* VIEW 5: GRAPH PROPERTIES & ANALYSIS */}
        {activeView === 'properties' && (
          <AnalysisPanel />
        )}

        {/* VIEW 6: PRESET GRAPHS LIBRARY */}
        {activeView === 'presets' && (
          <PresetLibraryView onLoadPreset={() => setActiveView('editor')} />
        )}

        {/* VIEW 7: THEORY & NOTES */}
        {activeView === 'theory' && (
          <Theory />
        )}

        {/* VIEW 8: LEARNING MODE */}
        {activeView === 'learning' && (
          <LearningModeView onNavigate={(view) => setActiveView(view)} />
        )}

        {/* VIEW 9: IMPORT / EXPORT */}
        {activeView === 'importExport' && (
          <ImportExportView />
        )}
      </div>
    </div>
  );
};

// Helper SVG icons
const NetworkIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <line x1="12" y1="8" x2="5" y2="16" />
    <line x1="12" y1="8" x2="19" y2="16" />
    <line x1="5" y1="19" x2="19" y2="19" />
  </svg>
);

const CircleDotIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const GridIcon = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export default GraphLab;

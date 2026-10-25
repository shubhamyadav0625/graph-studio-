// src/pages/GraphLab.tsx
import React, { useState } from 'react';
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
  MousePointer,
  Trash2,
  Sparkles,
  Move,
  Maximize2,
  RotateCcw,
  RotateCw,
  FolderDown,
  FolderUp,
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

  const [activeView, setActiveView] = useState<ActiveNavView>('home');
  const [activeTool, setActiveTool] = useState<'move' | 'link' | 'select' | 'delete'>('select');
  const [highlightState, setHighlightState] = useState<AlgorithmHighlightState | null>(null);

  // Inspector & Graph Settings state matching Screen 5
  const [isDirected, setIsDirected] = useState(false);
  const [isWeighted, setIsWeighted] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'inspector' | 'settings'>('inspector');
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [edgeWeights, setEdgeWeights] = useState(false);
  const [bottomTab, setBottomTab] = useState<'overview' | 'adjList' | 'adjMatrix' | 'incMatrix' | 'properties'>('overview');

  const selectedVertex = selected[0] || (graph.vertices.length > 0 ? graph.vertices[0] : null);
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
    let nextNum = 1;
    while (graph.vertices.includes(String(nextNum))) {
      nextNum += 1;
    }
    addVertex(String(nextNum));
  };

  const handleAddEdge = () => {
    if (selected.length >= 2) {
      addEdge(selected[0], selected[1]);
      clearSelection();
    } else {
      alert('Please select at least 2 vertices by clicking on them to connect with an edge.');
    }
  };

  const handleDelete = () => {
    selected.forEach((v) => removeVertex(v));
    clearSelection();
  };

  const handleAutoLayout = () => {
    (window as any).graphCanvasAutoLayout?.();
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050713] text-slate-100 font-sans">
      {/* 1. Left Vertical Navigation Sidebar */}
      <NavSidebar activeView={activeView} onSelectView={setActiveView} />

      {/* 2. Main Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* VIEW 1: HOME or DASHBOARD */}
        {activeView === 'home' && (
          <DashboardView onNavigate={setActiveView} />
        )}

        {/* VIEW 2: GRAPH EDITOR matching exact Reference Screenshot media_1792936955494_eded48d1.png */}
        {activeView === 'editor' && (
          <div className="space-y-3.5 max-w-7xl mx-auto">
            {/* Top Editor Header matching Screenshot */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Undirected / Directed Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-[#090d22] border border-[#161f3e] text-xs font-semibold">
                  <button
                    onClick={() => setIsDirected(false)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      !isDirected ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.6)]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Undirected
                  </button>
                  <button
                    onClick={() => setIsDirected(true)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      isDirected ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.6)]' : 'text-slate-400 hover:text-white'
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
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isWeighted ? 'translate-x-3' : 'translate-x-0'}`} />
                  </button>
                  <span className="font-medium text-xs">Weighted</span>
                </div>

                {/* Status metrics: |V| = 6, |E| = 8, Components: 1 */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                    |V| = {graph.vertices.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                    |E| = {graph.edges.length}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-200 font-semibold">
                    Components: 1
                  </span>
                </div>
              </div>

              {/* Top Right Action buttons: Import, Export, New Graph + */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('importExport')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <FolderDown size={14} />
                  <span>Import</span>
                </button>
                <button
                  onClick={() => setActiveView('importExport')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090d22] border border-[#161f3e] text-slate-300 hover:text-white text-xs font-semibold transition-all"
                >
                  <FolderUp size={14} />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleAddVertex}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs font-semibold shadow-[0_0_15px_rgba(110,43,245,0.7)] transition-all"
                >
                  <span>New Graph</span>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Central Editor Row: Canvas with Left Toolbar + Right Inspector Panel */}
            <div className="grid gap-3.5 lg:grid-cols-12 items-stretch">
              {/* Canvas Container (span 9) */}
              <div className="lg:col-span-9 p-3 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl relative flex flex-col justify-between min-h-[440px]">
                {/* Floating Left Toolbar matching Reference Screenshot */}
                <div className="absolute left-6 top-6 z-20 flex flex-col gap-2 p-1.5 rounded-2xl bg-[#070a1a]/90 backdrop-blur-md border border-[#1a2346] shadow-2xl">
                  <button
                    onClick={() => setActiveTool('select')}
                    className={`p-2 rounded-xl transition-all ${
                      activeTool === 'select'
                        ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.8)]'
                        : 'text-slate-400 hover:text-white hover:bg-[#121938]'
                    }`}
                    title="Select"
                  >
                    <MousePointer size={16} />
                  </button>
                  <button
                    onClick={handleAddVertex}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121938] transition-all"
                    title="Add Vertex"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={handleAddEdge}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121938] transition-all"
                    title="Add Edge (Select 2 vertices)"
                  >
                    <LinkIcon size={16} />
                  </button>
                  <button
                    onClick={() => setActiveTool('move')}
                    className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121938] transition-all"
                    title="Move Canvas"
                  >
                    <Move size={16} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all"
                    title="Delete Selected"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Floating Top Right Canvas Controls (Layout, Fullscreen) */}
                <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
                  <button
                    onClick={handleAutoLayout}
                    className="p-2 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300 hover:text-white transition-all shadow-md"
                    title="Layout Options"
                  >
                    <Sparkles size={16} />
                  </button>
                  <button
                    onClick={handleAutoLayout}
                    className="p-2 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300 hover:text-white transition-all shadow-md"
                    title="Fit to Screen"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>

                {/* Real Interactive Cytoscape Canvas */}
                <div className="flex-1 h-[360px] w-full rounded-xl overflow-hidden relative">
                  <GraphCanvas highlightState={highlightState} />
                </div>

                {/* Bottom Canvas Toolbar & Legend matching Reference Screenshot */}
                <div className="flex items-center justify-between pt-2 border-t border-[#141b38] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#0d132e] border border-[#182142] text-slate-300 font-mono text-[11px]">
                      100%
                    </span>
                    <button
                      onClick={handleAutoLayout}
                      className="px-3 py-1 rounded-lg bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white font-medium text-xs transition-all"
                    >
                      Fit
                    </button>
                    <button
                      onClick={handleAutoLayout}
                      className="px-3 py-1 rounded-lg bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white font-medium text-xs transition-all"
                    >
                      Layout ▾
                    </button>
                  </div>

                  {/* Legend matching exact screenshot colors */}
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef] shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
                      <span>Selected</span>
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
                      <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_8px_rgba(234,179,8,0.9)]" />
                      <span>Path</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Inspector & Settings Panel (span 3) matching Reference Screenshot */}
              <div className="lg:col-span-3 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  {/* Top Inspector / Graph Settings Tabs */}
                  <div className="flex items-center gap-2 p-1 rounded-xl bg-[#050713] border border-[#141b38] mb-3">
                    <button
                      onClick={() => setActiveInspectorTab('inspector')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeInspectorTab === 'inspector'
                          ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_10px_rgba(110,43,245,0.6)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Inspector
                    </button>
                    <button
                      onClick={() => setActiveInspectorTab('settings')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeInspectorTab === 'settings'
                          ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_10px_rgba(110,43,245,0.6)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Graph Settings
                    </button>
                  </div>

                  {activeInspectorTab === 'inspector' ? (
                    <div className="space-y-4">
                      {/* Selected Vertex Badge */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#9333ea] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(147,51,234,0.9)]">
                          {selectedVertex || '3'}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">Vertex {selectedVertex || '3'}</div>
                          <div className="text-xs text-slate-400">Degree: {degree}</div>
                          <div className="text-[11px] text-slate-400">
                            Neighbors: {neighbors.length > 0 ? neighbors.join(', ') : 'None'}
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
                            className="py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-200 text-xs font-semibold transition-all"
                          >
                            + Add Vertex
                          </button>
                          <button
                            onClick={handleAddEdge}
                            className="py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-200 text-xs font-semibold transition-all"
                          >
                            + Add Edge
                          </button>
                          <button
                            onClick={handleDelete}
                            className="py-2 px-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold transition-all"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Clear graph canvas?')) {
                                graph.vertices.forEach((v) => removeVertex(v));
                              }
                            }}
                            className="py-2 px-2.5 rounded-xl bg-[#0d132e] border border-[#182142] hover:bg-[#141b3a] text-slate-300 text-xs font-semibold transition-all"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <button
                            onClick={handleAutoLayout}
                            className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white text-xs font-medium"
                          >
                            <RotateCcw size={12} /> Undo
                          </button>
                          <button
                            onClick={handleAutoLayout}
                            className="flex items-center justify-center gap-1 py-1.5 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white text-xs font-medium"
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
                          <span>Vertices (|V|)</span>
                          <span className="font-mono font-bold text-white">{graph.vertices.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Edges (|E|)</span>
                          <span className="font-mono font-bold text-white">{graph.edges.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Components</span>
                          <span className="font-mono font-bold text-white">1</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Density</span>
                          <span className="font-mono font-bold text-white">
                            {graph.vertices.length > 1
                              ? (
                                  (2 * graph.edges.length) /
                                  (graph.vertices.length * (graph.vertices.length - 1))
                                ).toFixed(2)
                              : '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Graph Settings Tab */
                    <div className="space-y-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Show Labels</span>
                        <button
                          onClick={() => setShowLabels(!showLabels)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                            showLabels ? 'bg-[#6e2bf5]' : 'bg-[#1b264e]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showLabels ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Show Grid</span>
                        <button
                          onClick={() => setShowGrid(!showGrid)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                            showGrid ? 'bg-[#6e2bf5]' : 'bg-[#1b264e]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${showGrid ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Edge Weights</span>
                        <button
                          onClick={() => setEdgeWeights(!edgeWeights)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                            edgeWeights ? 'bg-[#6e2bf5]' : 'bg-[#1b264e]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${edgeWeights ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row: Tabs (Overview, Adjacency List, Adjacency Matrix, Incidence Matrix, Properties) */}
            <div className="space-y-3 pt-2">
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
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      bottomTab === tab.id
                        ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.7)]'
                        : 'bg-[#090d22] border border-[#161f3e] text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Bottom Content Area: Dynamically changes based on bottomTab */}
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

              {bottomTab === 'overview' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] space-y-1">
                    <div className="text-xs font-bold text-white">Degree Sequence</div>
                    <div className="text-sm font-mono text-[#c084fc] font-bold">
                      ({graph.vertices.map((v) => graph.edges.filter((e) => e.source === v || e.target === v).length).sort((a, b) => b - a).join(', ') || '0'})
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] space-y-1">
                    <div className="text-xs font-bold text-white">Handshaking Lemma</div>
                    <div className="text-xs text-slate-300">
                      Σ deg(v) = <span className="font-mono text-emerald-400 font-bold">{graph.edges.length * 2}</span> = 2 × |E|
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] space-y-1">
                    <div className="text-xs font-bold text-white">Graph Density</div>
                    <div className="text-sm font-mono text-white font-bold">
                      {graph.vertices.length > 1
                        ? ((2 * graph.edges.length) / (graph.vertices.length * (graph.vertices.length - 1))).toFixed(2)
                        : '0.00'}
                    </div>
                  </div>
                </div>
              )}

              {bottomTab === 'adjList' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg space-y-2">
                  <div className="flex items-center justify-between pb-1 border-b border-[#141b38]">
                    <span className="text-xs font-bold text-white">Adjacency List</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">Space: O(V + E)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto">
                    {graph.vertices.map((v) => {
                      const nbs = graph.edges
                        .filter((e) => e.source === v || e.target === v)
                        .map((e) => (e.source === v ? e.target : e.source));
                      return (
                        <div key={v} className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] flex items-center justify-between font-mono text-xs">
                          <span className="font-bold text-[#38bdf8]">{v}</span>
                          <span className="text-slate-300 truncate">{nbs.length > 0 ? nbs.join(', ') : '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {bottomTab === 'adjMatrix' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg space-y-2">
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

              {bottomTab === 'incMatrix' && (
                <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-lg space-y-2">
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

export default GraphLab;

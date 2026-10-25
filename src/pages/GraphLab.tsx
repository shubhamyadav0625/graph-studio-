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
import type { AlgorithmHighlightState } from '../types/graph';
import {
  Plus,
  Link as LinkIcon,
  MousePointer,
  Trash2,
  Sparkles,
  Info,
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
  const [activeTool, setActiveTool] = useState<'move' | 'link' | 'select' | 'delete'>('select');
  const [highlightState, setHighlightState] = useState<AlgorithmHighlightState | null>(null);

  // Inspector & Graph Settings state matching Screen 2
  const [isDirected, setIsDirected] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [edgeWeights, setEdgeWeights] = useState(false);

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
    setActiveTool('select');
    addVertex();
  };

  const handleAddEdge = () => {
    setActiveTool('link');
    if (selected.length !== 2) {
      alert('Select exactly two vertices on canvas to establish an edge.');
      return;
    }
    addEdge(selected[0], selected[1]);
    clearSelection();
  };

  const handleDelete = () => {
    setActiveTool('delete');
    if (selected.length === 0) return;
    selected.forEach((id) => removeVertex(id));
    clearSelection();
  };

  const handleAutoLayout = () => {
    (window as any).graphCanvasAutoLayout?.();
  };

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-[#070b18] text-slate-100 select-none">
      {/* 1. Left Nav Sidebar (matches all 9 reference screens) */}
      <NavSidebar activeView={activeView} onSelectView={setActiveView} />

      {/* 2. Main Content Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* VIEW 1: HOME or DASHBOARD matching Screen 1 */}
        {(activeView === 'home' || activeView === 'dashboard') && (
          <DashboardView onNavigate={setActiveView} />
        )}

        {/* VIEW 2: GRAPH EDITOR matching Screen 2 */}
        {activeView === 'editor' && (
          <div className="space-y-3 max-w-6xl mx-auto">
            {/* Top Editor Header matching Screen 2 */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Graph Editor</span>
                </div>
                {/* Undirected / Weighted toggle */}
                <div className="flex items-center p-0.5 rounded-lg bg-[#080d1e] border border-[#1b2648] text-[11px] font-semibold">
                  <button
                    onClick={() => setIsDirected(false)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      !isDirected ? 'bg-[#5b3bf6] text-white shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Undirected
                  </button>
                  <button
                    onClick={() => setIsDirected(true)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      isDirected ? 'bg-[#5b3bf6] text-white shadow-xs' : 'text-slate-400'
                    }`}
                  >
                    Weighted
                  </button>
                </div>
              </div>

              {/* Status Pills: V=6, E=8, Components: 1 */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-[#080d1e] border border-[#1b2648] text-slate-300">
                  |V| = {graph.vertices.length}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#080d1e] border border-[#1b2648] text-slate-300">
                  |E| = {graph.edges.length}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#080d1e] border border-[#1b2648] text-[#38bdf8] font-semibold">
                  Components: 1
                </span>
              </div>
            </div>

            {/* Central Editor Layout matching Screen 2: Left Toolbar + Canvas + Right Inspector */}
            <div className="grid gap-3 lg:grid-cols-12 items-start">
              {/* Left Action Toolbar (span 1) matching Screen 2 */}
              <div className="lg:col-span-1 flex lg:flex-col gap-1.5 p-1.5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl w-fit">
                <button
                  onClick={handleAddVertex}
                  className="p-2.5 rounded-xl bg-[#080d1e] border border-[#1b2648] text-slate-300 hover:text-white hover:bg-[#152044] transition-all"
                  title="Add Vertex"
                >
                  <Plus size={16} className="text-[#38bdf8]" />
                </button>

                <button
                  onClick={handleAddEdge}
                  className="p-2.5 rounded-xl bg-[#080d1e] border border-[#1b2648] text-slate-300 hover:text-white hover:bg-[#152044] transition-all"
                  title="Add Edge (Select 2 vertices)"
                >
                  <LinkIcon size={16} className="text-[#38bdf8]" />
                </button>

                <button
                  onClick={() => setActiveTool('select')}
                  className={`p-2.5 rounded-xl transition-all ${
                    activeTool === 'select'
                      ? 'bg-[#5b3bf6] text-white shadow-[0_0_12px_rgba(91,59,246,0.6)]'
                      : 'bg-[#080d1e] border border-[#1b2648] text-slate-300'
                  }`}
                  title="Select / Move"
                >
                  <MousePointer size={16} />
                </button>

                <button
                  onClick={handleDelete}
                  className="p-2.5 rounded-xl bg-[#080d1e] border border-[#1b2648] text-rose-400 hover:bg-rose-950/40 transition-all"
                  title="Delete Selected"
                >
                  <Trash2 size={16} />
                </button>

                <div className="h-px w-full bg-[#1b2648] my-1 hidden lg:block" />

                <button
                  onClick={handleAutoLayout}
                  className="p-2.5 rounded-xl bg-[#080d1e] border border-[#1b2648] text-amber-400 hover:bg-amber-950/40 transition-all"
                  title="Auto Layout"
                >
                  <Sparkles size={16} />
                </button>
              </div>

              {/* Center Canvas (span 8) */}
              <div className="lg:col-span-8 flex flex-col gap-2">
                <GraphCanvas highlightState={highlightState} />

                {/* Bottom Canvas Control Bar matching Screen 2 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#0c1228] border border-[#172140] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAutoLayout}
                      className="px-2.5 py-1 rounded-lg bg-[#080d1e] border border-[#1b2648] text-slate-300 hover:text-white"
                    >
                      Fit
                    </button>
                    <button
                      onClick={handleAutoLayout}
                      className="px-2.5 py-1 rounded-lg bg-[#080d1e] border border-[#1b2648] text-slate-300 hover:text-white"
                    >
                      Layout ▾
                    </button>
                  </div>

                  {/* Legend matching Screen 2 */}
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                      <span>Selected</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                      <span>Visited</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                      <span>Step Path</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Inspector & Settings Panel (span 3) matching Screen 2 */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                {/* Inspector Card matching Screen 2 */}
                <div className="p-3.5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white tracking-wide">Inspector</h3>
                    <Info size={14} className="text-slate-500" />
                  </div>

                  {selectedVertex && (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#080d1e] border border-[#182348]">
                      <div className="w-10 h-10 rounded-full bg-[#c084fc] flex items-center justify-center font-bold text-white text-sm shadow-[0_0_12px_rgba(192,132,252,0.8)]">
                        {selectedVertex}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold text-white">Vertex: {selectedVertex}</div>
                        <div className="text-[11px] text-slate-400">Degree: {degree}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          Neighbors: {neighbors.length > 0 ? neighbors.join(', ') : 'None'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Graph Settings Toggle Switches matching Screen 2 */}
                  <div className="pt-2 border-t border-[#172140] space-y-2">
                    <h4 className="text-[11px] font-semibold text-slate-400">Graph Settings</h4>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Directed</span>
                        <button
                          onClick={() => setIsDirected(!isDirected)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                            isDirected ? 'bg-[#5b3bf6]' : 'bg-[#1b264e]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isDirected ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Show Labels</span>
                        <button
                          onClick={() => setShowLabels(!showLabels)}
                          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
                            showLabels ? 'bg-[#5b3bf6]' : 'bg-[#1b264e]'
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
                            showGrid ? 'bg-[#5b3bf6]' : 'bg-[#1b264e]'
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
                            edgeWeights ? 'bg-[#5b3bf6]' : 'bg-[#1b264e]'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform ${edgeWeights ? 'translate-x-3' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: GRAPH ALGORITHMS matching Screen 3 */}
        {activeView === 'algorithms' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Graph Algorithms</h1>
              <p className="text-xs text-slate-400 mt-0.5">Visualize and understand graph algorithms step-by-step</p>
            </div>
            <AlgorithmsView onHighlightChange={setHighlightState} />
          </div>
        )}

        {/* VIEW 4: GRAPH REPRESENTATIONS matching Screen 4 */}
        {activeView === 'representations' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <RepresentationsView />
          </div>
        )}

        {/* VIEW 5: GRAPH PROPERTIES & ANALYSIS matching Screen 5 */}
        {activeView === 'properties' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <AnalysisPanel />
          </div>
        )}

        {/* VIEW 6: PRESET GRAPHS LIBRARY matching Screen 6 */}
        {activeView === 'presets' && (
          <PresetLibraryView onLoadPreset={() => setActiveView('editor')} />
        )}

        {/* VIEW 7: THEORY & NOTES matching Screen 7 */}
        {activeView === 'theory' && (
          <Theory />
        )}
      </div>
    </div>
  );
};

export default GraphLab;

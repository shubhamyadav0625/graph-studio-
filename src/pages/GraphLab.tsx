// src/pages/GraphLab.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGraph } from '../context';
import { examples } from '../data/exampleGraphs';
import type { ExampleKey } from '../data/exampleGraphs';
import { verifyTree } from '../algorithms/verifyTree';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import GraphCanvas from '../components/GraphCanvas';
import GraphInfoPanel from '../components/GraphInfoPanel';
import RepresentationsView from '../components/RepresentationsView';
import AnalysisPanel from '../components/AnalysisPanel';
import AlgorithmsView from '../components/AlgorithmsView';
import {
  Plus,
  Share2,
  Trash2,
  RotateCcw,
  RotateCw,
  ChevronDown,
  Info,
} from 'lucide-react';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'representations', label: 'Representations' },
  { id: 'properties', label: 'Properties' },
  { id: 'algorithms', label: 'Algorithms' },
];

const GraphLab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [exampleDropdownOpen, setExampleDropdownOpen] = useState(false);

  const {
    graph,
    addVertex,
    addEdge,
    removeVertex,
    clearGraph,
    undo,
    redo,
    canUndo,
    canRedo,
    selected,
    clearSelection,
    setGraph,
  } = useGraph();

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  const handleAddVertex = () => {
    addVertex();
  };

  const handleAddEdge = () => {
    if (selected.length !== 2) {
      alert('Select exactly two vertices to add an edge.');
      return;
    }
    addEdge(selected[0], selected[1]);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    selected.forEach((id) => removeVertex(id));
    clearSelection();
  };

  const handleLoadExample = (key: ExampleKey) => {
    if (!examples[key]) return;
    setGraph({ ...examples[key] });
    clearSelection();
    setExampleDropdownOpen(false);
    setTimeout(() => {
      (window as any).graphCanvasAutoLayout?.();
    }, 40);
  };

  const result = verifyTree(graph);
  const cycle = detectCycle(graph);
  const components = connectedComponents(graph);
  const vCount = graph.vertices.length;
  const eCount = graph.edges.length;
  const isConnected = components.length <= 1 && vCount > 0;
  const hasCycle = cycle.length > 0;
  const isTree = result.isTree;

  const overviewText = `This is an undirected graph with ${vCount} vertices and ${eCount} edges. The graph is ${
    isConnected ? 'connected' : 'disconnected'
  } and ${hasCycle ? 'contains cycles' : 'contains no cycles'}, so it is ${
    isTree ? 'a valid tree' : 'not a tree'
  }.`;

  return (
    <div className="flex flex-col gap-4 select-none pb-6">
      {/* Top Header Row (matches Screen 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Graph Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, edit and analyze mathematical graphs
          </p>
        </div>

        {/* Right Type selector, Example loader & Clear Graph */}
        <div className="flex flex-wrap items-center gap-2 relative">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141a30] border border-slate-200 dark:border-[#212b4e] text-xs font-medium text-slate-700 dark:text-slate-200 shadow-xs">
            <span>Undirected Graph</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setExampleDropdownOpen(!exampleDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all cursor-pointer"
            >
              <span>Load Example</span>
              <ChevronDown size={14} />
            </button>

            {exampleDropdownOpen && (
              <div className="absolute right-0 top-10 w-48 rounded-xl bg-white dark:bg-[#12182e] border border-slate-200 dark:border-[#1e2646] shadow-2xl py-1.5 z-40">
                {Object.keys(examples).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleLoadExample(key as ExampleKey)}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-[#1b2344] hover:text-indigo-600 dark:hover:text-white transition-colors"
                  >
                    {key}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={clearGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-[#371924] hover:bg-rose-100 dark:hover:bg-[#481f2f] border border-rose-200 dark:border-[#6b2539] text-rose-600 dark:text-rose-300 text-xs font-medium transition-all"
            title="Clear current graph"
          >
            <Trash2 size={13} />
            <span>Clear Graph</span>
          </button>
        </div>
      </div>

      {/* Toolbar Row */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleAddVertex}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-[0_0_12px_rgba(99,102,241,0.35)] transition-all"
        >
          <Plus size={15} />
          <span>Add Vertex</span>
        </button>

        <button
          onClick={handleAddEdge}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161d36] hover:bg-slate-50 dark:hover:bg-[#1e274a] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-200 text-xs font-medium shadow-xs transition-all"
          title="Select 2 vertices and click Add Edge"
        >
          <Share2 size={14} />
          <span>Add Edge</span>
        </button>

        <button
          onClick={handleDeleteSelected}
          disabled={selected.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-[#371924] hover:bg-rose-100 dark:hover:bg-[#481f2f] border border-rose-200 dark:border-[#6b2539] text-rose-600 dark:text-rose-300 disabled:opacity-40 text-xs font-medium transition-all"
        >
          <Trash2 size={14} />
          <span>Delete Selected</span>
        </button>

        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161d36] hover:bg-slate-50 dark:hover:bg-[#1e274a] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-200 disabled:opacity-40 text-xs font-medium shadow-xs transition-all"
        >
          <RotateCcw size={14} />
          <span>Undo</span>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#161d36] hover:bg-slate-50 dark:hover:bg-[#1e274a] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-200 disabled:opacity-40 text-xs font-medium shadow-xs transition-all"
        >
          <RotateCw size={14} />
          <span>Redo</span>
        </button>
      </div>

      {/* Main Graph Canvas & Info Panel Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="flex-1 w-full min-w-0">
          <GraphCanvas />
        </div>
        <GraphInfoPanel />
      </div>

      {/* Sub-Tabs: Overview, Representations, Properties, Algorithms */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] w-fit mt-2 shadow-xs">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === t.id
                ? 'bg-indigo-600 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Bottom Sub-Tab Content */}
      <div className="mt-1">
        {activeTab === 'overview' && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] shadow-md dark:shadow-xl space-y-1.5 transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Info size={15} className="text-indigo-600 dark:text-indigo-400" />
              Graph Overview
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{overviewText}</p>
          </div>
        )}

        {activeTab === 'representations' && <RepresentationsView />}

        {activeTab === 'properties' && <AnalysisPanel />}

        {activeTab === 'algorithms' && <AlgorithmsView />}
      </div>
    </div>
  );
};

export default GraphLab;

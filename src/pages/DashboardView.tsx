// src/pages/DashboardView.tsx
import React from 'react';
import type { ActiveNavView } from '../components/NavSidebar';
import {
  Play,
  BookOpen,
  Check,
  Share2,
  FileCode,
  Grid,
  Layers,
  Clock,
  Plus,
  Upload,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useGraph } from '../context';

interface DashboardViewProps {
  onNavigate: (view: ActiveNavView) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { addVertex, removeVertex, graph } = useGraph();

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans">
      {/* 1. Large Hero Section matching Image 3 (media_1792938565154_1490b7c2.png) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#090b20] via-[#101438] to-[#1c0e3f] border border-[#232454] p-6 lg:p-8 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Text Content (span 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1a48] border border-[#302b70] text-xs font-semibold text-[#c084fc]">
              <span>Discrete Mathematics</span>
              <span className="w-1 h-1 rounded-full bg-[#c084fc]" />
              <span>Unit 6</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Graph Studio
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Create, visualize, analyze and learn graph theory with interactive tools and step-by-step algorithm visualizations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('editor')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(110,43,245,0.7)] transition-all"
              >
                <Play size={15} fill="currentColor" />
                <span>Open Graph Editor</span>
              </button>

              <button
                onClick={() => onNavigate('theory')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111636] hover:bg-[#18204c] border border-[#222c5e] text-slate-200 text-xs sm:text-sm font-semibold transition-all"
              >
                <BookOpen size={15} />
                <span>Start Learning</span>
              </button>
            </div>
          </div>

          {/* Center Interactive Graph Illustration (span 4) */}
          <div className="lg:col-span-4 flex items-center justify-center py-2">
            <div className="relative w-[240px] h-[210px]">
              <svg width="240" height="210" viewBox="0 0 240 210" className="overflow-visible">
                {/* Edges */}
                <line x1="120" y1="30" x2="50" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="120" y1="30" x2="190" y2="75" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="50" y1="75" x2="70" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="190" y1="75" x2="170" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="70" y1="175" x2="170" y2="175" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="120" y1="30" x2="120" y2="115" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="50" y1="75" x2="120" y2="115" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="190" y1="75" x2="120" y2="115" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Nodes with glowing dropshadows */}
                <circle cx="120" cy="30" r="16" fill="#9333ea" className="drop-shadow-[0_0_15px_rgba(147,51,234,1)]" />
                <text x="120" y="35" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">1</text>

                <circle cx="50" cy="75" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
                <text x="50" y="80" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">2</text>

                <circle cx="190" cy="75" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
                <text x="190" y="80" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">3</text>

                <circle cx="120" cy="115" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
                <text x="120" y="120" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">6</text>

                <circle cx="70" cy="175" r="15" fill="#9333ea" className="drop-shadow-[0_0_15px_rgba(147,51,234,1)]" />
                <text x="70" y="180" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">4</text>

                <circle cx="170" cy="175" r="15" fill="#0284c7" className="drop-shadow-[0_0_12px_rgba(2,132,199,0.9)]" />
                <text x="170" y="180" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">5</text>
              </svg>
            </div>
          </div>

          {/* Right Feature Checklist (span 3) */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-[#0b0e26]/80 border border-[#1b2348] backdrop-blur-md space-y-3">
            {[
              'Interactive Visualization',
              'Multiple Algorithms',
              'Graph Analysis & Properties',
              'Learn with Examples',
            ].map((feature, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-xs text-slate-200 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1e2350] border border-[#2b3370] flex items-center justify-center text-cyan-400">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </div>
                <Check size={14} className="text-cyan-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Horizontal Stats Row matching Image 3 (media_1792938565154_1490b7c2.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#6e2bf5]/20 text-[#c084fc] flex items-center justify-center">
            <Share2 size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-white">6+</div>
            <div className="text-[11px] text-slate-400 font-medium">Algorithms</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center">
            <Grid size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-white">3</div>
            <div className="text-[11px] text-slate-400 font-medium">Representations</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#9333ea]/20 text-[#c084fc] flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-white">15+</div>
            <div className="text-[11px] text-slate-400 font-medium">Preset Graphs</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#d946ef]/20 text-[#f472b6] flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-white">10+</div>
            <div className="text-[11px] text-slate-400 font-medium">Theory Topics</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#6e2bf5]/20 text-[#a855f7] flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-lg font-black text-white">100%</div>
            <div className="text-[11px] text-slate-400 font-medium">Interactive</div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Explore Modules (Left) + Continue Learning & Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Explore Modules Grid (span 8) */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Explore Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Card 1: Graph Editor */}
            <div
              onClick={() => onNavigate('editor')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#6e2bf5]/20 text-[#c084fc] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Share2 size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
                    Graph Editor
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Create and modify graphs with an interactive canvas
                </p>
              </div>
            </div>

            {/* Card 2: Algorithms */}
            <div
              onClick={() => onNavigate('algorithms')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileCode size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
                    Algorithms
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Run BFS, DFS, Dijkstra, Coloring and more
                </p>
              </div>
            </div>

            {/* Card 3: Representations */}
            <div
              onClick={() => onNavigate('representations')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Grid size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                    Representations
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Adjacency matrix, list and incidence matrix
                </p>
              </div>
            </div>

            {/* Card 4: Graph Properties */}
            <div
              onClick={() => onNavigate('properties')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#9333ea]/20 text-[#c084fc] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Layers size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
                    Graph Properties
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Analyze connectivity, cycles, trees and more
                </p>
              </div>
            </div>

            {/* Card 5: Preset Graphs */}
            <div
              onClick={() => onNavigate('presets')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#059669]/20 text-[#34d399] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Layers size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#34d399] transition-colors">
                    Preset Graphs
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Ready-to-use graphs for practice and demos
                </p>
              </div>
            </div>

            {/* Card 6: Theory & Notes */}
            <div
              onClick={() => onNavigate('theory')}
              className="p-3.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:border-[#6e2bf5] transition-all cursor-pointer group flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#d946ef]/20 text-[#f472b6] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white group-hover:text-[#f472b6] transition-colors">
                    Theory & Notes
                  </h3>
                  <ArrowRight size={13} className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  Concepts, theorems and solved examples
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (span 4): Continue Learning & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Continue Learning Card */}
          <div className="p-4 rounded-3xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-[#c084fc]" />
                <h3 className="text-xs font-bold text-white">Continue Learning</h3>
              </div>
              <button
                onClick={() => onNavigate('learning')}
                className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
              >
                View All
              </button>
            </div>

            {/* In-Progress Module */}
            <div className="p-3 rounded-2xl bg-[#0d132e] border border-[#182144] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#141d40] border border-[#212f60] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <line x1="8" y1="8" x2="20" y2="8" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="8" y1="8" x2="14" y2="20" stroke="#38bdf8" strokeWidth="2" />
                    <line x1="20" y1="8" x2="14" y2="20" stroke="#38bdf8" strokeWidth="2" />
                    <circle cx="8" cy="8" r="3" fill="#38bdf8" />
                    <circle cx="20" cy="8" r="3" fill="#38bdf8" />
                    <circle cx="14" cy="20" r="3" fill="#a855f7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">BFS Traversal</h4>
                  <div className="text-[10px] text-slate-400">Last accessed • 10 min ago</div>
                  {/* Progress bar */}
                  <div className="w-28 h-1.5 rounded-full bg-[#182144] overflow-hidden mt-1.5">
                    <div className="h-full bg-gradient-to-r from-[#6e2bf5] to-[#a855f7] w-[60%]" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-300">60%</span>
                <button
                  onClick={() => onNavigate('algorithms')}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] flex items-center justify-center text-white shadow-[0_0_10px_rgba(110,43,245,0.7)]"
                >
                  <Play size={11} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="p-4 rounded-3xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-[#a855f7]" />
              <h3 className="text-xs font-bold text-white">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  let nextNum = 1;
                  while (graph.vertices.includes(String(nextNum))) {
                    nextNum += 1;
                  }
                  addVertex(String(nextNum));
                  onNavigate('editor');
                }}
                className="p-2.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:bg-[#151c3d] text-slate-300 hover:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all"
              >
                <Plus size={15} />
                <span>New Graph</span>
              </button>

              <button
                onClick={() => onNavigate('importExport')}
                className="p-2.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:bg-[#151c3d] text-slate-300 hover:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all"
              >
                <Upload size={15} />
                <span>Import</span>
              </button>

              <button
                onClick={() => onNavigate('importExport')}
                className="p-2.5 rounded-2xl bg-[#0d132e] border border-[#182144] hover:bg-[#151c3d] text-slate-300 hover:text-white flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all"
              >
                <Download size={15} />
                <span>Export</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Clear graph?')) {
                    graph.vertices.forEach((v) => removeVertex(v));
                  }
                }}
                className="p-2.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40 text-rose-300 flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all"
              >
                <Trash2 size={15} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

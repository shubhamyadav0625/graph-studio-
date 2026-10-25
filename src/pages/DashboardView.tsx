// src/pages/DashboardView.tsx
import React, { useState } from 'react';
import type { ActiveNavView } from '../components/NavSidebar';
import {
  Play,
  Code2,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Grid,
  BookOpen,
  Zap,
  CheckCircle2,
  Network,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: ActiveNavView) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [activeAlgoSlide, setActiveAlgoSlide] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string>('4');
  void activeAlgoSlide;

  // Interactive node positions matching the circular pentagon in the reference image
  const nodes = [
    { id: '1', cx: 175, cy: 45, label: '1', color: '#9333ea', glow: 'rgba(147,51,234,0.9)' },
    { id: '2', cx: 80, cy: 110, label: '2', color: '#0284c7', glow: 'rgba(2,132,199,0.9)' },
    { id: '3', cx: 270, cy: 110, label: '3', color: '#0284c7', glow: 'rgba(2,132,199,0.9)' },
    { id: '6', cx: 175, cy: 140, label: '6', color: '#0284c7', glow: 'rgba(2,132,199,0.9)' },
    { id: '4', cx: 110, cy: 220, label: '4', color: '#a855f7', glow: 'rgba(168,85,247,1)' },
    { id: '5', cx: 240, cy: 220, label: '5', color: '#0284c7', glow: 'rgba(2,132,199,0.9)' },
  ];

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans">
      {/* 1. Large Hero Section matching the exact reference image */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#080a1c] via-[#0d1230] to-[#1a0f3c] border border-[#232352] p-6 lg:p-8 shadow-2xl">
        {/* Background glow radial overlays */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6e2bf5]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Text Content (span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16173d] border border-[#2d2a6a] text-xs font-semibold text-[#c084fc]">
              <span>Discrete Mathematics</span>
              <span className="w-1 h-1 rounded-full bg-[#c084fc]" />
              <span>Unit 6</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Master Graph Theory by Building,{' '}
              <span className="bg-gradient-to-r from-[#c084fc] via-[#e879f9] to-[#f472b6] bg-clip-text text-transparent">
                Exploring & Solving
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
              Create graphs, analyze their properties, and visualize graph algorithms step by step with an interactive and intuitive learning platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('editor')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(110,43,245,0.7)] transition-all cursor-pointer"
              >
                <span>Open Graph Editor</span>
                <Play size={13} fill="currentColor" />
              </button>

              <button
                onClick={() => onNavigate('algorithms')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0c102a]/80 hover:bg-[#141b44] border border-[#242954] text-slate-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                <Code2 size={15} className="text-[#c084fc]" />
                <span>Explore Algorithms</span>
              </button>
            </div>
          </div>

          {/* Center Interactive Graph Illustration (span 4) */}
          <div className="lg:col-span-4 flex items-center justify-center py-2 relative">
            <div className="relative w-[340px] h-[270px] flex items-center justify-center">
              {/* Outer decorative halo orbit rings */}
              <div className="absolute inset-2 rounded-full border border-[#2b2568]/40 animate-pulse pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-[#6e2bf5]/20 pointer-events-none" />

              <svg width="340" height="260" viewBox="0 0 350 270" className="overflow-visible select-none">
                {/* Graph Edges matching reference Image */}
                <line x1="175" y1="45" x2="80" y2="110" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="175" y1="45" x2="270" y2="110" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="80" y1="110" x2="110" y2="220" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="270" y1="110" x2="240" y2="220" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="110" y1="220" x2="240" y2="220" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="175" y1="45" x2="175" y2="140" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="80" y1="110" x2="175" y2="140" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="270" y1="110" x2="175" y2="140" stroke="#38bdf8" strokeWidth="2.5" />

                {/* Nodes with interactive click and glowing rings */}
                {nodes.map((node) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className="cursor-pointer transition-transform duration-200 hover:scale-110"
                    >
                      {/* Active glowing ring on Node 4 / Selected Node */}
                      {isSelected && (
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r="28"
                          fill="none"
                          stroke="#c084fc"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                      )}
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="18"
                        fill={node.color}
                        style={{ filter: `drop-shadow(0px 0px 10px ${node.glow})` }}
                      />
                      <text
                        x={node.cx}
                        y={node.cy + 5}
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hand pointer cursor icon on node 4 */}
              <div className="absolute bottom-6 left-28 pointer-events-none transform translate-x-3 -translate-y-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11V6a2 2 0 114 0v5M13 10V8a2 2 0 114 0v4M17 11a2 2 0 114 0v3.5a7.5 7.5 0 01-15 0V11a2 2 0 114 0"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#ffffff"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Card: Try Interactive Demo (span 3) */}
          <div className="lg:col-span-3 p-4 rounded-2xl bg-[#0a0d24]/90 border border-[#20254c] shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-[#9333ea]/30 flex items-center justify-center text-[#c084fc]">
                <Play size={10} fill="currentColor" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-wide">
                Try Interactive Demo
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#182142] border border-[#2b3564] flex items-center justify-center text-[10px] font-bold text-slate-200">
                  1
                </span>
                <span>Drag nodes to move</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#182142] border border-[#2b3564] flex items-center justify-center text-[10px] font-bold text-slate-200">
                  2
                </span>
                <span>Click a node to select</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#182142] border border-[#2b3564] flex items-center justify-center text-[10px] font-bold text-slate-200">
                  3
                </span>
                <span>Use controls to run BFS/DFS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Five Statistics Metric Cards matching Reference Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#2563eb]/20 text-[#38bdf8] flex items-center justify-center">
            <Network size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">8</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Algorithms</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/20 text-[#38bdf8] flex items-center justify-center">
            <Grid size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">3</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Representations</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">15+</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Preset Graphs</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#e879f9]/20 text-[#f472b6] flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">10+</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Theory Topics</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#9333ea]/20 text-[#c084fc] flex items-center justify-center">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">100%</div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Interactive Learning</div>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Featured Algorithms & Interactive Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Featured Algorithms (span 7) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-[#6e2bf5]/20 text-[#c084fc]">
                <Code2 size={15} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">Featured Algorithms</h3>
                <p className="text-[10px] text-slate-400">Run and visualize key graph algorithms step by step</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveAlgoSlide((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded-lg bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setActiveAlgoSlide((prev) => Math.min(2, prev + 1))}
                className="p-1 rounded-lg bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Algorithm Cards Row: BFS, DFS, Dijkstra */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div
              onClick={() => onNavigate('algorithms')}
              className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] hover:border-[#6e2bf5] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0284c7]/30 text-[#38bdf8] flex items-center justify-center font-bold text-xs">
                  <Network size={14} />
                </div>
                <span className="font-bold text-xs text-white">BFS</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#6e2bf5] text-white flex items-center justify-center shadow-[0_0_8px_rgba(110,43,245,0.8)]">
                <Play size={10} fill="currentColor" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('algorithms')}
              className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] hover:border-[#6e2bf5] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#9333ea]/30 text-[#c084fc] flex items-center justify-center font-bold text-xs">
                  <Sparkles size={14} />
                </div>
                <span className="font-bold text-xs text-white">DFS</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#6e2bf5] text-white flex items-center justify-center shadow-[0_0_8px_rgba(110,43,245,0.8)]">
                <Play size={10} fill="currentColor" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('algorithms')}
              className="p-3 rounded-xl bg-[#0d132e] border border-[#182142] hover:border-[#6e2bf5] transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2563eb]/30 text-[#38bdf8] flex items-center justify-center font-bold text-xs">
                  <BookOpen size={14} />
                </div>
                <span className="font-bold text-xs text-white">Dijkstra</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#6e2bf5] text-white flex items-center justify-center shadow-[0_0_8px_rgba(110,43,245,0.8)]">
                <Play size={10} fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <span className="w-4 h-1 rounded-full bg-[#6e2bf5]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#182142]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#182142]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#182142]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#182142]" />
          </div>
        </div>

        {/* Interactive Playground (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#a855f7]/20 text-[#c084fc]">
              <Gamepad2 size={15} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">Interactive Playground</h3>
              <p className="text-[10px] text-slate-400">Try a ready graph, run an algorithm, and see it in action!</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Small graph preview icon */}
            <div className="w-24 h-16 rounded-xl bg-[#070a1a] border border-[#161f3e] flex items-center justify-center p-1">
              <svg width="80" height="50" viewBox="0 0 80 50">
                <line x1="40" y1="10" x2="20" y2="25" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="40" y1="10" x2="60" y2="25" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="20" y1="25" x2="30" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="60" y1="25" x2="50" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="30" y1="42" x2="50" y2="42" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="40" cy="10" r="5" fill="#9333ea" />
                <circle cx="20" cy="25" r="4" fill="#0284c7" />
                <circle cx="60" cy="25" r="4" fill="#0284c7" />
                <circle cx="30" cy="42" r="4" fill="#10b981" />
                <circle cx="50" cy="42" r="4" fill="#10b981" />
              </svg>
            </div>

            <button
              onClick={() => onNavigate('editor')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs font-bold shadow-[0_0_15px_rgba(110,43,245,0.7)] cursor-pointer"
            >
              <span>Try Now</span>
              <Play size={12} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Graph Theory Topics (Unit 6) & Your Learning Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Graph Theory Topics (Unit 6) (span 7) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-[#6e2bf5]/20 text-[#c084fc]">
              <BookOpen size={15} />
            </div>
            <h3 className="text-xs font-bold text-white tracking-wide">Graph Theory Topics (Unit 6)</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'graphs', label: 'Graphs' },
              { id: 'matrices', label: 'Matrices' },
              { id: 'euler', label: 'Euler & Hamiltonian' },
              { id: 'trees', label: 'Trees' },
              { id: 'bipartite', label: 'Bipartite Graphs' },
              { id: 'planar', label: 'Planar Graphs' },
              { id: 'coloring', label: 'Graph Coloring' },
              { id: 'matching', label: 'Matching' },
            ].map((topic) => (
              <button
                key={topic.id}
                onClick={() => onNavigate('theory')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d132e] hover:bg-[#151c42] border border-[#182142] text-xs font-semibold text-slate-200 transition-colors"
              >
                <span>{topic.label}</span>
                <CheckCircle2 size={13} className="text-emerald-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Your Learning Journey (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center justify-between">
          <div className="space-y-3 flex-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[#c084fc] font-bold text-xs">📊</span>
              <h3 className="text-xs font-bold text-white tracking-wide">Your Learning Journey</h3>
            </div>

            {/* Stepper Progression: Basics -> Representations -> Algorithms -> Properties -> Applications */}
            <div className="flex items-center justify-between relative pt-1">
              {[
                { name: 'Basics', done: true },
                { name: 'Representations', done: true },
                { name: 'Algorithms', done: true },
                { name: 'Properties', active: true },
                { name: 'Applications', pending: true },
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 z-10">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.done
                        ? 'bg-[#0284c7] text-white shadow-[0_0_8px_rgba(2,132,199,0.8)]'
                        : step.active
                        ? 'bg-gradient-to-r from-[#6e2bf5] to-[#a855f7] text-white shadow-[0_0_10px_rgba(110,43,245,0.9)] ring-2 ring-[#c084fc]'
                        : 'bg-[#182142] text-slate-500'
                    }`}
                  >
                    {step.done ? (
                      '✓'
                    ) : step.active ? (
                      <Play size={8} fill="currentColor" />
                    ) : (
                      '○'
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium">{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut percentage ring: 80% Completed */}
          <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#141b38" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#06b6d4"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset="32.6"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center leading-tight">
              <span className="text-xs font-black text-white block">80%</span>
              <span className="text-[8px] text-slate-400 block -mt-0.5">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

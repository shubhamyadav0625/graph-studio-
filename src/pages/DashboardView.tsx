// src/pages/DashboardView.tsx
import React from 'react';
import { Share2, FileCode, AlignLeft, ShieldCheck, Sparkles } from 'lucide-react';
import type { ActiveNavView } from '../components/NavSidebar';

interface DashboardViewProps {
  onNavigate: (view: ActiveNavView) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {

  return (
    <div className="space-y-4 max-w-6xl mx-auto select-none">
      {/* Hero Welcome Banner matching Screen 1 in reference image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0c1430] via-[#101a40] to-[#1a133f] border border-[#1a2550] p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-lg">
            <div className="text-[11px] font-semibold text-slate-400 tracking-wider">
              Welcome to
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Graph Studio
            </h1>
            <p className="text-sm font-medium text-slate-300">
              Interactive Graph Theory Visualization
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('editor')}
                className="px-4 py-2 rounded-xl bg-[#5b3bf6] hover:bg-[#6c4ef7] text-white text-xs font-semibold shadow-[0_0_15px_rgba(91,59,246,0.6)] transition-all hover:scale-105"
              >
                Create New Graph
              </button>
              <button
                onClick={() => onNavigate('algorithms')}
                className="px-4 py-2 rounded-xl bg-[#141d3e] hover:bg-[#1b2650] border border-[#212f5e] text-slate-200 text-xs font-semibold transition-all"
              >
                Explore Algorithms
              </button>
            </div>
          </div>

          {/* Right Floating Node Graphic matching Screen 1 */}
          <div className="w-56 h-36 flex items-center justify-center">
            <svg width="220" height="140" className="overflow-visible">
              <line x1="40" y1="35" x2="110" y2="25" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="40" y1="35" x2="30" y2="85" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="110" y1="25" x2="180" y2="40" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="110" y1="25" x2="120" y2="80" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="30" y1="85" x2="80" y2="110" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="80" y1="110" x2="160" y2="110" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="120" y1="80" x2="160" y2="110" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
              <line x1="180" y1="40" x2="160" y2="110" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />

              <circle cx="110" cy="25" r="14" fill="#a855f7" stroke="#c084fc" strokeWidth="2.5" />
              <text x="110" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">0</text>

              <circle cx="40" cy="35" r="13" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
              <text x="40" y="39" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">1</text>

              <circle cx="180" cy="40" r="13" fill="#9333ea" stroke="#d8b4fe" strokeWidth="2" />
              <text x="180" y="44" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">2</text>

              <circle cx="30" cy="85" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="30" y="89" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">3</text>

              <circle cx="120" cy="80" r="13" fill="#6366f1" stroke="#818cf8" strokeWidth="2" />
              <text x="120" y="84" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">4</text>

              <circle cx="160" cy="110" r="13" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
              <text x="160" y="114" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">5</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 4 Feature Action Cards matching Screen 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('editor')}
          className="p-4 rounded-2xl bg-[#0a1024] border border-[#17213d] hover:border-[#5b3bf6] transition-all text-left group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-[#3b82f6]/20 text-[#38bdf8] flex items-center justify-center mb-3">
            <Share2 size={18} />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-[#38bdf8] transition-colors">
            Graph Editor
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-tight">
            Create and edit interactive nodes and edges
          </div>
        </button>

        <button
          onClick={() => onNavigate('algorithms')}
          className="p-4 rounded-2xl bg-[#0a1024] border border-[#17213d] hover:border-[#5b3bf6] transition-all text-left group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-[#a855f7]/20 text-[#c084fc] flex items-center justify-center mb-3">
            <FileCode size={18} />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-[#c084fc] transition-colors">
            Algorithms
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-tight">
            Step-by-step traversal, paths, and coloring
          </div>
        </button>

        <button
          onClick={() => onNavigate('representations')}
          className="p-4 rounded-2xl bg-[#0a1024] border border-[#17213d] hover:border-[#5b3bf6] transition-all text-left group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-[#10b981]/20 text-[#34d399] flex items-center justify-center mb-3">
            <AlignLeft size={18} />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-[#34d399] transition-colors">
            Representations
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-tight">
            Adjacency and incidence matrix views
          </div>
        </button>

        <button
          onClick={() => onNavigate('properties')}
          className="p-4 rounded-2xl bg-[#0a1024] border border-[#17213d] hover:border-[#5b3bf6] transition-all text-left group shadow-lg"
        >
          <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/20 text-[#fbbf24] flex items-center justify-center mb-3">
            <ShieldCheck size={18} />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-[#fbbf24] transition-colors">
            Properties
          </div>
          <div className="text-[10px] text-slate-400 mt-1 leading-tight">
            Analyze degrees, cycles, and connectivity
          </div>
        </button>
      </div>

      {/* 4 Stats Cards matching Screen 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#080d1e] border border-[#151f3b] text-center shadow-md">
          <div className="text-2xl font-extrabold text-white">6+</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Algorithms</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1e] border border-[#151f3b] text-center shadow-md">
          <div className="text-2xl font-extrabold text-white">3</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Representations</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1e] border border-[#151f3b] text-center shadow-md">
          <div className="text-2xl font-extrabold text-white">15+</div>
          <div className="text-[11px] font-medium text-slate-400 mt-0.5">Preset Graphs</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#080d1e] border border-[#151f3b] text-center shadow-md">
          <div className="flex items-center justify-center w-6 h-6 mx-auto mb-1 rounded-full bg-[#5b3bf6]/20 text-[#a855f7]">
            <Sparkles size={14} />
          </div>
          <div className="text-xs font-bold text-white">Unit 6 Coverage</div>
          <div className="text-[10px] text-slate-400">Discrete Mathematics</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;

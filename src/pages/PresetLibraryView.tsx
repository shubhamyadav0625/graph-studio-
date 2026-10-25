// src/pages/PresetLibraryView.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import { examples, type ExampleKey } from '../data/exampleGraphs';
import { Eye, Play, Layers } from 'lucide-react';

interface PresetCardData {
  key: ExampleKey;
  title: string;
  badge: string;
  badgeColor: string;
  vText: string;
  desc: string;
  renderGraphic: () => React.ReactNode;
  category: 'All' | 'Basic' | 'Trees' | 'Cycles' | 'Bipartite' | 'Planar' | 'Special';
}

const CATEGORIES = ['All', 'Basic', 'Trees', 'Cycles', 'Bipartite', 'Planar', 'Special'] as const;

interface PresetLibraryViewProps {
  onLoadPreset?: () => void;
}

const PresetLibraryView: React.FC<PresetLibraryViewProps> = ({ onLoadPreset }) => {
  const { setGraph, clearSelection } = useGraph();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleLoad = (key: ExampleKey) => {
    if (examples[key]) {
      setGraph({ ...examples[key] });
      clearSelection();
      setTimeout(() => {
        (window as any).graphCanvasAutoLayout?.();
      }, 50);
      onLoadPreset?.();
    }
  };

  const PRESETS: PresetCardData[] = [
    {
      key: 'wheel6',
      title: 'Wheel Graph W₆',
      badge: 'Cycle',
      badgeColor: 'bg-[#a855f7]/20 text-[#c084fc] border-[#a855f7]/40',
      vText: 'V = 7, E = 12',
      desc: 'A cycle C₆ with a central vertex connected to all vertices.',
      category: 'Cycles',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          <circle cx="50" cy="45" r="7" fill="#a855f7" className="drop-shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + 32 * Math.cos(rad);
            const y = 45 + 32 * Math.sin(rad);
            const nextRad = ((deg + 60) * Math.PI) / 180;
            const nx = 50 + 32 * Math.cos(nextRad);
            const ny = 45 + 32 * Math.sin(nextRad);
            return (
              <g key={i}>
                <line x1="50" y1="45" x2={x} y2={y} stroke="#c084fc" strokeWidth="2" opacity="0.8" />
                <line x1={x} y1={y} x2={nx} y2={ny} stroke="#c084fc" strokeWidth="2" opacity="0.8" />
                <circle cx={x} cy={y} r="6" fill="#a855f7" className="drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
              </g>
            );
          })}
        </svg>
      ),
    },
    {
      key: 'cycleGraph',
      title: 'Complete Graph K₄',
      badge: 'Complete',
      badgeColor: 'bg-[#a855f7]/20 text-[#c084fc] border-[#a855f7]/40',
      vText: 'V = 4, E = 6',
      desc: 'A graph where every pair of vertices is connected.',
      category: 'Basic',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          <polygon points="25,20 75,20 75,70 25,70" fill="none" stroke="#d946ef" strokeWidth="2" />
          <line x1="25" y1="20" x2="75" y2="70" stroke="#d946ef" strokeWidth="2" />
          <line x1="75" y1="20" x2="25" y2="70" stroke="#d946ef" strokeWidth="2" />
          <circle cx="25" cy="20" r="6" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
          <circle cx="75" cy="20" r="6" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
          <circle cx="75" cy="70" r="6" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
          <circle cx="25" cy="70" r="6" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
        </svg>
      ),
    },
    {
      key: 'k33Bipartite',
      title: 'Bipartite Graph K₃,₃',
      badge: 'Bipartite',
      badgeColor: 'bg-[#0284c7]/20 text-[#38bdf8] border-[#0284c7]/40',
      vText: 'V = 6, E = 9',
      desc: 'A complete bipartite graph with partitions of size 3 and 3.',
      category: 'Bipartite',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          {[20, 45, 70].map((y1, i) =>
            [20, 45, 70].map((y2, j) => (
              <line key={`${i}-${j}`} x1="30" y1={y1} x2="70" y2={y2} stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
            ))
          )}
          {[20, 45, 70].map((y, i) => (
            <circle key={`l-${i}`} cx="30" cy={y} r="5.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
          ))}
          {[20, 45, 70].map((y, i) => (
            <circle key={`r-${i}`} cx="70" cy={y} r="5.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
          ))}
        </svg>
      ),
    },
    {
      key: 'eulerianEnvelope',
      title: 'Eulerian Graph',
      badge: 'Eulerian',
      badgeColor: 'bg-[#059669]/20 text-[#34d399] border-[#059669]/40',
      vText: 'V = 6, E = 6',
      desc: 'A connected graph with all vertices of even degree.',
      category: 'Special',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + 30 * Math.cos(rad);
            const y = 45 + 30 * Math.sin(rad);
            const nextRad = ((deg + 60) * Math.PI) / 180;
            const nx = 50 + 30 * Math.cos(nextRad);
            const ny = 45 + 30 * Math.sin(nextRad);
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={nx} y2={ny} stroke="#d946ef" strokeWidth="2.5" />
                <circle cx={x} cy={y} r="6" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
              </g>
            );
          })}
        </svg>
      ),
    },
    {
      key: 'petersen',
      title: 'Petersen Graph',
      badge: 'Special',
      badgeColor: 'bg-[#a855f7]/20 text-[#c084fc] border-[#a855f7]/40',
      vText: 'V = 10, E = 15',
      desc: 'A well-known non-planar, 3-regular graph.',
      category: 'Special',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          {/* Outer pentagon */}
          {[0, 72, 144, 216, 288].map((deg, i) => {
            const rad = ((deg - 90) * Math.PI) / 180;
            const x = 50 + 34 * Math.cos(rad);
            const y = 45 + 34 * Math.sin(rad);
            const nextRad = ((deg + 72 - 90) * Math.PI) / 180;
            const nx = 50 + 34 * Math.cos(nextRad);
            const ny = 45 + 34 * Math.sin(nextRad);
            const inRad = ((deg - 90) * Math.PI) / 180;
            const ix = 50 + 17 * Math.cos(inRad);
            const iy = 45 + 17 * Math.sin(inRad);
            const starNextRad = ((deg + 144 - 90) * Math.PI) / 180;
            const six = 50 + 17 * Math.cos(starNextRad);
            const siy = 45 + 17 * Math.sin(starNextRad);
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={nx} y2={ny} stroke="#38bdf8" strokeWidth="1.5" />
                <line x1={x} y1={y} x2={ix} y2={iy} stroke="#38bdf8" strokeWidth="1.5" />
                <line x1={ix} y1={iy} x2={six} y2={siy} stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx={x} cy={y} r="4.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
                <circle cx={ix} cy={iy} r="4" fill="#38bdf8" />
              </g>
            );
          })}
        </svg>
      ),
    },
    {
      key: 'validTree',
      title: 'Tree T₅',
      badge: 'Tree',
      badgeColor: 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]/40',
      vText: 'V = 5, E = 4',
      desc: 'A connected acyclic graph with 5 vertices.',
      category: 'Trees',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          <line x1="50" y1="20" x2="30" y2="45" stroke="#22c55e" strokeWidth="2" />
          <line x1="50" y1="20" x2="70" y2="45" stroke="#22c55e" strokeWidth="2" />
          <line x1="30" y1="45" x2="20" y2="70" stroke="#22c55e" strokeWidth="2" />
          <line x1="70" y1="45" x2="80" y2="70" stroke="#22c55e" strokeWidth="2" />
          <circle cx="50" cy="20" r="5.5" fill="#22c55e" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          <circle cx="30" cy="45" r="5.5" fill="#22c55e" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          <circle cx="70" cy="45" r="5.5" fill="#22c55e" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          <circle cx="20" cy="70" r="5.5" fill="#22c55e" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
          <circle cx="80" cy="70" r="5.5" fill="#22c55e" className="drop-shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
        </svg>
      ),
    },
    {
      key: 'cycleGraph',
      title: 'Cycle Graph C₆',
      badge: 'Cycle',
      badgeColor: 'bg-[#a855f7]/20 text-[#c084fc] border-[#a855f7]/40',
      vText: 'V = 6, E = 6',
      desc: 'A simple cycle with 6 vertices.',
      category: 'Cycles',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          {[0, 60, 120, 180, 240, 300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = 50 + 28 * Math.cos(rad);
            const y = 45 + 28 * Math.sin(rad);
            const nextRad = ((deg + 60) * Math.PI) / 180;
            const nx = 50 + 28 * Math.cos(nextRad);
            const ny = 45 + 28 * Math.sin(nextRad);
            return (
              <g key={i}>
                <line x1={x} y1={y} x2={nx} y2={ny} stroke="#38bdf8" strokeWidth="2" />
                <circle cx={x} cy={y} r="5.5" fill="#38bdf8" className="drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]" />
              </g>
            );
          })}
        </svg>
      ),
    },
    {
      key: 'twoComponents',
      title: 'Path Graph P₅',
      badge: 'Basic',
      badgeColor: 'bg-[#6366f1]/20 text-[#818cf8] border-[#6366f1]/40',
      vText: 'V = 5, E = 4',
      desc: 'A simple path with 5 vertices.',
      category: 'Basic',
      renderGraphic: () => (
        <svg width="100" height="90" viewBox="0 0 100 90">
          <line x1="10" y1="45" x2="90" y2="45" stroke="#d946ef" strokeWidth="2.5" />
          {[10, 30, 50, 70, 90].map((cx, i) => (
            <circle key={i} cx={cx} cy="45" r="5.5" fill="#d946ef" className="drop-shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
          ))}
        </svg>
      ),
    },
  ];

  const filtered = selectedCategory === 'All'
    ? PRESETS
    : PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      {/* Top Banner Row matching exact Reference Screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Preset Graphs Library
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Load standard graphs for practice, testing, and algorithm demonstration.
            </p>
          </div>
        </div>

        {/* Total Graphs badge */}
        <div className="px-3.5 py-1.5 rounded-full bg-[#111634] border border-[#212b54] text-xs font-semibold text-slate-300">
          Total Graphs: 15+
        </div>
      </div>

      {/* Category Filter Pills matching Reference Image */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
                : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white hover:bg-[#151c3f]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4-Column Card Grid matching exact Reference Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] hover:border-[#6e2bf5] transition-all shadow-xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Row: Category Tag badge */}
            <div className="flex items-center justify-end mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>

            {/* Center Visual Diagram Graphic */}
            <div className="h-24 flex items-center justify-center my-1 group-hover:scale-105 transition-transform">
              {item.renderGraphic()}
            </div>

            {/* Info details */}
            <div className="space-y-1 my-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                {item.title}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 font-semibold">
                {item.vText}
              </p>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 h-8">
                {item.desc}
              </p>
            </div>

            {/* Action buttons: View & Load */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#141b38]">
              <button
                onClick={() => handleLoad(item.key)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#101530] border border-[#1b2548] text-slate-300 hover:text-white hover:bg-[#182046] text-xs font-semibold transition-all"
              >
                <Eye size={13} />
                <span>View</span>
              </button>
              <button
                onClick={() => handleLoad(item.key)}
                className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs font-semibold shadow-[0_0_12px_rgba(110,43,245,0.6)] transition-all"
              >
                <Play size={13} fill="currentColor" />
                <span>Load</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresetLibraryView;

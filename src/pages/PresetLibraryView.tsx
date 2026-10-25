// src/pages/PresetLibraryView.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import { examples, type ExampleKey } from '../data/exampleGraphs';
import { GitGraph, Layers, Home, Sparkles, CheckCircle2 } from 'lucide-react';

interface PresetItem {
  key: ExampleKey;
  name: string;
  category: 'All' | 'Basic' | 'Trees' | 'Cycles' | 'Bipartite' | 'Planar' | 'Special';
  vCount: number;
  eCount: number;
  icon: React.ElementType;
}

const PRESET_LIST: PresetItem[] = [
  { key: 'wheel6', name: 'Wheel Graph (W6)', category: 'Special', vCount: 6, eCount: 10, icon: GitGraph },
  { key: 'cycleGraph', name: 'Complete Graph (K4)', category: 'Basic', vCount: 4, eCount: 6, icon: GitGraph },
  { key: 'k33Bipartite', name: 'Bipartite Graph (K3,3)', category: 'Bipartite', vCount: 6, eCount: 9, icon: Layers },
  { key: 'eulerianEnvelope', name: 'Eulerian Graph', category: 'Special', vCount: 6, eCount: 8, icon: Home },
  { key: 'petersen', name: 'Petersen Graph', category: 'Special', vCount: 10, eCount: 15, icon: Sparkles },
  { key: 'validTree', name: 'Tree (T5)', category: 'Trees', vCount: 5, eCount: 4, icon: CheckCircle2 },
];

const CATEGORIES = ['All', 'Basic', 'Trees', 'Cycles', 'Bipartite', 'Planar', 'Special'] as const;

interface PresetLibraryViewProps {
  onLoadPreset?: () => void;
}

const PresetLibraryView: React.FC<PresetLibraryViewProps> = ({ onLoadPreset }) => {
  const { setGraph, clearSelection } = useGraph();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleSelectPreset = (key: ExampleKey) => {
    if (examples[key]) {
      setGraph({ ...examples[key] });
      clearSelection();
      setTimeout(() => {
        (window as any).graphCanvasAutoLayout?.();
      }, 50);
      onLoadPreset?.();
    }
  };

  const filtered = selectedCategory === 'All'
    ? PRESET_LIST
    : PRESET_LIST.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-4 max-w-6xl mx-auto select-none">
      {/* Title & Subtitle matching Screen 6 in reference image */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Preset Graphs Library
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ready-to-use graphs for learning and testing
        </p>
      </div>

      {/* Category Filter Pills matching Screen 6 */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#090e22] border border-[#141b38] w-fit shadow-md">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#5b3bf6] text-white shadow-[0_0_12px_rgba(91,59,246,0.6)]'
                : 'text-slate-400 hover:text-white hover:bg-[#121936]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Preset Cards matching Screen 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => handleSelectPreset(item.key)}
              className="p-4 rounded-2xl bg-[#0c1228] border border-[#172140] hover:border-[#5b3bf6] transition-all cursor-pointer group shadow-xl flex flex-col items-center text-center space-y-3"
            >
              {/* Graphic Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#080d1e] border border-[#182348] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon size={32} className="text-[#38bdf8] group-hover:text-[#c084fc] transition-colors" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  V = {item.vCount}, E = {item.eCount}
                </p>
              </div>

              <button
                className="w-full py-1.5 px-3 rounded-xl bg-[#141d3e] group-hover:bg-[#5b3bf6] text-slate-300 group-hover:text-white text-xs font-semibold transition-all"
              >
                Load Graph
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetLibraryView;

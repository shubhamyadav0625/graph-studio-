// src/components/NavSidebar.tsx
import React from 'react';
import {
  Home,
  Edit3,
  Play,
  Grid,
  Share2,
  Layers,
  BookOpen,
  GraduationCap,
  Check,
} from 'lucide-react';

export type ActiveNavView =
  | 'home'
  | 'editor'
  | 'algorithms'
  | 'representations'
  | 'properties'
  | 'presets'
  | 'theory'
  | 'learning';

interface NavSidebarProps {
  activeView: ActiveNavView;
  onSelectView: (view: ActiveNavView) => void;
}

const navItems: Array<{ id: ActiveNavView; label: string; icon: React.ElementType }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'editor', label: 'Graph Editor', icon: Edit3 },
  { id: 'algorithms', label: 'Algorithms', icon: Play },
  { id: 'representations', label: 'Representations', icon: Grid },
  { id: 'properties', label: 'Graph Properties', icon: Share2 },
  { id: 'presets', label: 'Preset Graphs', icon: Layers },
  { id: 'theory', label: 'Theory & Notes', icon: BookOpen },
  { id: 'learning', label: 'Learning Mode', icon: GraduationCap },
];

const NavSidebar: React.FC<NavSidebarProps> = ({ activeView, onSelectView }) => {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#060814] border-r border-[#151c36] p-3 flex flex-col justify-between h-full select-none">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_20px_rgba(110,43,245,0.7)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#0e142c]'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Unit 6 Graph Theory Badge matching exact references */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#12103a] to-[#0a0c24] border border-[#2b246a] shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-xl bg-[#6e2bf5]/30 text-[#c084fc]">
            <GraduationCap size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">Unit 6</div>
            <div className="text-[10px] font-semibold text-[#a855f7] leading-tight">Graph Theory</div>
          </div>
        </div>
        <div className="space-y-1 pt-1 text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Check size={11} strokeWidth={3} />
            <span className="text-slate-300">Graphs & Representations</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Check size={11} strokeWidth={3} />
            <span className="text-slate-300">Algorithms</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Check size={11} strokeWidth={3} />
            <span className="text-slate-300">Properties & Theorems</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Check size={11} strokeWidth={3} />
            <span className="text-slate-300">Applications</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default NavSidebar;

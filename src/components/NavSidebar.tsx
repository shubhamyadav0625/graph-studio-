// src/components/NavSidebar.tsx
import React from 'react';
import {
  Home,
  LayoutDashboard,
  FileCode,
  AlignLeft,
  Share2,
  Bookmark,
  BookOpen,
} from 'lucide-react';

export type ActiveNavView =
  | 'home'
  | 'dashboard'
  | 'editor'
  | 'algorithms'
  | 'representations'
  | 'properties'
  | 'presets'
  | 'theory';

interface NavSidebarProps {
  activeView: ActiveNavView;
  onSelectView: (view: ActiveNavView) => void;
}

const navItems: Array<{ id: ActiveNavView; label: string; icon: React.ElementType }> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'editor', label: 'Graph Editor', icon: Share2 },
  { id: 'algorithms', label: 'Algorithms', icon: FileCode },
  { id: 'representations', label: 'Representations', icon: AlignLeft },
  { id: 'properties', label: 'Graph Properties', icon: Share2 },
  { id: 'presets', label: 'Preset Graphs', icon: Bookmark },
  { id: 'theory', label: 'Theory & Notes', icon: BookOpen },
];

const NavSidebar: React.FC<NavSidebarProps> = ({ activeView, onSelectView }) => {
  return (
    <aside className="w-52 flex-shrink-0 bg-[#090d22] border-r border-[#141b38] p-3 flex flex-col justify-between h-full select-none">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#5b3bf6] text-white shadow-[0_0_15px_rgba(91,59,246,0.5)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#121936]'
              }`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom badge */}
      <div className="p-3 rounded-2xl bg-[#0c132c] border border-[#172244] text-center">
        <div className="text-[11px] font-bold text-white">Unit 6 Discrete Math</div>
        <div className="text-[9px] text-slate-400 mt-0.5">Graphs & Algorithms Lab</div>
      </div>
    </aside>
  );
};

export default NavSidebar;

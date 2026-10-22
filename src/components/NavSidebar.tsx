// src/components/NavSidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, AlignLeft, Share2, FileCode, BookOpen, Network } from 'lucide-react';

interface NavSidebarProps {
  className?: string;
  onItemClick?: () => void;
}

const NavSidebar: React.FC<NavSidebarProps> = ({ className, onItemClick }) => {
  const location = useLocation();
  const search = location.search;

  const isHomeActive = location.pathname === '/';
  const isWorkspaceActive = location.pathname === '/lab' && !search;
  const isRepresentationsActive = location.pathname === '/lab' && search.includes('tab=representations');
  const isPropertiesActive = location.pathname === '/lab' && search.includes('tab=properties');
  const isAlgorithmsActive = location.pathname === '/lab' && search.includes('tab=algorithms');
  const isTheoryActive = location.pathname === '/theory';

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
      active
        ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] font-semibold'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#131930]'
    }`;

  return (
    <nav className={`w-52 bg-slate-50 dark:bg-[#0c101d] border-r border-slate-200 dark:border-[#1b223c] p-3 flex flex-col justify-between h-full select-none transition-colors ${className ?? ''}`}>
      <div className="space-y-1.5">
        <NavLink to="/" end className={() => linkClass(isHomeActive)} onClick={onItemClick}>
          <Home size={16} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/lab" end className={() => linkClass(isWorkspaceActive)} onClick={onItemClick}>
          <LayoutGrid size={16} />
          <span>Workspace</span>
        </NavLink>

        <NavLink to="/lab?tab=representations" className={() => linkClass(isRepresentationsActive)} onClick={onItemClick}>
          <AlignLeft size={16} />
          <span>Representations</span>
        </NavLink>

        <NavLink to="/lab?tab=properties" className={() => linkClass(isPropertiesActive)} onClick={onItemClick}>
          <Share2 size={16} />
          <span>Properties</span>
        </NavLink>

        <NavLink to="/lab?tab=algorithms" className={() => linkClass(isAlgorithmsActive)} onClick={onItemClick}>
          <FileCode size={16} />
          <span>Algorithms</span>
        </NavLink>

        <NavLink to="/theory" className={() => linkClass(isTheoryActive)} onClick={onItemClick}>
          <BookOpen size={16} />
          <span>Theory</span>
        </NavLink>
      </div>

      {/* Bottom Promo / Lab Card */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#12182e] border border-slate-200 dark:border-[#1e2646] text-center shadow-md dark:shadow-lg transition-colors">
        <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Network size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
          Graph Theory
        </h4>
        <h5 className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-tight">
          Learning Lab
        </h5>
        <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-mono tracking-wide">
          Learn • Visualize • Analyze
        </p>
      </div>
    </nav>
  );
};

export default NavSidebar;

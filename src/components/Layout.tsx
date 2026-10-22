// src/components/Layout.tsx
import React, { useState } from 'react';
import Header from './Header';
import NavSidebar from './NavSidebar';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, FileCode, BookOpen } from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
  const isWorkspaceActive = location.pathname === '/lab';
  const isAlgorithmsActive = location.pathname === '/lab' && location.search.includes('tab=algorithms');
  const isTheoryActive = location.pathname === '/theory';

  const mobileNavClass = (active: boolean) =>
    `flex flex-col items-center justify-center py-2 px-1 text-[11px] font-medium transition-colors ${
      active
        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0c101d] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop left sidebar */}
        <div className="hidden md:block h-full flex-shrink-0 z-20">
          <NavSidebar />
        </div>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          >
            <div
              className="absolute left-0 top-0 h-full w-60 bg-white dark:bg-[#0c101d] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <NavSidebar onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-100/70 dark:bg-[#0c101d] p-4 lg:p-6 pb-20 md:pb-6 relative transition-colors">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (as shown in Screen 6) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c101d] border-t border-slate-200 dark:border-[#1b223c] grid grid-cols-4 z-30 transition-colors">
        <NavLink to="/" end className={() => mobileNavClass(isHomeActive)}>
          <Home size={17} className="mb-0.5" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/lab" end className={() => mobileNavClass(isWorkspaceActive)}>
          <LayoutGrid size={17} className="mb-0.5" />
          <span>Workspace</span>
        </NavLink>
        <NavLink to="/lab?tab=algorithms" className={() => mobileNavClass(isAlgorithmsActive)}>
          <FileCode size={17} className="mb-0.5" />
          <span>Algorithms</span>
        </NavLink>
        <NavLink to="/theory" className={() => mobileNavClass(isTheoryActive)}>
          <BookOpen size={17} className="mb-0.5" />
          <span>Theory</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Layout;

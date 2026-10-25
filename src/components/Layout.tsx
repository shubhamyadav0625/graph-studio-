// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#070b18] text-slate-100 overflow-hidden font-sans transition-colors">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#070b18] p-3 md:p-4 relative transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

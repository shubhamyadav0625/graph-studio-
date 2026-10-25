// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#060814] text-slate-100 overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 overflow-hidden relative bg-[#060814]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

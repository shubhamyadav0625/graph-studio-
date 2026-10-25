// src/components/Header.tsx
import React from 'react';
import { Network, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-5 py-2.5 bg-[#0a0e24] border-b border-[#141b38] text-white select-none z-30 transition-colors">
      {/* Brand logo & tagline matching reference image */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Network size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 leading-none">
              Graph Studio
            </div>
            <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5 tracking-tight">
              Graph Theory Learning Lab
            </div>
          </div>
        </div>
      </div>

      {/* Center Search Bar matching reference image */}
      <div className="hidden sm:flex items-center gap-2 w-80 lg:w-96 px-3 py-1.5 rounded-full bg-[#0e1430] border border-[#1b254b] text-slate-400 text-xs focus-within:border-[#5b3bf6] transition-colors">
        <Search size={14} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search algorithms, topics, or graphs..."
          className="bg-transparent border-none outline-none w-full text-slate-200 placeholder-slate-500 text-xs"
        />
      </div>

      {/* Right Controls: GitHub icon, Theme toggle & user avatar S */}
      <div className="flex items-center space-x-3">
        <a
          href="https://github.com/shubhamyadav0625/graph-studio-"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-colors"
          title="GitHub Repository"
        >
          <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        </a>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-indigo-400" />
          )}
        </button>

        {/* User avatar S matching reference image */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#5b3bf6] text-white font-bold text-xs shadow-[0_0_12px_rgba(91,59,246,0.6)] cursor-pointer">
          S
        </div>
      </div>
    </header>
  );
};

export default Header;

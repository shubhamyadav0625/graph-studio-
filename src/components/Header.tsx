// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Search, Moon, Sun, Bell, Menu } from 'lucide-react';
import { useTheme } from '../context';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white dark:bg-[#0c101d] border-b border-slate-200 dark:border-[#1b223c] text-slate-800 dark:text-white select-none z-30 transition-colors">
      {/* Brand logo & mobile hamburger */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-[#141a30] border border-slate-200 dark:border-[#212b4e] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.5)]">
            <Zap size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Graph Studio
          </span>
        </Link>
      </div>

      {/* Center Search Input with Ctrl K (matches updated mockup) */}
      <div className="hidden sm:flex items-center justify-between w-72 lg:w-96 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#13192f] border border-slate-200 dark:border-[#212b4e] text-slate-500 dark:text-slate-400 text-xs focus-within:border-indigo-500 transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search size={14} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search topics, algorithms..."
            className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs"
          />
        </div>
        <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-[#1a223f] border border-slate-200 dark:border-[#26325a] rounded shadow-xs">
          Ctrl K
        </kbd>
      </div>

      {/* Right Controls: Theme Toggle, Notifications, Avatar */}
      <div className="flex items-center space-x-2.5">
        {/* Working Light/Dark Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#151c35] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle dark/light theme"
        >
          {theme === 'dark' ? (
            <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={17} className="text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        <button
          className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#151c35] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* User avatar S */}
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.4)] cursor-pointer">
          S
        </div>
      </div>
    </header>
  );
};

export default Header;

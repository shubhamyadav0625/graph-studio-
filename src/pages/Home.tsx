// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Grid, Play, BarChart3, ArrowRight, BookOpen } from 'lucide-react';

const topics = [
  'Graph Definitions',
  'Paths & Cycles',
  'Trees',
  'Bipartite Graphs',
  'Planar Graphs',
  'Graph Coloring',
  'Euler Coloring',
];

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 select-none space-y-10">
      {/* Hero Section (matches updated mockup Screen 1) */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
        {/* Left Hero Content */}
        <div className="flex-1 space-y-4 text-left">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
            Welcome to
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Graph Studio
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-200">
            An interactive learning lab for Graph Theory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Create, explore, analyze and understand mathematical graphs with visualizations, algorithms, and detailed insights.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/lab"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all hover:scale-105"
            >
              <span>Open Workspace</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/theory"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#161d36] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <BookOpen size={14} />
              <span>Learn Theory</span>
            </Link>
          </div>
        </div>

        {/* Right Hero Visual Graphic (Connected Nodes SVG) */}
        <div className="w-full sm:w-[380px] h-[220px] rounded-2xl bg-white dark:bg-[#101528] border border-slate-200 dark:border-[#1e2646] p-4 flex items-center justify-center shadow-lg dark:shadow-2xl relative overflow-hidden transition-colors">
          <svg width="340" height="190" className="overflow-visible">
            {/* Edges */}
            <line x1="80" y1="50" x2="160" y2="40" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="80" y1="50" x2="50" y2="120" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="160" y1="40" x2="270" y2="60" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="160" y1="40" x2="190" y2="110" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="50" y1="120" x2="120" y2="150" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="50" y1="120" x2="190" y2="110" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="270" y1="60" x2="190" y2="110" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="270" y1="60" x2="240" y2="150" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="120" y1="150" x2="240" y2="150" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />
            <line x1="190" y1="110" x2="240" y2="150" stroke="#818cf8" strokeWidth="2.5" opacity="0.8" />

            {/* Glowing Nodes */}
            <circle cx="160" cy="40" r="16" fill="#4338ca" stroke="#818cf8" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(99,102,241,0.8))" />
            <text x="160" y="44" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">1</text>

            <circle cx="80" cy="50" r="15" fill="#3b82f6" stroke="#93c5fd" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(59,130,246,0.8))" />
            <text x="80" y="54" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">2</text>

            <circle cx="270" cy="60" r="15" fill="#7c3aed" stroke="#c084fc" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(124,58,237,0.8))" />
            <text x="270" y="64" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">3</text>

            <circle cx="50" cy="120" r="15" fill="#2563eb" stroke="#60a5fa" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(37,99,235,0.8))" />
            <text x="50" y="124" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">4</text>

            <circle cx="120" cy="150" r="15" fill="#6366f1" stroke="#a5b4fc" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(99,102,241,0.8))" />
            <text x="120" y="154" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">5</text>

            <circle cx="190" cy="110" r="15" fill="#4f46e5" stroke="#818cf8" strokeWidth="3" filter="drop-shadow(0 0 10px rgba(79,70,229,0.8))" />
            <text x="190" y="114" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">6</text>

            <circle cx="240" cy="150" r="14" fill="#a855f7" stroke="#e9d5ff" strokeWidth="2.5" filter="drop-shadow(0 0 8px rgba(168,85,247,0.7))" />
            <text x="240" y="154" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">7</text>
          </svg>
        </div>
      </section>

      {/* 4 Feature Cards Row (matches Screen 1) */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Interactive Graph Editor */}
        <Link
          to="/lab"
          className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Share2 size={16} />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Interactive Graph Editor
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Create and modify graphs with an intuitive interface
          </p>
        </Link>

        {/* Card 2: Graph Representations */}
        <Link
          to="/lab?tab=representations"
          className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
              <Grid size={16} />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Graph Representations
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Adjacency matrix, list and incidence matrix
          </p>
        </Link>

        {/* Card 3: Graph Algorithms */}
        <Link
          to="/lab?tab=algorithms"
          className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
              <Play size={16} />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Graph Algorithms
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            BFS, DFS and more with step-by-step visualization
          </p>
        </Link>

        {/* Card 4: Graph Properties */}
        <Link
          to="/lab?tab=properties"
          className="p-4 rounded-2xl bg-white dark:bg-[#12172a] border border-slate-200 dark:border-[#1e2646] hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
              <BarChart3 size={16} />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Graph Properties
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Analyze connectivity, cycles, trees and more
          </p>
        </Link>
      </section>

      {/* Explore Key Topics (matches Screen 1 bottom) */}
      <section className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Explore Key Topics
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {topics.map((t) => (
            <Link
              key={t}
              to="/theory"
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#141a30] border border-slate-200 dark:border-[#212b4e] text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-white text-xs font-medium shadow-2xs transition-all"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

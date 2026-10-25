// src/pages/LearningModeView.tsx
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { ActiveNavView } from '../components/NavSidebar';

interface LearningModeViewProps {
  onNavigate: (view: ActiveNavView) => void;
}

const tutorialSteps = [
  { id: 1, label: 'Create a graph' },
  { id: 2, label: 'Run an algorithm' },
  { id: 3, label: 'View representations' },
  { id: 4, label: 'Analyze properties' },
  { id: 5, label: 'Verify & learn' },
];

const LearningModeView: React.FC<LearningModeViewProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(2);

  return (
    <div className="space-y-4 max-w-6xl mx-auto select-none">
      {/* Title & Subtitle matching Screen 8 in reference image */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Learning Mode
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Step-by-step tutorial with interactive examples
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 items-start">
        {/* Left 5 Steps Sidebar matching Screen 8 */}
        <div className="lg:col-span-4 p-3.5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-2">
          {tutorialSteps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#5b3bf6] text-white font-semibold shadow-[0_0_12px_rgba(91,59,246,0.6)]'
                    : 'text-slate-300 hover:bg-[#121936]'
                }`}
              >
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-[#5b3bf6]' : 'bg-[#182348] text-slate-300'
                  }`}
                >
                  {step.id}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Tutorial Demonstration Card matching Screen 8 */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">BFS Example</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              See how BFS explores a graph level by level
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* Visual Mini Canvas Graphic */}
            <div className="w-56 h-40 flex items-center justify-center">
              <svg width="220" height="150" className="overflow-visible">
                <line x1="110" y1="30" x2="40" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="110" y1="30" x2="180" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="40" y1="70" x2="60" y2="130" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="180" y1="70" x2="160" y2="130" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="60" y1="130" x2="160" y2="130" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="110" y1="80" x2="40" y2="70" stroke="#38bdf8" strokeWidth="2.5" />
                <line x1="110" y1="80" x2="180" y2="70" stroke="#38bdf8" strokeWidth="2.5" />

                <circle cx="110" cy="30" r="14" fill="#a855f7" stroke="#c084fc" strokeWidth="2.5" />
                <text x="110" y="34" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">1</text>

                <circle cx="40" cy="70" r="13" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
                <text x="40" y="74" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">2</text>

                <circle cx="180" cy="70" r="13" fill="#9333ea" stroke="#d8b4fe" strokeWidth="2" />
                <text x="180" y="74" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">3</text>

                <circle cx="110" cy="80" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="110" y="84" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">6</text>

                <circle cx="60" cy="130" r="13" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
                <text x="60" y="134" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">4</text>

                <circle cx="160" cy="130" r="13" fill="#2563eb" stroke="#38bdf8" strokeWidth="2" />
                <text x="160" y="134" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">5</text>
              </svg>
            </div>

            {/* Key Takeaways list matching Screen 8 */}
            <div className="space-y-2 text-xs">
              <h3 className="font-semibold text-white text-xs">Key Takeaways</h3>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                  <span>Visits nodes in layers (breadth-first)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                  <span>Uses a queue (FIFO)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                  <span>Time Complexity: O(V + E)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                  <span>Space Complexity: O(V)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-[#172140] flex justify-end">
            <button
              onClick={() => onNavigate('algorithms')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#5b3bf6] hover:bg-[#6c4ef7] text-white text-xs font-semibold shadow-[0_0_12px_rgba(91,59,246,0.6)] transition-all"
            >
              <span>Try It Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModeView;

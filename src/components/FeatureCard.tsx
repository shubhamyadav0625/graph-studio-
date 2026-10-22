// src/components/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="rounded-2xl border border-[#1e2646] bg-[#12172a] p-6 shadow-xl hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all group">
      {icon && <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>}
      <h3 className="text-base font-semibold mb-2 text-white group-hover:text-indigo-400 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;

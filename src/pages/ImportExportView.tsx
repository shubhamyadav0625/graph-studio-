// src/pages/ImportExportView.tsx
import React, { useState } from 'react';
import { useGraph } from '../context';
import { Upload, Download, CheckCircle2 } from 'lucide-react';

const ImportExportView: React.FC = () => {
  const { graph, setGraph, clearSelection } = useGraph();
  const [format, setFormat] = useState('JSON');
  const [successMsg, setSuccessMsg] = useState('');

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graph, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `graph_studio_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setSuccessMsg('Graph exported successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.vertices) && Array.isArray(parsed.edges)) {
          setGraph(parsed);
          clearSelection();
          setSuccessMsg('Graph imported successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          alert('Invalid graph JSON format.');
        }
      } catch (err) {
        alert('Failed to parse graph JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto select-none">
      {/* Title & Subtitle matching Screen 9 in reference image */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Import / Export
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Save, load and share your graphs
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Two Main Cards: Import Graph and Export Graph matching Screen 9 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Import Graph Card */}
        <div className="p-5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-3.5">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Import Graph</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload JSON file or paste graph data
            </p>
          </div>

          {/* Drag & Drop Upload Container matching Screen 9 */}
          <label className="border-2 border-dashed border-[#1f2c58] hover:border-[#5b3bf6] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#080d1e] block">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-[#5b3bf6]/20 text-[#a855f7] flex items-center justify-center mb-3">
              <Upload size={22} />
            </div>
            <span className="text-xs font-semibold text-slate-200">
              Drag & drop a file or click to browse
            </span>
            <span className="text-[10px] text-slate-400 mt-1">
              Supports .json
            </span>
            <div className="mt-4 px-4 py-1.5 rounded-xl bg-[#5b3bf6] text-white text-xs font-semibold shadow-[0_0_12px_rgba(91,59,246,0.6)]">
              Upload
            </div>
          </label>
        </div>

        {/* Export Graph Card matching Screen 9 */}
        <div className="p-5 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl space-y-3.5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Export Graph</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Download current graph data
            </p>

            <div className="mt-4 space-y-2">
              <label className="text-xs text-slate-400 font-medium block">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#080d1e] border border-[#1b2648] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#5b3bf6]"
              >
                <option value="JSON">JSON</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5b3bf6] hover:bg-[#6c4ef7] text-white text-xs font-semibold shadow-[0_0_15px_rgba(91,59,246,0.6)] transition-all"
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bottom Graph Settings bar matching Screen 9 */}
      <div className="p-4 rounded-2xl bg-[#0c1228] border border-[#172140] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-white">Graph Settings</h3>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span>Theme:</span>
            <span className="px-2 py-0.5 rounded-lg bg-[#5b3bf6] text-white font-semibold text-[11px]">Dark</span>
            <span className="text-slate-500 text-[11px]">Light</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Auto Layout</span>
            <button
              onClick={() => (window as any).graphCanvasAutoLayout?.()}
              className="w-6 h-3.5 rounded-full bg-[#5b3bf6] p-0.5 relative"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white translate-x-2.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Animations</span>
            <div className="w-6 h-3.5 rounded-full bg-[#5b3bf6] p-0.5 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white translate-x-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Show Grid</span>
            <div className="w-6 h-3.5 rounded-full bg-[#5b3bf6] p-0.5 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white translate-x-2.5" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Node Labels</span>
            <div className="w-6 h-3.5 rounded-full bg-[#5b3bf6] p-0.5 relative">
              <div className="w-2.5 h-2.5 rounded-full bg-white translate-x-2.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportView;

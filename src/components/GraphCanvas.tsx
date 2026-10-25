// src/components/GraphCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph } from '../context';
import type { VertexId, AlgorithmHighlightState } from '../types/graph';
import {
  MousePointer,
  Hand,
  Plus,
  Link as LinkIcon,
  Unlink,
  Move,
  Trash2,
  Maximize2,
  LayoutGrid,
  Minus,
} from 'lucide-react';

interface GraphCanvasProps {
  highlightState?: AlgorithmHighlightState | null;
  activeTool?: 'select' | 'pan' | 'addVertex' | 'addEdge' | 'disconnect' | 'move' | 'delete';
  onToolChange?: (tool: any) => void;
  showWeights?: boolean;
}

// Reference coords matching exact circular pentagon with center D from screenshot:
// A (top), B (left), C (right), D (center), E (bottom-left), F (bottom-right)
const REFERENCE_COORDS: Record<string, { x: number; y: number }> = {
  'A': { x: 380, y: 70 },
  'B': { x: 230, y: 180 },
  'C': { x: 530, y: 180 },
  'D': { x: 380, y: 270 },
  'E': { x: 230, y: 380 },
  'F': { x: 530, y: 380 },
  // Numeric fallbacks
  '1': { x: 380, y: 70 },
  '2': { x: 230, y: 180 },
  '3': { x: 530, y: 180 },
  '6': { x: 380, y: 270 },
  '4': { x: 230, y: 380 },
  '5': { x: 530, y: 380 },
};

// Edge weights from the screenshot
const DEFAULT_EDGE_WEIGHTS: Record<string, number> = {
  'A_B': 3,
  'A_C': 2,
  'A_D': 1,
  'B_D': 4,
  'C_D': 5,
  'B_E': 2,
  'C_F': 3,
  'D_E': 6,
  'D_F': 4,
  'E_F': 7,
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  highlightState,
  activeTool = 'select',
  onToolChange,
  showWeights = true,
}) => {
  void highlightState;
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [edgeStart, setEdgeStart] = useState<string | null>(null);

  const { graph, addVertex, addEdge, removeVertex, selected, toggleSelected, clearSelection } = useGraph();

  // Initialize Cytoscape with exact styles matching screenshot
  useEffect(() => {
    if (!containerRef.current) return;

    cyRef.current = Cytoscape({
      container: containerRef.current,
      elements: [],
      boxSelectionEnabled: false,
      autounselectify: false,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'background-color': '#0369a1',
            'border-width': 3,
            'border-color': '#38bdf8',
            color: '#ffffff',
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-weight': 'bold',
            'font-size': 14,
            'text-valign': 'center',
            'text-halign': 'center',
            width: 44,
            height: 44,
            'overlay-opacity': 0,
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': 0.2,
          } as any,
        },
        {
          selector: 'edge',
          style: {
            width: 2.8,
            'line-color': '#0284c7',
            opacity: 0.9,
            'curve-style': 'straight',
            label: showWeights ? 'data(weight)' : '',
            'font-size': 11,
            'font-weight': 'bold',
            color: '#ffffff',
            'text-background-opacity': 1,
            'text-background-color': '#7c3aed',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'overlay-opacity': 0,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.2,
          } as any,
        },
        {
          selector: '.selected',
          style: {
            'border-width': 4.5,
            'border-color': '#d946ef',
            'background-color': '#86198f',
            color: '#ffffff',
            width: 48,
            height: 48,
          } as any,
        },
        {
          selector: '.visited',
          style: {
            'background-color': '#10b981',
            'border-color': '#34d399',
            'border-width': 3,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.in-queue',
          style: {
            'background-color': '#0284c7',
            'border-color': '#38bdf8',
            'border-width': 3.5,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.path-node',
          style: {
            'background-color': '#eab308',
            'border-color': '#fde047',
            'border-width': 4,
            color: '#000000',
          } as any,
        },
      ],
      layout: { name: 'preset' },
    });

    const cy = cyRef.current!;

    // Tap on node
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const id = node.id() as VertexId;

      if (activeTool === 'addEdge') {
        if (!edgeStart) {
          setEdgeStart(id);
          toggleSelected(id);
        } else {
          if (edgeStart !== id) {
            addEdge(edgeStart, id);
          }
          setEdgeStart(null);
          clearSelection();
        }
      } else if (activeTool === 'delete') {
        removeVertex(id);
      } else {
        toggleSelected(id);
      }
    });

    // Tap on background
    cy.on('tap', (event) => {
      if (event.target === cy) {
        if (activeTool === 'addVertex') {
          const pan = cy.pan();
          const zoom = cy.zoom();
          const pos = event.renderedPosition;
          const x = (pos.x - pan.x) / zoom;
          const y = (pos.y - pan.y) / zoom;

          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let nextLabel = 'A';
          for (let i = 0; i < 26; i++) {
            if (!graph.vertices.includes(alphabet[i])) {
              nextLabel = alphabet[i];
              break;
            }
          }
          if (graph.vertices.includes(nextLabel)) {
            nextLabel = String(graph.vertices.length + 1);
          }
          addVertex(nextLabel);

          setTimeout(() => {
            const added = cy.$(`node#${nextLabel}`);
            if (added.length > 0) {
              added.position({ x, y });
            }
          }, 30);
        } else {
          clearSelection();
          setEdgeStart(null);
        }
      }
    });

    cy.on('zoom', () => {
      setZoomPercent(Math.round(cy.zoom() * 100));
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [showWeights]);

  // Sync elements & apply exact styling
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const currentNodeIds = new Set(cy.nodes().map((n) => n.id()));
    const graphNodeIds = new Set(graph.vertices);

    graph.vertices.forEach((v, index) => {
      if (!currentNodeIds.has(v)) {
        const presetPos = REFERENCE_COORDS[v];
        const defaultX = presetPos ? presetPos.x : 200 + (index % 4) * 110;
        const defaultY = presetPos ? presetPos.y : 150 + Math.floor(index / 4) * 100;

        cy.add({
          group: 'nodes',
          data: { id: v, label: v },
          position: { x: defaultX, y: defaultY },
        });
      }
    });

    currentNodeIds.forEach((id) => {
      if (!graphNodeIds.has(id)) {
        cy.$(`node#${id}`).remove();
      }
    });

    const makeEdgeId = (s: string, t: string) => `e_${[s, t].sort().join('_')}`;
    const currentEdgeIds = new Set(cy.edges().map((e) => e.id()));
    const graphEdgeIds = new Set<string>();

    graph.edges.forEach((e) => {
      const id = makeEdgeId(e.source, e.target);
      graphEdgeIds.add(id);
      if (!currentEdgeIds.has(id)) {
        const key1 = `${e.source}_${e.target}`;
        const key2 = `${e.target}_${e.source}`;
        const weight = DEFAULT_EDGE_WEIGHTS[key1] || DEFAULT_EDGE_WEIGHTS[key2] || (e as any).weight || 1;

        cy.add({
          group: 'edges',
          data: { id, source: e.source, target: e.target, weight: String(weight) },
        });
      }
    });

    currentEdgeIds.forEach((id) => {
      if (!graphEdgeIds.has(id)) {
        cy.$(`edge#${id}`).remove();
      }
    });

    // Reset styles
    cy.nodes().removeClass('selected visited in-queue path-node');
    cy.edges().removeClass('path-edge');

    // Highlight selected nodes
    selected.forEach((id) => {
      cy.$(`node#${id}`).addClass('selected');
    });

    // Panning & dragging control based on active tool
    cy.userPanningEnabled(activeTool === 'pan' || activeTool === 'move');
    cy.boxSelectionEnabled(false);
    cy.nodes().grabify();
  }, [graph, selected, activeTool]);

  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.25);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 40);
  };

  const handleLayout = () => {
    if (cyRef.current) {
      cyRef.current.layout({
        name: 'cose',
        animate: true,
        animationDuration: 400,
        padding: 40,
      } as any).run();
    }
  };

  (window as any).graphCanvasAutoLayout = handleLayout;

  return (
    <div className="relative w-full h-[440px] rounded-2xl overflow-hidden border border-[#161f3e] bg-[#070b1c] shadow-2xl flex flex-col select-none">
      {/* 1. Left Vertical Floating Toolbar matching exact Screenshot */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 p-1 rounded-2xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-2xl">
        <button
          onClick={() => onToolChange?.('select')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'select'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Pointer / Select"
        >
          <MousePointer size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('pan')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'pan'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Hand / Pan"
        >
          <Hand size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('addVertex')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'addVertex'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Add Vertex"
        >
          <Plus size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('addEdge')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'addEdge'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Connect Edge"
        >
          <LinkIcon size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('disconnect')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'disconnect'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Disconnect Edge"
        >
          <Unlink size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('move')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'move'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Move Elements"
        >
          <Move size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('delete')}
          className={`p-2 rounded-xl transition-all ${
            activeTool === 'delete'
              ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.8)]'
              : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
          }`}
          title="Delete Vertex / Edge"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* 2. Top Right Floating Controls matching Screenshot (LayoutGrid, Fullscreen, Sparkles) */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-lg">
        <button
          onClick={handleLayout}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141b3a] transition-all"
          title="Auto Layout"
        >
          <LayoutGrid size={14} />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141b3a] transition-all"
          title="Fit Canvas"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* 3. Central Interactive Cytoscape Canvas with Dot-Grid Background */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* 4. Bottom Floating Bar (Zoom +/- Fit, and Legend) matching exact Screenshot */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Zoom Controls Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-lg pointer-events-auto">
          <span className="px-2 py-0.5 text-xs font-mono font-bold text-slate-200">
            {zoomPercent}%
          </span>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all"
            title="Zoom Out"
          >
            <Minus size={13} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all"
            title="Zoom In"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={handleFit}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all"
            title="Fit to Screen"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Legend matching exact screenshot colors */}
        <div className="flex items-center gap-4 text-[11px] p-1.5 px-3 rounded-xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-lg pointer-events-auto font-medium">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef] shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
            <span>Selected</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            <span>Visited</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.9)]" />
            <span>In Queue</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shadow-[0_0_8px_rgba(234,179,8,0.9)]" />
            <span>Path</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GraphCanvas;

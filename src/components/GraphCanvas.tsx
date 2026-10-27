// src/components/GraphCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph } from '../context';
import type { AlgorithmHighlightState, VertexId } from '../types/graph';
import {
  MousePointer,
  Hand,
  Plus,
  Link as LinkIcon,
  Unlink,
  Move,
  Trash2,
  LayoutGrid,
  Maximize2,
  Minus,
} from 'lucide-react';

interface GraphCanvasProps {
  highlightState?: AlgorithmHighlightState | null;
  activeTool?: 'select' | 'pan' | 'addVertex' | 'addEdge' | 'disconnect' | 'move' | 'delete';
  onToolChange?: (tool: 'select' | 'pan' | 'addVertex' | 'addEdge' | 'disconnect' | 'move' | 'delete') => void;
  showWeights?: boolean;
}

// Precomputed reference coordinates matching the pentagon + center layout
const REFERENCE_COORDS: Record<string, { x: number; y: number }> = {
  A: { x: 380, y: 120 },
  B: { x: 230, y: 230 },
  C: { x: 530, y: 230 },
  D: { x: 380, y: 270 },
  E: { x: 280, y: 410 },
  F: { x: 480, y: 410 },
  '1': { x: 380, y: 120 },
  '2': { x: 230, y: 230 },
  '3': { x: 530, y: 230 },
  '4': { x: 380, y: 270 },
  '5': { x: 280, y: 410 },
  '6': { x: 480, y: 410 },
};

// Edge weights mapping
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

  // Store activeTool in a ref so Cytoscape event handlers always access the latest value
  const activeToolRef = useRef(activeTool);
  useEffect(() => {
    activeToolRef.current = activeTool;
    if (activeTool !== 'addEdge') {
      setEdgeStart(null);
    }
  }, [activeTool]);

  const edgeStartRef = useRef(edgeStart);
  useEffect(() => {
    edgeStartRef.current = edgeStart;
  }, [edgeStart]);

  const { graph, addVertex, addEdge, removeVertex, removeEdge, selected, toggleSelected, clearSelection } = useGraph();

  const graphRef = useRef(graph);
  useEffect(() => {
    graphRef.current = graph;
  }, [graph]);

  // Initialize Cytoscape
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

    // Tap on node: handle selection, addEdge, or delete
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const id = node.id() as VertexId;
      const currentTool = activeToolRef.current;
      const currentEdgeStart = edgeStartRef.current;

      if (currentTool === 'addEdge') {
        if (!currentEdgeStart) {
          setEdgeStart(id);
          toggleSelected(id);
        } else {
          if (currentEdgeStart !== id) {
            addEdge(currentEdgeStart, id);
          }
          setEdgeStart(null);
          clearSelection();
        }
      } else if (currentTool === 'delete') {
        removeVertex(id);
      } else {
        // In select or default mode:
        // If user already had 1 node selected and clicks another node while holding or wanting to link:
        toggleSelected(id);
      }
    });

    // Tap on edge: handle delete or disconnect
    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      const currentTool = activeToolRef.current;
      if (currentTool === 'delete' || currentTool === 'disconnect') {
        const source = edge.data('source');
        const target = edge.data('target');
        if (source && target) {
          removeEdge(source, target);
        }
      }
    });

    // Tap on empty canvas background
    cy.on('tap', (event) => {
      if (event.target === cy) {
        const currentTool = activeToolRef.current;
        if (currentTool === 'addVertex') {
          const pan = cy.pan();
          const zoom = cy.zoom();
          const pos = event.renderedPosition;
          const x = (pos.x - pan.x) / zoom;
          const y = (pos.y - pan.y) / zoom;

          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let nextLabel = 'A';
          const currentVertices = graphRef.current.vertices;
          for (let i = 0; i < 26; i++) {
            if (!currentVertices.includes(alphabet[i])) {
              nextLabel = alphabet[i];
              break;
            }
          }
          if (currentVertices.includes(nextLabel)) {
            nextLabel = String(currentVertices.length + 1);
          }
          addVertex(nextLabel);

          setTimeout(() => {
            const added = cy.$(`node#${nextLabel}`);
            if (added.length > 0) {
              added.position({ x, y });
            }
          }, 40);
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

  // Sync elements & apply styles
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

    // Reset classes
    cy.nodes().removeClass('selected visited in-queue path-node');
    cy.edges().removeClass('path-edge');

    // Highlight selected nodes or active edge creation source
    selected.forEach((id) => {
      cy.$(`node#${id}`).addClass('selected');
    });

    if (edgeStart) {
      cy.$(`node#${edgeStart}`).addClass('selected');
    }

    // Panning & dragging control based on active tool
    cy.userPanningEnabled(activeTool === 'pan' || activeTool === 'move');
    cy.boxSelectionEnabled(false);
    cy.nodes().grabify();
  }, [graph, selected, edgeStart, activeTool]);

  // Expose auto layout to window
  const handleLayout = () => {
    if (!cyRef.current) return;
    const layout = cyRef.current.layout({
      name: 'circle',
      animate: true,
      animationDuration: 400,
      padding: 60,
    } as any);
    layout.run();
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 40);
      setZoomPercent(Math.round(cyRef.current.zoom() * 100));
    }
  };

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.25);
      setZoomPercent(Math.round(cyRef.current.zoom() * 100));
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
      setZoomPercent(Math.round(cyRef.current.zoom() * 100));
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] select-none">
      {/* Visual Indicator when Add Edge mode is active */}
      {activeTool === 'addEdge' && (
        <div className="absolute top-4 left-20 z-30 px-3 py-1.5 rounded-xl bg-purple-900/90 border border-purple-500/80 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-pulse">
          <LinkIcon size={14} className="text-purple-300" />
          <span>
            {edgeStart ? `Click second node to connect with ${edgeStart}` : 'Click first node to start edge'}
          </span>
        </div>
      )}

      {/* 1. Left Floating Vertical Toolbar matching exact Screenshot */}
      <div className="absolute left-4 top-4 z-20 flex flex-col items-center gap-1.5 p-1 rounded-2xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-2xl">
        <button
          onClick={() => onToolChange?.('select')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
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
          className={`p-2 rounded-xl transition-all cursor-pointer ${
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
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'addVertex'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Add Vertex"
        >
          <Plus size={15} />
        </button>

        <button
          onClick={() => onToolChange?.(activeTool === 'addEdge' ? 'select' : 'addEdge')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
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
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'disconnect'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)]'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Disconnect Edge (Click on edge)"
        >
          <Unlink size={15} />
        </button>

        <button
          onClick={() => onToolChange?.('move')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
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
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'delete'
              ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.8)]'
              : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
          }`}
          title="Delete Vertex / Edge"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* 2. Top Right Floating Controls matching Screenshot (LayoutGrid, Fullscreen) */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-[#090d24]/90 backdrop-blur-md border border-[#1b2348] shadow-lg">
        <button
          onClick={handleLayout}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141b3a] transition-all cursor-pointer"
          title="Auto Layout"
        >
          <LayoutGrid size={14} />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#141b3a] transition-all cursor-pointer"
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
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all cursor-pointer"
            title="Zoom Out"
          >
            <Minus size={13} />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all cursor-pointer"
            title="Zoom In"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={handleFit}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#141b3a] transition-all cursor-pointer"
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

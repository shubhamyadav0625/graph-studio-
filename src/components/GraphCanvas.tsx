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
  isDirected?: boolean;
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
  isDirected = false,
}) => {
  void highlightState;
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [edgeStart, setEdgeStart] = useState<string | null>(null);

  // Store placed positions for newly added vertices
  const placedPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  const { graph, addVertex, addEdge, removeVertex, removeEdge, selected, toggleSelected, clearSelection } = useGraph();

  // Stable references for all dynamically updated state and context methods
  const activeToolRef = useRef(activeTool);
  activeToolRef.current = activeTool;

  const edgeStartRef = useRef(edgeStart);
  edgeStartRef.current = edgeStart;

  const graphRef = useRef(graph);
  graphRef.current = graph;

  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  const addEdgeRef = useRef(addEdge);
  addEdgeRef.current = addEdge;

  const addVertexRef = useRef(addVertex);
  addVertexRef.current = addVertex;

  const removeVertexRef = useRef(removeVertex);
  removeVertexRef.current = removeVertex;

  const removeEdgeRef = useRef(removeEdge);
  removeEdgeRef.current = removeEdge;

  const toggleSelectedRef = useRef(toggleSelected);
  toggleSelectedRef.current = toggleSelected;

  const clearSelectionRef = useRef(clearSelection);
  clearSelectionRef.current = clearSelection;

  const onToolChangeRef = useRef(onToolChange);
  onToolChangeRef.current = onToolChange;

  // Clear edgeStart when switching away from addEdge tool
  useEffect(() => {
    if (activeTool !== 'addEdge') {
      setEdgeStart(null);
    }
  }, [activeTool]);

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

  (window as any).graphCanvasAutoLayout = handleLayout;

  // Helper to compute next vertex label
  const getNextVertexLabel = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const current = graphRef.current.vertices;
    for (let i = 0; i < alphabet.length; i++) {
      if (!current.includes(alphabet[i])) {
        return alphabet[i];
      }
    }
    let num = 1;
    while (current.includes(String(num))) {
      num++;
    }
    return String(num);
  };

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
            'curve-style': isDirected ? 'bezier' : 'straight',
            'target-arrow-shape': isDirected ? 'triangle' : 'none',
            'target-arrow-color': '#38bdf8',
            'arrow-scale': 1.25,
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

    // Tap on node: handle addEdge, selection, or delete
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const id = node.id() as VertexId;
      const currentTool = activeToolRef.current;
      const currentEdgeStart = edgeStartRef.current;

      if (currentTool === 'addEdge') {
        if (!currentEdgeStart) {
          // Select source vertex for edge
          setEdgeStart(id);
        } else {
          // Connect source with target vertex
          if (currentEdgeStart !== id) {
            addEdgeRef.current(currentEdgeStart, id);
          }
          setEdgeStart(null);
          clearSelectionRef.current();
          onToolChangeRef.current?.('select');
        }
      } else if (currentTool === 'delete') {
        removeVertexRef.current(id);
      } else {
        // Pointer / Select tool
        toggleSelectedRef.current(id);
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
          removeEdgeRef.current(source, target);
        }
      }
    });

    // Tap on empty canvas background: add vertex or clear selection
    cy.on('tap', (event) => {
      if (event.target === cy) {
        const currentTool = activeToolRef.current;
        if (currentTool === 'addVertex') {
          const pan = cy.pan();
          const zoom = cy.zoom();
          const pos = event.position || event.renderedPosition;
          const x = (pos.x - pan.x) / zoom;
          const y = (pos.y - pan.y) / zoom;

          const nextLabel = getNextVertexLabel();
          placedPositionsRef.current[nextLabel] = { x: Math.round(x), y: Math.round(y) };
          addVertexRef.current(nextLabel);
        } else {
          clearSelectionRef.current();
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
  }, []);

  // Sync Cytoscape elements with current graph
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const currentNodeIds = new Set(cy.nodes().map((n) => n.id()));
    const graphNodeIds = new Set(graph.vertices);

    // 1. Add missing nodes with reliable positioning
    graph.vertices.forEach((v, index) => {
      if (!currentNodeIds.has(v)) {
        // Check placed position, then reference coords, then calculate nice open space
        const placed = placedPositionsRef.current[v];
        const presetPos = REFERENCE_COORDS[v];
        const count = graph.vertices.length;
        
        let posX = 380;
        let posY = 270;

        if (placed) {
          posX = placed.x;
          posY = placed.y;
        } else if (presetPos) {
          posX = presetPos.x;
          posY = presetPos.y;
        } else {
          // Circular placement around center
          const angle = (2 * Math.PI * index) / Math.max(1, count);
          posX = 380 + Math.round(160 * Math.sin(angle));
          posY = 270 - Math.round(130 * Math.cos(angle));
        }

        cy.add({
          group: 'nodes',
          data: { id: v, label: v },
          position: { x: posX, y: posY },
        });
      }
    });

    // 2. Remove deleted nodes
    currentNodeIds.forEach((id) => {
      if (!graphNodeIds.has(id)) {
        cy.$(`node#${id}`).remove();
        delete placedPositionsRef.current[id];
      }
    });

    // 3. Sync edges
    const makeEdgeId = (s: string, t: string) => (isDirected ? `e_${s}_${t}` : `e_${[s, t].sort().join('_')}`);
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

    // Dynamically update edge styles (arrows & curve) whenever isDirected or showWeights changes
    cy.style()
      .selector('edge')
      .style({
        width: 2.8,
        'line-color': '#0284c7',
        opacity: 0.9,
        'curve-style': isDirected ? 'bezier' : 'straight',
        'target-arrow-shape': isDirected ? 'triangle' : 'none',
        'target-arrow-color': '#38bdf8',
        'arrow-scale': 1.25,
        label: showWeights ? 'data(weight)' : '',
      } as any)
      .update();

    // 4. Highlight selection & active edge creation
    cy.nodes().removeClass('selected visited in-queue path-node');
    cy.edges().removeClass('path-edge');

    selected.forEach((id) => {
      cy.$(`node#${id}`).addClass('selected');
    });

    if (edgeStart) {
      cy.$(`node#${edgeStart}`).addClass('selected');
    }

    // 5. Tool behavior: dragging/panning
    cy.userPanningEnabled(activeTool === 'pan' || activeTool === 'move');
    cy.boxSelectionEnabled(false);
    cy.nodes().grabify();
  }, [graph, selected, edgeStart, activeTool, isDirected]);

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

  // Direct vertex add helper from toolbar button
  const handleDirectAddVertex = () => {
    const nextLabel = getNextVertexLabel();
    // Stagger slightly from center
    const offset = (graph.vertices.length % 5) * 45;
    placedPositionsRef.current[nextLabel] = { x: 380 + offset, y: 270 + offset };
    addVertex(nextLabel);
  };

  return (
    <div className="relative w-full h-full min-h-[440px] select-none">
      {/* Visual Indicator when Add Edge mode is active */}
      {activeTool === 'addEdge' && (
        <div className="absolute top-4 left-20 z-30 px-3.5 py-1.5 rounded-xl bg-purple-900/95 border border-purple-400 text-white text-xs font-semibold shadow-[0_0_20px_rgba(147,51,234,0.7)] flex items-center gap-2">
          <LinkIcon size={14} className="text-purple-300 animate-spin" />
          <span>
            {edgeStart ? `Click 2nd node to connect with [${edgeStart}]` : 'Step 1: Click 1st node'}
          </span>
          {edgeStart && (
            <button
              onClick={() => {
                setEdgeStart(null);
                clearSelection();
              }}
              className="ml-2 px-1.5 py-0.5 rounded bg-purple-800 text-[10px] text-purple-200 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Visual Indicator when Add Vertex mode is active */}
      {activeTool === 'addVertex' && (
        <div className="absolute top-4 left-20 z-30 px-3.5 py-1.5 rounded-xl bg-cyan-900/95 border border-cyan-400 text-white text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.7)] flex items-center gap-2">
          <Plus size={14} className="text-cyan-300" />
          <span>Click anywhere on canvas to place a vertex</span>
          <button
            onClick={handleDirectAddVertex}
            className="ml-2 px-2.5 py-0.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-[11px] text-white font-bold cursor-pointer transition-colors shadow-md"
          >
            + Add Now
          </button>
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
          onClick={() => {
            const next = activeTool === 'addVertex' ? 'select' : 'addVertex';
            onToolChange?.(next);
          }}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'addVertex'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)] ring-2 ring-cyan-400'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Add Vertex (Click canvas to place)"
        >
          <Plus size={15} />
        </button>

        <button
          onClick={() => {
            const next = activeTool === 'addEdge' ? 'select' : 'addEdge';
            onToolChange?.(next);
            if (next === 'select') setEdgeStart(null);
          }}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'addEdge'
              ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.8)] ring-2 ring-purple-400'
              : 'text-slate-400 hover:text-white hover:bg-[#121938]'
          }`}
          title="Connect Edge (Click two nodes to connect)"
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

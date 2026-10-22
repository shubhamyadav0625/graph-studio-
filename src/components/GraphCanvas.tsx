// src/components/GraphCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph, useTheme } from '../context';
import type { VertexId, AlgorithmHighlightState } from '../types/graph';
import { MousePointer, Hand, ZoomIn, ZoomOut, Maximize2, Network } from 'lucide-react';

interface GraphCanvasProps {
  highlightState?: AlgorithmHighlightState | null;
}

const MOCKUP_COORDS: Record<string, { x: number; y: number }> = {
  '1': { x: 300, y: 70 },
  '2': { x: 170, y: 170 },
  '3': { x: 430, y: 170 },
  '6': { x: 300, y: 220 },
  '4': { x: 210, y: 330 },
  '5': { x: 390, y: 330 },
  '7': { x: 500, y: 260 },
  'A1': { x: 180, y: 100 },
  'A2': { x: 180, y: 200 },
  'A3': { x: 180, y: 300 },
  'B1': { x: 420, y: 100 },
  'B2': { x: 420, y: 200 },
  'B3': { x: 420, y: 300 },
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({ highlightState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const { theme } = useTheme();

  const {
    graph,
    addVertex,
    selected,
    toggleSelected,
  } = useGraph();

  // Initialise Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark';
    const nodeBg = isDark ? '#2a3465' : '#4f46e5';
    const nodeBorder = isDark ? '#6366f1' : '#4338ca';
    const edgeColor = isDark ? '#60a5fa' : '#6366f1';

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
            'background-color': nodeBg,
            'border-width': 2.5,
            'border-color': nodeBorder,
            color: '#ffffff',
            'font-family': 'system-ui, sans-serif',
            'font-weight': 'bold',
            'font-size': 14,
            'text-valign': 'center',
            'text-halign': 'center',
            width: 46,
            height: 46,
            'overlay-opacity': 0,
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 2.5,
            'line-color': edgeColor,
            opacity: 0.85,
            'curve-style': 'bezier',
            'overlay-opacity': 0,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: '.selected',
          style: {
            'border-width': 4,
            'border-color': '#818cf8',
            'background-color': '#4338ca',
            color: '#ffffff',
          },
        },
        {
          selector: '.visited',
          style: {
            'background-color': '#1d4ed8',
            'border-color': '#60a5fa',
            'border-width': 3.5,
            color: '#ffffff',
          },
        },
        {
          selector: '.root',
          style: {
            'background-color': '#059669',
            'border-color': '#10b981',
            'border-width': 4,
            color: '#ffffff',
          },
        },
        {
          selector: '.frontier',
          style: {
            'background-color': '#d97706',
            'border-color': '#f59e0b',
            'border-width': 3.5,
            color: '#ffffff',
          },
        },
        {
          selector: '.current-node',
          style: {
            'border-width': 5,
            'border-color': '#38bdf8',
            'background-color': '#0284c7',
            width: 52,
            height: 52,
          },
        },
        {
          selector: '.partition-a',
          style: {
            'background-color': '#4f46e5',
            'border-color': '#818cf8',
            'border-width': 3.5,
          },
        },
        {
          selector: '.partition-b',
          style: {
            'background-color': '#db2777',
            'border-color': '#f472b6',
            'border-width': 3.5,
          },
        },
        {
          selector: '.odd-cycle-node',
          style: {
            'border-color': '#ef4444',
            'border-width': 4.5,
          },
        },
        {
          selector: '.active-edge',
          style: {
            width: 4,
            'line-color': '#818cf8',
            opacity: 1,
          },
        },
        {
          selector: '.conflicting-edge',
          style: {
            width: 5,
            'line-color': '#ef4444',
            opacity: 1,
          },
        },
        {
          selector: '.traversed-edge',
          style: {
            width: 4.5,
            'line-color': '#10b981',
            opacity: 1,
          },
        },
        {
          selector: '.matched-edge',
          style: {
            width: 5.5,
            'line-color': '#ec4899',
            opacity: 1,
          },
        },
      ],
      layout: { name: 'preset' },
    });

    const cy = cyRef.current!;

    // Node click
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const id = node.id() as VertexId;
      toggleSelected(id);
    });

    // Background click adds node
    cy.on('tap', (event) => {
      if (event.target === cy) {
        const pan = cy.pan();
        const zoom = cy.zoom();
        const renderedPos = event.renderedPosition;
        const x = (renderedPos.x - pan.x) / zoom;
        const y = (renderedPos.y - pan.y) / zoom;

        const allNumbers = graph.vertices.every((v) => !isNaN(Number(v)));
        let newId = '';
        if (allNumbers && graph.vertices.length > 0) {
          const maxNum = Math.max(...graph.vertices.map((v) => Number(v)));
          newId = String(maxNum + 1);
        } else {
          newId = `v${graph.vertices.length + 1}`;
        }
        addVertex(newId);

        setTimeout(() => {
          const cyInst = cyRef.current;
          if (cyInst) {
            const added = cyInst.$(`node#${newId}`);
            if (added.length > 0) {
              added.position({ x, y });
            }
          }
        }, 30);
      }
    });

    // Zoom listener
    cy.on('zoom', () => {
      setZoomLevel(Math.round(cy.zoom() * 100));
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [theme]);

  // Sync elements & apply highlights
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const isDark = theme === 'dark';
    const defaultNodeBg = isDark ? '#2a3465' : '#4f46e5';
    const defaultNodeBorder = isDark ? '#6366f1' : '#4338ca';

    const currentNodeIds = new Set(cy.nodes().map((n) => n.id()));
    const graphNodeIds = new Set(graph.vertices);

    graph.vertices.forEach((v, index) => {
      if (!currentNodeIds.has(v)) {
        const presetPos = MOCKUP_COORDS[v];
        const defaultX = presetPos ? presetPos.x : 200 + (index % 4) * 80;
        const defaultY = presetPos ? presetPos.y : 150 + Math.floor(index / 4) * 90;

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
        cy.add({
          group: 'edges',
          data: { id, source: e.source, target: e.target },
        });
      }
    });

    currentEdgeIds.forEach((id) => {
      if (!graphEdgeIds.has(id)) {
        cy.$(`edge#${id}`).remove();
      }
    });

    // Clean classes and custom inline styles
    cy.nodes().removeClass('selected visited frontier root current-node partition-a partition-b odd-cycle-node');
    cy.edges().removeClass('active-edge conflicting-edge traversed-edge matched-edge');
    cy.nodes().forEach((n) => {
      n.style('background-color', defaultNodeBg);
      n.style('border-color', defaultNodeBorder);
    });

    selected.forEach((id) => {
      cy.$(`node#${id}`).addClass('selected');
    });

    // 1. Check highlightState prop
    if (highlightState) {
      if (highlightState.rootNode) {
        cy.$(`node#${highlightState.rootNode}`).addClass('root');
      }
      if (highlightState.currentNode) {
        cy.$(`node#${highlightState.currentNode}`).addClass('current-node');
      }
      if (highlightState.visitedNodes) {
        highlightState.visitedNodes.forEach((id) => {
          if (id !== highlightState.rootNode) {
            cy.$(`node#${id}`).addClass('visited');
          }
        });
      }
      if (highlightState.frontierNodes) {
        highlightState.frontierNodes.forEach((id) => {
          cy.$(`node#${id}`).addClass('frontier');
        });
      }

      // Bipartite partitions
      if (highlightState.partitionA) {
        highlightState.partitionA.forEach((id) => {
          cy.$(`node#${id}`).addClass('partition-a');
        });
      }
      if (highlightState.partitionB) {
        highlightState.partitionB.forEach((id) => {
          cy.$(`node#${id}`).addClass('partition-b');
        });
      }
      if (highlightState.oddCycle) {
        highlightState.oddCycle.forEach((id) => {
          cy.$(`node#${id}`).addClass('odd-cycle-node');
        });
      }
      if (highlightState.conflictingEdge) {
        const edgeId = makeEdgeId(highlightState.conflictingEdge.source, highlightState.conflictingEdge.target);
        cy.$(`edge#${edgeId}`).addClass('conflicting-edge');
      }

      // Graph Coloring
      if (highlightState.nodeColors) {
        Object.entries(highlightState.nodeColors).forEach(([vId, hexColor]) => {
          const node = cy.$(`node#${vId}`);
          if (node.length > 0) {
            node.style('background-color', hexColor);
            node.style('border-color', '#ffffff');
          }
        });
      }

      // Eulerian active edges
      if (highlightState.activeEdgeIds) {
        highlightState.activeEdgeIds.forEach((eid) => {
          cy.$(`edge#${eid}`).addClass('traversed-edge');
        });
      }

      // Matching edges
      if (highlightState.matchedEdgeIds) {
        highlightState.matchedEdgeIds.forEach((eid) => {
          cy.$(`edge#${eid}`).addClass('matched-edge');
        });
      }
    } else {
      // Legacy window fallbacks
      const bfsVisited = (window as any).bfsVisited as string[] | undefined;
      const bfsFrontier = (window as any).bfsFrontier as string[] | undefined;
      if (bfsVisited && bfsVisited.length > 0) {
        cy.$(`node#${bfsVisited[0]}`).addClass('root');
        bfsVisited.slice(1).forEach((id) => {
          cy.$(`node#${id}`).addClass('visited');
        });
      }
      if (bfsFrontier) {
        bfsFrontier.forEach((id) => {
          cy.$(`node#${id}`).addClass('frontier');
        });
      }
    }

    if (selected.length === 2) {
      const [a, b] = selected;
      const edgeId = makeEdgeId(a, b);
      cy.$(`edge#${edgeId}`).addClass('active-edge');
    }

    cy.nodes().grabify();
  }, [graph, selected, highlightState, theme]);

  const handleZoomIn = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({ level: cy.zoom() * 1.25, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  };

  const handleZoomOut = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({ level: cy.zoom() * 0.8, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  };

  const handleFit = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.fit(undefined, 50);
  };

  const handleAutoLayout = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 500,
      nodeRepulsion: () => 5000,
      idealEdgeLength: () => 100,
      padding: 40,
    } as any).run();
  };

  (window as any).graphCanvasAutoLayout = handleAutoLayout;

  const isDark = theme === 'dark';

  return (
    <div className={`relative w-full h-[450px] rounded-2xl overflow-hidden border ${
      isDark ? 'border-[#1e2646] bg-[#0c101d]' : 'border-slate-200 bg-white'
    } shadow-xl flex flex-col select-none transition-colors`}>
      {/* Floating Left Toolbar */}
      <div className={`absolute top-4 left-4 z-10 flex flex-col gap-1.5 p-1 rounded-xl ${
        isDark ? 'bg-[#141a30]/90 border border-[#212b4e]' : 'bg-white/95 border border-slate-200'
      } shadow-lg backdrop-blur-sm`}>
        <button
          onClick={() => setActiveTool('select')}
          className={`p-2 rounded-lg transition-colors ${
            activeTool === 'select'
              ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
              : 'text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="Select & Move"
        >
          <MousePointer size={15} />
        </button>

        <button
          onClick={() => setActiveTool('pan')}
          className={`p-2 rounded-lg transition-colors ${
            activeTool === 'pan'
              ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]'
              : 'text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="Pan View"
        >
          <Hand size={15} />
        </button>

        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={15} />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={15} />
        </button>

        <button
          onClick={handleFit}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          title="Fit Canvas"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Main Cytoscape Container */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-crosshair ${
          showGrid ? (isDark ? 'canvas-grid-dark' : 'canvas-grid-light') : ''
        }`}
      />

      {/* Bottom Zoom & Grid Bar */}
      <div className={`absolute bottom-3.5 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl ${
        isDark ? 'bg-[#141a30]/90 border border-[#212b4e]' : 'bg-white/95 border border-slate-200'
      } text-xs shadow-lg backdrop-blur-sm`}>
        <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          Zoom: {zoomLevel}%
        </span>
        <button
          onClick={handleZoomOut}
          className="w-5 h-5 flex items-center justify-center rounded bg-slate-200 dark:bg-[#1f284d] text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors font-bold"
        >
          -
        </button>
        <button
          onClick={handleZoomIn}
          className="w-5 h-5 flex items-center justify-center rounded bg-slate-200 dark:bg-[#1f284d] text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors font-bold"
        >
          +
        </button>
        <button
          onClick={handleFit}
          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-[#1f284d] text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors text-[10px] font-semibold"
        >
          Fit
        </button>
        <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-500 dark:text-slate-400">
          <span>Grid</span>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="accent-indigo-600 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Bottom-right Mini-Map Badge */}
      <div className={`absolute bottom-3.5 right-4 p-2.5 rounded-xl ${
        isDark ? 'bg-[#131930]/90 border border-[#212b4e]' : 'bg-white/95 border border-slate-200'
      } shadow-lg backdrop-blur-sm pointer-events-none`}>
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/30">
          <Network size={15} className="text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
    </div>
  );
};

export default GraphCanvas;

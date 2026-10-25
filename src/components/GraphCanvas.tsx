// src/components/GraphCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph, useTheme } from '../context';
import type { VertexId, AlgorithmHighlightState } from '../types/graph';
import { MousePointer, Hand, ZoomIn, ZoomOut, Maximize2, Network } from 'lucide-react';

interface GraphCanvasProps {
  highlightState?: AlgorithmHighlightState | null;
}

// Default layout coordinates matching Reference Image exactly
const REFERENCE_COORDS: Record<string, { x: number; y: number }> = {
  'A': { x: 380, y: 70 },
  'B': { x: 230, y: 180 },
  'C': { x: 530, y: 180 },
  'D': { x: 380, y: 250 },
  'E': { x: 230, y: 360 },
  'F': { x: 530, y: 360 },
  // Numeric fallbacks
  '1': { x: 380, y: 70 },
  '2': { x: 230, y: 180 },
  '3': { x: 530, y: 180 },
  '6': { x: 380, y: 250 },
  '4': { x: 230, y: 360 },
  '5': { x: 530, y: 360 },
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({ highlightState }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');
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
    const nodeBg = isDark ? '#1e3a8a' : '#2563eb';
    const nodeBorder = isDark ? '#38bdf8' : '#60a5fa';
    const edgeColor = isDark ? '#475569' : '#64748b';

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
            'font-family': 'system-ui, -apple-system, sans-serif',
            'font-weight': 'bold',
            'font-size': 13,
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
            width: 2,
            'line-color': edgeColor,
            opacity: 0.85,
            'curve-style': 'straight',
            label: 'data(weight)',
            'font-size': 10,
            color: '#94a3b8',
            'text-background-opacity': 0.8,
            'text-background-color': '#080d1a',
            'text-background-padding': '2px',
            'overlay-opacity': 0,
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.2,
          } as any,
        },
        {
          selector: '.selected',
          style: {
            'border-width': 3.5,
            'border-color': '#d946ef',
            'background-color': '#86198f',
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.root',
          style: {
            'background-color': '#9333ea',
            'border-color': '#c084fc',
            'border-width': 3.5,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.target-node',
          style: {
            'background-color': '#2563eb',
            'border-color': '#38bdf8',
            'border-width': 3.5,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.visited',
          style: {
            'background-color': '#2563eb',
            'border-color': '#60a5fa',
            'border-width': 3,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.frontier',
          style: {
            'background-color': '#0284c7',
            'border-color': '#38bdf8',
            'border-width': 3.5,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.current-node',
          style: {
            'border-width': 4.5,
            'border-color': '#38bdf8',
            'background-color': '#0284c7',
            width: 48,
            height: 48,
          } as any,
        },
        {
          selector: '.path-node',
          style: {
            'background-color': '#2563eb',
            'border-color': '#38bdf8',
            'border-width': 4,
            color: '#ffffff',
          } as any,
        },
        {
          selector: '.partition-a',
          style: {
            'background-color': '#9333ea',
            'border-color': '#c084fc',
            'border-width': 3.5,
          },
        },
        {
          selector: '.partition-b',
          style: {
            'background-color': '#0284c7',
            'border-color': '#38bdf8',
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
            width: 3.5,
            'line-color': '#818cf8',
            opacity: 1,
          },
        },
        {
          selector: '.conflicting-edge',
          style: {
            width: 4.5,
            'line-color': '#ef4444',
            opacity: 1,
          },
        },
        {
          selector: '.traversed-edge',
          style: {
            width: 3.5,
            'line-color': '#38bdf8',
            opacity: 1,
          },
        },
        {
          selector: '.matched-edge',
          style: {
            width: 4.5,
            'line-color': '#ec4899',
            opacity: 1,
          },
        },
        {
          selector: '.explored-edge',
          style: {
            width: 3,
            'line-color': '#38bdf8',
            opacity: 0.9,
          },
        },
        {
          selector: '.path-edge',
          style: {
            width: 4.5,
            'line-color': '#38bdf8',
            opacity: 1,
            'z-index': 10,
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
      // zoom tracked internally
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
    const defaultNodeBg = isDark ? '#1e3a8a' : '#2563eb';
    const defaultNodeBorder = isDark ? '#38bdf8' : '#60a5fa';

    const currentNodeIds = new Set(cy.nodes().map((n) => n.id()));
    const graphNodeIds = new Set(graph.vertices);

    graph.vertices.forEach((v, index) => {
      if (!currentNodeIds.has(v)) {
        const presetPos = REFERENCE_COORDS[v];
        const defaultX = presetPos ? presetPos.x : 200 + (index % 4) * 90;
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
    cy.nodes().removeClass('selected visited frontier root target-node current-node path-node partition-a partition-b odd-cycle-node');
    cy.edges().removeClass('active-edge conflicting-edge traversed-edge matched-edge explored-edge path-edge');
    cy.nodes().forEach((n) => {
      n.style('background-color', defaultNodeBg);
      n.style('border-color', defaultNodeBorder);
    });

    selected.forEach((id) => {
      cy.$(`node#${id}`).addClass('selected');
    });

    // Check highlightState prop
    if (highlightState) {
      if (highlightState.rootNode) {
        cy.$(`node#${highlightState.rootNode}`).addClass('root');
      }
      if (highlightState.targetNode) {
        cy.$(`node#${highlightState.targetNode}`).addClass('target-node');
      }
      if (highlightState.currentNode) {
        cy.$(`node#${highlightState.currentNode}`).addClass('current-node');
      }
      if (highlightState.visitedNodes) {
        highlightState.visitedNodes.forEach((id) => {
          if (id !== highlightState.rootNode && id !== highlightState.targetNode) {
            cy.$(`node#${id}`).addClass('visited');
          }
        });
      }
      if (highlightState.frontierNodes) {
        highlightState.frontierNodes.forEach((id) => {
          cy.$(`node#${id}`).addClass('frontier');
        });
      }

      // Shortest path nodes and edges
      if (highlightState.exploredEdgeIds) {
        highlightState.exploredEdgeIds.forEach((eid) => {
          cy.$(`edge#${eid}`).addClass('explored-edge');
        });
      }
      if (highlightState.pathEdgeIds) {
        highlightState.pathEdgeIds.forEach((eid) => {
          cy.$(`edge#${eid}`).addClass('path-edge');
        });
      }
      if (highlightState.pathNodes) {
        highlightState.pathNodes.forEach((id) => {
          if (id === highlightState.rootNode) {
            cy.$(`node#${id}`).addClass('root');
          } else if (id === highlightState.targetNode) {
            cy.$(`node#${id}`).addClass('target-node');
          } else {
            cy.$(`node#${id}`).addClass('path-node');
          }
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
    cy.fit(undefined, 40);
  };

  const handleAutoLayout = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 400,
      nodeRepulsion: () => 6000,
      idealEdgeLength: () => 110,
      padding: 40,
    } as any).run();
  };

  (window as any).graphCanvasAutoLayout = handleAutoLayout;

  return (
    <div className="relative w-full h-[400px] lg:h-[420px] rounded-2xl overflow-hidden border border-[#16213e] bg-[#070d1d] shadow-2xl flex flex-col select-none transition-colors">
      {/* Top Left Floating Canvas Toolbar matching Reference Image */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-[#0e162f]/90 border border-[#1d2b52] shadow-lg backdrop-blur-md">
        <button
          onClick={() => setActiveTool('select')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'select'
              ? 'bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Select & Move"
        >
          <MousePointer size={14} />
        </button>

        <button
          onClick={() => setActiveTool('pan')}
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'pan'
              ? 'bg-[#3b82f6] text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Pan View"
        >
          <Hand size={14} />
        </button>

        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={handleFit}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Fit Canvas"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Top Right Mini-Map Box matching Reference Image */}
      <div className="absolute top-3.5 right-3.5 z-10 w-24 h-20 rounded-xl bg-[#0c132a]/90 border border-[#1d2b52] shadow-xl backdrop-blur-md p-2 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full flex items-center justify-center">
          <Network size={36} className="text-[#3b82f6]/40" />
          <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-[#c084fc] shadow-[0_0_6px_rgba(192,132,252,0.8)]" />
          <div className="absolute bottom-2 right-3 w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
          <div className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
        </div>
      </div>

      {/* Main Cytoscape Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair canvas-grid-dark"
      />
    </div>
  );
};

export default GraphCanvas;

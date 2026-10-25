// src/components/AlgorithmsView.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Cytoscape from 'cytoscape';
import { useGraph } from '../context';
import { bfsSteps } from '../algorithms/bfsSteps';
import { dfsSteps } from '../algorithms/dfsSteps';
import { shortestPathSteps } from '../algorithms/shortestPathSteps';
import { detectCycle } from '../algorithms/detectCycle';
import { connectedComponents } from '../algorithms/connectedComponents';
import { bipartiteSteps } from '../algorithms/bipartiteSteps';
import { eulerianSteps } from '../algorithms/eulerianSteps';
import { graphColoringSteps, COLOR_PALETTE } from '../algorithms/graphColoringSteps';
import { bipartiteMatchingSteps } from '../algorithms/bipartiteMatchingSteps';
import type { AlgorithmHighlightState } from '../types/graph';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  RotateCcw,
  ChevronDown,
  MousePointer,
  Hand,
  Trash2,
  Share2,
  Layers,
  CircleDot,
  CheckCircle,
  HelpCircle,
  Scissors,
  Check,
} from 'lucide-react';

type AlgorithmId =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'cycle'
  | 'components'
  | 'bipartite'
  | 'eulerian'
  | 'coloring'
  | 'matching';

interface AlgorithmsViewProps {
  onHighlightChange?: (state: AlgorithmHighlightState | null) => void;
}

interface StepItem {
  step: number;
  current: string | undefined;
  visited: Set<string>;
  queue: string[];
  stack: string[];
  message: string;
  order: string[];
  colors: Record<string, string>;
}

const ALGORITHMS_META: Record<
  AlgorithmId,
  {
    name: string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
  }
> = {
  bfs: {
    name: 'BFS (Breadth-First Search)',
    description: 'Explores all neighbors at the current level before moving to the next level.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  dfs: {
    name: 'DFS (Depth-First Search)',
    description: 'Explores as far as possible along each branch before backtracking.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  dijkstra: {
    name: "Dijkstra's / BFS Shortest Path",
    description: 'Finds the shortest path from the source vertex to target or all vertices.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  cycle: {
    name: 'Cycle Detection',
    description: 'Finds cycles in undirected or directed graphs using DFS back-edges.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  components: {
    name: 'Connected Components',
    description: 'Identifies all maximal connected subgraphs in the graph.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  bipartite: {
    name: 'Bipartite Test',
    description: 'Determines if the graph is 2-colorable or detects an odd-length cycle.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  eulerian: {
    name: "Eulerian Path",
    description: 'Finds a closed trail or circuit that visits every edge exactly once.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(E)',
  },
  coloring: {
    name: 'Graph Coloring',
    description: 'Assigns colors so no adjacent vertices share a color.',
    timeComplexity: 'O(V²)',
    spaceComplexity: 'O(V)',
  },
  matching: {
    name: 'Matching',
    description: 'Finds the maximum set of independent edges in a bipartite graph.',
    timeComplexity: 'O(V · E)',
    spaceComplexity: 'O(V)',
  },
};

const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({ onHighlightChange: _onHighlightChange }) => {
  const { graph, addVertex, addEdge, removeVertex, selected, toggleSelected, clearSelection } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('bfs');
  const [sourceVertex, setSourceVertex] = useState<string>(() => graph.vertices[0] || 'A');
  const [targetVertex, setTargetVertex] = useState<string>(() => graph.vertices[graph.vertices.length - 1] || 'F');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'addVertex' | 'addEdge'>('select');
  const [edgeStartVertex, setEdgeStartVertex] = useState<string | null>(null);

  // Checkbox settings matching screenshot
  const [showAnimation, setShowAnimation] = useState(true);
  const [showQueueSet, setShowQueueSet] = useState(true);
  const [highlightLevels, setHighlightLevels] = useState(false);

  // Cytoscape Canvas Reference
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);

  // Synchronize source/target vertex options with current graph
  useEffect(() => {
    if (graph.vertices.length > 0) {
      if (!graph.vertices.includes(sourceVertex)) {
        setSourceVertex(graph.vertices[0]);
      }
      if (!graph.vertices.includes(targetVertex)) {
        setTargetVertex(graph.vertices[graph.vertices.length - 1]);
      }
    }
  }, [graph.vertices, sourceVertex, targetVertex]);

  // Generate algorithm steps whenever algorithm, source, target, or graph changes
  const { steps, finalResult } = useMemo<{ steps: StepItem[]; finalResult: { title: string; text: string; status: string } }>(() => {
    if (graph.vertices.length === 0) {
      return {
        steps: [
          {
            step: 0,
            current: undefined,
            visited: new Set<string>(),
            queue: [],
            stack: [],
            message: 'Graph is empty. Add vertices to run algorithms.',
            order: [],
            colors: {},
          },
        ],
        finalResult: { title: 'BFS Traversal Order:', text: 'None', status: 'Running...' },
      };
    }

    const start = graph.vertices.includes(sourceVertex) ? sourceVertex : graph.vertices[0];
    const target = graph.vertices.includes(targetVertex) ? targetVertex : graph.vertices[graph.vertices.length - 1];

    switch (selectedAlgo) {
      case 'bfs': {
        const raw = Array.from(bfsSteps(graph, start));
        const sList: StepItem[] = raw.map((s, idx) => {
          const curr = s.queue[0] || (idx === 0 ? start : undefined);
          return {
            step: idx,
            current: curr,
            visited: new Set(s.visited),
            queue: [...s.queue],
            stack: [],
            message: curr
              ? `Visiting vertex ${curr}. Queue contains: [${s.queue.join(', ')}].`
              : idx === 0
              ? `Initialize BFS from source vertex ${start}.`
              : 'BFS traversal completed.',
            order: Array.from(s.visited),
            colors: {},
          };
        });
        const lastOrder = sList[sList.length - 1]?.order || [];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: start, visited: new Set([start]), queue: [start], stack: [], message: `Visiting vertex ${start}. Queue contains: [${start}].`, order: [start], colors: {} }],
          finalResult: {
            title: 'BFS Traversal Order:',
            text: lastOrder.length > 0 ? lastOrder.join(' → ') : 'A → B → C → D → E → F',
            status: 'Running...',
          },
        };
      }

      case 'dfs': {
        const raw = Array.from(dfsSteps(graph, start));
        const sList: StepItem[] = raw.map((s, idx) => ({
          step: idx,
          current: s.current,
          visited: new Set(s.visited),
          queue: [],
          stack: [...s.stack],
          message: s.current
            ? `Visiting vertex ${s.current}. Current call stack: [${s.stack.join(', ')}].`
            : idx === 0
            ? `Initialize DFS from source vertex ${start}.`
            : 'DFS traversal completed.',
          order: Array.from(s.visited),
          colors: {},
        }));
        const lastOrder = sList[sList.length - 1]?.order || [];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: start, visited: new Set([start]), queue: [], stack: [start], message: 'Done', order: [start], colors: {} }],
          finalResult: {
            title: 'DFS Traversal Order:',
            text: lastOrder.join(' → ') || 'None',
            status: 'Completed',
          },
        };
      }

      case 'dijkstra': {
        const raw = Array.from(shortestPathSteps(graph, start, target));
        const sList: StepItem[] = raw.map((s, idx) => ({
          step: idx,
          current: s.currentVertex || undefined,
          visited: new Set(s.visited),
          queue: [...s.queue],
          stack: [],
          message: s.message || `Visiting ${s.currentVertex}.`,
          order: [...s.shortestPath],
          colors: {},
        }));
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: start, visited: new Set([start]), queue: [], stack: [], message: 'Done', order: [start], colors: {} }],
          finalResult: {
            title: `Shortest Path (${start} → ${target}):`,
            text: lastStep?.shortestPath?.length ? lastStep.shortestPath.join(' → ') : 'No path found',
            status: lastStep?.shortestPath?.length ? `Cost: ${lastStep.shortestPath.length - 1}` : 'No Path',
          },
        };
      }

      case 'cycle': {
        const cyclePath = detectCycle(graph);
        const hasCycle = cyclePath.length > 0;
        const stepsArr: StepItem[] = [
          {
            step: 0,
            current: graph.vertices[0],
            visited: new Set(cyclePath),
            queue: [],
            stack: cyclePath,
            message: hasCycle
              ? `Cycle detected: ${cyclePath.join(' → ')}`
              : 'No cycle found in the graph. The graph is acyclic.',
            order: cyclePath,
            colors: {},
          },
        ];
        return {
          steps: stepsArr,
          finalResult: {
            title: 'Cycle Detection Result:',
            text: hasCycle ? `Cycle: ${cyclePath.join(' → ')}` : 'Acyclic (No cycles found)',
            status: hasCycle ? 'Cycle Found' : 'Acyclic',
          },
        };
      }

      case 'components': {
        const comps = connectedComponents(graph);
        const stepsArr: StepItem[] = comps.map((comp, idx) => ({
          step: idx,
          current: comp[0],
          visited: new Set(comp),
          queue: [],
          stack: [],
          message: `Component ${idx + 1}: Vertices {${comp.join(', ')}}`,
          order: comp,
          colors: {},
        }));
        return {
          steps: stepsArr.length > 0 ? stepsArr : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Empty', order: [], colors: {} }],
          finalResult: {
            title: 'Connected Components Result:',
            text: `${comps.length} component(s): ${comps.map((c) => `{${c.join(',')}}`).join(', ')}`,
            status: `${comps.length} Component${comps.length === 1 ? '' : 's'}`,
          },
        };
      }

      case 'bipartite': {
        const raw = Array.from(bipartiteSteps(graph));
        const sList: StepItem[] = raw.map((s, idx) => {
          const cols: Record<string, string> = {};
          Object.entries(s.colors).forEach(([v, c]) => {
            cols[v] = c === 0 ? '#38bdf8' : '#c084fc';
          });
          return {
            step: idx,
            current: s.currentVertex || undefined,
            visited: new Set(Object.keys(s.colors)),
            queue: [],
            stack: [],
            message: s.message,
            order: Object.keys(s.colors),
            colors: cols,
          };
        });
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Bipartite Test Result:',
            text: lastStep?.isBipartite
              ? 'Graph is Bipartite (2-colorable with no monochromatic edges).'
              : `Graph is Not Bipartite (Odd cycle: ${lastStep?.oddCycle?.join(' → ') || 'detected'}).`,
            status: lastStep?.isBipartite ? 'Bipartite' : 'Not Bipartite',
          },
        };
      }

      case 'eulerian': {
        const raw = Array.from(eulerianSteps(graph));
        const sList: StepItem[] = raw.map((s, idx) => ({
          step: idx,
          current: s.currentVertex || undefined,
          visited: new Set(s.eulerianTrail),
          queue: [],
          stack: [],
          message: s.message,
          order: s.eulerianTrail,
          colors: {},
        }));
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Eulerian Analysis Result:',
            text: lastStep?.isEulerian
              ? `Trail/Circuit: ${lastStep.eulerianTrail.join(' → ')}`
              : lastStep?.message || 'No Eulerian Trail/Circuit exists',
            status: lastStep?.isEulerian ? 'Eulerian' : 'Non-Eulerian',
          },
        };
      }

      case 'coloring': {
        const raw = Array.from(graphColoringSteps(graph));
        const sList: StepItem[] = raw.map((s, idx) => {
          const cols: Record<string, string> = {};
          Object.entries(s.assignedColors).forEach(([v, cIndex]) => {
            cols[v] = COLOR_PALETTE[cIndex % COLOR_PALETTE.length];
          });
          return {
            step: idx,
            current: s.currentVertex || undefined,
            visited: new Set(Object.keys(s.assignedColors)),
            queue: [],
            stack: [],
            message: s.message,
            order: Object.keys(s.assignedColors),
            colors: cols,
          };
        });
        const lastStep = raw[raw.length - 1];
        const numColors = lastStep ? new Set(Object.values(lastStep.assignedColors)).size : 0;
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Chromatic Bound Result:',
            text: `Colored using ${numColors} colors (Welsh-Powell upper bound: ${lastStep?.chromaticUpperBound || numColors})`,
            status: `χ(G) ≤ ${numColors}`,
          },
        };
      }

      case 'matching': {
        const raw = Array.from(bipartiteMatchingSteps(graph));
        const sList: StepItem[] = raw.map((s, idx) => {
          const cols: Record<string, string> = {};
          s.partitionA.forEach((v) => {
            cols[v] = '#38bdf8';
          });
          s.partitionB.forEach((v) => {
            cols[v] = '#c084fc';
          });
          return {
            step: idx,
            current: s.currentVertex || undefined,
            visited: new Set(s.matchedPairs.flatMap((p) => [p.u, p.v])),
            queue: [],
            stack: [],
            message: s.message,
            order: s.matchedPairs.map((p) => `${p.u}-${p.v}`),
            colors: cols,
          };
        });
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Maximum Matching Result:',
            text: lastStep?.isBipartite
              ? `Max Matching Size: ${lastStep.maxMatchingSize} (${lastStep.matchedPairs.map((p) => `${p.u}—${p.v}`).join(', ') || 'none'})`
              : 'Graph is not bipartite. Bipartite matching not applicable.',
            status: lastStep?.isBipartite ? `Size: ${lastStep.maxMatchingSize}` : 'Not Bipartite',
          },
        };
      }

      default:
        return {
          steps: [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Select an algorithm', order: [], colors: {} }],
          finalResult: { title: 'Result', text: 'Select an algorithm', status: 'Idle' },
        };
    }
  }, [graph, selectedAlgo, sourceVertex, targetVertex]);

  // Ensure current step index is within valid bounds
  const currentStepData: StepItem =
    steps[Math.min(stepIndex, Math.max(0, steps.length - 1))] || {
      step: 0,
      current: undefined,
      visited: new Set(),
      queue: [],
      stack: [],
      message: '',
      order: [],
      colors: {},
    };

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (playing) {
      timer = setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing, steps.length]);

  // Setup & Render Cytoscape Canvas with EXACT styling from UI screenshot
  useEffect(() => {
    if (!containerRef.current) return;

    if (!cyRef.current) {
      cyRef.current = Cytoscape({
        container: containerRef.current,
        elements: [],
        boxSelectionEnabled: false,
        autoungrabify: false,
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'center',
              'text-halign': 'center',
              color: '#ffffff',
              'font-size': '15px',
              'font-weight': 'bold',
              'font-family': 'ui-sans-serif, system-ui, sans-serif',
              'background-color': '#0084c7',
              'border-width': 3,
              'border-color': '#38bdf8',
              width: 48,
              height: 48,
              'transition-property': 'background-color, border-color, width, height',
              'transition-duration': '0.2s',
            } as any,
          },
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#38bdf8',
              'target-arrow-shape': 'none',
              'curve-style': 'straight',
              opacity: 0.95,
            } as any,
          },
        ],
        layout: { name: 'preset' },
      });

      // Canvas click handling
      cyRef.current.on('tap', (evt) => {
        if (evt.target === cyRef.current) {
          if (activeTool === 'addVertex') {
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
          }
        } else if (evt.target.isNode()) {
          const clickedId = evt.target.id();
          if (activeTool === 'addEdge') {
            if (!edgeStartVertex) {
              setEdgeStartVertex(clickedId);
            } else {
              if (edgeStartVertex !== clickedId) {
                addEdge(edgeStartVertex, clickedId);
              }
              setEdgeStartVertex(null);
            }
          } else {
            toggleSelected(clickedId);
          }
        }
      });
    }

    const cy = cyRef.current;
    if (!cy) return;

    // Fixed coordinates matching the exact arrangement in the user's screenshot:
    // A at the top, B at left, C at right, D in center, E at bottom-left, F at bottom-right
    const referenceCoords: Record<string, { x: number; y: number }> = {
      A: { x: 250, y: 55 },
      B: { x: 140, y: 135 },
      C: { x: 360, y: 135 },
      D: { x: 250, y: 190 },
      E: { x: 140, y: 275 },
      F: { x: 360, y: 275 },
      '1': { x: 250, y: 55 },
      '2': { x: 140, y: 135 },
      '3': { x: 360, y: 135 },
      '4': { x: 250, y: 190 },
      '5': { x: 140, y: 275 },
      '6': { x: 360, y: 275 },
    };

    const elements: Cytoscape.ElementDefinition[] = [];
    const count = graph.vertices.length;

    graph.vertices.forEach((v, index) => {
      let pos = referenceCoords[v];
      if (!pos) {
        const angle = (2 * Math.PI * index) / Math.max(1, count);
        pos = {
          x: 250 + 130 * Math.sin(angle),
          y: 165 - 110 * Math.cos(angle),
        };
      }

      elements.push({
        group: 'nodes',
        data: { id: v, label: v },
        position: pos,
      });
    });

    graph.edges.forEach((e, i) => {
      elements.push({
        group: 'edges',
        data: {
          id: `e-${e.source}-${e.target}-${i}`,
          source: e.source,
          target: e.target,
        },
      });
    });

    cy.elements().remove();
    cy.add(elements);

    // Apply exact step visual highlights matching UI screenshot:
    // Current node A: Purple body with Magenta glow border
    // Visited node: Emerald green
    // Queue node: Cyan/blue
    // Unvisited: Dark Slate
    const current = currentStepData.current;
    const visitedSet = currentStepData.visited || new Set();
    const queueList = currentStepData.queue || [];
    const colorMap: Record<string, string> = currentStepData.colors || {};

    cy.nodes().forEach((node) => {
      const id = node.id();

      if (colorMap[id]) {
        node.style({
          'background-color': colorMap[id],
          'border-color': '#ffffff',
          'border-width': id === current ? 4 : 3,
          width: id === current ? 52 : 46,
          height: id === current ? 52 : 46,
        });
      } else if (id === current) {
        // Current Node (Purple center with Magenta glow border as in image for node A)
        node.style({
          'background-color': '#9333ea',
          'border-color': '#e879f9',
          'border-width': 5,
          width: 52,
          height: 52,
        });
      } else if (visitedSet.has(id)) {
        // Visited Node (Emerald green)
        node.style({
          'background-color': '#059669',
          'border-color': '#34d399',
          'border-width': 3,
          width: 48,
          height: 48,
        });
      } else if (queueList.includes(id)) {
        // In Queue / Frontier Node (Cyan neon glow as in B, C, D, E, F)
        node.style({
          'background-color': '#0284c7',
          'border-color': '#38bdf8',
          'border-width': 3,
          width: 48,
          height: 48,
        });
      } else {
        // Unvisited Node
        node.style({
          'background-color': '#334155',
          'border-color': '#64748b',
          'border-width': 2.5,
          width: 46,
          height: 46,
        });
      }
    });

    cy.userPanningEnabled(activeTool === 'pan');
  }, [graph, currentStepData, activeTool, edgeStartVertex, toggleSelected, addVertex, addEdge]);

  // Direct editing helpers
  const handleAddVertexDirectly = () => {
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
  };

  const handleDeleteSelected = () => {
    selected.forEach((v) => removeVertex(v));
    clearSelection();
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 35);
  };

  // Total steps
  const totalSteps = Math.max(1, steps.length);
  const displayStep = Math.min(stepIndex + 1, totalSteps);

  // Visited count & percentage calculation for Traversal Progress card
  const visitedCount = currentStepData.visited?.size || 1;
  const inQueueCount = currentStepData.queue?.length || 1;
  const unvisitedCount = Math.max(0, graph.vertices.length - visitedCount);
  const visitedPct = graph.vertices.length > 0 ? ((visitedCount / graph.vertices.length) * 100).toFixed(1) : '16.7';

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans text-slate-100">
      {/* 1. Header Row Banner with Purple Glowing Wave matching UI image */}
      <div className="relative rounded-2xl p-4 bg-gradient-to-r from-[#0b0e27] via-[#0d1232] to-[#140b2f] border border-[#201c4e] overflow-hidden flex items-center justify-between shadow-xl">
        {/* Ambient background glowing wave */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/30 via-fuchsia-500/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_20px_rgba(110,43,245,0.7)] flex-shrink-0">
            <Play size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-tight">
              Graph Algorithm Visualizer
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Run and visualize graph algorithms with step-by-step execution and real-time interactive canvas.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Algorithm Selector Pill Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'bfs' as const, label: 'DFS', icon: Share2 },
          { id: 'dfs' as const, label: 'DFS', icon: Layers },
          { id: 'dijkstra' as const, label: 'Dijkstra', icon: CircleDot },
          { id: 'cycle' as const, label: 'Cycle Detection', icon: RotateCcw },
          { id: 'components' as const, label: 'Connected Components', icon: Layers },
          { id: 'bipartite' as const, label: 'Bipartite Test', icon: CheckCircle },
          { id: 'eulerian' as const, label: 'Eulerian Path', icon: HelpCircle },
          { id: 'coloring' as const, label: 'Graph Coloring', icon: CircleDot },
          { id: 'matching' as const, label: 'Matching', icon: Scissors },
        ].map((tab, idx) => {
          const isSelected = (tab.id === 'bfs' && selectedAlgo === 'bfs') || (idx > 0 && selectedAlgo === tab.id);
          const Icon = tab.icon;
          return (
            <button
              key={`${tab.id}-${idx}`}
              onClick={() => {
                setSelectedAlgo(tab.id);
                setStepIndex(0);
                setPlaying(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.75)]'
                  : 'bg-[#0c102a] border border-[#1a234a] text-slate-400 hover:text-white hover:border-[#2b3970]'
              }`}
            >
              <Icon size={13} className={isSelected ? 'text-white' : 'text-slate-400'} />
              <span>{idx === 0 ? 'DFS' : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main 3-Column Visualizer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Column 1 (span 3.5): BFS Info, Complexity & Configuration Card */}
        <div className="lg:col-span-3 xl:col-span-3 p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Title with Layer icon */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-lg text-purple-400">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {ALGORITHMS_META[selectedAlgo].name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {ALGORITHMS_META[selectedAlgo].description}
                </p>
              </div>
            </div>

            {/* Complexity Badges */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <CircleDot size={12} className="text-purple-400" />
                <span>Complexity</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-[#0e1434] border border-[#1b2650] text-xs font-mono font-semibold text-slate-200">
                  Time: {ALGORITHMS_META[selectedAlgo].timeComplexity}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-[#0e1434] border border-[#1b2650] text-xs font-mono font-semibold text-slate-200">
                  Space: {ALGORITHMS_META[selectedAlgo].spaceComplexity}
                </span>
              </div>
            </div>

            {/* Configuration */}
            <div className="pt-2 border-t border-[#151d3e] space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>⚙</span>
                <span>Configuration</span>
              </div>

              {/* Source Vertex Select */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Source Vertex</label>
                <div className="relative">
                  <select
                    value={sourceVertex}
                    onChange={(e) => setSourceVertex(e.target.value)}
                    className="w-full bg-[#0e1434] border border-[#1c2752] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#6e2bf5] appearance-none cursor-pointer"
                  >
                    {graph.vertices.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Checkboxes matching UI screenshot */}
              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    onClick={() => setShowAnimation(!showAnimation)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      showAnimation ? 'bg-[#7c3aed] text-white' : 'bg-[#0e1434] border border-[#1c2752]'
                    }`}
                  >
                    {showAnimation && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-slate-300">Show traversal animation</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    onClick={() => setShowQueueSet(!showQueueSet)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      showQueueSet ? 'bg-[#7c3aed] text-white' : 'bg-[#0e1434] border border-[#1c2752]'
                    }`}
                  >
                    {showQueueSet && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-slate-300">Show queue/visited set</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    onClick={() => setHighlightLevels(!highlightLevels)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      highlightLevels ? 'bg-[#7c3aed] text-white' : 'bg-[#0e1434] border border-[#1c2752]'
                    }`}
                  >
                    {highlightLevels && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className="text-slate-400">Highlight traversal levels</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 (span 5.5): Interactive Dot-Grid Canvas with 5-Node Graph */}
        <div className="lg:col-span-6 xl:col-span-6 p-3.5 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl relative flex flex-col justify-between">
          {/* Top Floating Canvas Toolbar */}
          <div className="flex items-center justify-between mb-2 z-10 px-1">
            {/* Left Tools: Pointer, Hand, +Node, +Edge, Delete */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b102b]/90 backdrop-blur-md border border-[#1b2650] shadow-md">
              <button
                onClick={() => {
                  setActiveTool('select');
                  setEdgeStartVertex(null);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'select'
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_10px_rgba(110,43,245,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Select"
              >
                <MousePointer size={14} />
              </button>
              <button
                onClick={() => {
                  setActiveTool('pan');
                  setEdgeStartVertex(null);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'pan'
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Hand / Pan"
              >
                <Hand size={14} />
              </button>
              <button
                onClick={handleAddVertexDirectly}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0e1538] hover:bg-[#162152] border border-[#1c2752] text-xs font-semibold text-cyan-400 transition-colors"
                title="Add Node"
              >
                <span>+ Node</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool(activeTool === 'addEdge' ? 'select' : 'addEdge');
                  setEdgeStartVertex(null);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  activeTool === 'addEdge'
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white border-transparent'
                    : 'bg-[#0e1538] hover:bg-[#162152] border-[#1c2752] text-purple-400'
                }`}
                title="Connect Edge"
              >
                <span>{edgeStartVertex ? `Connect ${edgeStartVertex} →` : '+ Edge'}</span>
              </button>
              <button
                onClick={handleDeleteSelected}
                className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 border border-rose-900/50 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Right Tools: Undo, Redo, Maximize, Settings */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-xl bg-[#0b102b]/90 border border-[#1b2650] text-slate-300 hover:text-white"
                title="Undo Step"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="p-1.5 rounded-xl bg-[#0b102b]/90 border border-[#1b2650] text-slate-300 hover:text-white"
                title="Redo Step"
              >
                <RotateCcw size={14} className="transform -scale-x-100" />
              </button>
              <button
                onClick={handleFit}
                className="p-1.5 rounded-xl bg-[#0b102b]/90 border border-[#1b2650] text-slate-300 hover:text-white"
                title="Fit to Screen"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          {/* Canvas Container with Dot Grid Background */}
          <div
            className="h-[310px] w-full relative rounded-xl overflow-hidden border border-[#141c3d]"
            style={{
              backgroundColor: '#060919',
              backgroundImage: 'radial-gradient(rgba(147, 51, 234, 0.25) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          >
            <div ref={containerRef} className="w-full h-full" />
          </div>

          {/* Bottom Canvas Legend */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea] shadow-[0_0_8px_rgba(147,51,234,0.9)]" />
              <span>Current</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
              <span>Visited</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shadow-[0_0_8px_rgba(2,132,199,0.9)]" />
              <span>In Queue / Frontier</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
              <span>Unvisited</span>
            </span>
          </div>
        </div>

        {/* Column 3 (span 3): Step Execution & Algorithm State Cards */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-3.5 flex flex-col justify-between">
          {/* Step Execution Card with Step Counter & Player Controls */}
          <div className="p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-purple-400">
                  <Share2 size={15} />
                </div>
                <h3 className="text-xs font-bold text-white">Step Execution</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#c084fc]">
                Step {displayStep} / {totalSteps}
              </span>
            </div>

            {/* Stepper Progress Dots & Bar */}
            <div className="w-full h-2 rounded-full bg-[#131a3a] overflow-hidden flex items-center p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6e2bf5] to-[#c084fc] shadow-[0_0_8px_rgba(192,132,252,0.8)] transition-all duration-300"
                style={{ width: `${(displayStep / totalSteps) * 100}%` }}
              />
            </div>

            {/* Playback Button Controls: First, Prev, Play/Pause, Next, Last, Reset */}
            <div className="flex items-center justify-between pt-1 px-1">
              <button
                onClick={() => setStepIndex(0)}
                className="p-2 rounded-xl bg-[#0e1434] border border-[#1c2752] text-slate-300 hover:text-white"
                title="First Step"
              >
                <Rewind size={14} />
              </button>
              <button
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl bg-[#0e1434] border border-[#1c2752] text-slate-300 hover:text-white"
                title="Previous"
              >
                <span className="font-bold text-xs">‹</span>
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-3 rounded-full bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] hover:from-[#7e3cf7] hover:to-[#b96aff] text-white shadow-[0_0_18px_rgba(110,43,245,0.8)]"
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              </button>
              <button
                onClick={() => setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="p-2 rounded-xl bg-[#0e1434] border border-[#1c2752] text-slate-300 hover:text-white"
                title="Next"
              >
                <span className="font-bold text-xs">›</span>
              </button>
              <button
                onClick={() => setStepIndex(steps.length - 1)}
                className="p-2 rounded-xl bg-[#0e1434] border border-[#1c2752] text-slate-300 hover:text-white"
                title="Last Step"
              >
                <FastForward size={14} />
              </button>
              <button
                onClick={() => {
                  setStepIndex(0);
                  setPlaying(false);
                }}
                className="p-2 rounded-xl bg-[#0e1434] border border-[#1c2752] text-slate-400 hover:text-white"
                title="Reset"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Algorithm State Card: Queue (FIFO), Visited Set, Current Order */}
          <div className="p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="text-purple-400">
                <Share2 size={15} />
              </div>
              <h3 className="text-xs font-bold text-white">Algorithm State</h3>
            </div>

            {/* Queue (FIFO) */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1">
                <span className="text-cyan-400">⦿</span>
                <span>Queue (FIFO)</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070b1f] border border-[#161f44] flex items-center gap-1.5 min-h-[36px]">
                {(currentStepData.queue.length > 0 ? currentStepData.queue : [sourceVertex]).map((v, i) => (
                  <span
                    key={`${v}-${i}`}
                    className="w-6 h-6 rounded-md bg-[#0284c7] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(2,132,199,0.9)]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Visited Set */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1">
                <span className="text-emerald-400">♥</span>
                <span>Visited Set</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070b1f] border border-[#161f44] flex items-center gap-1.5 min-h-[36px]">
                {(Array.from(currentStepData.visited).length > 0 ? Array.from(currentStepData.visited) : [sourceVertex]).map((v) => (
                  <span
                    key={v}
                    className="w-6 h-6 rounded-md bg-[#10b981] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Order */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1">
                <span className="text-purple-400">⦿</span>
                <span>Current Order</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070b1f] border border-[#161f44] font-mono text-xs text-white font-bold text-center">
                {currentStepData.order.length > 0 ? currentStepData.order.join(' → ') : sourceVertex}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row 3 Cards: Current Step Explanation, Traversal Progress, Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Card 1: Current Step Explanation (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-purple-400">📖</span>
            <h3 className="text-xs font-bold text-white">Current Step Explanation</h3>
          </div>
          <div className="text-sm font-bold text-[#c084fc]">
            Step {displayStep}: Visit Vertex {currentStepData.current || sourceVertex}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStepData.message || `Visiting vertex ${sourceVertex}. Queue contains: [${sourceVertex}].`}
          </p>
        </div>

        {/* Card 2: Traversal Progress (span 4) with Circular Progress Ring */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-purple-400">📊</span>
              <h3 className="text-xs font-bold text-white">Traversal Progress</h3>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-slate-200">
                  Visited: {visitedCount} ({visitedPct}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-slate-300">
                  In Queue: {inQueueCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
                <span className="text-slate-400">
                  Unvisited: {unvisitedCount}
                </span>
              </div>
            </div>
          </div>

          {/* Donut progress ring matching screenshot: 1/6 with purple gradient ring */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="#131a38" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#c084fc"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="201"
                strokeDashoffset={201 - (201 * visitedCount) / Math.max(1, graph.vertices.length)}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-sm font-bold text-white font-mono">
                {visitedCount}/{graph.vertices.length || 6}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Result (span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-purple-400">🏆</span>
              <h3 className="text-xs font-bold text-white">Result</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-700/80 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Running...</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-semibold">{finalResult.title}</div>
          <div className="p-2 rounded-xl bg-[#070b1f] border border-[#161f44] font-mono text-xs font-bold text-white text-center break-words">
            {finalResult.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

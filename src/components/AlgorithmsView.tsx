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
import type { AlgorithmHighlightState, VertexId } from '../types/graph';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Maximize2,
  MousePointer,
  Hand,
  Plus,
  Minus,
  PlusCircle,
  Trash2,
  Link as LinkIcon,
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
    name: 'Bipartite 2-Coloring Test',
    description: 'Determines if the graph is 2-colorable or detects an odd-length cycle.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
  },
  eulerian: {
    name: "Eulerian Trail & Circuit (Hierholzer's)",
    description: 'Finds a closed trail or circuit that visits every edge exactly once.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(E)',
  },
  coloring: {
    name: 'Graph Coloring (Welsh-Powell)',
    description: 'Greedy heuristic algorithm that assigns colors so no adjacent vertices share a color.',
    timeComplexity: 'O(V²)',
    spaceComplexity: 'O(V)',
  },
  matching: {
    name: 'Maximum Bipartite Matching',
    description: 'Finds the maximum set of independent edges in a bipartite graph.',
    timeComplexity: 'O(V · E)',
    spaceComplexity: 'O(V)',
  },
};

const AlgorithmsView: React.FC<AlgorithmsViewProps> = ({ onHighlightChange }) => {
  const { graph, addVertex, addEdge, removeVertex, selected, toggleSelected, clearSelection } = useGraph();
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('bfs');
  const [sourceVertex, setSourceVertex] = useState<string>(() => graph.vertices[0] || '1');
  const [targetVertex, setTargetVertex] = useState<string>(() => graph.vertices[graph.vertices.length - 1] || '6');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'addVertex' | 'addEdge'>('select');
  const [edgeStartVertex, setEdgeStartVertex] = useState<string | null>(null);
  const speed = 750;

  // Cytoscape Canvas Reference
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Cytoscape.Core | null>(null);

  // Checkbox settings
  const [showAnimation, setShowAnimation] = useState(true);
  const [showQueueSet, setShowQueueSet] = useState(true);
  const [highlightLevels, setHighlightLevels] = useState(false);

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
        finalResult: { title: 'Result', text: 'No vertices in graph', status: 'Empty' },
      };
    }

    const start = graph.vertices.includes(sourceVertex) ? sourceVertex : graph.vertices[0];
    const target = graph.vertices.includes(targetVertex) ? targetVertex : graph.vertices[graph.vertices.length - 1];

    switch (selectedAlgo) {
      case 'bfs': {
        const raw = Array.from(bfsSteps(graph, start));
        const sList: StepItem[] = raw.map((s, idx) => {
          const curr = s.queue[0];
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
          steps: sList.length > 0 ? sList : [{ step: 0, current: start, visited: new Set([start]), queue: [], stack: [], message: 'Done', order: [start], colors: {} }],
          finalResult: {
            title: 'BFS Traversal Order:',
            text: lastOrder.join(' → ') || 'None',
            status: 'Completed',
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
          steps: sList.length > 0 ? sList : [{ step: 0, current: start, visited: new Set([start]), queue: [], stack: [], message: 'Done', order: [start], colors: {} }],
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
            text: lastStep?.isFound ? `${lastStep.shortestPath.join(' → ')} (Distance: ${lastStep.pathLength})` : 'No path exists between vertices',
            status: lastStep?.isFound ? 'Path Found' : 'Unreachable',
          },
        };
      }

      case 'cycle': {
        const cycleNodes = detectCycle(graph);
        const hasCycle = cycleNodes.length > 0;
        const sList: StepItem[] = [
          {
            step: 0,
            current: undefined,
            visited: new Set<string>(),
            queue: [],
            stack: [],
            message: 'Scanning graph edges with DFS back-edge detection...',
            order: [],
            colors: {},
          },
          {
            step: 1,
            current: cycleNodes[0] || undefined,
            visited: new Set(cycleNodes),
            queue: [],
            stack: [],
            message: hasCycle
              ? `Cycle identified: ${cycleNodes.join(' → ')}`
              : 'No cycles detected. The graph is acyclic (a forest or tree).',
            order: cycleNodes,
            colors: hasCycle
              ? cycleNodes.reduce((acc, v) => ({ ...acc, [v]: '#ef4444' }), {})
              : {},
          },
        ];
        return {
          steps: sList,
          finalResult: {
            title: 'Cycle Analysis Result:',
            text: hasCycle ? `Cycle: ${cycleNodes.join(' → ')}` : 'Acyclic (No cycle found)',
            status: hasCycle ? 'Cycle Detected' : 'Acyclic',
          },
        };
      }

      case 'components': {
        const comps = connectedComponents(graph);
        const palette = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
        const colors: Record<string, string> = {};
        comps.forEach((comp, idx) => {
          const col = palette[idx % palette.length];
          comp.forEach((v) => {
            colors[v] = col;
          });
        });

        const sList: StepItem[] = comps.map((comp, idx) => ({
          step: idx,
          current: comp[0],
          visited: new Set(comp),
          queue: [],
          stack: [],
          message: `Component ${idx + 1} of ${comps.length}: [ ${comp.join(', ')} ]`,
          order: comp,
          colors,
        }));

        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Connected Components:',
            text: `${comps.length} Component(s): ${comps.map((c, i) => `C${i + 1}={${c.join(',')}}`).join(', ')}`,
            status: comps.length === 1 ? 'Connected' : 'Disconnected',
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
            visited: new Set(s.visited),
            queue: [...s.queue],
            stack: [],
            message: s.message,
            order: s.isBipartite ? [...s.partitionA, ...s.partitionB] : (s.oddCycle || []),
            colors: cols,
          };
        });
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Bipartite Analysis:',
            text: lastStep?.isBipartite
              ? `Bipartite with partitions V1={${lastStep.partitionA.join(',')}}, V2={${lastStep.partitionB.join(',')}}`
              : `Not Bipartite (Odd cycle: ${(lastStep?.oddCycle || []).join(' → ') || 'present'})`,
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
          stack: [...s.stack],
          message: s.message,
          order: [...s.eulerianTrail],
          colors: {},
        }));
        const lastStep = raw[raw.length - 1];
        return {
          steps: sList.length > 0 ? sList : [{ step: 0, current: undefined, visited: new Set(), queue: [], stack: [], message: 'Done', order: [], colors: {} }],
          finalResult: {
            title: 'Eulerian Result:',
            text: lastStep?.isEulerian && lastStep.eulerianTrail.length > 0
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
          steps: [],
          finalResult: { title: 'Result', text: 'Select an algorithm', status: 'Idle' },
        };
    }
  }, [graph, selectedAlgo, sourceVertex, targetVertex]);

  // Keep stepIndex within range when steps change
  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [selectedAlgo, sourceVertex, targetVertex, graph]);

  const currentStepData: StepItem = steps[stepIndex] || steps[0] || {
    step: 0,
    current: undefined,
    visited: new Set<string>(),
    queue: [],
    stack: [],
    message: '',
    order: [],
    colors: {},
  };

  // Sync highlight to parent canvas if requested
  useEffect(() => {
    if (onHighlightChange) {
      if (currentStepData && currentStepData.current) {
        onHighlightChange({
          mode: selectedAlgo as any,
          currentNode: currentStepData.current,
          visitedNodes: Array.from(currentStepData.visited) as VertexId[],
        });
      } else {
        onHighlightChange(null);
      }
    }
  }, [currentStepData, onHighlightChange, selectedAlgo]);

  // Playback timer
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        setPlaying(false);
        return prev;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, steps.length]);

  // Initialize & Synchronize Cytoscape Canvas
  useEffect(() => {
    if (!containerRef.current) return;

    if (!cyRef.current) {
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
              'text-valign': 'center',
              'text-halign': 'center',
              color: '#ffffff',
              'font-size': '13px',
              'font-weight': 'bold',
              'background-color': '#0284c7',
              'border-width': 2.5,
              'border-color': '#38bdf8',
              width: 38,
              height: 38,
              'transition-property': 'background-color, border-color, width, height, shadow-blur',
              'transition-duration': '0.2s',
            } as any,
          },
          {
            selector: 'edge',
            style: {
              width: 2.5,
              'line-color': '#38bdf8',
              'target-arrow-shape': 'none',
              'curve-style': 'bezier',
              opacity: 0.85,
            } as any,
          },
          {
            selector: ':selected',
            style: {
              'border-color': '#a855f7',
              'border-width': 4,
            } as any,
          },
        ],
        layout: { name: 'preset' },
      });

      // Canvas click handling: adding vertex or connecting edges
      cyRef.current.on('tap', (evt) => {
        if (evt.target === cyRef.current) {
          // Clicked on empty canvas background
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

    // Build Cytoscape elements from current graph
    const elements: Cytoscape.ElementDefinition[] = [];

    // Precomputed reference coordinates matching desktop screenshot
    const referenceCoords: Record<string, { x: number; y: number }> = {
      '1': { x: 190, y: 40 },
      '2': { x: 80, y: 110 },
      '3': { x: 300, y: 110 },
      '6': { x: 190, y: 140 },
      '4': { x: 110, y: 220 },
      '5': { x: 270, y: 220 },
      'A': { x: 190, y: 40 },
      'B': { x: 80, y: 110 },
      'C': { x: 300, y: 110 },
      'D': { x: 190, y: 140 },
      'E': { x: 110, y: 220 },
      'F': { x: 270, y: 220 },
    };

    const count = graph.vertices.length;
    graph.vertices.forEach((v, index) => {
      let pos = referenceCoords[v];
      if (!pos) {
        // Distribute nicely in a circular layout
        const angle = (2 * Math.PI * index) / Math.max(1, count);
        pos = {
          x: 190 + 110 * Math.sin(angle),
          y: 130 - 90 * Math.cos(angle),
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

    // Cleanly sync elements
    cy.elements().remove();
    cy.add(elements);

    // Apply algorithm step visual highlights
    const current = currentStepData.current;
    const visitedSet = currentStepData.visited || new Set();
    const queueList = currentStepData.queue || [];
    const colorMap: Record<string, string> = currentStepData.colors || {};

    cy.nodes().forEach((node) => {
      const id = node.id();

      // Custom coloring algorithm overrides
      if (colorMap[id]) {
        node.style({
          'background-color': colorMap[id],
          'border-color': '#ffffff',
          'border-width': id === current ? 4 : 2,
          width: id === current ? 44 : 38,
          height: id === current ? 44 : 38,
        });
      } else if (id === current) {
        // Active Current Node (Purple Glow)
        node.style({
          'background-color': '#9333ea',
          'border-color': '#c084fc',
          'border-width': 4.5,
          width: 44,
          height: 44,
        });
      } else if (visitedSet.has(id)) {
        // Visited Node (Emerald Green)
        node.style({
          'background-color': '#10b981',
          'border-color': '#34d399',
          'border-width': 2.5,
          width: 38,
          height: 38,
        });
      } else if (queueList.includes(id)) {
        // In Queue / Frontier Node (Cyan/Blue)
        node.style({
          'background-color': '#0284c7',
          'border-color': '#38bdf8',
          'border-width': 3,
          width: 38,
          height: 38,
        });
      } else {
        // Unvisited Node (Slate)
        node.style({
          'background-color': '#334155',
          'border-color': '#64748b',
          'border-width': 2,
          width: 38,
          height: 38,
        });
      }
    });

    // Panning & zooming configuration
    cy.userPanningEnabled(activeTool === 'pan');
    cy.boxSelectionEnabled(false);
  }, [graph, currentStepData, activeTool, edgeStartVertex, toggleSelected, addVertex, addEdge]);

  // Canvas Action Helpers
  const handleZoomIn = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 1.2);
  };

  const handleZoomOut = () => {
    if (cyRef.current) cyRef.current.zoom(cyRef.current.zoom() * 0.8);
  };

  const handleFit = () => {
    if (cyRef.current) cyRef.current.fit(undefined, 30);
  };

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

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans">
      {/* Top Header Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6e2bf5] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_15px_rgba(110,43,245,0.6)]">
            <Play size={22} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Graph Algorithm Visualizer
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Run and visualize graph algorithms with step-by-step execution and real-time interactive canvas.
            </p>
          </div>
        </div>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { id: 'bfs', label: 'BFS' },
            { id: 'dfs', label: 'DFS' },
            { id: 'dijkstra', label: 'Dijkstra' },
            { id: 'cycle', label: 'Cycle Detection' },
            { id: 'components', label: 'Connected Components' },
            { id: 'bipartite', label: 'Bipartite Test' },
            { id: 'eulerian', label: 'Eulerian Path' },
            { id: 'coloring', label: 'Graph Coloring' },
            { id: 'matching', label: 'Matching' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedAlgo(tab.id);
              setStepIndex(0);
              setPlaying(false);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedAlgo === tab.id
                ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
                : 'bg-[#101530] border border-[#1c2448] text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main 3-Column Visualizer Layout */}
      <div className="flex flex-col lg:flex-row gap-3.5 items-stretch">
        {/* Column 1 (Fixed Width): Algorithm Info, Complexity & Configuration */}
        <div className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                {ALGORITHMS_META[selectedAlgo].name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {ALGORITHMS_META[selectedAlgo].description}
              </p>
            </div>

            {/* Complexity Badges */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Complexity
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#0d132e] border border-[#182142] text-xs font-mono font-semibold text-slate-200">
                  Time: {ALGORITHMS_META[selectedAlgo].timeComplexity}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#0d132e] border border-[#182142] text-xs font-mono font-semibold text-slate-200">
                  Space: {ALGORITHMS_META[selectedAlgo].spaceComplexity}
                </span>
              </div>
            </div>

            {/* Configuration: Source / Target Vertex & Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-[#141b38]">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Configuration
              </div>

              {/* Source Vertex Dropdown */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Source Vertex</label>
                <div className="relative">
                  <select
                    value={sourceVertex}
                    onChange={(e) => setSourceVertex(e.target.value)}
                    className="w-full bg-[#0d132e] border border-[#182142] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6e2bf5] appearance-none cursor-pointer"
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

              {/* Target Vertex Dropdown for Dijkstra */}
              {selectedAlgo === 'dijkstra' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Vertex</label>
                  <div className="relative">
                    <select
                      value={targetVertex}
                      onChange={(e) => setTargetVertex(e.target.value)}
                      className="w-full bg-[#0d132e] border border-[#182142] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#6e2bf5] appearance-none cursor-pointer"
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
              )}

              {/* Checkbox settings */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnimation}
                    onChange={(e) => setShowAnimation(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Show traversal animation</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showQueueSet}
                    onChange={(e) => setShowQueueSet(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Show queue/visited set</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlightLevels}
                    onChange={(e) => setHighlightLevels(e.target.checked)}
                    className="rounded bg-[#0d132e] border-[#182142] text-[#6e2bf5] focus:ring-0"
                  />
                  <span>Highlight traversal levels</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 (Flexible Interactive Canvas): Graph Editing & Real-Time Visualization */}
        <div className="flex-1 min-w-[320px] p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl relative flex flex-col justify-between">
          {/* Top Canvas Controls Bar */}
          <div className="flex items-center justify-between mb-2 z-10">
            {/* Interactive Graph Manipulation Tools */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070a1a]/90 backdrop-blur-md border border-[#1a2346] shadow-md">
              <button
                onClick={() => {
                  setActiveTool('select');
                  setEdgeStartVertex(null);
                }}
                className={`p-1.5 rounded-lg transition-all ${
                  activeTool === 'select'
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Select & Move"
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
                title="Pan Canvas"
              >
                <Hand size={14} />
              </button>
              <button
                onClick={handleAddVertexDirectly}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0d132e] hover:bg-[#182142] border border-[#1c264a] text-slate-200 text-xs font-semibold"
                title="Add Node"
              >
                <PlusCircle size={13} className="text-[#38bdf8]" />
                <span>+ Node</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool(activeTool === 'addEdge' ? 'select' : 'addEdge');
                  setEdgeStartVertex(null);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  activeTool === 'addEdge'
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white border-transparent'
                    : 'bg-[#0d132e] border-[#1c264a] text-slate-300 hover:text-white'
                }`}
                title="Click two nodes to connect edge"
              >
                <LinkIcon size={13} className="text-[#c084fc]" />
                <span>{edgeStartVertex ? `Connect ${edgeStartVertex} → ...` : '+ Edge'}</span>
              </button>
              {selected.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            {/* Zoom and Fit */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <Minus size={13} />
              </button>
              <button
                onClick={handleFit}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-xs text-slate-300 hover:text-white"
                title="Auto-Fit Layout"
              >
                <Sparkles size={13} />
                <span>Fit</span>
              </button>
              <button
                onClick={handleFit}
                className="p-1.5 rounded-xl bg-[#070a1a]/90 border border-[#1a2346] text-slate-300 hover:text-white"
                title="Fullscreen / Center"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Central Live Interactive Cytoscape Canvas */}
          <div className="h-[270px] w-full relative py-1 rounded-xl bg-[#060919] border border-[#121833] overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
          </div>

          {/* Bottom Canvas Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-[#141b38] text-[11px]">
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
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#475569]" />
              <span>Unvisited</span>
            </span>
          </div>
        </div>

        {/* Column 3 (Fixed Width): Step Execution & Algorithm State */}
        <div className="w-full lg:w-[280px] xl:w-[300px] flex-shrink-0 space-y-3.5 flex flex-col justify-between">
          {/* Step Execution Card with Playback Controls */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white">Step Execution</h3>
              <span className="text-xs font-mono font-bold text-[#c084fc]">
                Step {stepIndex + 1} of {Math.max(1, steps.length)}
              </span>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#141b38] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6e2bf5] to-[#a855f7]"
                style={{ width: `${((stepIndex + 1) / Math.max(1, steps.length)) * 100}%` }}
              />
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
                title="Previous"
              >
                <Rewind size={15} />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]"
                title={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
              </button>
              <button
                onClick={() => setStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-300 hover:text-white"
                title="Next"
              >
                <FastForward size={15} />
              </button>
              <button
                onClick={() => {
                  setStepIndex(0);
                  setPlaying(false);
                }}
                className="p-2 rounded-xl bg-[#0d132e] border border-[#182142] text-slate-400 hover:text-white"
                title="Reset"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Algorithm State Card: Queue, Visited, Traversal Order */}
          <div className="p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-white">Algorithm State</h3>

            {/* Queue / Stack State */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                {selectedAlgo === 'dfs' ? 'Stack (LIFO)' : 'Queue (FIFO)'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                {(selectedAlgo === 'dfs' ? currentStepData.stack : currentStepData.queue).length > 0 ? (
                  (selectedAlgo === 'dfs' ? currentStepData.stack : currentStepData.queue).map((v, i) => (
                    <span
                      key={`${v}-${i}`}
                      className="w-6 h-6 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(2,132,199,0.9)]"
                    >
                      {v}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono italic">Empty</span>
                )}
              </div>
            </div>

            {/* Visited Vertices */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Visited Set</span>
              <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                {Array.from(currentStepData.visited).length > 0 ? (
                  Array.from(currentStepData.visited).map((v) => (
                    <span
                      key={v}
                      className="w-6 h-6 rounded-lg bg-[#10b981] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                    >
                      {v}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-[11px] font-mono italic">None</span>
                )}
              </div>
            </div>

            {/* Traversal Order / Sequence */}
            <div>
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Current Order</span>
              <div className="p-2 rounded-xl bg-[#050713] border border-[#141b38] font-mono text-xs text-white font-bold text-center truncate">
                {currentStepData.order && currentStepData.order.length > 0
                  ? currentStepData.order.join(' → ')
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Current Step Explanation, Traversal Progress & Result */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Current Step Explanation (span 5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <h3 className="text-xs font-bold text-white">Current Step Explanation</h3>
          <div className="text-xs font-bold text-[#c084fc]">
            Step {stepIndex + 1}: {currentStepData.current ? `Vertex ${currentStepData.current}` : 'State Evaluation'}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStepData.message || 'Executing step analysis on the graph structure.'}
          </p>
        </div>

        {/* Traversal Progress Donut Chart (span 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white mb-2">Traversal Progress</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="text-slate-300">
                  Visited: {currentStepData.visited?.size || 0} (
                  {graph.vertices.length > 0
                    ? (((currentStepData.visited?.size || 0) / graph.vertices.length) * 100).toFixed(1)
                    : 0}
                  %)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                <span className="text-slate-300">
                  In Queue: {currentStepData.queue?.length || currentStepData.stack?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#475569]" />
                <span className="text-slate-400">
                  Unvisited: {Math.max(0, graph.vertices.length - (currentStepData.visited?.size || 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Donut progress ring */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#141b38" strokeWidth="6" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#10b981"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="163"
                strokeDashoffset={
                  graph.vertices.length > 0
                    ? 163 - (163 * (currentStepData.visited?.size || 0)) / graph.vertices.length
                    : 163
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-bold text-white">
                {currentStepData.visited?.size || 0}/{graph.vertices.length}
              </span>
            </div>
          </div>
        </div>

        {/* Result Card (span 3) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#090d22] border border-[#161f3e] shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white">Result</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-bold">
              {finalResult.status}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">{finalResult.title}</div>
          <div className="p-2.5 rounded-xl bg-[#050713] border border-[#141b38] font-mono text-xs font-bold text-white text-center break-words">
            {finalResult.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsView;

// src/algorithms/graphColoringSteps.ts
import type { Graph, VertexId } from '../types/graph';

export interface ColoringStepState {
  step: number;
  ordering: VertexId[];
  currentIndex: number;
  currentVertex: VertexId | null;
  assignedColors: Record<VertexId, number>;
  currentColorClass: number;
  colorNames: Record<number, string>;
  degrees: Record<VertexId, number>;
  chromaticUpperBound: number;
  message: string;
  isComplete: boolean;
}

export const COLOR_PALETTE = [
  '#6366f1', // Indigo (1)
  '#ec4899', // Pink (2)
  '#10b981', // Emerald (3)
  '#f59e0b', // Amber (4)
  '#06b6d4', // Cyan (5)
  '#8b5cf6', // Purple (6)
  '#ef4444', // Red (7)
  '#14b8a6', // Teal (8)
  '#84cc16', // Lime (9)
  '#f97316', // Orange (10)
];

/**
 * Step-by-step Welsh-Powell Greedy Graph Coloring Generator.
 * Deterministic sorting: Descending degree, tie-broken by vertex label.
 */
export function* graphColoringSteps(graph: Graph): Generator<ColoringStepState> {
  let step = 0;

  if (graph.vertices.length === 0) {
    yield {
      step: 0,
      ordering: [],
      currentIndex: -1,
      currentVertex: null,
      assignedColors: {},
      currentColorClass: 0,
      colorNames: {},
      degrees: {},
      chromaticUpperBound: 0,
      message: 'Empty graph requires 0 colors.',
      isComplete: true,
    };
    return;
  }

  // Calculate degrees and adjacency
  const adj: Record<VertexId, Set<VertexId>> = {};
  const degrees: Record<VertexId, number> = {};
  for (const v of graph.vertices) {
    adj[v] = new Set();
    degrees[v] = 0;
  }
  for (const e of graph.edges) {
    adj[e.source]?.add(e.target);
    adj[e.target]?.add(e.source);
    degrees[e.source] = (degrees[e.source] || 0) + 1;
    degrees[e.target] = (degrees[e.target] || 0) + 1;
  }

  // Welsh-Powell Ordering: degree descending, then lexicographic ID
  const ordering = [...graph.vertices].sort((a, b) => {
    if (degrees[b] !== degrees[a]) {
      return degrees[b] - degrees[a];
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true });
  });

  const assignedColors: Record<VertexId, number> = {};
  const colorNames: Record<number, string> = {};
  let maxColorUsed = 0;

  step++;
  yield {
    step,
    ordering: [...ordering],
    currentIndex: -1,
    currentVertex: null,
    assignedColors: {},
    currentColorClass: 0,
    colorNames: {},
    degrees: { ...degrees },
    chromaticUpperBound: 0,
    message: `Welsh-Powell order computed: [${ordering.map((v) => `${v} (deg ${degrees[v]})`).join(', ')}].`,
    isComplete: false,
  };

  for (let i = 0; i < ordering.length; i++) {
    const u = ordering[i];

    // Determine colors used by neighbors
    const neighborColors = new Set<number>();
    for (const nb of adj[u]) {
      if (assignedColors[nb] !== undefined) {
        neighborColors.add(assignedColors[nb]);
      }
    }

    // Find lowest available positive color
    let chosenColor = 1;
    while (neighborColors.has(chosenColor)) {
      chosenColor++;
    }

    assignedColors[u] = chosenColor;
    if (chosenColor > maxColorUsed) {
      maxColorUsed = chosenColor;
    }
    colorNames[chosenColor] = COLOR_PALETTE[(chosenColor - 1) % COLOR_PALETTE.length];

    step++;
    yield {
      step,
      ordering: [...ordering],
      currentIndex: i,
      currentVertex: u,
      assignedColors: { ...assignedColors },
      currentColorClass: chosenColor,
      colorNames: { ...colorNames },
      degrees: { ...degrees },
      chromaticUpperBound: maxColorUsed,
      message: `Assigned Color ${chosenColor} to vertex ${u} (neighbors use: [${Array.from(neighborColors).sort().join(', ') || 'none'}]).`,
      isComplete: false,
    };
  }

  step++;
  yield {
    step,
    ordering: [...ordering],
    currentIndex: ordering.length,
    currentVertex: null,
    assignedColors: { ...assignedColors },
    currentColorClass: maxColorUsed,
    colorNames: { ...colorNames },
    degrees: { ...degrees },
    chromaticUpperBound: maxColorUsed,
    message: `Greedy coloring finished! Chromatic upper bound: χ(G) ≤ ${maxColorUsed}. Total ${maxColorUsed} colors utilized.`,
    isComplete: true,
  };
}

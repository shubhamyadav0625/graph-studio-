// src/pages/Theory.tsx
import React, { useState } from 'react';
import { Check, Play, Scale } from 'lucide-react';

interface TopicData {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  section1: {
    title: string;
    items: Array<{ label: string; text: string }>;
    subPointsTitle?: string;
    subPoints?: Array<{ label: string; text: string }>;
    svgType: 'tree' | 'cycle' | 'bipartite' | 'basic';
  };
  section2: {
    title: string;
    items: Array<{ label: string; text: string }>;
    subPointsTitle?: string;
    subPoints?: Array<{ label: string; text: string }>;
    svgType: 'cycle' | 'tree' | 'basic';
  };
  keyDifference: {
    part1Label: string;
    part1Text: string;
    part2Label: string;
    part2Text: string;
  };
}

const TOPICS_DATA: Record<string, TopicData> = {
  euler: {
    id: 'euler',
    label: 'Euler & Hamiltonian',
    title: 'Eulerian & Hamiltonian Graphs',
    subtitle: 'Study edge-covering (Euler) and vertex-covering (Hamiltonian) routes in graphs.',
    section1: {
      title: '1. Eulerian Graphs',
      items: [
        { label: 'Euler Trail', text: 'A walk that uses every edge exactly once.' },
        { label: 'Euler Circuit', text: 'An Euler trail that starts and ends at the same vertex.' },
      ],
      subPointsTitle: 'Existence (Undirected, connected):',
      subPoints: [
        { label: 'Euler Circuit', text: 'all vertices have even degree.' },
        { label: 'Euler Trail', text: 'exactly two vertices have odd degree.' },
      ],
      svgType: 'tree',
    },
    section2: {
      title: '2. Hamiltonian Graphs',
      items: [
        { label: 'Hamiltonian Path', text: 'A path that visits every vertex exactly once.' },
        { label: 'Hamiltonian Cycle', text: 'A cycle that visits every vertex exactly once and returns to start.' },
      ],
      subPointsTitle: 'Key Points:',
      subPoints: [
        { label: 'Focus', text: 'Focuses on vertices (not edges).' },
        { label: 'General Condition', text: 'No simple general condition like Euler graphs.' },
        {
          label: "Dirac's Theorem",
          text: 'if n ≥ 3 and deg(v) ≥ n/2 for all v, then G is Hamiltonian.',
        },
      ],
      svgType: 'cycle',
    },
    keyDifference: {
      part1Label: 'Eulerian',
      part1Text: 'uses every edge exactly once (edge-covering).',
      part2Label: 'Hamiltonian',
      part2Text: 'visits every vertex exactly once (vertex-covering).',
    },
  },
  basics: {
    id: 'basics',
    label: 'Graph Basics',
    title: 'Graph Fundamentals & Anatomy',
    subtitle: 'Core definitions: vertices, edges, directed vs. undirected, degree and handshaking lemma.',
    section1: {
      title: '1. Graph Definition & Types',
      items: [
        { label: 'Graph G = (V, E)', text: 'Consists of a set of vertices V and edge pairs E connecting them.' },
        { label: 'Simple Graph', text: 'Has no loops (self-edges) and at most one edge between any pair of vertices.' },
      ],
      subPointsTitle: 'Classification:',
      subPoints: [
        { label: 'Undirected', text: 'Edges have no direction; (u, v) is identical to (v, u).' },
        { label: 'Directed (Digraph)', text: 'Edges are ordered pairs; (u, v) goes from u to v.' },
      ],
      svgType: 'basic',
    },
    section2: {
      title: '2. Degree & Handshaking Lemma',
      items: [
        { label: 'Degree deg(v)', text: 'The number of edges incident to vertex v.' },
        { label: 'Handshaking Lemma', text: 'The sum of all degrees equals twice the number of edges: ∑ deg(v) = 2|E|.' },
      ],
      subPointsTitle: 'Corollaries:',
      subPoints: [
        { label: 'Even Sum', text: 'The sum of degrees in any graph is always an even number.' },
        { label: 'Odd Degree Vertices', text: 'Every graph has an even number of vertices with odd degree.' },
      ],
      svgType: 'tree',
    },
    keyDifference: {
      part1Label: 'Degree',
      part1Text: 'measures local connectivity around an individual vertex.',
      part2Label: 'Handshaking',
      part2Text: 'proves that total edge endpoints always double global edge count.',
    },
  },
  representations: {
    id: 'representations',
    label: 'Graph Representations',
    title: 'Data Structures for Graph Storage',
    subtitle: 'Adjacency list, adjacency matrix, incidence matrix, and performance trade-offs.',
    section1: {
      title: '1. Adjacency Matrix & Incidence Matrix',
      items: [
        { label: 'Adjacency Matrix', text: 'A V × V grid where entry (u, v) = 1 if an edge connects u and v, else 0.' },
        { label: 'Incidence Matrix', text: 'A V × E grid where entry (v, e) = 1 if vertex v is incident to edge e.' },
      ],
      subPointsTitle: 'Space Complexity:',
      subPoints: [
        { label: 'Adj. Matrix', text: 'O(V²) space; efficient edge lookup O(1).' },
        { label: 'Inc. Matrix', text: 'O(V × E) space; useful in algebraic graph theory.' },
      ],
      svgType: 'cycle',
    },
    section2: {
      title: '2. Adjacency List',
      items: [
        { label: 'Structure', text: 'An array or hash map of size V, where index v stores a list of neighbors.' },
        { label: 'Space Optimal', text: 'Uses O(V + E) memory, making it ideal for sparse real-world graphs.' },
      ],
      subPointsTitle: 'Practical Advantages:',
      subPoints: [
        { label: 'Neighbor Iteration', text: 'Iterates through deg(v) neighbors in O(deg(v)) optimal time.' },
        { label: 'Sparse Performance', text: 'Requires significantly less memory when |E| ≪ |V|².' },
      ],
      svgType: 'basic',
    },
    keyDifference: {
      part1Label: 'Adjacency Matrix',
      part1Text: 'best for dense graphs with O(1) query requirements.',
      part2Label: 'Adjacency List',
      part2Text: 'best for sparse graphs with memory-efficient traversals.',
    },
  },
  connectivity: {
    id: 'connectivity',
    label: 'Connectivity',
    title: 'Connectivity & Components',
    subtitle: 'Reachable paths, connected components, cuts, bridges, and articulation points.',
    section1: {
      title: '1. Connectedness & Components',
      items: [
        { label: 'Connected Graph', text: 'There is a path between every pair of distinct vertices in the graph.' },
        { label: 'Connected Component', text: 'A maximal connected subgraph of an undirected graph.' },
      ],
      subPointsTitle: 'Directed Connectivity:',
      subPoints: [
        { label: 'Strongly Connected', text: 'Directed path exists from every vertex to every other vertex.' },
        { label: 'Weakly Connected', text: 'Connected when replacing directed edges with undirected edges.' },
      ],
      svgType: 'tree',
    },
    section2: {
      title: '2. Cut Vertices & Bridges',
      items: [
        { label: 'Cut Vertex', text: 'A vertex whose removal increases the number of connected components.' },
        { label: 'Bridge (Cut Edge)', text: 'An edge whose deletion disconnects the graph or increases components.' },
      ],
      subPointsTitle: 'Key Theorems:',
      subPoints: [
        { label: 'Bridge Characterization', text: 'An edge is a bridge if and only if it belongs to no simple cycle.' },
        { label: 'Network Reliability', text: 'Bridges represent single points of failure in topology.' },
      ],
      svgType: 'cycle',
    },
    keyDifference: {
      part1Label: 'Cut Vertex',
      part1Text: 'a single node whose failure isolates parts of the network.',
      part2Label: 'Bridge',
      part2Text: 'a critical link whose disruption partitions graph connectivity.',
    },
  },
  cycles: {
    id: 'cycles',
    label: 'Cycles & Paths',
    title: 'Cycles, Walks, Trails & Paths',
    subtitle: 'Taxonomy of graph traversals, cycle detection, and acyclic structures.',
    section1: {
      title: '1. Walks, Trails, and Paths',
      items: [
        { label: 'Walk', text: 'An alternating sequence of vertices and edges beginning and ending with vertices.' },
        { label: 'Trail', text: 'A walk in which no edge is repeated.' },
        { label: 'Path', text: 'A trail in which no vertex (and thus no edge) is repeated.' },
      ],
      subPointsTitle: 'Distinctions:',
      subPoints: [
        { label: 'Shortest Path', text: 'A simple path with minimal total edge weight.' },
        { label: 'Diameter', text: 'The greatest distance between any pair of vertices in a connected graph.' },
      ],
      svgType: 'basic',
    },
    section2: {
      title: '2. Cycles & Girth',
      items: [
        { label: 'Cycle', text: 'A closed walk with at least three vertices and no repeated vertices except first/last.' },
        { label: 'Girth', text: 'The length of the shortest cycle contained in the graph.' },
      ],
      subPointsTitle: 'Properties:',
      subPoints: [
        { label: 'Odd Cycle', text: 'A cycle with an odd number of edges; prevents 2-colorability.' },
        { label: 'Chordless Cycle', text: 'A cycle where no two non-consecutive vertices share an edge.' },
      ],
      svgType: 'cycle',
    },
    keyDifference: {
      part1Label: 'Path',
      part1Text: 'an open traversal with all unique vertices and edges.',
      part2Label: 'Cycle',
      part2Text: 'a closed loop returning to the origin without intermediate repeats.',
    },
  },
  trees: {
    id: 'trees',
    label: 'Trees',
    title: 'Trees & Forest Structures',
    subtitle: 'Minimally connected and maximally acyclic undirected graphs.',
    section1: {
      title: '1. Tree Properties',
      items: [
        { label: 'Definition', text: 'A tree is a connected graph with no cycles.' },
        { label: 'Edge Formula', text: 'Every tree with n vertices contains exactly n - 1 edges: |E| = |V| - 1.' },
      ],
      subPointsTitle: 'Equivalent Definitions (T with n vertices):',
      subPoints: [
        { label: 'Path Uniqueness', text: 'Unique simple path exists between any two vertices.' },
        { label: 'Minimal Connectivity', text: 'Connected, and deleting any edge disconnects T.' },
      ],
      svgType: 'tree',
    },
    section2: {
      title: '2. Spanning Trees & Leaves',
      items: [
        { label: 'Spanning Tree', text: 'A subgraph that is a tree and includes all vertices of G.' },
        { label: 'Leaf', text: 'A vertex of degree 1. Every non-trivial tree has at least two leaves.' },
      ],
      subPointsTitle: 'Theorems:',
      subPoints: [
        { label: 'Cayley’s Formula', text: 'There are n^(n-2) distinct labeled trees on n vertices.' },
        { label: 'Cycle Creation', text: 'Adding any non-tree edge to a spanning tree creates exactly one cycle.' },
      ],
      svgType: 'basic',
    },
    keyDifference: {
      part1Label: 'Tree',
      part1Text: 'a single connected acyclic component with |E| = |V| - 1.',
      part2Label: 'Forest',
      part2Text: 'a disjoint collection of trees with |E| = |V| - c components.',
    },
  },
  bipartite: {
    id: 'bipartite',
    label: 'Bipartite Graphs',
    title: 'Bipartite Graphs & 2-Colorability',
    subtitle: 'Partitioning vertices into two independent sets with no intra-set edges.',
    section1: {
      title: '1. Bipartite Definition & Characterization',
      items: [
        { label: 'Bipartition (V₁, V₂)', text: 'V is partitioned into V₁ and V₂ such that every edge connects V₁ to V₂.' },
        { label: 'No Odd Cycles (Kőnig)', text: 'A graph is bipartite if and only if it contains no odd-length cycles.' },
      ],
      subPointsTitle: 'Properties:',
      subPoints: [
        { label: 'Chromatic Number', text: 'χ(G) ≤ 2 (graph can be colored using only 2 colors).' },
        { label: 'Even Girth', text: 'All cycles (if any exist) have even length.' },
      ],
      svgType: 'basic',
    },
    section2: {
      title: '2. Complete Bipartite (Km,n)',
      items: [
        { label: 'Definition', text: 'Every vertex in V₁ of size m is connected to every vertex in V₂ of size n.' },
        { label: 'Edge Count', text: 'Contains exactly m × n edges: |E| = |V₁| · |V₂|.' },
      ],
      subPointsTitle: 'Special Cases:',
      subPoints: [
        { label: 'Star Graph', text: 'K1,n is a tree with one central vertex connected to n leaves.' },
        { label: 'K3,3 Utility Graph', text: 'Fundamental non-planar Kuratowski graph.' },
      ],
      svgType: 'cycle',
    },
    keyDifference: {
      part1Label: 'Bipartite',
      part1Text: 'all edges cross between two partitions; zero odd cycles.',
      part2Label: 'General Graph',
      part2Text: 'can have odd cycles like triangles (K₃), requiring 3+ colors.',
    },
  },
  planar: {
    id: 'planar',
    label: 'Planar Graphs',
    title: 'Planar Graphs & Euler’s Formula',
    subtitle: 'Embedding graphs on a plane without edge crossings and Kuratowski’s theorem.',
    section1: {
      title: '1. Planarity & Euler’s Formula',
      items: [
        { label: 'Planar Graph', text: 'A graph that can be drawn on the Euclidean plane without edge crossings.' },
        { label: 'Euler’s Polyhedral Formula', text: 'For any connected planar graph: V - E + F = 2.' },
      ],
      subPointsTitle: 'Edge Upper Bounds (V ≥ 3):',
      subPoints: [
        { label: 'Simple Planar', text: 'E ≤ 3V - 6 (maximal planar triangulations reach equality).' },
        { label: 'Triangle-Free Planar', text: 'E ≤ 2V - 4 (applies to planar bipartite graphs).' },
      ],
      svgType: 'cycle',
    },
    section2: {
      title: '2. Kuratowski’s Theorem & Minors',
      items: [
        { label: 'Non-Planar Forbidden Minors', text: 'K₅ (complete graph on 5 vertices) and K₃,₃ (utility graph).' },
        { label: 'Kuratowski’s Theorem', text: 'A graph is planar if and only if it contains no subdivision of K₅ or K₃,₃.' },
      ],
      subPointsTitle: 'Consequences:',
      subPoints: [
        { label: 'Wagner’s Theorem', text: 'Planar iff neither K₅ nor K₃,₃ is a graph minor.' },
        { label: 'Four Color Theorem', text: 'Every planar graph can be colored with at most 4 colors.' },
      ],
      svgType: 'basic',
    },
    keyDifference: {
      part1Label: 'Planar',
      part1Text: 'embeddable with zero crossings; bounded by |E| ≤ 3|V| - 6.',
      part2Label: 'Non-Planar',
      part2Text: 'contains topological subdivisions of K₅ or K₃,₃.',
    },
  },
  coloring: {
    id: 'coloring',
    label: 'Graph Coloring',
    title: 'Vertex Coloring & Chromatic Number',
    subtitle: 'Assigning colors so no adjacent vertices share a color, greedy Welsh-Powell heuristics.',
    section1: {
      title: '1. Chromatic Number χ(G)',
      items: [
        { label: 'Proper Coloring', text: 'Assignment of colors to vertices such that no adjacent vertices share a color.' },
        { label: 'Chromatic Number χ(G)', text: 'The minimal number of colors needed for a proper coloring.' },
      ],
      subPointsTitle: 'Standard Bounds:',
      subPoints: [
        { label: 'Clique Bound', text: 'χ(G) ≥ ω(G) where ω(G) is the maximum clique size.' },
        { label: "Brooks' Theorem", text: 'χ(G) ≤ Δ(G) unless G is a complete graph or odd cycle.' },
      ],
      svgType: 'tree',
    },
    section2: {
      title: '2. Welsh-Powell Greedy Algorithm',
      items: [
        { label: 'Sorting Phase', text: 'Order all vertices in non-increasing order of their degrees.' },
        { label: 'Greedy Coloring', text: 'Assign the first color to the first vertex, then to all non-adjacent vertices in order.' },
      ],
      subPointsTitle: 'Algorithm Steps:',
      subPoints: [
        { label: 'Repeat for Next Color', text: 'Move to the first uncolored vertex and repeat with color 2, 3...' },
        { label: 'Upper Bound', text: 'Provides an effective heuristic bound for general graphs.' },
      ],
      svgType: 'cycle',
    },
    keyDifference: {
      part1Label: 'Vertex Coloring',
      part1Text: 'partitions vertex set into independent color classes.',
      part2Label: 'Edge Coloring',
      part2Text: 'partitions edge set into matchings (Tait / Vizing theorems).',
    },
  },
  matching: {
    id: 'matching',
    label: 'Matching (Hopcroft-Karp)',
    title: 'Matchings in Graphs',
    subtitle: 'Independent edge sets, maximum bipartite matching, augmenting paths, and Hall’s theorem.',
    section1: {
      title: '1. Matching Concepts',
      items: [
        { label: 'Matching M', text: 'A set of edges without common vertices (no two edges share an endpoint).' },
        { label: 'Maximal vs Maximum', text: 'Maximal: cannot add more edges. Maximum: largest possible cardinality |M|.' },
      ],
      subPointsTitle: 'Hall’s Marriage Theorem:',
      subPoints: [
        { label: 'Condition', text: 'Bipartite graph with partitions (X, Y) has a matching covering X iff |N(S)| ≥ |S| for all S ⊆ X.' },
        { label: 'Bottlenecks', text: 'If any subset S has fewer neighbors than vertices, no complete matching exists.' },
      ],
      svgType: 'tree',
    },
    section2: {
      title: '2. Hopcroft-Karp Algorithm',
      items: [
        { label: 'Augmenting Path', text: 'A path starting and ending at unmatched vertices, alternating unmatched and matched edges.' },
        { label: 'Berge’s Lemma', text: 'A matching M is maximum if and only if there is no augmenting path relative to M.' },
      ],
      subPointsTitle: 'Complexity & Steps:',
      subPoints: [
        { label: 'Phase Execution', text: 'BFS finds all shortest augmenting paths simultaneously; DFS augments them.' },
        { label: 'Time Complexity', text: 'Runs in O(E √V) time, outperforming standard Ford-Fulkerson O(V · E).' },
      ],
      svgType: 'basic',
    },
    keyDifference: {
      part1Label: 'Maximal Matching',
      part1Text: 'a greedy local optimum where no more edges can be added.',
      part2Label: 'Maximum Matching',
      part2Text: 'a global optimum with maximal edge cardinality across the graph.',
    },
  },
};

const Theory: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string>('euler');
  const [activeContentTab, setActiveContentTab] = useState<'theory' | 'examples' | 'interactive' | 'summary'>('theory');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const topic = TOPICS_DATA[activeTopicId] || TOPICS_DATA.euler;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none font-sans text-slate-100">
      {/* 1. Page Header matching exact Reference Screenshot */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight leading-tight">
          Theory & Learning
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-normal">
          Concepts, definitions and theorems (Unit 6)
        </p>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Topics Sidebar List (span 3.5) */}
        <div className="lg:col-span-3 xl:col-span-3 p-3 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-1">
          {Object.values(TOPICS_DATA).map((t) => {
            const isActive = activeTopicId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTopicId(t.id);
                  setActiveContentTab('theory');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_15px_rgba(110,43,245,0.7)]'
                    : 'text-slate-400 hover:text-white hover:bg-[#101736]'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                    isActive ? 'border-white bg-white/20' : 'border-slate-500'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Interactive Content Card (span 8.5) */}
        <div className="lg:col-span-9 xl:col-span-9 p-5 rounded-2xl bg-[#090d24] border border-[#192244] shadow-xl space-y-5">
          {/* Header Row: Topic Title & Action Buttons (Mark Complete, Take Quiz) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {topic.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {topic.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCompleted(!isCompleted)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                    : 'bg-[#0d1433] border-[#1f2b54] text-slate-300 hover:text-white hover:border-[#384a86]'
                }`}
              >
                <Check size={14} className={isCompleted ? 'text-emerald-400' : 'text-slate-400'} />
                <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={() => alert(`Starting interactive quiz on ${topic.title}!`)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] hover:from-[#7e3cf7] hover:to-[#9d55fb] text-white text-xs font-bold shadow-[0_0_15px_rgba(110,43,245,0.7)] transition-all cursor-pointer"
              >
                <Play size={13} fill="currentColor" />
                <span>Take Quiz</span>
              </button>
            </div>
          </div>

          {/* Sub-Tabs: Theory (active), Examples, Interactive, Summary */}
          <div className="flex items-center gap-2">
            {[
              { id: 'theory', label: 'Theory' },
              { id: 'examples', label: 'Examples' },
              { id: 'interactive', label: 'Interactive' },
              { id: 'summary', label: 'Summary' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveContentTab(tab.id as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeContentTab === tab.id
                    ? 'bg-gradient-to-r from-[#6e2bf5] to-[#8d41f8] text-white shadow-[0_0_12px_rgba(110,43,245,0.7)]'
                    : 'bg-[#0c112e] border border-[#182348] text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Theory Tab Content matching exact Reference Screenshot */}
          {activeContentTab === 'theory' && (
            <div className="space-y-4">
              {/* Section 1 Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-[#070b1f] border border-[#161f44]">
                <div className="md:col-span-8 space-y-2 text-xs">
                  <h3 className="text-xs font-bold text-white bg-purple-950/40 border border-purple-800/60 px-2.5 py-1 rounded-lg inline-block text-purple-300">
                    {topic.section1.title}
                  </h3>
                  <ul className="space-y-1.5 text-slate-300 leading-relaxed list-disc list-inside">
                    {topic.section1.items.map((item, idx) => (
                      <li key={idx}>
                        <strong className="text-white">{item.label}:</strong> {item.text}
                      </li>
                    ))}
                  </ul>

                  {topic.section1.subPoints && (
                    <div className="pt-1 text-slate-300 space-y-1 pl-2">
                      <div className="font-semibold text-white">
                        {topic.section1.subPointsTitle}
                      </div>
                      <ul className="space-y-1 pl-4 list-[circle] list-inside text-[11px] text-slate-300">
                        {topic.section1.subPoints.map((sp, idx) => (
                          <li key={idx}>
                            <span className="text-purple-300 font-medium">{sp.label}</span> ⇔ {sp.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Visual Diagram 1: Tree / Graph SVG matching Screenshot */}
                <div className="md:col-span-4 h-36 flex items-center justify-center p-2 rounded-xl bg-[#050717] border border-[#131b3c]">
                  <svg width="180" height="120" viewBox="0 0 180 120" className="overflow-visible">
                    {/* Edges */}
                    <line x1="90" y1="25" x2="45" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="90" y1="25" x2="135" y2="60" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="45" y1="60" x2="25" y2="95" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="45" y1="60" x2="65" y2="95" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Node 1 (Purple at top) */}
                    <circle cx="90" cy="25" r="13" fill="#9333ea" stroke="#c084fc" strokeWidth="2.5" />
                    <text x="90" y="29" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>

                    {/* Node 2 (Blue left) */}
                    <circle cx="45" cy="60" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="45" y="64" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>

                    {/* Node 4 (Emerald right) */}
                    <circle cx="135" cy="60" r="13" fill="#059669" stroke="#34d399" strokeWidth="2.5" />
                    <text x="135" y="64" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">4</text>

                    {/* Node 3 (Cyan bottom-left) */}
                    <circle cx="25" cy="95" r="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="25" y="99" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">3</text>

                    {/* Node 5 (Cyan bottom-right) */}
                    <circle cx="65" cy="95" r="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="65" y="99" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">5</text>
                  </svg>
                </div>
              </div>

              {/* Section 2 Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl bg-[#070b1f] border border-[#161f44]">
                <div className="md:col-span-8 space-y-2 text-xs">
                  <h3 className="text-xs font-bold text-white bg-purple-950/40 border border-purple-800/60 px-2.5 py-1 rounded-lg inline-block text-purple-300">
                    {topic.section2.title}
                  </h3>
                  <ul className="space-y-1.5 text-slate-300 leading-relaxed list-disc list-inside">
                    {topic.section2.items.map((item, idx) => (
                      <li key={idx}>
                        <strong className="text-white">{item.label}:</strong> {item.text}
                      </li>
                    ))}
                  </ul>

                  {topic.section2.subPoints && (
                    <div className="pt-1 text-slate-300 space-y-1 pl-2">
                      <div className="font-semibold text-white">
                        {topic.section2.subPointsTitle}
                      </div>
                      <ul className="space-y-1 pl-4 list-[circle] list-inside text-[11px] text-slate-300">
                        {topic.section2.subPoints.map((sp, idx) => (
                          <li key={idx}>
                            <span className="text-purple-300 font-medium">{sp.label}:</span> {sp.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Visual Diagram 2: Cycle Pentagram SVG matching Screenshot */}
                <div className="md:col-span-4 h-36 flex items-center justify-center p-2 rounded-xl bg-[#050717] border border-[#131b3c]">
                  <svg width="180" height="120" viewBox="0 0 180 120" className="overflow-visible">
                    {/* Pentagon Cycle Edges */}
                    <line x1="90" y1="20" x2="45" y2="55" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="90" y1="20" x2="135" y2="55" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="45" y1="55" x2="60" y2="98" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="135" y1="55" x2="120" y2="98" stroke="#38bdf8" strokeWidth="2.5" />
                    <line x1="60" y1="98" x2="120" y2="98" stroke="#38bdf8" strokeWidth="2.5" />

                    {/* Nodes matching pentagon in screenshot */}
                    <circle cx="90" cy="20" r="13" fill="#9333ea" stroke="#c084fc" strokeWidth="2.5" />
                    <text x="90" y="24" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">1</text>

                    <circle cx="45" cy="55" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="45" y="59" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">2</text>

                    <circle cx="135" cy="55" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="135" y="59" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">5</text>

                    <circle cx="60" cy="98" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="60" y="102" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">4</text>

                    <circle cx="120" cy="98" r="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="120" y="102" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">5</text>
                  </svg>
                </div>
              </div>

              {/* Bottom Key Difference Banner matching Screenshot */}
              <div className="p-4 rounded-xl bg-[#090b24] border border-[#231b54] shadow-lg flex items-center gap-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs flex-shrink-0">
                  <Scale size={18} />
                  <span>Key Difference</span>
                </div>
                <div className="h-6 w-px bg-[#262458]" />
                <div className="text-xs text-slate-300 leading-relaxed font-sans">
                  <strong className="text-purple-300">{topic.keyDifference.part1Label}:</strong>{' '}
                  {topic.keyDifference.part1Text}{' '}
                  <strong className="text-purple-300 ml-2">{topic.keyDifference.part2Label}:</strong>{' '}
                  {topic.keyDifference.part2Text}
                </div>
              </div>
            </div>
          )}

          {/* Examples Tab */}
          {activeContentTab === 'examples' && (
            <div className="p-4 rounded-xl bg-[#070b1f] border border-[#161f44] space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">Worked Examples</h3>
              <p className="text-slate-300 leading-relaxed">
                Consider the complete graph K₅. The degree of each vertex is 4 (even). Therefore, by Euler's Theorem, K₅ has an Eulerian Circuit.
              </p>
              <div className="p-3 rounded-lg bg-[#0e1434] border border-[#1b2650] font-mono text-purple-300 text-xs">
                Example Euler Circuit in K₅: 1 → 2 → 3 → 4 → 5 → 1 → 3 → 5 → 2 → 4 → 1
              </div>
            </div>
          )}

          {/* Interactive Tab */}
          {activeContentTab === 'interactive' && (
            <div className="p-4 rounded-xl bg-[#070b1f] border border-[#161f44] space-y-3 text-xs text-center py-8">
              <div className="text-purple-400 text-2xl font-bold">Interactive Sandbox</div>
              <p className="text-slate-300 max-w-md mx-auto">
                Test and trace Eulerian walks and Hamiltonian cycles interactively in the Graph Editor or Algorithms visualizer.
              </p>
            </div>
          )}

          {/* Summary Tab */}
          {activeContentTab === 'summary' && (
            <div className="p-4 rounded-xl bg-[#070b1f] border border-[#161f44] space-y-3 text-xs">
              <h3 className="font-bold text-white text-sm">Summary Cheat Sheet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-lg bg-[#0e1434] border border-[#1b2650]">
                  <div className="font-bold text-purple-300 mb-1">Eulerian (Edges)</div>
                  <div className="text-slate-300 text-[11px]">
                    Uses every edge exactly once. Governed strictly by even/odd degree parity.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0e1434] border border-[#1b2650]">
                  <div className="font-bold text-cyan-300 mb-1">Hamiltonian (Vertices)</div>
                  <div className="text-slate-300 text-[11px]">
                    Visits every vertex exactly once. NP-complete in general, sufficient conditions like Dirac's.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Theory;

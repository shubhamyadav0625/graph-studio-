// src/context/GraphContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Graph, VertexId } from '../types/graph';
import { examples } from '../data/exampleGraphs';

interface GraphContextProps {
  graph: Graph;
  setGraph: React.Dispatch<React.SetStateAction<Graph>>;
  addVertex: (id?: VertexId) => void;
  removeVertex: (id: VertexId) => void;
  addEdge: (source: VertexId, target: VertexId) => void;
  removeEdge: (source: VertexId, target: VertexId) => void;
  clearGraph: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selected: VertexId[];
  setSelected: React.Dispatch<React.SetStateAction<VertexId[]>>;
  toggleSelected: (id: VertexId) => void;
  clearSelection: () => void;
}

const GraphContext = createContext<GraphContextProps | undefined>(undefined);

export const useGraph = () => {
  const ctx = useContext(GraphContext);
  if (!ctx) throw new Error('useGraph must be used within GraphProvider');
  return ctx;
};

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [graph, setGraph] = useState<Graph>(() => ({ ...examples.wheel6 }));
  const [history, setHistory] = useState<Graph[]>([]);
  const [future, setFuture] = useState<Graph[]>([]);
  const [selected, setSelected] = useState<VertexId[]>(['3']);

  const pushHistory = () => {
    setHistory((h) => [...h, { ...graph }]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setFuture((f) => [{ ...graph }, ...f]);
    setGraph(previous);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory((h) => [...h, { ...graph }]);
    setGraph(next);
    setFuture((f) => f.slice(1));
  };

  const addVertex = (id?: VertexId) => {
    pushHistory();
    setGraph((g) => {
      // If numbers exist, find next number, else vX
      const allNumbers = g.vertices.every((v) => !isNaN(Number(v)));
      let newId = id;
      if (!newId) {
        if (allNumbers && g.vertices.length > 0) {
          const maxNum = Math.max(...g.vertices.map((v) => Number(v)));
          newId = String(maxNum + 1);
        } else {
          newId = `v${g.vertices.length + 1}`;
        }
      }
      if (g.vertices.includes(newId)) return g;
      return { ...g, vertices: [...g.vertices, newId] };
    });
  };

  const removeVertex = (id: VertexId) => {
    pushHistory();
    setGraph((g) => {
      const verts = g.vertices.filter((v) => v !== id);
      const edges = g.edges.filter((e) => e.source !== id && e.target !== id);
      return { vertices: verts, edges };
    });
    setSelected((s) => s.filter((sid) => sid !== id));
  };

  const addEdge = (source: VertexId, target: VertexId) => {
    if (source === target) return; // no self‑loops
    pushHistory();
    setGraph((g) => {
      const exists = g.edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      );
      if (exists) return g;
      return { ...g, edges: [...g.edges, { source, target }] };
    });
  };

  const removeEdge = (source: VertexId, target: VertexId) => {
    pushHistory();
    setGraph((g) => {
      const edges = g.edges.filter(
        (e) =>
          !(
            (e.source === source && e.target === target) ||
            (e.source === target && e.target === source)
          )
      );
      return { ...g, edges };
    });
  };

  const clearGraph = () => {
    pushHistory();
    setGraph({ vertices: [], edges: [] });
    setSelected([]);
  };

  const toggleSelected = (id: VertexId) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const clearSelection = () => setSelected([]);

  return (
    <GraphContext.Provider
      value={{
        graph,
        setGraph,
        addVertex,
        removeVertex,
        addEdge,
        removeEdge,
        clearGraph,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
        selected,
        setSelected,
        toggleSelected,
        clearSelection,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
};

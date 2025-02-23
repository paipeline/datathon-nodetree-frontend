import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

interface FlowContextType {
  nodes: Node[];
  addResponseNode: (content: string) => void;
  addResponseEdge: (source: string, target: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // 将原 handleAddResponseNode 逻辑提取到此处
  const addResponseNode = useCallback(
    (content: string) => {
      const newNode: Node = {
        id: uuidv4(),
        type: "aiResponse",
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          content
        }
      };
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    []
  );

  const addResponseEdge = useCallback(
    (source: string, target: string) => {
      setEdges((prevEdges) => [...prevEdges, { id: uuidv4(), source, target, animated: true }]);
    },
    []
  );

  return (
    <FlowContext.Provider value={{ nodes, addResponseNode, addResponseEdge, setNodes, setEdges }}>
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
}
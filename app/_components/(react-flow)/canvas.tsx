import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  BackgroundVariant,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { initialNodes, initialEdges } from "./canvas.node";
import handleAddInputNode from "./handleAddInputNode";
import handleAddResponseNode from "./handleAddResponseNode";
import { UserInput } from "./user-input";
import AiResponse from "./ai-response";

import { nodeTypes as baseNodeTypes } from "./canvas.node";

// 直接在模块作用域中定义并导出一个 Edge 数组 —— 这种写法可能会带来潜在问题
export let edgesStore: Edge[] = [];
export let nodesStore: Node[] = [];

export default function Canvas() {
  const [customNodes, setCustomNodes, onCustomNodesChange] = useNodesState(initialNodes as any);
  const [customEdges, setCustomEdges, onCustomEdgesChange] = useEdgesState(initialEdges as any);

  const onConnect = useCallback((connection: any) => {
    const edge = { ...connection, animated: true, id: uuidv4() + "-edge" };
    setCustomEdges((edges: any) => addEdge(edge, edges));
  }, [setCustomEdges]);

  const handleAddInput = () => {
    handleAddInputNode(setCustomNodes);
  };

  const handleAddResponse = () => {
    handleAddResponseNode(setCustomNodes, setCustomEdges, "title", "solution");
  };

  useEffect(() => {
    console.log("customNodes", customNodes);
  }, [customNodes]);

  // used chatgpt and has been cited
  const nodeTypes = useMemo(() => ({
    userInput: (nodeProps: any) => (
      <UserInput
        {...nodeProps}
        setCustomNodes={setCustomNodes}
        setCustomEdges={setCustomEdges}
      />
    ),
    aiResponse: (nodeProps: any) => (
      <AiResponse
        {...nodeProps}
        setCustomNodes={setCustomNodes}
        setCustomEdges={setCustomEdges}
      />
    ),
  }), [setCustomNodes]);

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={customNodes}
          edges={customEdges}
          onNodesChange={onCustomNodesChange}
          onEdgesChange={onCustomEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes as any} 
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10 }}>
          <button
            onClick={handleAddInput}
            className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
          >
            Add Input Node
          </button>
          <button
            onClick={handleAddResponse}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Add AI Response Node
          </button>
        </div>
    </ReactFlowProvider>
  );
}
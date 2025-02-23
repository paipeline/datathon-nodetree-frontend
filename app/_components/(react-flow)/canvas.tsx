import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import { initialNodes, initialEdges } from "./canvas.node";
import handleAddInputNode from "./handleAddInputNode";
import handleAddResponseNode from "./handleAddResponseNode";
import UserInput from "./user-input";

// 关键点：导入原先的 nodeTypes，但是需要重写 userInput
import { nodeTypes as baseNodeTypes } from "./canvas.node";

export default function Canvas() {
  const [customNodes, setCustomNodes, onCustomNodesChange] = useNodesState(initialNodes);
  const [customEdges, setCustomEdges, onCustomEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: any) => {
    const edge = { ...connection, animated: true, id: uuidv4() + "-edge" };
    setCustomEdges((edges: any) => addEdge(edge, edges));
  }, [setCustomEdges]);

  const handleAddInput = () => {
    handleAddInputNode(setCustomNodes);
  };

  const handleAddResponse = () => {
    handleAddResponseNode(setCustomNodes, "这是一个新AI节点");
  };

  useEffect(() => {
    console.log("customNodes", customNodes);
  }, [customNodes]);

  // 重写 userInput: 注入 setCustomNodes
  const nodeTypes = {
    ...baseNodeTypes,
    userInput: (nodeProps: any) => (
      <UserInput
        {...nodeProps}
        setCustomNodes={setCustomNodes}
      />
    ),
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ marginBottom: 10 }}>
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
    </ReactFlowProvider>
  );
}
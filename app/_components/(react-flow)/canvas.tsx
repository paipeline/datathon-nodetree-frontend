import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
 
import { initialNodes, initialEdges, nodeTypes } from './canvas.node';
 
export default function Canvas() {
  const [customNodes, setCustomNodes, onCustomNodesChange] = useNodesState(initialNodes);
  const [customEdges, setCustomEdges, onCustomEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback((connection: any) => {
    const edge = {...connection, animated: true, id: uuidv4() + '-edge'}
    setCustomEdges((prevEdges: any) => addEdge(edge, prevEdges))
  }, [setCustomEdges])
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={customNodes}
        edges={customEdges}
        onNodesChange={onCustomNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes as any}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
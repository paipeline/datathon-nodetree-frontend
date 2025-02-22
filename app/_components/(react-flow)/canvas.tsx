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
 
const initialNodes = [
  { 
    id: '1', 
    position: { 
      x: window.innerWidth / 2 - 100, 
      y: window.innerHeight / 2 - 350
    }, 
    data: { label: '1' } 
  },
  {
    id: '2',
    position: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    data: { label: '2' },
  },
  {
    id: '3',
    position: {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    },
    data: { label: '3' },
  }
];
const initialEdges = [
  { id: '456', source: '1', target: '2', animated: true }
];
 
export default function Canvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback((connection: any) => {
    const edge = {...connection, animated: true, id: uuidv4() + '-edge'}
    setEdges((prevEdges: any) => addEdge(edge, prevEdges))
  }, [])
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
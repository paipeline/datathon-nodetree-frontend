import React, { useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { initialNodes, initialEdges, nodeTypes } from './canvas.node';
import {handleAddInputNode} from './handleAddInputNode';
import {handleAddResponseNode} from './handleAddResponseNode';

export default function Canvas() {
  const [customNodes, setCustomNodes, onCustomNodesChange] = useNodesState(initialNodes);
  const [customEdges, setCustomEdges, onCustomEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback((connection: any) => {
    const edge = {...connection, animated: true, id: uuidv4() + '-edge'}
    setCustomEdges((prevEdges: any) => addEdge(edge, prevEdges))
  }, [setCustomEdges])
 
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={customNodes}
          edges={customEdges}
          onNodesChange={onCustomNodesChange}
          onEdgesChange={onCustomEdgesChange}
          onConnect={onConnect}
          // fitView
          nodeTypes={nodeTypes as any}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <button 
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
        onClick={() => {
          console.log('Button clicked');
          handleAddInputNode(setCustomNodes as any);
        }}
      >
        Add Input Node
      </button>
      <button 
        className="absolute top-4 right-44 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
        onClick={() => {
          console.log('Button clicked');
          handleAddResponseNode(setCustomNodes as any);
        }}
      >
        Add Response Node
      </button>
    </ReactFlowProvider>
    
  );
}
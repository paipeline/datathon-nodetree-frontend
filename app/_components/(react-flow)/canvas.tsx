import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
} from '@xyflow/react';
import { DemoNode } from './DemoNode';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useState } from 'react';

const nodeTypes = {
  CNode: DemoNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'CNode',
    position: { 
      x: typeof window !== 'undefined' ? window.innerWidth/2 - 200 : 0, 
      y: typeof window !== 'undefined' ? window.innerHeight/2 : 0 
    },
    data: { label: 'None' },
    connectable: true
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
      x: window.innerWidth / 2 + 100,
      y: window.innerHeight / 2 + 200,
    },
    data: { label: '3' },
  }
];

const onGenerateAIResponse = async (prompt: string): Promise<string> => {
  // 这里可以调用 OpenAI API 或其他 AI 生成逻辑
  return `AI Response for: ${prompt}`;
};

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onConnect = useCallback((connection: any) => {
    if (connection.source === connection.target) {
      return toast.error("不能连接自己到自身");
    }
    const edge = {...connection, animated: true, id: uuidv4() + '-edge'}
    setEdges((prevEdges: any) => addEdge(edge, prevEdges))
  }, []);

  const onGenerateAIResponse = async (prompt: string): Promise<string> => {
    return `AI Response for: ${prompt}`;
  };

  const handleSubmit = async (inputValue: string) => {
    setIsLoading(true);
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: inputValue }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: inputValue },
          ],
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: data.content }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Error: ' + (error as Error).message + ' API调用失败，请检查网络连接或稍后再试。'
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeOrigin={[0.5, 0.5]}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          connectionRadius={30}
          nodeTypes={{
            CNode: (props) => {
              const { data, ...nodeProps } = props;
              return <DemoNode data={data} onGenerateAIResponse={onGenerateAIResponse} onSubmit={handleSubmit} isLoading={isLoading} setIsLoading={setIsLoading} {...nodeProps} />;
            }
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
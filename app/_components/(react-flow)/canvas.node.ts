import UserInput from "./user-input";
import AiResponse from "./ai-response";
import { Node as ReactFlowNode } from '@xyflow/react';

export interface Node extends ReactFlowNode {
  content?: string;
  metadata?: any;
  parentNodeId?: string;
  childrenNodeIds?: string[];
  data: {
    label?: string;
    content?: string;
    [key: string]: unknown;
  };
}

export const initialNodes: Node[] = [
  {
    id: 'user-input-node-1',
    type: 'userInput',
    content: '',
    position: { 
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 350
     },
    data: { content: "" }
  },
  // fake nodes for testing
  // {
  //   id: 'ai-response-node-1',
  //   type: 'aiResponse',
  //   content: '',
  //   position: { x: 150, y: 150 },
  //   data: { content: 'Shenwei' }
  // },
  // {
  //   id: 'ai-response-node-2',
  //   type: 'aiResponse',
  //   content: '',
  //   position: { x: 150, y: 150 },
  //   data: { content: 'Pai' }
  // },
  // {
  //   id: 'ai-response-node-3',
  //   type: 'aiResponse',
  //   content: '',
  //   position: { x: 150, y: 150 },
  //   data: { content: 'AI Response Node' }
  // },
  // {
  //   id: 'ai-response-node-4',
  //   type: 'aiResponse',
  //   content: '',
  //   position: { x: 150, y: 150 },
  //   data: { content: 'AI Response Node' }
  // }
];

export const initialEdges = [
  // fake edges for testing
  // { id: 'user-input-node-1-ai-response-node-1', source: 'user-input-node-1', target: 'ai-response-node-1', animated: true },
  // { id: 'user-input-node-2-ai-response-node-2', source: 'user-input-node-1', target: 'ai-response-node-2', animated: true },
  // { id: 'user-input-node-3-ai-response-node-3', source: 'user-input-node-1', target: 'ai-response-node-3', animated: true },
  // { id: 'user-input-node-4-ai-response-node-4', source: 'user-input-node-1', target: 'ai-response-node-4', animated: true }
];

export const nodeTypes = {
  userInput: UserInput,
  aiResponse: AiResponse
};
import { UserInput } from "./user-input";
import AiResponse from "./ai-response";
import { Edge } from "@xyflow/react";
// import { Node as ReactFlowNode } from '@xyflow/react';

export interface Node {
  id: string;                // unique id
  color?: string;             // coloring the node
  type: string;               // type of the node being displayed
  content?: string;            // content = "" reactflow's must
  metadata?: any;          // langauge
  parentNodeId?: string;         // parentNodeId
  childrenNodeIds?: string[];       // childrenNodeIds
  position: {               
    x: number;
    y: number;
  };
  data?: {                    // place where to store the real data
    label: string;    
    content?: string;
    [key: string]: unknown;
  };
  selected?: boolean;
}

export const initialNodes: Node[] = [
  {
    id: 'user-input-node-1',
    type: 'userInput',
    content: '',
    position: { x: 100, y: 100 },
    data: { label: "", content: "" },
    selected: false
  },
  // fake nodes for testing

  // {
  //   id: 'ai-response-node-1',
  //   type: 'aiResponse',
  //   content: '',
  //   position: { x: 150, y: 150 },
  //   data: { label: "Shenwei", content: "Shenwei" }
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

export const initialEdges: Edge[] = [
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
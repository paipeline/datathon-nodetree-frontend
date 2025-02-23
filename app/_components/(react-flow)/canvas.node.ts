import UserInput from "./user-input";
import AiResponse from "./ai-response";

export interface Node {
  id: string;                 // 节点唯一标识
  type: string;               // 节点类型，例如 "question" | "answer" | "reasoning"
  content?: string;            // 节点主要内容
  metadata?: any;             // 节点元数据，存储额外信息（时间戳、来源等）
  parentNodeId?: string;      // 父节点ID
  childrenNodeIds?: string[]; // 子节点ID
  position: {                 // 节点位置
    x: number;
    y: number;
  };
  data?: {                    // 新增的 data 属性
    label: string;
  };
}

export const initialNodes = [
  {
    id: 'user-input-node-1',
    type: 'userInput',
    content: '',
    position: { x: 150, y: 150 },
    data: { content: 'User Input Node' }
  },
  {
    id: 'ai-response-node-1',
    type: 'aiResponse',
    content: '',
    position: { x: 150, y: 150 },
    data: { content: 'Shenwei' }
  },
  {
    id: 'ai-response-node-2',
    type: 'aiResponse',
    content: '',
    position: { x: 150, y: 150 },
    data: { content: 'Pai' }
  },
  {
    id: 'ai-response-node-3',
    type: 'aiResponse',
    content: '',
    position: { x: 150, y: 150 },
    data: { content: 'AI Response Node' }
  },
  {
    id: 'ai-response-node-4',
    type: 'aiResponse',
    content: '',
    position: { x: 150, y: 150 },
    data: { content: 'AI Response Node' }
  }
];

export const initialEdges = [
  { id: 'user-input-node-1-ai-response-node-1', source: 'user-input-node-1', target: 'ai-response-node-1', animated: true },
  { id: 'user-input-node-2-ai-response-node-2', source: 'user-input-node-1', target: 'ai-response-node-2', animated: true },
  { id: 'user-input-node-3-ai-response-node-3', source: 'user-input-node-1', target: 'ai-response-node-3', animated: true },
  { id: 'user-input-node-4-ai-response-node-4', source: 'user-input-node-1', target: 'ai-response-node-4', animated: true }
];

export const nodeTypes = {
  userInput: UserInput,
  aiResponse: AiResponse
};
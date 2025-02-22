import UserInput from "./user-input";

export interface Node {
  id: string;                 // 节点唯一标识
  type: string;               // 节点类型，例如 "question" | "answer" | "reasoning"
  content: string;            // 节点主要内容
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
    data: { label: 'User Input Node' }
  }
];

export const initialEdges = [
  { id: '456', source: '1', target: '2', animated: true }
];

export const nodeTypes = {
  userInput: UserInput
};
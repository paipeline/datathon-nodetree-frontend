import { Node, Edge } from "reactflow";

export const initialEdges: Edge[] = [];

export const initialNodes: Node[] = [
  {
    id: "input-node-1",
    type: "user-input",
    data: { 
      label: "User Input",
    },
    position: { x: 100, y: 100 },
  },  
];


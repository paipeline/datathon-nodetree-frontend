import { Node } from "@xyflow/react";
import UserInput from "./user-input";
import AiResponse from "./ai-response";
import { v4 as uuidv4 } from "uuid";


export const nodeTypes = {
    userInput: UserInput,
    aiResponse: AiResponse
  };
// 处理添加节点
export const handleAddResponseNode = (
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
) => {
    const newNode = {
        id: uuidv4(),
        type: "aiResponse",
        content: "",
        position: { x: Math.random() * 300 , y: Math.random() * 300 },
        data: { label: 'Response Node' }
    };
    console.log("Node added:", newNode);
    setNodes((prevNodes: any) => [...prevNodes, newNode]);
};

export default handleAddResponseNode;
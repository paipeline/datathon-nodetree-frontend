import { Node } from "@xyflow/react";
import AiResponse from "./ai-response";
import { v4 as uuidv4 } from "uuid";

export const nodeTypes = {
    aiResponse: AiResponse
};

// 处理添加节点
export const handleAddResponseNode = async (
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    content: string
) => {
    // const { default: UserInput } = await import("./user-input");
    const newNode = {
        id: uuidv4(),
        type: "aiResponse",
        content: "",
        position: { x: Math.random() * 300 , y: Math.random() * 300 },
        data: { content }
    };
    console.log("Node added:", newNode);
    setNodes((prevNodes: any) => [...prevNodes, newNode]);
};

export default handleAddResponseNode;
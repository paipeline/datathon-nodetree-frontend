import { Node } from "@xyflow/react";
import AiResponse from "./ai-response";
import { v4 as uuidv4 } from "uuid";

export const nodeTypes = {
    aiResponse: AiResponse
};

// 处理添加节点
export const handleAddResponseNode = (
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    title: string,
    solution: string
) => {
    const newNode: Node = {
        id: uuidv4(),
        type: "aiResponse",
        position: { x: Math.random() * 300 , y: Math.random() * 300 },
        data: {
            title,
            solution
        }
    };
    // check if the title or the solution is undefined
    if (title === undefined || solution === undefined) {
        console.log("title or solution is undefined -- from handleAddResponseNode");
        return;
    }
    console.log("Node added:", newNode);
    setNodes((prevNodes: any) => [...prevNodes, newNode]);
};

export default handleAddResponseNode;
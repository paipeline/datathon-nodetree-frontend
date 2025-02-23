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
    if (title === undefined || solution === undefined) {
        console.log("title 或 solution 未定义 —— 来自 handleAddResponseNode");
        return;
    }

    setNodes((prevNodes: Node[]): Node[] => {
        // 查找所有的 userInput 节点
        const userInputNodes = prevNodes.filter((node) => node.type === "userInput");

        if (!userInputNodes || userInputNodes.length === 0) {
            console.log("未找到 userInput 类型节点，无法定位父节点");
            return prevNodes;
        }

        // 这里以"最后一个" userInput 节点作为父节点
        const lastUserInputNode = userInputNodes[userInputNodes.length - 1];

        // 在父节点坐标基础上，x 轴向右移动 500px，y 轴向上移动 100px
        console.log("lastUserInputNode", lastUserInputNode);
        const newX = prevNodes[prevNodes.length - 1].type === "userInput" ? lastUserInputNode.position.x - 1000 : prevNodes[prevNodes.length - 1].position.x + 500;
        const newY = lastUserInputNode.position.y + 300;

        const newNode: Node = {
            id: uuidv4(),
            type: "aiResponse",
            position: { x: newX, y: newY },
            data: {
                title,
                solution
            }
        };

        console.log("新增 AI 节点:", newNode);
        return [...prevNodes, newNode];
    });
};

export default handleAddResponseNode;
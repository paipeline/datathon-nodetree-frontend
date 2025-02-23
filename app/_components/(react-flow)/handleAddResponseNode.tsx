"use client";

import { Node, Edge } from "@xyflow/react";
import AiResponse from "./ai-response";
import { v4 as uuidv4 } from "uuid";

export const nodeTypes = {
    aiResponse: AiResponse
};

export const handleAddResponseNode = (
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    title: string,
    solution: string,
    selectedNodeId: string
) => {
    if (title === undefined || solution === undefined) {
        // console.log("title 或 solution 未定义 —— 来自 handleAddResponseNode");
        return;
    }

    setNodes((prevNodes: Node[]): Node[] => {
        const selectedNode = prevNodes.find((node) => node.id === selectedNodeId);

        if (!selectedNode) {
            // console.log("未找到选中的节点，无法定位父节点");
            return prevNodes;
        }

        console.log("selectedNode", selectedNode);
        const newX = selectedNode.position.x + 500;
        const newY = selectedNode.position.y + 300;

        const newNode: Node = {
            id: uuidv4(),
            type: "aiResponse",
            position: { x: newX, y: newY },
            data: {
                title,
                solution
            },
            selected: false
        };

        setTimeout(() => {
            setEdges((prevEdges: Edge[]): Edge[] => {
                prevEdges.push({ id: uuidv4(), source: selectedNode.id, target: newNode.id, animated: true });
                return [...prevEdges];
            });
        }, 500)
        
        return [...prevNodes, newNode];
    });

};

export default handleAddResponseNode;
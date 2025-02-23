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
    selectedNodeId: string,
    positionAbsoluteX: number,
    positionAbsoluteY: number,
    type: string
) => {
    if (title === undefined || solution === undefined) {
        // console.log("title 或 solution 未定义 —— 来自 handleAddResponseNode");
        return;
    }

    console.log("positionAbsoluteX", positionAbsoluteX);
    console.log("positionAbsoluteY", positionAbsoluteY);

    setNodes((prevNodes: Node[]): Node[] => {

        const newX = prevNodes[prevNodes.length - 1].type === "userInput" ? positionAbsoluteX - 1000 : prevNodes[prevNodes.length - 1].position.x + 500;
        const newY = positionAbsoluteY + 300;

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
                prevEdges.push({ id: uuidv4(), source: selectedNodeId, target: newNode.id, animated: true });
                return [...prevEdges];
            });
        }, 500)
        
        return [...prevNodes, newNode];
    });

};

export default handleAddResponseNode;
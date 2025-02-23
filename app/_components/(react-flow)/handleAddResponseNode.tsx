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
    nodeId_toset: string
) => {
    if (!title || !solution) {
        return;
    }

    setNodes((prevNodes) => {

        // this part is written by chatgpt, I cited it
        const baseNode = prevNodes.find((node) => node.id === selectedNodeId);
        if (!baseNode) {
            return prevNodes;
        }

        const baseNodeChildren = prevNodes.filter((node) => {
            return node.data?.parentId === selectedNodeId;
        });

        let newX = 0;
        if (baseNodeChildren.length === 0) {
            newX = baseNode.position.x - 500;
        } else {
            const lastChild = baseNodeChildren[baseNodeChildren.length - 1];
            newX = lastChild.position.x + 500;
        }

        const newY = positionAbsoluteY + 300;

        const newNode: Node = {
            id: nodeId_toset,
            type: "aiResponse",
            position: { x: newX, y: newY },
            data: {
                title,
                solution,
                parentId: selectedNodeId
            },
            selected: false
        };

        setTimeout(() => {
            setEdges((prevEdges: Edge[]) => ([
                ...prevEdges,
                {
                    id: uuidv4(),
                    source: selectedNodeId,
                    target: newNode.id,
                    animated: true
                }
            ]));
        }, 500);

        return [...prevNodes, newNode];
    });
};

export default handleAddResponseNode;
"use client";

import { Node, Edge } from "@xyflow/react";
import AiResponse from "./ai-response";
import { v4 as uuidv4 } from "uuid";

import { edgesStore, nodesStore } from "./canvas";

export const nodeTypes = {
    aiResponse: AiResponse
};

export const handleAddResponseNode = (
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
    title: string,
    solution: string
) => {
    if (title === undefined || solution === undefined) {
        console.log("title 或 solution 未定义 —— 来自 handleAddResponseNode");
        return;
    }

    setNodes((prevNodes: Node[]): Node[] => {
        const userInputNodes = prevNodes.filter((node) => node.type === "userInput");

        if (!nodesStore.some((node) => node.id === userInputNodes[userInputNodes.length - 1].id)) {
            nodesStore.push(userInputNodes[userInputNodes.length - 1]);
        }

        if (!userInputNodes || userInputNodes.length === 0) {
            console.log("未找到 userInput 类型节点，无法定位父节点");
            return prevNodes;
        }

        // 这里以"最后一个" userInput 节点作为父节点
        const lastUserInputNode = userInputNodes[userInputNodes.length - 1];

        // in respect to the father node, add the new node to the good position
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

        // setEdges((prevEdges: Edge[]): Edge[] => {
        //     prevEdges.push({ id: uuidv4(), source: lastUserInputNode.id, target: newNode.id, animated: true });
        //     return [...prevEdges, new];
        // });

        // const newEdge: Edge = {
        //     id: uuidv4(),
        //     source: lastUserInputNode.id,
        //     target: newNode.id,
        //     animated: true
        // };
        

        // setTimeout(() => {
        //     edgesStore.push({
        //         id: uuidv4(),
        //         source: lastUserInputNode.id,
        //         target: newNode.id,
        //         animated: true
        //     } as Edge);
        // }, 1000)

        setTimeout(() => {
            setEdges((prevEdges: Edge[]): Edge[] => {
                prevEdges.push({ id: uuidv4(), source: lastUserInputNode.id, target: newNode.id, animated: true });
                return [...prevEdges];
            });
        }, 5000)
        
        console.log("edgesStore", edgesStore);

        console.log("新增 AI 节点:", newNode);

        nodesStore.push(newNode);
        return [...prevNodes, newNode];
    });

};

export default handleAddResponseNode;
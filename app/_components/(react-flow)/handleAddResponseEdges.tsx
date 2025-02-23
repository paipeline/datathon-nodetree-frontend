"use client";

import { Node, Edge } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { nodesStore, edgesStore } from "./canvas";

// 示例：将在这里直接使用 nodesStore 查找"最后一个 userInput 节点"并连到"最后一个 aiResponse 节点"
export function handleAddResponseEdges() {
  const userInputNodes = nodesStore.filter((node) => node.type === "userInput");
  if (userInputNodes.length === 0) {
    console.log("未找到 userInput 类型节点");
    return;
  }
  const lastUserInputNode = userInputNodes[userInputNodes.length - 1];

  const aiResponseNodes = nodesStore.filter((node) => node.type === "aiResponse");
  if (aiResponseNodes.length === 0) {
    console.log("未找到 aiResponse 类型节点");
    return;
  }
  const lastAiResponseNode = aiResponseNodes[aiResponseNodes.length - 1];

  const newEdge: Edge = {
    id: uuidv4(),
    source: lastUserInputNode.id,
    target: lastAiResponseNode.id,
    animated: true,
  };

  // 直接往 edgesStore 里 push
  edgesStore.push(newEdge);
  console.log("edgesStore 更新:", edgesStore);
}

export default handleAddResponseEdges; 
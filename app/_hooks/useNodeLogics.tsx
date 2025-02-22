import { useState, useRef, useCallback, useEffect } from "react";
import { useNodeId, useReactFlow } from "@xyflow/react";

// export function useNodeLogic(onGenerateAIResponse: (prompt: string) => Promise<string>) {
//   // 在这里实现 useNodeLogic 的逻辑
// }

// 将 useDeleteNode 移到外面作为单独的 hook
export function useDeleteNode() {
  const id = useNodeId();
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((prevNodes) =>
      prevNodes.filter((node) => node.id !== id)
    );
  }, [id, setNodes]);

  return { handleDelete };
}
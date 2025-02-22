import { useState, useRef, useCallback, useEffect } from "react";
import { useNodeId, useReactFlow } from "@xyflow/react";

export function useNodeLogic(onGenerateAIResponse: (prompt: string) => Promise<string>) {
  const [isLoading, setIsLoading] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 调整 textarea 高度
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  // 处理 AI 生成内容
  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      const aiResponse = await onGenerateAIResponse(inputValue);
      console.log("AI Response:", aiResponse);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    textareaHeight,
    inputValue,
    setInputValue,
    textareaRef,
    adjustTextareaHeight,
    handleSubmit,
  };
}

// 删除节点逻辑 Hook
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
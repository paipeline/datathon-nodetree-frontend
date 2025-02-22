"use client";

import { BaseNode } from "@/components/base-node";
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
} from "@/components/node-header";
import { useNodeLogic } from "@/app/hooks/useNodeLogics";
import { NodeHeaderSubmitAction, NodeHeaderDeleteAction } from "./NodeActions";

interface CustomNodeProps {
  data: {
    title: string;
    aiResponse?: string;
  };
  onGenerateAIResponse: (prompt: string) => Promise<string>;
}

export function DemoNode({ data, onGenerateAIResponse }: CustomNodeProps) {
  const {
    isLoading,
    textareaHeight,
    inputValue,
    setInputValue,
    textareaRef,
    adjustTextareaHeight,
    handleSubmit,
  } = useNodeLogic(onGenerateAIResponse);
  

  return (
    <BaseNode className="flex py-2 px-3 rounded-2xl h-auto flex-col w-[300px]">
      <NodeHeader className="px-0 flex flex-col items-start">
        <NodeHeaderTitle className="w-full">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your prompt..."
            className="rounded-lg border w-full outline-none resize-none bg-gray-100 p-1 text-sm placeholder:text-gray-400 placeholder:text-[12px] pl-2"
            rows={1}
            onInput={adjustTextareaHeight}
            style={{ height: `${textareaHeight}px` }}
          />
        </NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderSubmitAction handleSubmit={handleSubmit} isLoading={isLoading} />
          <NodeHeaderDeleteAction />
        </NodeHeaderActions>
      </NodeHeader>
    </BaseNode>
  );
}
"use client";

import { BaseNode } from "@/components/base-node";
import {
  NodeHeader,
  NodeHeaderTitle,
  NodeHeaderActions,
} from "@/components/node-header";
import { NodeHeaderSubmitAction, NodeHeaderDeleteAction } from "./NodeActions";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface CustomNodeProps {
  data: {
    title: string;
    aiResponse?: string;
  };
  onGenerateAIResponse: (prompt: string) => Promise<string>;
  onSubmit: (input: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function DemoNode({ data, onGenerateAIResponse, onSubmit, isLoading, setIsLoading }: CustomNodeProps) {

  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [adjustCount, setAdjustCount] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("gpt-4o-mini");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lineCount = textarea.value.split('\n').length;
    const newAdjustCount = lineCount - 1;
    setAdjustCount(newAdjustCount);

    if (newAdjustCount <= 3) {
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);

      const button = textarea.parentElement?.nextElementSibling as HTMLButtonElement;
      if (button) {
        button.style.height = `${newHeight}px`;
      }
    } else {
      textarea.style.overflow = 'auto';
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    onSubmit(inputValue);
    setInputValue(""); // 触发useEffect中的高度调整
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (inputValue.trim() === "") {
          toast.error("Please enter a message");
          return;
        }
        setIsLoading(true);
        onSubmit(inputValue);
        setInputValue("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, onSubmit, setIsLoading]);

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
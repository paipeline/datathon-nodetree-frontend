"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUp, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import "@/styles/fade-in.css";
import { Handle, Position } from '@xyflow/react';

function UserInput({ data, onSubmit, setIsLoading }: { data: any, onSubmit: (input: string) => void, setIsLoading: (loading: boolean) => void }) {

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

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

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
  }, [inputValue, onSubmit]);

  return (
    <div
      style={{
        padding: 10,
        backgroundColor: "rgba(240, 240, 240, 0.7)",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "#004d40",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        width: "350px",
        backdropFilter: "blur(20px)",
      }}
    >
      <Handle type="source" position={Position.Bottom} id="a" />
      <div className="text-sm text-gray-500 font-bold mb-2">{"Ask Me Now..."}</div>
      <textarea
        ref={textareaRef}
        className="relative w-full outline-none resize-none bg-transparent p-2 pl-6 z-10 border rounded-md"
        value={inputValue}
        placeholder="请输入..."
        onChange={(e) => setInputValue(e.target.value)}
        rows={1}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <div className="flex items-center justify-end w-full h-full bg-transparent z-10">
        <div className={`flex items-center justify-center w-6 h-6 bg-gray-300 hover:bg-gray-200 rounded-lg hover:cursor-pointer hover:w-12
              transition-all duration-300`}>
          <Trash className="w-4 h-4 text-black" />
        </div>
        <div className={`flex items-center justify-center ml-3 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg hover:cursor-pointer hover:w-12
            transition-all duration-300`}>
          <ArrowUp className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default UserInput;
"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Trash } from "lucide-react";
import { Handle, Position } from '@xyflow/react';
import { handleAddResponseNode } from "./handleAddResponseNode";
import "@/styles/fade-in.css";
import "@/app/_components/(conversation)/inputbar.css";
import { cn } from "@/lib/utils";

export const UserInput = ({ setCustomNodes, setCustomEdges }: { setCustomNodes: (nodes: any) => void, setCustomEdges: (edges: any) => void }) => {
  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [adjustCount, setAdjustCount] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddResponse = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalInput: inputValue,
          followUpQuestion: "",
          metadata: {
            language: "English"
          },
          sessionId: null,
          traceId: null,
          contextNodes: null
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      console.log("responsing");
      console.log(response);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader?.read() || {};
        if (done) break;

        const chunk = decoder.decode(value);
        console.log("Stream chunk:", chunk);

        // split by \n
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();

          // console.log("Line content:", trimmedLine);

          // check if it starts with data:
          if (trimmedLine.startsWith('data: ')) {
            try {
              // remove data: and trim
              const jsonData = trimmedLine.slice(6).trim();
              if (jsonData) {
                const parsedData = JSON.parse(jsonData);
                console.log("Parsed data:", parsedData);
                // render ai-response node
                handleAddResponseNode(setCustomNodes as any, setCustomEdges as any, parsedData.title, parsedData.solution);
              }
            } catch (e) {
              console.error('Error parsing event data:', e);
            }
          }
        }

        setIsLoading(false);
      }

    } catch (error) {
      console.error("API error:", error);
    } finally {
      // setIsLoading(false);  redundant  - marked by Shenwei
    }
  };

  return (
    <div className="fade-in flex items-center justify-start w-[500px] h-full px-4 py-4 pt-0 bg-transparent transition-all duration-300">
      <div className={cn(
        "relative flex flex-col items-center justify-start h-full backdrop-blur-3xl bg-[rgba(243, 244, 246, 0.7)] border border-[#e8eaeb] bg-[#F5F5F5] rounded-2xl px-4 py-2 w-full overflow-hidden",
        isLoading && "inputbar-loading"
      )}>
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1]" />
        <div
          className={cn(
            "absolute top-0 left-0 w-full h-full rounded-xl transition-all duration-1000 z-[2]",
            (isFocused || isLoading)
              ? "opacity-100 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 backdrop-blur-lg"
              : "opacity-0 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 backdrop-blur-lg"
          )}
        />
        <Handle type="source" position={Position.Bottom} id="a" />
        <div className="text-sm text-gray-500 font-bold mb-2 z-10 absolute top-[10px] left-[10px]">Ask Me Now...</div>
        <textarea
          ref={textareaRef}
          className="relative w-full outline-none resize-none bg-transparent p-2 pl-4 z-10 border rounded-lg mt-[30px]"
          value={inputValue}
          placeholder="Enter your question here..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex items-center justify-end w-full h-full bg-transparent mt-2 z-10">
          <div className={`flex items-center justify-center w-6 h-6 bg-gray-400 hover:bg-gray-300 rounded-lg hover:cursor-pointer hover:w-12 transition-all duration-300`}>
            <Trash className="w-4 h-4 text-black" />
          </div>
          <div
            className={`flex items-center justify-center ml-3 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg hover:cursor-pointer hover:w-12 transition-all duration-300`}
            onClick={handleAddResponse}
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInput;
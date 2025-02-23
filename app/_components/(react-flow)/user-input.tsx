"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Trash } from "lucide-react";
import { toast } from "sonner";
import "@/styles/fade-in.css";
import { Handle, Position } from '@xyflow/react';
import { handleAddResponseNode } from "./handleAddResponseNode";

export const UserInput = ({ setCustomNodes }: { setCustomNodes: (nodes: any) => void }) => {

  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [adjustCount, setAdjustCount] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("gpt-4o-mini");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddResponse = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    
    console.log("inputValue", inputValue);

    try {
      const response = await fetch("http://localhost:8000/api/v1/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "originalInput": "Create a web application that allows users to track their daily expenses and generate monthly reports.",
            "followUpQuestion": "how to perform CRUD operations in Next.jres?",
            "metadata": {
              "language": "English"
            },
            "sessionId": null,
            "traceId": null,
            "contextNodes": null
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

        // 改为按行来拆分
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          // 打印看每一行是什么
          console.log("Line content:", trimmedLine);

          // 检查是否以 data: 开头
          if (trimmedLine.startsWith('data: ')) {
            try {
              // 去掉 data: 后面的部分，并再次 trim
              const jsonData = trimmedLine.slice(6).trim();
              if (jsonData) {
                const parsedData = JSON.parse(jsonData);
                console.log("Parsed data:", parsedData);
                // 渲染 ai-response node
                handleAddResponseNode(setCustomNodes as any, parsedData.title, parsedData.solution);
              }
            } catch (e) {
              console.error('Error parsing event data:', e);
            }
          }
        }
      }
      

    } catch (error) {
      console.error("API error:", error);
    } finally {
      // setIsLoading(false);
    }

    // setIsLoading(true);
    // onSubmit(inputValue);
    setInputValue("");
  };

  return (
    <div
    className="border-sky-400"
      style={{
        padding: 10,
        backgroundColor: "rgba(240, 240, 240, 0.7)",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "#004d40",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        width: "300px",
        backdropFilter: "blur(20px)"
      }}
    >
      <Handle type="source" position={Position.Bottom} id="a" />
      <div className="text-sm text-gray-500 font-bold mb-2">Ask Me Now...</div>
      <textarea
        ref={textareaRef}
        className="relative w-full outline-none resize-none bg-transparent p-2 pl-4 z-10 border rounded-md"
        value={inputValue}
        placeholder="请输入..."
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex items-center justify-end w-full h-full bg-transparent z-10">
        <div className={`flex items-center justify-center w-6 h-6 bg-gray-400 hover:bg-gray-300 rounded-lg hover:cursor-pointer hover:w-12
              transition-all duration-300`}>
          <Trash className="w-4 h-4 text-black" />
        </div>
        <div className={`flex items-center justify-center ml-3 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg hover:cursor-pointer hover:w-12
            transition-all duration-300`}
            onClick={handleAddResponse}
            >
          <ArrowUp className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
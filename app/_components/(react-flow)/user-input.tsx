"use client";

import React, { useState, useRef } from "react";
import { ArrowUp, Trash } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

import handleAddResponseNode from "./handleAddResponseNode";
import { Node } from "./canvas.node";

// data: 用于节点自带内容
// setCustomNodes: 父组件里（Canvas）传进来的
export default function UserInput({
  data,
  setCustomNodes
}: {
  data: { content?: string }; 
  setCustomNodes: React.Dispatch<React.SetStateAction<Node[]>>;
}) {
  const [inputValue, setInputValue] = useState<string>(data?.content || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // const handleAddResponse = () => {
  //   if (!inputValue.trim()) return;
  //   handleAddResponseNode(setCustomNodes as any, inputValue.trim());
  //   handleAddResponseNode(setCustomNodes as any, inputValue.trim());
  //   handleAddResponseNode(setCustomNodes as any, inputValue.trim());
  //   setInputValue("");
  // };

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

      // 可以reach到
      handleAddResponseNode(setCustomNodes as any, "test - from user input");
      handleAddResponseNode(setCustomNodes as any, "test - from user input");
      handleAddResponseNode(setCustomNodes as any, "test - from user input");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader?.read() || {};
        if (done) break;

        const chunk = decoder.decode(value);
        console.log("Stream chunk:", chunk);
        const events = chunk.split('\n\n');

        for (const event of events) {
          // if (event.startsWith('data: ')) {
            try {   
              const data = JSON.parse(event.slice(6));
              console.log("张珅玮是傻逼！");
              // rendering the ai-response node
              handleAddResponseNode(setCustomNodes as any, "test - from user input");
              // console.log("customNodes", customNodes);
            } catch (e) {
              console.error('Error parsing event data:', e);
            }
          // }
        }
      }
      

    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }

    setIsLoading(true);
    // onSubmit(inputValue);
    setInputValue("");
  };

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
        width: "300px",
        backdropFilter: "blur(20px)"
      }}
    >
      <Handle type="source" position={Position.Bottom} id="a" />
      <div className="text-sm text-gray-500 font-bold mb-2">Ask Me Now...</div>
      <textarea
        ref={textareaRef}
        className="w-full outline-none resize-none bg-transparent p-2 pl-6 border rounded-md"
        value={inputValue}
        placeholder="请输入..."
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex items-center justify-end w-full h-full bg-transparent mt-2">
        <div
          className="flex items-center justify-center w-6 h-6 bg-gray-300 hover:bg-gray-200 rounded-lg 
          hover:cursor-pointer hover:w-12 transition-all duration-300 mr-2"
        >
          <Trash className="w-4 h-4 text-black" />
        </div>
        <div
          className="flex items-center justify-center w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg
          hover:cursor-pointer hover:w-12 transition-all duration-300"
          onClick={handleAddResponse}
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}
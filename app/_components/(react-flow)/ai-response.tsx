"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import "@/styles/fade-in.css";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Handle, Position } from '@xyflow/react';
import { Trash, ArrowUp, Maximize } from "lucide-react";
import { toast } from "sonner";
import { useNodeColor } from "./handleDropDownMenu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import "@/styles/fade-in.css";

const AiResponse = ({ data: { title, solution } }: { data: { title: string, solution: string } }) => {
  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [adjustCount, setAdjustCount] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("gpt-4o-mini");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setRed, setOrange, setYellow } = useNodeColor();

  const [expand, setExpand] = useState<boolean>(false);
  const [expandHeight, setExpandHeight] = useState<number>(150);

  // if title or solution is undefined, return null, not render the node
  if (title === undefined || solution === undefined) {
    return null;
  }

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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      toast.error("Please enter a message");
      return;
    }

    // setIsLoading(true);
    // onSubmit(inputValue);
    setInputValue(""); // 触发useEffect中的高度调整
  };

  // console.log("content - ai-response", content);

  const handleScroll = (e: React.WheelEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;

    // 只有当 `textarea` 还可以滚动时，才阻止事件冒泡
    if (
      (e.deltaY < 0 && target.scrollTop === 0) ||
      (e.deltaY > 0 && target.scrollTop + target.clientHeight >= target.scrollHeight)
    ) {
      return; // 允许事件继续传播，ReactFlow 可能会处理
    }

    e.stopPropagation(); // 阻止 `canvas` 监听 `wheel` 事件
  };

  return (
    <div
      className="relative fade-in-1"
      style={{
        borderColor: "oklch(0.871 0.15 154.449)",
        padding: 10,
        backgroundColor: "rgba(240, 240, 240, 0.7)",
        border: "2px solid rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "#004d40",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        width: "350px",
        backdropFilter: "blur(20px)"
      }}
    >
      <Handle type="target" position={Position.Top} id="b" />
      <div className="flex items-center justify-start w-full mb-2">
        <div className="text-sm text-gray-500 font-bold">{"AI Response"}</div>
        <Button variant="outline" className="flex items-center gap-1 text-xs w-6 h-6 ml-auto" onClick={() => setExpand(!expand)}>
          <Maximize className="w-4 h-4 text-gray-500 hover:cursor-pointer hover:text-gray-700" />
          <p className="text-xs">{expand ? "Collapse" : "Expand"}</p>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-xs w-12 h-6 ml-2">Priority</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem onClick={() => setRed()} value={"high"}>High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"Medium"} onClick={() => setOrange()}>Medium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"Low"} onClick={() => setYellow()}>Low</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* render the content generated by the ai */}
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: ({ node, inline, className, children, ...props }: {
            node?: any;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';

            if (inline || !lang) {
              return (
                <code
                  className="bg-gray-700 rounded px-1 text-white"
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <SyntaxHighlighter
                language={lang || 'text'}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0.375rem',
                  background: '#1e1e1e'
                }}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {`# **Title:** ${title}\n\n# **Solution:**\n ${solution}`}
      </ReactMarkdown>
      <div className="text-sm text-gray-500 mb-2 italic pt-2">{"Follow-up questions..."}</div>
      <div className="relative flex items-center">
        <style jsx global>{`
        textarea::-webkit-scrollbar {
          width: 6px; 
          background-color: transparent;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 3px;
          cursor: default; 
        }

        textarea {
          cursor: text;
        }
      `}</style>
        <textarea
          onWheel={handleScroll}
          ref={textareaRef}
          onFocus={() => setIsFocused(true)}
          className="relative w-[calc(100%-70px)] outline-none resize-none bg-transparent p-0 pl-2 pr-16 z-10 border rounded-md overflow-y-auto"
          value={inputValue}
          placeholder="Enter here"
          onChange={(e) => setInputValue(e.target.value)}
          rows={1}
          onInput={handleInput}
          onBlur={() => setIsFocused(false)}
        />
        <div className="absolute top-0 right-2 flex items-center gap-2" >
          <div className={`flex items-center justify-center w-6 h-6 bg-gray-400 hover:bg-gray-300 rounded-lg hover:cursor-pointer hover:scale-110
                transition-transform duration-300`}>
            <Trash className="w-3 h-3 text-black" />
          </div>
          <div className={`flex items-center justify-center w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg hover:cursor-pointer hover:scale-110
              transition-transform duration-300`}
            onClick={() => handleSubmit}
          >
            <ArrowUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiResponse;
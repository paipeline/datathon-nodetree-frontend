"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import "@/styles/fade-in.css";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Trash, ArrowUp, Maximize } from "lucide-react";
import { toast } from "sonner";
import { useNodeColor } from "./handleDropDownMenu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuRadioGroup } from "@radix-ui/react-dropdown-menu";
import "@/styles/fade-in.css";
import { cn } from "@/lib/utils";
import { handleAddResponseNode } from "./handleAddResponseNode";

interface AiResponseProps extends NodeProps {
  data: {
    title: string;
    solution: string;
  };
  setCustomNodes: React.Dispatch<React.SetStateAction<any[]>>;
  setCustomEdges: React.Dispatch<React.SetStateAction<any[]>>;
}

const AiResponse = ({
  data: { title, solution },
  setCustomNodes,
  setCustomEdges,
  id,
  selected,
  ...rest
}: AiResponseProps) => {
  if (!title || !solution) {
    return null;
  }
  const {
    positionAbsoluteX,
    positionAbsoluteY,
    setCustomNodes: restSetCustomNodes,
    setCustomEdges: restSetCustomEdges,
  } = rest;

  const [textareaHeight, setTextareaHeight] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [adjustCount, setAdjustCount] = useState(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<string>("gpt-4o-mini");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setRed, setOrange, setYellow } = useNodeColor();

  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [isFullyExpanded, setIsFullyExpanded] = useState<boolean>(false);
  const aiResponseRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExpand = () => {
    if (!isExpand) {
      setIsExpand(true);
      setTimeout(() => {
        setIsFullyExpanded(true);
      }, 100);
    } else {
      setIsFullyExpanded(false);
      setTimeout(() => {
        setIsExpand(false);
      }, 100);
    }
  };

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

  const handleAddResponse = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (inputValue.trim() === "") {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v2/round_context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalInput: inputValue,
          followUpQuestion: title,
          metadata: {
            language: "English"
          },
          sessionId: null,
          traceId: null,
          contextNodes: null,
          priority: 0,
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

                // get the id of the node
                const nodeId_toset = parsedData.id;

                console.log("nodeId:", nodeId_toset);

                // render ai-response node
                handleAddResponseNode(setCustomNodes, setCustomEdges, parsedData.title, parsedData.solution, id, positionAbsoluteX, positionAbsoluteY, nodeId_toset);
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
    }
  };

  return (
    <div
      ref={aiResponseRef}
      className={cn("relative fade-in-1 transition-all duration-100")}
      style={{
        height: isExpand ? `${aiResponseRef.current?.scrollHeight}px` : "230px",
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
        backdropFilter: "blur(20px)",
      }}
    >
      <Handle type="target" position={Position.Top} id="b" />
      <Handle type="source" position={Position.Bottom} id="a" />
      <div className="flex items-center justify-start w-full mb-2">
        <div className="text-sm text-gray-500 font-bold">{"AI Response"}</div>
        <Button
          variant="outline"
          className="flex items-center gap-2 text-xs h-6 ml-auto"
          onClick={handleExpand}
        >
          <Maximize className="w-4 h-4 text-gray-500 hover:cursor-pointer hover:text-gray-700" />
          <p className="text-xs">{isExpand ? "Collapse" : "Expand"}</p >
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-xs w-12 h-6 ml-2">
              Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem onClick={() => setRed()} value={"high"}>
                High
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value={"Medium"}
                onClick={() => setOrange()}
              >
                Medium
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={"Low"} onClick={() => setYellow()}>
                Low
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* render the content generated by the ai */}
      {isExpand ? (
        <div className={cn("fade-in-1 transition-all duration-300")}>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code: ({
                node,
                inline,
                className,
                children,
                ...props
              }: {
                node?: any;
                inline?: boolean;
                className?: string;
                children?: React.ReactNode;
              }) => {
                const match = /language-(\w+)/.exec(className || "");
                const lang = match ? match[1] : "";

                if (inline || !lang) {
                  return (
                    <code
                      className="bg-gray-700 rounded px-1 text-white"
                      style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <SyntaxHighlighter
                    language={lang || "text"}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.375rem",
                      background: "#1e1e1e",
                    }}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              },
              a: ({ node, ...props }) => (
                <a target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {`# **Title:** ${title}\n\n# **Solution:**\n ${solution}`}
          </ReactMarkdown>
        </div>
      ) : (
        <div
          className={cn(
            "text-lg font-bold flex flex-col gap-2 text-gray-500 mb-2 italic pt-2 fade-in-1 transition-all duration-300",
            isFullyExpanded ? "opacity-0" : "opacity-100"
          )}
        >
          <div
            className="overflow-hidden line-clamp-5"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "5",
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const lang = match ? match[1] : "";

                  if (inline || !lang) {
                    return (
                      <code
                        className="bg-gray-200 text-black rounded px-1"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <SyntaxHighlighter
                      language={lang || "text"}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.375rem",
                        background: "#1e1e1e",
                      }}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  );
                },

                p: ({ children }) => (
                  <p className="text-gray-800 text-[16px] leading-6 ml-2">
                    {children}
                  </p >
                ),

                em: ({ children }) => (
                  <em className="text-gray-600 italic">{children}</em>
                ),

                strong: ({ children }) => (
                  <strong className="text-black font-bold">{children}</strong>
                ),
              }}
            >
              {solution}
            </ReactMarkdown>
          </div>
        </div>
      )}
      <div className="relative flex items-center mt-5">
        <textarea
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
        <div className="absolute top-0 right-2 flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-6 h-6 bg-gray-400 hover:bg-gray-300 rounded-lg hover:cursor-pointer 
                transition-transform duration-300`}
          >
            <Trash className="w-3 h-3 text-black" />
          </div>
          <div
            className={`flex items-center justify-center w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-lg hover:cursor-pointer
              transition-transform duration-300`}
            onClick={handleAddResponse}
          >
            <ArrowUp className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiResponse;
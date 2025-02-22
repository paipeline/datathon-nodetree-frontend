"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, BotMessageSquare, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import "@/styles/fade-in.css";
import "./inputbar.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const InputBar = ({
  onSubmit,
  isLoading,
  setIsLoading
}: {
  onSubmit: (input: string) => void,
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void
}) => {
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
    <div className="fade-in flex items-center justify-center w-[70%] xl:w-[50%] 2xl:w-[40%] h-full px-4 py-4 pt-0 bg-transparent transition-all duration-300">
      <form onSubmit={handleSubmit} className="w-full">
        <div className={cn(
          "relative flex flex-col items-center justify-center h-full backdrop-blur-3xl bg-[rgba(243, 244, 246, 0.7)] border border-[#e8eaeb] bg-[#F5F5F5] rounded-xl px-4 py-2 w-full overflow-hidden",
          isLoading && "inputbar-loading"
        )}>
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-[1]" />
          <div className={cn(
            "absolute w-full h-full rounded-xl transition-all duration-1000 z-[2]",
            isFocused || isLoading ? "opacity-100 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 backdrop-blur-lg" : "opacity-0 bg-gradient-to-r from-purple-100/50 via-pink-100/50 to-blue-100/50 backdrop-blur-lg",
          )} />
          <textarea
            ref={textareaRef}
            className="relative w-full outline-none resize-none bg-transparent px-2 pt-1 z-10"
            value={inputValue}
            placeholder="请输入..."
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
            onInput={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <div className="flex items-center w-full h-full bg-transparent mt-2 z-10">
            <div className={`flex items-center justify-center w-8 h-8 bg-transparent hover:bg-gray-200 rounded-lg
            transition-all duration-300`}>
              <Plus className="w-5 h-5" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center justify-center w-8 h-8 bg-transparent rounded-lg hover:bg-gray-200
                  transition-all duration-300 ml-2">
                  <BotMessageSquare className="w-5 h-5" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Chatbot Models</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                  <DropdownMenuRadioItem value="gpt-4o">GPT-4o</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="gpt-4o-mini">GPT-4o-mini</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="gpt-3.5-turbo">GPT-3.5-turbo</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button type="submit" className={`flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg
            hover:bg-gray-700 hover:rounded-2xl transition-all duration-300 ml-auto`}>
              {isLoading ? (
                <div className="w-5 h-5 bg-white rounded-full"></div>
              ) : (
                <ArrowUp className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default InputBar;
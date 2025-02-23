"use client";

import { cn } from "@/lib/utils";
import { Share, ArrowRightLeft, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Conversations from "@/app/_components/(conversation)/conversations";
import InputBar from "@/app/_components/(conversation)/inputbar";
import Canvas from "@/app/_components/(react-flow)/canvas";
import { useConversation, Conversation } from "@/app/_contexts/ConversationProvider";
import "@/styles/fade-in.css";

type Message = { role: "user" | "assistant"; content: string };

const ConversationArea = ({
  isSidebarOpen,
  conversationId,
}: {
  isSidebarOpen: boolean;
  conversationId?: string;
}) => {
  const { getConversationById, updateConversation, addConversation } = useConversation();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [caroselIndex, setCaroselIndex] = useState<number>(0);

  // Initialize or load conversation
  useEffect(() => {
    if (!conversationId) return;
    const conv = getConversationById(conversationId);
    if (conv) {
      setConversation(conv);
    } else {
      const newConversation = { id: conversationId, title: "New Chat", messages: [] };
      setConversation(newConversation);
      addConversation(newConversation);
    }
  }, [conversationId, getConversationById, addConversation]);

  const handleSubmit = async (inputValue: string) => {
    if (!conversation) return;
    setIsLoading(true);

    const userMessage: Message = { role: "user", content: inputValue };
    const updatedMessages = [...conversation.messages, userMessage];
    const updatedConversation = { ...conversation, messages: updatedMessages };

    setConversation(updatedConversation);
    updateConversation(updatedConversation);

    try {
      const response = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          prompt: updatedMessages[updatedMessages.length - 1].content,
          max_tokens: 2000,
          temperature: 0.7,
          model: "gpt-4o-mini"
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.content };
      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = { ...conversation, messages: finalMessages };

      setConversation(finalConversation);
      updateConversation(finalConversation);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    if (!conversation) return;
    const updatedConversation = { ...conversation, title: newTitle };
    setConversation(updatedConversation);
    updateConversation(updatedConversation);
  };

  return (
    <div className="flex flex-col flex-grow h-full fade-in">
      <header className={`flex items-center justify-start w-full px-4 py-2 overflow-hidden ${isSidebarOpen ? 'ml-10' : 'ml-10'}`}>
        <div
          className="font-bold text-gray-600 transition-all duration-700 mx-4 rounded-lg px-4 py-1 h-8"
          style={{
            border: '2px solid transparent',
            borderImage: 'linear-gradient(to right, #ff7e5f, #feb47b) 1',
            WebkitMaskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 98%, rgba(0, 0, 0, 0) 100%)',
            maskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 98%, rgba(0, 0, 0, 0) 100%)',
            transition: 'transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transform: caroselIndex === 1 ? 'translateY(0)' : 'translateY(150%)',
            fontStyle: 'italic',
            background: 'linear-gradient(to right, #ff7e5f, #feb47b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Brush Script MT',
            fontSize: '18px',
          }}
        >
          Canvas Mode
        </div>

        <div className="flex items-center justify-center bg-transparent rounded-lg hover:bg-gray-200
          transition-all duration-300 px-4 py-1 shadow-sm"
          style={{
            transform: caroselIndex === 1 ? 'translateX(0)' : 'translateX(-65%)'
          }}
        >
          <input
            type="text"
            value={conversation?.title ?? ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={() => {
              if (conversation && conversation.title.trim() === "") {
                handleTitleChange("Untitled Chat");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur(); 
              }
            }}
            placeholder="Enter a title..."
            className="w-full h-full bg-transparent outline-none text-md font-medium text-gray-600 transition-all duration-300"
          />
        </div>

        <div className="flex justify-end ml-auto translate-x-[-55px]">
          <FileText className="w-4 h-4 text-gray-600 transition-all duration-300 translate-x-[24px] translate-y-[8px]" />
          <div className="flex items-center justify-center ml-auto w-8 h-8 bg-transparent rounded-lg hover:bg-gray-200 shadow-sm
          transition-all duration-500 hover:cursor-pointer hover:w-28 group">
            <p className="text-sm font-medium text-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[8px]">
              Markdown
            </p>
          </div>
          <Share className="w-4 h-4 text-gray-600 transition-all duration-300 translate-x-[24px] translate-y-[8px]" />
          <div className="flex items-center justify-center ml-auto w-8 h-8 bg-transparent rounded-lg hover:bg-gray-200 shadow-sm
          transition-all duration-500 hover:cursor-pointer hover:w-28 group">
            <p className="text-sm font-medium text-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[8px]">
              Share
            </p>
          </div>
          <ArrowRightLeft className="w-4 h-4 text-gray-600 transition-all duration-300 translate-x-[24px] translate-y-[8px]" />
          <div
            className="flex items-center justify-center w-8 h-8 bg-transparent rounded-lg hover:bg-gray-200 shadow-sm
            transition-all duration-500 hover:cursor-pointer group hover:w-28"
            onClick={() => setCaroselIndex((prevIndex) => (prevIndex + 1) % 2)}>
            <p className="text-sm font-medium text-gray-600 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[8px]">
              Switch
            </p>
          </div>
        </div>
        <div className="absolute top-[48px] left-0 w-[100%] h-px bg-gray-200" />
      </header>

      <div
        className={`flex flex-grow relative`}
        style={{
          transition: 'transform 0.6s',
          transform: caroselIndex === 0 ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div className="absolute inset-0 flex h-full w-full overflow-hidden py-6 px-6 md:px-12 lg:px-40 2xl:px-64 transition-all duration-300">
          <Conversations messages={conversation?.messages || []} isLoading={isLoading} />
        </div>
        <div className="absolute inset-0 flex flex-col flex-grow h-full w-full overflow-hidden" style={{ left: '100%' }}>
          <Canvas />
        </div>
      </div>

      <div
        className="flex justify-center p-2 pt-0"
        style={{
          transition: 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)',
          transform: caroselIndex === 0 ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* <style jsx>{`
          @media (min-width: 1024px) and (max-width: 1279px) {
            div {
              transform: ${caroselIndex !== 0 ? 'translateX(15%)' : 'translateX(0)'};
            }
          }
          @media (min-width: 1280px) and (max-width: 1535px) {
            div {
              transform: ${caroselIndex !== 0 ? 'translateX(25%)' : 'translateX(0)'};
            }
          }
          @media (min-width: 1536px) {
            div {
              transform: ${caroselIndex !== 0 ? 'translateX(30%)' : 'translateX(0)'};
            }
          }
        `}</style> */}
        <InputBar onSubmit={handleSubmit} setIsLoading={setIsLoading} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ConversationArea;
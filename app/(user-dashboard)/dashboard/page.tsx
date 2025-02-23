"use client";

import Sidebar from "@/app/_components/(sidebar)/sidebar";
import { useState } from "react";
import { Bot } from "lucide-react";
import "@/styles/fade-in.css";
import { v4 as uuid4 } from "uuid";
import { useConversation } from "@/app/_contexts/ConversationProvider";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { historyRecords, addConversation } = useConversation();
  const router = useRouter();

  const handleNewConversation = () => {
    const newId = uuid4();
    console.log("clicked handleNewConversation");
    const newConversation = {
      id: newId,
      title: `New Conversation ${historyRecords.length + 1}`,
      messages: [],
    };
    addConversation(newConversation);
    router.push(`/dashboard/${newId}`);
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      {/* header of intro page */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-shrink-0 h-12 flex items-center justify-start pl-16 fade-in">
          <h2 className="text-md font-medium text-gray-600">
            Welcome to the Dashboard
          </h2>
        </div>
        <hr />
        {/* intro page */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-100 justify-center items-center fade-in-1">
          <div className="w-[80%] h-[80%] bg-white rounded-lg shadow-md flex">
            {/* left side of intro page */}
            <div className="flex flex-col w-[50%] p-20">
              <h2 className="text-5xl font-extrabold fade-in-1">
                Structured AI Conversations, Smarter Solutions.
              </h2>
              <p className="text-md font-medium text-gray-600 mt-8 w-[80%] fade-in-3">
                Your AI Guide, One Step at a Time.
                Ask a question, get an answer, and expand your journey through a dynamic decision tree. Our AI chatbot organizes responses into structured paths, allowing you to explore different branches of knowledge effortlessly.
              </p>
              <div className="flex items-center mt-8">
                <button
                  className="group/button text-white px-4 py-2 rounded-md mt-4 w-fit bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 transition-all duration-300
                  transform hover:translate-x-1 fade-in-5"
                  onClick={handleNewConversation}
                >
                  <span className="font-bold font-mono">Get Started</span>&nbsp; by creating a new chat
                </button>
              </div>
            </div>
            {/* right side of intro page */}
            <div className="flex flex-col items-start justify-center w-[50%]">
              <div className="fade-in-1 w-[90%] h-[80%] relative bg-white rounded-2xl shadow-md flex bg-gradient-to-br from-blue-300 to-green-300 p-4">
                {/* First Card */}
                <div className="fade-in-right absolute top-[-5%] right-[-5%] bg-[rgba(255,255,255,0.2)] backdrop-blur-md rounded-xl p-4 shadow-md w-[80%] h-[80%]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold">Linear Bot</span>
                    <span className="text-gray-600 text-sm">alpha version</span>
                  </div>
                  <div className="mt-2 text-lg font-mono tracking-wide">
                    <div className="fade-in flex items-center justify-start gap-2 mb-2 w-[80%] mt-1">
                      <Bot className="w-9 h-9 border border-gray-600 rounded-full p-1 bg-gray-100" />
                      <p className="text-sm  bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 rounded-2xl p-2">
                        Good day! How can I help you today?
                      </p>
                    </div>
                    <div className="flex gap-2 mb-2 mt-4 fade-in justify-end">
                      <div className="text-sm bg-gray-200 rounded-2xl p-2 max-w-[70%] break-words">
                        <p>I want to know about the Linear regression model</p>
                      </div>
                      <div className="rounded-full h-[36px] w-[36px] border border-gray-300">
                        <img src="/images/TestProfilePicture.JPG" alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2 mt-4 fade-in justify-end">
                      <div className="text-sm bg-gray-200 rounded-2xl p-2 max-w-[70%] break-words">
                        <p>I want to know about the Linear regression model</p>
                      </div>
                      <div className="rounded-full h-[36px] w-[36px] border border-gray-300">
                        <img src="/images/TestProfilePicture.JPG" alt="Profile Picture" className="w-full h-full object-cover rounded-full" />
                      </div>
                    </div>
                    <div className="fade-in flex items-center justify-start gap-2 mb-2 w-[80%] mt-2">
                      <Bot className="w-9 h-9 border border-gray-600 rounded-full p-1 bg-gray-100" />
                      <p className="text-sm  bg-gradient-to-r from-blue-300 to-purple-300 hover:from-blue-400 hover:to-purple-400 rounded-2xl p-2">
                        Regression is a statistical method that explores the relationship between a dependent variable and one or more independent variables.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Second Card */}
                <div className="fade-in-left absolute bottom-[-5%] left-[-10%] bg-[rgba(255,255,255,0.1)] backdrop-blur-md rounded-xl p-4 shadow-md w-[80%] h-[80%]">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Tree Bot</span>
                    <span className="text-gray-600 text-sm">alpha version</span>
                  </div>
                  <div className="mt-2 text-lg font-mono tracking-wide w-full h-[calc(100%-35px)]">
                    <img src="/images/TreeBot.png" alt="Tree Bot" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

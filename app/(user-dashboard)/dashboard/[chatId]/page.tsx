"use client";

import Sidebar from "@/app/_components/(sidebar)/sidebar";
import ConversationArea from "@/app/_components/(conversation)/conversationArea";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const { chatId } = useParams() as { chatId?: string };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      <ConversationArea isSidebarOpen={isSidebarOpen} conversationId={chatId} />
    </div>
  );
}
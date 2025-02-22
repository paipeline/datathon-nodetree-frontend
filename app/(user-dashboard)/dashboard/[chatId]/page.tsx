"use client";

import Sidebar from "@/app/_components/(sidebar)/sidebar";
import ConversationArea from "@/app/_components/(conversation)/conversationArea";
import { useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <Sidebar onSidebarToggle={setIsSidebarOpen} />
      <ConversationArea isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

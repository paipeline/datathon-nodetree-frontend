"use client";

import { PanelLeftDashed, SquarePen, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { v4 as uuid4 } from "uuid";
import { useConversation } from "@/app/_contexts/ConversationProvider";

const Sidebar = ({
  onSidebarToggle,
}: {
  onSidebarToggle: (isOpen: boolean) => void;
}) => {
  const router = useRouter();
  const { historyRecords, addConversation } = useConversation();
  
  // react state
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarFullyOpen, setIsSidebarFullyOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // react refs
  const sidebarRef = useRef<HTMLDivElement>(null);

  // functions
  /**
   * Handles the opening and closing of the sidebar, 
   * using isSidebarOpen and isSidebarFullyOpen to control the timing of the animation
   */
  const handleOpenSidebar = () => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setTimeout(() => {
        setIsSidebarFullyOpen(true);
        onSidebarToggle(true);
      }, 100);
    } else {
      setIsSidebarFullyOpen(false);
      setTimeout(() => {
        setIsSidebarOpen(false);
        onSidebarToggle(false);
      }, 100);
    }
  };

  /**
   * sizebar dragging, resize the sidebar width
   */
  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    // disable transition
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = 'none';
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, startWidth + e.clientX - startX);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = (): void => {
      // restore transition every time to avoid late dragging
      if (sidebarRef.current) {
        sidebarRef.current.style.transition = '';
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * Restores the default width of the sidebar when the user double-clicks on the resize handle
   */
  const restoreDefaultWidth = () => {
    if (sidebarRef.current) {
      sidebarRef.current.style.transition = '';
    }
    setSidebarWidth(280);
  }

  /**
   * Limits the width of the sidebar to 50% of the window width, 
   * if the user resizes the sidebar to be too wide, 
   * the sidebar will be limited to 50% of the window width
   */
  const handleOverSize = () => {
    const maxWidth = Number(window.innerWidth) * 0.5;
    if (sidebarWidth > maxWidth) {
      setSidebarWidth(maxWidth);
    }
  }

  // Add new conversation handler
  const handleNewConversation = () => {
    const newId = uuid4();
    const newConversation = {
      id: newId,
      title: `New Conversation ${historyRecords.length + 1}`,
      messages: [],
    };
    addConversation(newConversation);
    router.push(`/dashboard/${newId}`);
  };

  // Add search handler
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchInput.trim() !== "") {
      setSearchInput(e.currentTarget.value);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="h-screen absolute z-[100] flex flex-col bg-[rgba(243, 244, 246, 0.7)] backdrop-blur-lg shadow-xl transition-all duration-500"
      style={{
        width: isSidebarOpen ? `${sidebarWidth}px` : "0px",
      }}
    >
      <div
        className={cn(
          "h-13 px-3 py-2 flex items-center",
          isSidebarOpen ? "justify-end" : "justify-between"
        )}
      >
        {isSidebarOpen ? (
          <>
            <div
              className={cn(
                "flex items-center justify-center ml-2 w-8 h-8 bg-transparent rounded-lg shadow-sm hover:bg-[#e9e8e8] cursor-pointer transition-all duration-300",
                isSidebarFullyOpen ? "opacity-100" : "opacity-0"
              )}
              onClick={handleOpenSidebar}
            >
              <PanelLeftDashed className="w-5 h-5" />
            </div>
            <div
              className={cn(
                "flex items-center justify-center ml-2 w-8 h-8 bg-transparent rounded-lg shadow-sm hover:bg-[#e9e8e8] cursor-pointer transition-all duration-300",
                isSidebarFullyOpen ? "opacity-100" : "opacity-0"
              )}
              onClick={handleNewConversation}
            >
              <SquarePen className="w-5 h-5" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center ml-2 w-8 h-8 bg-transparent rounded-lg shadow-sm fade-in hover:bg-[#e9e8e8] cursor-pointer transition-all duration-300"
              onClick={handleOpenSidebar}
            >
              <PanelLeftDashed className="mx-[6px]" />
            </div>
          </>
        )}

      </div>
      {/* header: searchbar */}
      <div
        className={cn(
          "relative h-10 bg-transparent w-full flex items-center justify-between px-3 mb-2 transition-opacity duration-300",
          isSidebarFullyOpen ? "opacity-100" : "opacity-0"
        )}
      >
        <Search className="w-4 h-4 absolute left-6" />
        <input
          type="text"
          placeholder="Search Chat History"
          className="w-full h-full bg-transparent border border-gray-300 rounded-lg px-10 py-2 text-sm outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      {/* header: chat history */}
      <div className={cn(
        "w-full flex-1 bg-transparent flex-grow transition-opacity duration-300",
        isSidebarFullyOpen ? "opacity-100" : "opacity-0"
      )}>
        <p className="text-sm text-gray-500 px-6 py-2">Chat History</p>
        <ul className="px-6 ml-3">
          {historyRecords.filter(record => 
            searchInput.trim() === "" || 
            record.title.toLowerCase().includes(searchInput.toLowerCase())
          ).map((record) => (
            <li
              key={record.id}
              className={cn(
                "flex items-center justify-start py-2 px-4 cursor-pointer mt-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:text-blue-500",
                isSidebarFullyOpen ? "opacity-100" : "opacity-0"
              )}
              onClick={() => router.push(`/dashboard/${record.id}`)}
            >
              <p className="text-gray-700 text-sm cursor-pointer">
                {record.title}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          "w-full h-12 bg-transparent flex items-center space-x-4 px-6 border-t border-gray-200 transition-all duration-300",
          isSidebarFullyOpen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-200">
          <img src="/images/TestProfilePicture.JPG" alt="Profile Picture" className="object-cover w-full h-full" />
        </div>
        <p className={cn(
          "text-md text-gray-700 font-semibold font-family: 'Poppins', sans-serif",
          isSidebarFullyOpen ? 'opacity-100' : 'opacity-0'
        )}>User: Shenwei Zhang</p>
      </div>
      {/* resize handle */}
      <div className="w-1 h-full hover:bg-gray-100 cursor-ew-resize absolute right-0 top-0 rounded-lg transition-all duration-300"
        onMouseDown={handleResize}
        onDoubleClick={restoreDefaultWidth}
        onMouseUp={handleOverSize}
      />
    </div>
  );
};

export default Sidebar;

"use client";

import { useState, useEffect, useRef } from "react";

const Sidebar = ({
  onSidebarToggle,
}: {
  onSidebarToggle: (isOpen: boolean) => void;
}) => {
  // react state
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarFullyOpen, setIsSidebarFullyOpen] = useState(false);

  // react refs
  const sidebarRef = useRef<HTMLDivElement>(null);


  return (
    <div
      ref={sidebarRef}
      
    >
      <h1>Sidebar</h1>
    </div>
  );
};

export default Sidebar;

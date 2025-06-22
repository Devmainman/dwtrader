// desktopcomponents/DesktopLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBarDesktop from "./sidebar/Sidebar";
import TopNavBarDesktop from "./navigation/TopNavBar";

const DesktopLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex bg-neutral-900 text-white min-h-screen">
      {/* Sidebar on the left */}
      <SideBarDesktop sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation bar */}
        <TopNavBarDesktop toggleSidebar={toggleSidebar} />

        {/* Page content rendered via routing */}
        <div className="p-4 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;

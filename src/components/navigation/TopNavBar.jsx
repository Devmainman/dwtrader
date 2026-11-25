import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../assets/nav.svg";
import { useSidebar } from "../../context/SidebarContext";
import LanguageDropdown from "./LanguageDropdown";
import NotificationDropdown from "../notification/NotificationDropdown";
import user from "../../assets/Vector.svg";
import ModeToggle from "./ModeToggle";

const TopNavBar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  return (
    <header className="flex gap-5 justify-between px-5 py-3 w-full bg-[var(--card)] lg:sticky lg:top-0 lg:z-[800] lg:px-8 lg:bg-[var(--page)]/90 lg:backdrop-blur-md lg:border-b lg:border-white/5">
      <div className="flex gap-2.5 items-center">
        <div
          className="flex rounded-3xl border bg-zinc-900 border-neutral-800 cursor-pointer lg:hidden"
          onClick={toggleSidebar}
        >
          <img src={Nav} alt="menu" className="mode-icon" />
        </div>
        <LanguageDropdown />
      </div>

      <div className="flex gap-3.5 items-center">
        <ModeToggle />
        <NotificationDropdown />
        <div
          className="flex rounded-3xl p-1 border bg-zinc-900 border-neutral-800 cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <img src={user} alt="settings" className="mode-icon" />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;

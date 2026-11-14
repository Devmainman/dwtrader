import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../../assets/nav.svg";
import { useSidebar } from "../../context/SidebarContext";
import LanguageDropdown from "./LanguageDropdown";
import NotificationDropdown from "../notification/NotificationDropdown";
import user from "../../assets/Vector.svg";

const TopNavBar = () => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  return (
    <header className="flex gap-5 justify-between px-5 py-3 w-full bg-[#1D1D1F]">
      <div className="flex gap-2.5 items-center">
        <div
          className="flex rounded-3xl border bg-zinc-900 border-neutral-800 cursor-pointer"
          onClick={toggleSidebar}
        >
          <img src={Nav} alt="menu" />
        </div>
        <LanguageDropdown />
      </div>

      <div className="flex gap-3.5 items-center">
        <NotificationDropdown />
        <div
          className="flex rounded-3xl p-1 border bg-zinc-900 border-neutral-800 cursor-pointer"
          onClick={() => navigate("/settings")}
        >
          <img src={user} alt="settings" />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;

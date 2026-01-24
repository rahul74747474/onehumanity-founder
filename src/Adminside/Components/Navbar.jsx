import React, { useEffect, useState } from "react";
import {
  Bell, LayoutDashboard, Users, FolderKanban,
  SquareCheckBig, Heart, ChartNoAxesColumnIncreasing,
  Megaphone, Wrench, KeyRound, UserCircle, Settings, LogOut, ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar({ expanded, setExpanded }) {

  const [dropdown, setDropdown] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getActive = (path) => location.pathname === path;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          "https://backonehf.onrender.com/api/v1/admin/getuser",
          { withCredentials: true }
        );
        setUser(res.data.message);
      } catch {
        toast.error("Session expired");
        navigate("/login");
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/logout",
        { withCredentials: true }
      );
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const NavItem = ({ path, icon: Icon, label }) => (
    <div

      onClick={() => navigate(path)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer
      transition-all ${
        getActive(path)
          ? "bg-white/20 text-white"
          : "text-white/80 hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      {label}
    </div>
  );

const SidebarItem = ({ icon: Icon, label, path, expanded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;

  return (
    <div
      onClick={() => navigate(path)}
      className={`
        flex items-center rounded-xl cursor-pointer
        transition-all duration-300
        ${expanded ? "px-4 py-3 gap-3" : "px-0 py-3 justify-center"}
        ${active ? "bg-white/20" : "hover:bg-white/10"}
      `}
    >
      {/* ICON */}
      <Icon
        size={expanded ? 20 : 22}
        className={`
          transition-all duration-300
          ${expanded ? "scale-100" : "scale-110"}
        `}
      />

      {/* TEXT */}
      <span
        className={`
          whitespace-nowrap overflow-hidden
          transition-all duration-300
          ${expanded ? "opacity-100 w-auto ml-1" : "opacity-0 w-0"}
        `}
      >
        {label}
      </span>
    </div>
  );
};



  return (
    <>


      {/* SIDEBAR */}
   <aside
  onMouseEnter={() => setExpanded(true)}
  onMouseLeave={() => setExpanded(false)}
  className={`fixed left-0 top-0 h-screen z-40 text-white
    transition-all duration-300
    ${expanded ? "w-[240px]" : "w-[70px]"}
  `}

  style={{
  background: "linear-gradient(180deg, rgb(51,32,76) 0%, rgb(36,20,58) 100%)",
  boxShadow: "4px 0 20px rgba(0,0,0,0.25)"
}}
>
  {/* LOGO */}
  <div className="h-16 flex items-center justify-center">
    {expanded ? (
      <img src="/company.png" alt="logo" className="h-8 scale scale-100" />
    ) : (
       <img src="/company.png" alt="logo" className="h-8 scale-100" />
    )}
  </div>

  {/* NAV ITEMS */}
 <div className={`flex flex-col gap-2 mt-4 ${expanded ? "px-3" : "px-2"}`}>
    {user?.designation?.name === "Administrator" ? (
      <>
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          path="/dashboard"
          expanded={expanded}
        />
        <SidebarItem
          icon={Users}
          label="Employees"
          path="/employees"
          expanded={expanded}
        />
        <SidebarItem
          icon={SquareCheckBig}
          label="Tasks"
          path="/tasks"
          expanded={expanded}
        />
        <SidebarItem
          icon={ChartNoAxesColumnIncreasing}
          label="Reports"
          path="/reports1"
          expanded={expanded}
        />
      </>
    ) : (
      <>
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          path="/employee/dashboard"
          expanded={expanded}
        />
        <SidebarItem
          icon={Users}
          label="My Tasks"
          path="/employees/tasks"
          expanded={expanded}
        />
      </>
    )}
  </div>
</aside>

    </>
  );
}

export default Navbar;

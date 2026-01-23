import React, { useEffect, useState } from "react";
import {
  Bell, LayoutDashboard, Users, FolderKanban,
  SquareCheckBig, Heart, ChartNoAxesColumnIncreasing,
  Megaphone, Wrench, KeyRound, UserCircle, Settings, LogOut, ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
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

  return (
    <>

      {/* TOP BAR */}
      <div className="sticky top-0 z-30 flex justify-end items-center px-8 py-3 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <Bell size={20} className="cursor-pointer mr-6" />

        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => setProfileOpen((p) => !p)}
        >
          <div className="w-9 h-9 rounded-full bg-[#6850BE] text-white flex items-center justify-center text-sm">
            {user?.name?.[0] || "U"}
          </div>
          <ChevronDown size={14} />

          {profileOpen && (
            <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-200 min-w-[160px] overflow-hidden">
              <div className="px-4 py-3 hover:bg-gray-50 flex gap-2">
                <UserCircle size={16} /> Profile
              </div>
              <div className="px-4 py-3 hover:bg-gray-50 flex gap-2">
                <Settings size={16} /> Settings
              </div>
              <div
                onClick={handleLogout}
                className="px-4 py-3 hover:bg-gray-50 flex gap-2 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>


      {/* SIDEBAR */}
      <aside
        className="fixed left-0 top-0 h-screen w-[260px] z-40 text-white hidden md:flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, #6850BE 0%, #4c3aa8 60%, #3c2f7a 100%)",
        }}
      >
        <img
          src="/companylogo.png"
          alt="logo"
          className="h-10 my-8 mx-auto"
        />

        <div className="flex flex-col gap-2 px-4">
          {user?.designation?.name === "Administrator" ? (
            <>
              <NavItem path="/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem path="/employees" icon={Users} label="Employees" />
              <NavItem path="/projects" icon={FolderKanban} label="Projects" />
              <NavItem path="/tasks" icon={SquareCheckBig} label="Tasks" />
              <NavItem path="/hr" icon={Heart} label="HR Hub" />

              <div
                onClick={() => setDropdown(!dropdown)}
                className="flex items-center gap-3 px-4 py-3 text-white/80 cursor-pointer hover:bg-white/10 rounded-lg"
              >
                <ChartNoAxesColumnIncreasing size={18} />
                Reports
                <ChevronDown size={14} className={`${dropdown && "rotate-180"}`} />
              </div>

              {dropdown && (
                <div className="ml-6 flex flex-col gap-1 text-sm text-white/70">
                  <div onClick={() => navigate("/reports1")} className="hover:text-white cursor-pointer">Productivity</div>
                  <div onClick={() => navigate("/heatmap")} className="hover:text-white cursor-pointer">Heatmap</div>
                  <div onClick={() => navigate("/redreport")} className="hover:text-white cursor-pointer">Red Flags</div>
                </div>

              )}

              <NavItem path="/performance" icon={ChartNoAxesColumnIncreasing} label="Performance" />
              <NavItem path="/announcement" icon={Megaphone} label="Announcements" />
              <NavItem path="/role" icon={KeyRound} label="Roles" />
            </>
          ) : (
            <>
              <NavItem path="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
              <NavItem path="/employees/tasks" icon={Users} label="My Tasks" />
            </>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;

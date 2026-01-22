import React, { useEffect, useState } from "react";
import {
  Menu, X, Bell, LayoutDashboard, Users, FolderKanban,
  SquareCheckBig, Heart, ChartNoAxesColumnIncreasing,
  Megaphone, Wrench, KeyRound, UserCircle, Settings, LogOut, ChevronDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const [open, setOpen] = useState(false);
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
        navigate("/");
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
      onClick={() => {
        navigate(path);
        setOpen(false);
      }}
      className={`w-full max-w-sm flex items-center justify-center gap-3
      px-6 py-4 rounded-xl text-sm font-medium cursor-pointer transition-all
      ${getActive(path)
        ? "bg-white/20 text-white"
        : "text-white/80 hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </div>
  );

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="sticky top-0 z-40 flex justify-between items-center px-8 sm:px-4 py-3 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <button onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-4">
          <Bell size={20} className="cursor-pointer hover:text-[#6439FF]" />

          <div
            className="relative flex items-center gap-2 cursor-pointer"
            onClick={() => setProfileOpen((p) => !p)}
          >
            <div className="w-9 h-9 rounded-full bg-[#6850BE] text-white flex items-center justify-center text-sm">
              {user?.profilepicture ? (
                <img src={user.profilepicture} alt="" />
              ) : (
                user?.name?.[0] || "U"
              )}
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
            />

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
      </div>

      {/* SIDEBAR OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md"
          onClick={() => setOpen(false)}
        >
          <div
            className="h-full w-full sm:w-[30%] min-w-[280px] max-w-[420px]
            flex flex-col items-center justify-center text-white"
            style={{
              background:
                "linear-gradient(180deg, #6850BE 0%, #4c3aa8 60%, #3c2f7a 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-6 right-6" onClick={() => setOpen(false)}>
              <X size={28} />
            </button>

            <img src="/companylogo.png" alt="logo" className="mb-10 h-10 object-contain" />

            <div className="flex flex-col items-center gap-2 w-full">
              {user?.designation?.name === "Administrator" ? (
                <>
                  <NavItem path="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem path="/employees" icon={Users} label="Employees" />
                  <NavItem path="/projects" icon={FolderKanban} label="Projects" />
                  <NavItem path="/tasks" icon={SquareCheckBig} label="Tasks" />
                  <NavItem path="/hr" icon={Heart} label="HR Hub" />

                  {/* Reports */}
                  <div
                    onClick={() => setDropdown((p) => !p)}
                    className={`w-full max-w-sm flex items-center justify-center gap-3
                    px-6 py-4 rounded-xl text-sm font-medium cursor-pointer transition-all
                    ${dropdown ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`}
                  >
                    <ChartNoAxesColumnIncreasing size={18} />
                    <span>Reports</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dropdown ? "rotate-180" : ""}`}
                    />
                  </div>

                  {dropdown && (
                    <div className="w-full max-w-sm flex flex-col gap-1">
                      {[
                        ["/reports1", "Productivity"],
                        ["/heatmap", "Heatmap"],
                        ["/daily-report-submission", "Daily Reports"],
                        ["/task-analytics", "Analytics"],
                        ["/redreport", "Red Flags"],
                        ["/project-success", "Project Success"],
                        ["/data-export", "Export Data"],
                      ].map(([p, l]) => (
                        <div
                          key={p}
                          onClick={() => {
                            navigate(p);
                            setOpen(false);
                          }}
                          className="px-10 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                        >
                          {l}
                        </div>
                      ))}
                    </div>
                  )}

                  <NavItem path="/performance" icon={ChartNoAxesColumnIncreasing} label="Performance" />
                  <NavItem path="/announcement" icon={Megaphone} label="Announcements" />
                  <NavItem path="/support" icon={Wrench} label="Support" />
                  <NavItem path="/role" icon={KeyRound} label="Roles" />
                </>
              ) : (
                <>
                  <NavItem path="/employee/dashboard" icon={LayoutDashboard} label="Dashboard" />
                  <NavItem path="/employees/tasks" icon={Users} label="My Tasks" />
                  <NavItem path="/employee/reports" icon={FolderKanban} label="Reports" />
                  <NavItem path="/employee/projects" icon={SquareCheckBig} label="Projects" />
                  <NavItem path="/employee/calendar" icon={Heart} label="Calendar" />
                  <NavItem path="/employee/support" icon={Wrench} label="Support" />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

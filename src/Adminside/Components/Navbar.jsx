import React, { useEffect, useState } from 'react'
import { Menu , Bell ,LayoutDashboard, Users, FolderKanban, SquareCheckBig, Heart, ChartNoAxesColumnIncreasing, Megaphone, Wrench, KeyRound, UserCircle, Settings, LogOut, ArrowBigDown, ChevronDown } from "lucide-react";
import { useNavigate,useLocation } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';


function Navbar() {
  const [menuopen,setMenuopen]=useState(false);
  const [empmenu,setempmenuopen]=useState(false);
  const[toggle,settoggle]=useState("dashboard")
  const[dropdown,setdropdown]=useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const[user,setuser]=useState("")
  const[info,setinfo]=useState(false)

const getActive = (path) => {
  return location.pathname === path;
};

useEffect(()=>{
  (async()=>{
  try {
    const response = await axios.get("https://backonehf.onrender.com/api/v1/admin/getuser",{withCredentials:true})
    console.log(response.data.message)
    setuser(response.data.message)
  } catch (error) {
    toast.error("Connection Timed Out")
    navigate("/")
  }
})()
},[])

const handlelogout = async()=>{
  try {
    const response = await axios.get("https://backonehf.onrender.com/api/v1/admin/logout",{withCredentials:true})
    toast.success("Logout Successfull")
    navigate("/login")
  } catch (error) {
     toast.error("Logout Unsuccessfull")
  }
}
 const handlesidebar = () =>{
  if(user?.designation?.name === "Administrator"){
    setMenuopen(!menuopen)
  }
  else if(user?.designation?.name === "Employee" || user?.designation?.name === "Intern"){
    setempmenuopen(!empmenu)
  }
 }

  return (
    <>
    <div className="flex justify-between items-center px-8 sm:px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
      <style>{`
        .menu-btn { transition: color 0.2s ease-in-out; }
        .menu-btn:hover { color: #6439FF; }
        .notification-btn { transition: color 0.2s ease-in-out; }
        .notification-btn:hover { color: #6439FF; }
        .profile-dropdown {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dropdown-item {
          transition: background-color 0.2s ease-in-out;
        }
        .dropdown-item:hover {
          background-color: rgba(233, 227, 255, 0.6);
        }
      `}</style>
      <div className="flex items-center gap-6 flex-1">
        <div className="menu-btn cursor-pointer p-1 -ml-1" onClick={handlesidebar}>
            <Menu size={20} />
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-3">
        <div className="notification-btn cursor-pointer p-1 pr-4 border-r border-[#E2E8F0]">
            <Bell size={20} />
        </div>
        <div className="flex relative items-center gap-3 cursor-pointer pointer-events-auto" onClick={()=>{setinfo(!info)}}>
            <div className="w-9 h-9 rounded-full cursor-pointer overflow-hidden bg-[#6850BE] text-white flex justify-center items-center text-sm font-medium">{user.profilepicture ?(<img src ={user?.profilepicture} height="100%" width="100%" alt="/"/>):"B"}</div>
            <span className="text-sm font-medium hidden sm:inline">{user?.name?.split(" ")[0]}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${info ? 'rotate-180' : ''}`} />
            {info && (
              <div className="profile-dropdown absolute bg-white shadow-lg rounded-lg top-12 right-0 flex flex-col min-w-max border border-[#E2E8F0]">
                <div className="dropdown-item flex w-full flex-row px-4 py-3 gap-3 items-center rounded-t-lg"><UserCircle size={18} color="rgba(104, 80, 190, 1)"/><span className="text-sm">Profile</span></div>
                 <div className="dropdown-item flex w-full flex-row px-4 py-3 gap-3 items-center"><Settings size={18} color="rgba(104, 80, 190, 1)"/><span className="text-sm">Settings</span></div>
                  <div className="dropdown-item flex w-full flex-row px-4 py-3 gap-3 items-center rounded-b-lg cursor-pointer" onClick={handlelogout}><LogOut size={18} color="rgba(104, 80, 190, 1)"/><span className="text-sm">Log Out</span></div>
              </div>
            )}
        </div>
      </div>
    </div>
     {menuopen && (
  <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-10 animate-fadeIn"
    onClick={() => setMenuopen(false)}
  >
    <div className="relative w-72 h-screen bg-white border-r border-[#E2E8F0] flex flex-col z-20 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <style>{`
          .nav-item {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .nav-item.active {
            background-color: rgba(100, 57, 255, 0.1);
            color: rgba(100, 57, 255, 1);
          }
          .nav-item:hover:not(.active) {
            background-color: rgba(100, 57, 255, 0.05);
          }
        `}</style>
        <div className="w-full flex py-5 px-6 gap-12 items-center border-b border-[#E2E8F0]">
          <Menu size={20} onClick={()=>{setMenuopen(false)}} className="cursor-pointer hover:text-[#6439FF] transition-colors"/>
          <div className="w-auto h-auto">
            <img src ="/companylogo.png" alt="/" height="24" width="auto" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-0 items-stretch overflow-y-auto py-3 px-0 pb-6 min-h-0">
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/dashboard")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/dashboard")
          settoggle("dashboard")}}>
          <LayoutDashboard size={18}/>
          <span>Dashboard</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employees")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employees")
          settoggle("employees")}}>
         <Users size={18}/>
         <span>Employees</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/projects")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/projects")
          settoggle("projects")}}>
          <FolderKanban size={18}/>
          <span>Projects</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/tasks")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/tasks")
          settoggle("tasks")}}>
          <SquareCheckBig size={18}/>
          <span>Tasks</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/hr")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/hr")
          settoggle("hr")}}>
         <Heart size={18}/>
         <span>HR Hub</span>
        </div>
       <div
   className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    dropdown ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]" : "text-gray-700"
  }`}
  onClick={() => {
    settoggle("reports");
    setdropdown(!dropdown);
  }}
>
  <LayoutDashboard size={18}/>
  <span>Reports</span>
  <span className={`ml-auto text-xs transition-transform ${dropdown ? 'rotate-180' : ''}`}>▾</span>
</div>

<div
  className={`flex flex-col gap-1 mx-4 mt-1 ${dropdown ? "flex" : "hidden"}`}
>
  <style>{`
    .report-item {
      transition: all 0.2s ease-in-out;
    }
    .report-item:hover {
      background-color: rgba(100, 57, 255, 0.05);
      color: #6439FF;
    }
  `}</style>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/reports1")}>
    Productivity Reports
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/heatmap")}>
    Performance Score Heatmap
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/daily-report-submission")}>
    Daily Report Submission Chart
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/task-analytics")}>
    Task Delivery Analytics
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/redreport")}>
    Red Flags Report
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/project-success")}>
    Project Success Reports
  </div>
  <div className="report-item bg-transparent text-gray-700 p-3 pl-12 rounded-lg cursor-pointer text-xs font-medium" onClick={() => navigate("/data-export")}>
    Data Export
  </div>
</div>

        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/performance")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/performance")
          settoggle("performance")}}>
          <ChartNoAxesColumnIncreasing size={18}/>
          <span>Performance</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/announcement")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/announcement")
          settoggle("announcement")}}>
         <Megaphone size={18}/>
         <span>Announcements</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/support")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/support")
          settoggle("support")}}>
         <Wrench size={18}/>
         <span>Support/Tickets</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/role")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/role")
          settoggle("role")}}>
         <KeyRound size={18}/>
         <span>Role and Permissions</span>
        </div>
        </div>
    </div>
    </div>
        
        )}

        {empmenu && (
  <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-10 animate-fadeIn"
    onClick={() => setempmenuopen(false)}
  >
    <div className="relative w-72 h-screen bg-white border-r border-[#E2E8F0] flex flex-col z-20 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex py-5 px-6 gap-12 items-center border-b border-[#E2E8F0]">
          <Menu size={20} onClick={()=>{setempmenuopen(false)}} className="cursor-pointer hover:text-[#6439FF] transition-colors"/>
          <div className="w-auto h-auto">
            <img src ="./companylogo.png" alt="/" height="24" width="auto" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-0 items-stretch overflow-y-auto py-3 px-0 pb-6 min-h-0">
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/dashboard")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/dashboard")
          settoggle("dashboard")}}>
          <LayoutDashboard size={18}/>
          <span>Dashboard</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employees/tasks")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employees/tasks")
          settoggle("tasks")}}>
         <Users size={18}/>
         <span>My Task</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/reports")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/reports")
          settoggle("reports")}}>
          <FolderKanban size={18}/>
          <span>Daily Reports</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/projects")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/projects")
          settoggle("projects")}}>
          <SquareCheckBig size={18}/>
          <span>Project Workspace</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/Calendar")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/Calendar")
          settoggle("calendar")}}>
         <Heart size={18}/>
         <span>Calendar</span>
        </div>

        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/announcement")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/announcement")
          settoggle("performance")}}>
          <ChartNoAxesColumnIncreasing size={18}/>
          <span>Announcements</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/announcement")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/request")
          settoggle("request")}}>
         <Megaphone size={18}/>
         <span>My Requests</span>
        </div>
        <div  className={`nav-item flex items-center text-sm cursor-pointer rounded-lg mx-4 px-4 py-3 gap-3 font-normal ${
    getActive("/employee/support")
      ? "active bg-[rgba(100,57,255,0.1)] text-[#6439FF]"
      : "text-gray-700"
  }`} onClick={()=>{
          navigate("/employee/support")
          settoggle("support")}}>
         <Wrench size={18}/>
         <span>Support/Tickets</span>
        </div>
        </div>
    </div>
    </div>

        )}
</>
  )
}

export default Navbar

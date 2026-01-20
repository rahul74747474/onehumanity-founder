import React from "react";
import {
  User,
  Briefcase,
  Users,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import prismLogo from './logo_withoutBack.svg';
import entryBg from './EntryPage_Background.png';

const Entrypage = () => {
    const navigate = useNavigate();
    
  return (
    <div className="min-h-screen px-8 sm:px-4 bg-cover bg-center flex flex-col items-center justify-center" style={{backgroundImage: `url(${entryBg})`}}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideup {
          animation: slideUp 0.6s ease-out;
        }
        .role-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(100, 57, 255, 0.15);
        }
        @media (max-width: 768px) {
          .role-card:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="flex items-center gap-2 bg-[#5E40BE] text-white py-2 px-4 rounded-full text-xs font-bold tracking-[0.5px] mb-12 sm:mb-8">
        <div className="w-1.5 h-1.5 bg-[rgb(229,229,229)] rounded-full"></div>
        SECURE ENTERPRISE PORTAL
      </div>

      <div className="text-center mb-16 sm:mb-12">
        <h1 className="text-5xl sm:text-3xl font-bold text-[#6439FF] mb-4 flex items-center justify-center gap-4 flex-wrap">
          Welcome to <img src={prismLogo} alt="Prism" className="h-12 w-auto" /><span className="bg-gradient-to-r from-[#433AD8] to-[#8A64FF] bg-clip-text text-transparent">One Humanity Portal</span>
        </h1>
        <p className="text-lg sm:text-base font-normal text-white max-w-2xl mx-auto leading-relaxed">
          Select your role to securely access the unified corporate workspace
        </p>
      </div>

      <div className="grid grid-cols-4 gap-8 max-w-5xl w-full mb-12 sm:mb-8 lg:grid-cols-2 md:grid-cols-1 md:gap-6 sm:gap-4">
        <div className="role-card p-8 sm:p-6 rounded-xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-md border border-white cursor-pointer h-80 sm:h-auto flex flex-col items-start" onClick={() => navigate('/login')}>
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Shield size={24} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">System Admin</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Configure system settings, user permissions, and security protocols.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-md border border-white cursor-pointer h-80 sm:h-auto flex flex-col items-start" onClick={()=>navigate('/managerlogin')}>
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Briefcase size={24} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">Manager</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Review team performance, approve requests, and manage projects.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-md border border-white cursor-pointer h-80 sm:h-auto flex flex-col items-start" onClick={()=> navigate('/hrlogin')}>
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Users size={24} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">HR Admin</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Manage personnel records, recruitment, and organizational policy.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-md border border-white cursor-pointer h-80 sm:h-auto flex flex-col items-start" onClick={() => navigate('/employeelogin')}>
          <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 shadow-sm bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <User size={24} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">Employee</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Access your dashboard, submit requests, and view company updates.</p>
        </div>
      </div>

      <div className="text-xs sm:text-xs text-white text-center opacity-90">
        © 2025 Humanity Founders. All rights reserved. Secure connection established.
      </div>
    </div>
  );
};

export default Entrypage;

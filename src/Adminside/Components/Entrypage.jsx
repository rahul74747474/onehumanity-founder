import React, { useRef } from "react";
import {
  User,
  Briefcase,
  Users,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStaggerAnimation } from "../../hooks/useScrollAnimation";
import prismLogo from './logo_withoutBack.svg';
import entryBg from './EntryPage_Background.png';

const Entrypage = () => {
    const navigate = useNavigate();
    const cardsRef = useRef(null);
    useStaggerAnimation(cardsRef, 100);

  return (
    <div className="min-h-screen px-8 sm:px-4 bg-cover bg-center flex flex-col items-center justify-center" style={{backgroundImage: `url(${entryBg})`}}>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardHover {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-8px);
          }
        }
        .animate-slideup {
          animation: slideUp 0.6s ease-out;
        }
        .role-card {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .role-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.15) 0%, transparent 80%);
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }
        .role-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 24px 48px rgba(104, 80, 190, 0.25), 0 0 40px rgba(104, 80, 190, 0.15);
          border-color: rgba(255, 255, 255, 0.8);
        }
        .role-card:hover::before {
          opacity: 1;
        }
        .role-card-icon {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .role-card:hover .role-card-icon {
          transform: scale(1.1) rotate(5deg);
        }
        @media (max-width: 768px) {
          .role-card:hover {
            transform: none;
            box-shadow: 0 12px 24px rgba(104, 80, 190, 0.15);
          }
          .role-card:hover .role-card-icon {
            transform: none;
          }
        }
      `}</style>

      <div className="flex items-center gap-2 bg-[#5E40BE] text-white py-2.5 px-5 rounded-full text-xs font-bold tracking-[0.5px] mb-12 sm:mb-8 animate-slideup" style={{animation: 'slideUp 0.6s ease-out 0.1s both'}}>
        <div className="w-1.5 h-1.5 bg-[rgb(229,229,229)] rounded-full animate-pulse"></div>
        SECURE ENTERPRISE PORTAL
      </div>

      <div className="text-center mb-16 sm:mb-12">
        <h1 className="text-5xl sm:text-3xl font-bold text-[#6439FF] mb-4 flex items-center justify-center gap-4 flex-wrap" style={{animation: 'slideUp 0.7s ease-out 0.2s both', opacity: 0}}>
          Welcome to <img src={prismLogo} alt="Prism" className="h-12 w-auto" /><span className="bg-gradient-to-r from-[#433AD8] to-[#8A64FF] bg-clip-text text-transparent">One Humanity Portal</span>
        </h1>
        <p className="text-lg sm:text-base font-normal text-white max-w-2xl mx-auto leading-relaxed" style={{animation: 'slideUp 0.7s ease-out 0.3s both', opacity: 0}}>
          Select your role to securely access the unified corporate workspace
        </p>
      </div>

      <div className="grid grid-cols-4 gap-7 max-w-6xl w-full mb-12 sm:mb-8 lg:grid-cols-2 md:grid-cols-1 md:gap-6 sm:gap-4" ref={cardsRef}>
        <div className="role-card p-8 sm:p-6 rounded-2xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-xl border border-white border-opacity-60 cursor-pointer flex flex-col items-start h-auto transition-all" onClick={() => navigate('/login')}>
          <div className="role-card-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Shield size={28} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">System Admin</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Configure system settings, user permissions, and security protocols.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-2xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-xl border border-white border-opacity-60 cursor-pointer flex flex-col items-start h-auto transition-all" onClick={()=>navigate('/managerlogin')}>
          <div className="role-card-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Briefcase size={28} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">Manager</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Review team performance, approve requests, and manage projects.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-2xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-xl border border-white border-opacity-60 cursor-pointer flex flex-col items-start h-auto transition-all" onClick={()=> navigate('/hrlogin')}>
          <div className="role-card-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <Users size={28} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">HR Admin</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Manage personnel records, recruitment, and organizational policy.</p>
        </div>

        <div className="role-card p-8 sm:p-6 rounded-2xl sm:rounded-lg bg-[rgba(71,20,255,0.125)] backdrop-blur-xl border border-white border-opacity-60 cursor-pointer flex flex-col items-start h-auto transition-all" onClick={() => navigate('/employeelogin')}>
          <div className="role-card-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br from-[#684EB9] to-[#4F39F6] text-white">
            <User size={28} />
          </div>
          <h3 className="text-2xl sm:text-xl font-bold text-white mb-3">Employee</h3>
          <p className="text-base sm:text-sm text-white leading-relaxed flex-grow">Access your dashboard, submit requests, and view company updates.</p>
        </div>
      </div>

      <div className="text-xs sm:text-xs text-white text-center opacity-75" style={{animation: 'slideUp 0.7s ease-out 0.5s both', opacity: 0}}>
        © 2025 Humanity Founders. All rights reserved. Secure connection established.
      </div>
    </div>
  );
};

export default Entrypage;

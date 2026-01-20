import React, { useState } from 'react';
import axios from "axios"
import {useNavigate} from "react-router"
import { User, Lock, ArrowRight } from "lucide-react";
import prismLogo from './logo_withoutBack.svg';
import loginBg from './loginPage_Background.svg';

import {toast} from "react-toastify"
const Login = () => {
    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const navigate = useNavigate()
    const[loading,setloading]=useState(false)

    const handlelogin = async()=>{
        try {
            setloading(true)
            const response  = await axios.post("https://backonehf.onrender.com/api/v1/admin/adminlogin",{
                userid:email,
                password:pass
            },{withCredentials:true})
            console.log(response.data.message)
            toast.success("Login Successfull")
            navigate("/dashboard")
        } catch (error) {
             toast.error("Login Unsuccessfull")
        }finally{
            setloading(false)
        }
    }
  return(
    <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center px-5 relative overflow-hidden py-[100px] pl-5 pr-[100px] md:px-[20px] md:py-5" style={{backgroundImage: `url(${loginBg})`}}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float-before {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-after {
          position: absolute;
          bottom: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          animation: float 25s ease-in-out infinite reverse;
        }
      `}</style>
      
      <div className="animate-float-before"></div>
      <div className="animate-float-after"></div>
      
      <div className="w-full max-w-[1200px] grid grid-cols-2 gap-20 items-center relative z-10 md:grid-cols-1 md:gap-10">
        {/* Left Side - Content */}
        <div className="flex flex-col gap-10" style={{animation: 'slideInLeft 1s ease-out'}}>
          <div className="flex items-center" style={{animation: 'fadeInDown 1s ease-out 0.2s both'}}>
            <img src={prismLogo} alt="Prism Logo" className="h-[60px] w-auto" style={{animation: 'pulse 2s ease-in-out infinite'}} />
          </div>
          
          <div className="flex flex-col gap-6">
            <h1 className="text-[48px] font-bold leading-tight text-[#1e293b]" style={{animation: 'fadeInUp 1s ease-out 0.4s both'}}>
              Future of Work<br />
              <span className="bg-gradient-to-b from-[#684EB9] to-[#9F85F7] bg-clip-text text-transparent">
                Is Here.
              </span>
            </h1>
            
            <p className="text-[18px] leading-relaxed text-[#64748b] max-w-[480px]" style={{animation: 'fadeInUp 1s ease-out 0.6s both'}}>
              Experience a seamless, intelligent, and beautifully designed workspace portal built for modern teams.
            </p>
            
            <div className="flex items-center gap-4" style={{animation: 'fadeInUp 1s ease-out 0.8s both'}}>
              <div className="flex gap-0">
                <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#7DB5FF] first:ml-0" style={{animation: 'bounceIn 1s ease-out 1s'}}></div>
                <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#6850BE]" style={{animation: 'bounceIn 1s ease-out 1.1s'}}></div>
                <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#AF10FF]" style={{animation: 'bounceIn 1s ease-out 1.2s'}}></div>
                <div className="w-8 h-8 rounded-full border-2 border-white -ml-2 bg-[#539BFF]" style={{animation: 'bounceIn 1s ease-out 1.3s'}}></div>
              </div>
              <span className="text-[16px] text-[#64748b] font-medium">Trusted by 10,000+ teams</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center" style={{animation: 'slideInRight 1s ease-out 0.3s both'}}>
          <div className="w-full max-w-[30vw] bg-gradient-to-br from-[rgba(203,189,255,0.24)] to-[rgba(100,98,207,0.13)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.5)] rounded-[24px] p-10 box-shadow: 0 20px 40px rgba(99, 102, 241, 0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;" style={{animation: 'scaleIn 0.8s ease-out 0.5s both', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.1)'}}>
            <div className="mb-8 flex flex-col justify-start" style={{animation: 'fadeInDown 1s ease-out 0.7s both'}}>
              <h2 className="text-[28px] font-bold text-[#40239B] mb-2">Welcome Back</h2>
              <p className="text-[16px] text-[#64748b]">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={(e)=>{ e.preventDefault(); handlelogin()}} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2" style={{animation: 'fadeInUp 0.6s ease-out 0.9s both'}}>
                <label className="text-xs font-bold text-[#64748b] uppercase tracking-[0.5px]">USERNAME</label>
                <div className="relative flex items-center">
                  <User size={20} className="absolute left-4 text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                    className="w-full py-4 px-4 pl-12 border border-[rgba(148,163,184,0.3)] rounded-[12px] bg-[rgba(255,255,255,0.8)] text-[16px] text-[#1e293b] transition-all duration-300 focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:translate-y-[-2px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2" style={{animation: 'fadeInUp 0.6s ease-out 1.1s both'}}>
                <label className="text-xs font-bold text-[#64748b] uppercase tracking-[0.5px]">PASSWORD</label>
                <div className="relative flex items-center">
                  <Lock size={20} className="absolute left-4 text-[#94a3b8]" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setpass(e.target.value)}
                    required
                    className="w-full py-4 px-4 pl-12 border border-[rgba(148,163,184,0.3)] rounded-[12px] bg-[rgba(255,255,255,0.8)] text-[16px] text-[#1e293b] transition-all duration-300 focus:outline-none focus:border-[#8b5cf6] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] focus:translate-y-[-2px]"
                  />
                </div>
              </div>

              <div className="flex justify-end -mt-2" style={{animation: 'fadeInUp 0.6s ease-out 1.3s both'}}>
                <a href="/reset-password" className="text-sm text-[#684EB9] no-underline transition-all duration-300 hover:underline hover:translate-y-[-1px]">Forgot password?</a>
              </div>

              <button type='submit' className="w-full py-4 bg-[#684EB9] text-white border-none rounded-[12px] text-[16px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden" style={{animation: 'fadeInUp 0.6s ease-out 1.5s both'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                {loading ? 'Logging In...' : 'Login'}
                <ArrowRight size={20} />
              </button>

              <div className="text-center text-sm text-[#64748b]" style={{animation: 'fadeInUp 0.6s ease-out 1.7s both'}}>
                <span>Don't have an account? </span>
                <a href="/request-access" className="text-[#684EB9] no-underline font-medium transition-all duration-300 hover:underline hover:translate-y-[-1px]">Request Access</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-10 text-sm text-white text-center" style={{animation: 'fadeIn 1s ease-out 2s both'}}>
        © 2025 Humanity Founders. All rights reserved.
      </div>
    </div>
  );
};

export default Login;

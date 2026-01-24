import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { User, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://backonehf.onrender.com/api/v1/admin/adminlogin",
        { userid: email, password: pass },
        { withCredentials: true }
      );
      toast.success("Login successful");
      navigate("/dashboard");
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 45%),
          radial-gradient(circle at 70% 80%, rgba(255,255,255,0.08) 0%, transparent 40%),
          linear-gradient(
            135deg,
            rgb(51, 32, 76) 0%,
            rgb(72, 45, 110) 35%,
            rgb(98, 64, 150) 65%,
            rgb(128, 92, 255) 100%
          )
        `,
      }}
    >
      {/* floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-[460px]">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="glass-card relative overflow-hidden"
        >
          {/* mouse glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at ${glow.x}% ${glow.y}%,
                rgba(255,255,255,0.25),
                transparent 60%
              )`,
            }}
          />

          {/* shine */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none" />

          {/* noise */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "url('https://grainy-gradients.vercel.app/noise.svg')",
            }}
          />

          <div className="relative z-10 flex flex-col gap-8">
            <img src="/company.png" alt="company" className="h-14 mx-auto" />

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-sm text-white/70 mt-1">
                Sign in to continue
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="flex flex-col gap-5"
            >
              <Input
                icon={<User size={18} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <Input
                icon={<Lock size={18} />}
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
              />

              <button
  type="submit"
  disabled={loading}
  className="btn-primary"
>
  {loading ? "Logging in..." : "Login"}
  <ArrowRight size={18} />
</button>

            </form>

            <p className="text-xs text-white/60 text-center">
              © 2025 Humanity Founders
            </p>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 28px;
          padding: 3rem;
          box-shadow: 0 40px 120px rgba(0,0,0,0.35);
        }

        .btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem;
  border-radius: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #684EB9, #8B5CF6);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: white;
  color: #684EB9;
  border: 1px solid rgba(139, 92, 246, 0.5);
  box-shadow:
    0 10px 30px rgba(139, 92, 246, 0.35),
    inset 0 0 0 1px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

/* icon color change on hover */
.btn-primary:hover svg {
  color: #684EB9;
}

/* smooth glow sweep */
.btn-primary::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255,255,255,0.6),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover::before {
  transform: translateX(100%);
}


        .input {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 14px;
          padding: 0.9rem 1rem 0.9rem 2.8rem;
          width: 100%;
          color: white;
        }

        .input:focus {
          border-color: rgba(139,92,246,0.8);
          box-shadow: 0 0 25px rgba(139,92,246,0.45);
          outline: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.35;
          animation: float 20s ease-in-out infinite;
        }

        .blob-1 { width: 300px; height: 300px; background: rgb(128,92,255); top: 10%; left: 5%; }
        .blob-2 { width: 350px; height: 350px; background: rgb(98,64,150); bottom: 10%; right: 10%; }
        .blob-3 { width: 220px; height: 220px; background: rgb(72,45,110); top: 40%; right: 30%; }

        @keyframes float {
          0% { transform: translate(0,0); }
          50% { transform: translate(40px,-60px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
    </div>
  );
}

/* Input */
function Input({ icon, ...props }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
        {icon}
      </div>
      <input {...props} className="input" required />
    </div>
  );
}

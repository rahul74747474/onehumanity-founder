import React, { useMemo, useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ProjectCreationForm from "./ProjectCreationForm";

/* ================= HELPERS ================= */
const todayDateOnly = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDate = (v) => {
  if (!v) return null;
  const dt = new Date(v);
  if (isNaN(dt)) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
};

const avatarUrl = (uid) =>
  `https://i.pravatar.cc/40?u=${String(uid).slice(0, 8)}`;

/* ================= MAIN ================= */
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }, []);

  useEffect(() => {
    axios
      .get("https://backonehf.onrender.com/api/v1/admin/getallproject")
      .then((r) => setProjects(r.data.message || []));
    axios
      .get("https://backonehf.onrender.com/api/v1/admin/getalluser")
      .then((r) => setEmployees(r.data.message || []));
  }, []);

  /* ================= FILTER ================= */
  const categorized = useMemo(() => {
    const today = todayDateOnly();
    const active = [],
      upcoming = [],
      overdue = [],
      completed = [];

    for (const p of projects) {
      const status = p.progress?.status;
      const start = parseDate(p.timeline?.startDate);
      const end = parseDate(p.timeline?.endDate);

      if (status === "Completed") completed.push(p);
      else if (status === "Ongoing") active.push(p);
      else if (start && start > today) upcoming.push(p);
      else if (end && end < today) overdue.push(p);
      else active.push(p);
    }

    return { active, upcoming, overdue, completed };
  }, [projects]);

  /* ================= HANDLERS ================= */
  const handleCreateProject = async () => {
    // 🔥 connect backend here later
    alert("Project created (connect backend)");
    setShowModal(false);
    setStep(1);
  };

  /* ================= UI ================= */
  const GlassCard = ({ children }) => (
    <div
      data-aos="fade-up"
      className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg p-5 hover:-translate-y-1 transition-all"
    >
      {children}
    </div>
  );

  const ProjectCard = ({ p }) => (
    <div
      data-aos="zoom-in"
      className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all"
    >
      <h3 className="font-semibold text-slate-900">{p.projectname}</h3>
      <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>

      <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-600"
          style={{ width: `${p.progress?.percent || 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex -space-x-3">
          {(p.team?.assignedMembers || []).slice(0, 4).map((m, i) => (
            <img
              key={i}
              src={avatarUrl(m.userId || m)}
              className="w-8 h-8 rounded-full border-2 border-white"
              alt=""
            />
          ))}
        </div>
        <button
          className="text-xs text-violet-600 font-medium hover:underline"
          onClick={() => navigate(`/projects/${p._id}`)}
        >
          View →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= PAGE ================= */}
      <div className="min-h-screen px-10 py-10 bg-gradient-to-b from-[#f7f5ff] via-white to-[#faf7ff]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-violet-700">
              Projects Workspace
            </h1>
            <p className="text-sm text-slate-500">
              Track, manage and deliver work faster
            </p>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              setStep(1);
            }}
            className="bg-violet-600 text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <GlassCard>
            <h3 className="font-semibold text-violet-600 mb-3">Active</h3>
            {categorized.active.slice(0, 4).map((p) => (
              <div key={p._id}>{p.projectname}</div>
            ))}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-amber-600 mb-3">Upcoming</h3>
            {categorized.upcoming.slice(0, 4).map((p) => (
              <div key={p._id}>{p.projectname}</div>
            ))}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold text-red-600 mb-3">Overdue</h3>
            {categorized.overdue.slice(0, 4).map((p) => (
              <div key={p._id}>{p.projectname}</div>
            ))}
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <ProjectCard key={p._id} p={p} />
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
 {showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center
    bg-black/40 backdrop-blur-sm animate-fadeIn"
    onClick={() => setShowModal(false)}
  >
    <div
      data-aos="zoom-in"
      onClick={(e) => e.stopPropagation()}
      className="relative w-[920px] max-w-[95vw] max-h-[92vh]
      bg-white/80 backdrop-blur-2xl border border-white/40
      rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.25)]
      flex flex-col overflow-hidden"
    >
      {/* HEADER */}
      <div
        className="flex items-center justify-between px-8 py-5
        bg-white/90 backdrop-blur-xl border-b border-slate-200
        sticky top-0 z-20"
      >
        <div>
          <h2 className="text-2xl font-semibold text-violet-700">
            Create New Project
          </h2>
          <p className="text-sm text-slate-500">
            Set up details and assign your team
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X size={22} />
        </button>
      </div>

      {/* STEP INDICATOR */}
      <div className="px-8 pt-4">
        <div className="flex items-center gap-3">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${
            step >= 1 ? "bg-violet-600" : "bg-slate-200"
          }`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${
            step >= 2 ? "bg-violet-600" : "bg-slate-200"
          }`} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Details</span>
          <span>Review</span>
        </div>
      </div>

      {/* BODY (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {step === 1 && (
          <div className="animate-slideIn">
            <ProjectCreationForm
              onNext={() => setStep(2)}
              onCancel={() => setShowModal(false)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-slideIn bg-white/70 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-violet-700 mb-2">
              Review & Create
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Everything looks good. Ready to launch this project?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border rounded-xl hover:bg-slate-50 transition"
              >
                Back
              </button>

              <button
                onClick={handleCreateProject}
                className="px-6 py-2.5 rounded-xl text-white font-medium
                bg-gradient-to-r from-violet-600 to-indigo-600
                hover:shadow-[0_15px_35px_rgba(124,58,237,0.35)]
                transition-all active:scale-95"
              >
                Create Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Projects;

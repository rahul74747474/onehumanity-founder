import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";

/* =========================
   IST DATE HELPERS
========================= */
const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const getISTTodayKey = () =>
  toISTDateKey(new Date());

const getISTYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISTDateKey(d);
};

/* =========================
   TENURE
========================= */
const calculateTenure = (createdAt) => {
  if (!createdAt) return "-";

  const start = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now - start) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 30) return `${diffDays} days`;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0) return `${months} months`;
  return `${years}.${Math.floor((months / 12) * 10)} years`;
};

/* =========================
   COMPONENT
========================= */
export default function PerformanceSection() {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [department, setDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [scoreRange, setScoreRange] = useState("All");

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    (async () => {
      const empRes = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getalluser",
        { withCredentials: true }
      );
      const perfRes = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getscores",
        { withCredentials: true }
      );

      setEmployees(empRes.data.message || []);
      setPerformance(perfRes.data.message || []);
    })();
  }, []);

  /* =========================
     FILTER EMPLOYEES
     (NO ADMIN / MANAGER)
  ========================= */
  const validEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.designation?.name !== "Administrator" &&
          e.designation?.name !== "Manager"
      ),
    [employees]
  );

  /* =========================
     TODAY PERFORMANCE
     (BASED ON createdAt IST)
  ========================= */
  const todayKey = getISTTodayKey();
  const yesterdayKey = getISTYesterdayKey();

  const todaysPerformance = useMemo(
    () =>
      performance.filter(
        (p) => toISTDateKey(p.createdAt) === todayKey
      ),
    [performance, todayKey]
  );

  const getPrevScore = (userId) => {
    const prev = performance.find(
      (p) =>
        String(p.userId) === String(userId) &&
        toISTDateKey(p.createdAt) === yesterdayKey
    );
    return prev?.totalScore ?? null;
  };

  /* =========================
     BUILD CARDS
  ========================= */
  const cards = useMemo(
    () =>
      todaysPerformance
        .map((p) => {
          const emp = validEmployees.find(
            (e) => String(e._id) === String(p.userId)
          );
          if (!emp) return null;

          const prevScore = getPrevScore(p.userId);
          const diff =
            prevScore !== null ? p.totalScore - prevScore : 0;

          return {
            id: p._id,
            name: emp.name,
            profession: emp.designation?.name,
            score: p.totalScore,
            prevScore,
            diff,
            tenure: calculateTenure(emp.createdAt),
            avatar:
              emp.profilepicture ||
              `https://i.pravatar.cc/60?u=${p.userId}`,
          };
        })
        .filter(Boolean),
    [todaysPerformance, validEmployees]
  );

  /* =========================
     FILTERS
  ========================= */
  const filtered = useMemo(() => {
    let d = [...cards];

    if (department !== "All") {
      d = d.filter((x) => x.profession === department);
    }

    if (scoreRange !== "All") {
      d = d.filter((x) => {
        if (scoreRange === "above70") return x.score > 70;
        if (scoreRange === "40to70")
          return x.score >= 40 && x.score <= 70;
        if (scoreRange === "below40") return x.score < 40;
        return true;
      });
    }

    if (sortBy === "score") {
      d.sort((a, b) => b.score - a.score);
    }

    return d;
  }, [cards, department, scoreRange, sortBy]);

  const topPerformer = filtered[0];

  /* =========================
     JSX (TAILWIND STYLED)
  ========================= */
  return (
    <div className="px-7 py-7 bg-[#f8fafc]">
      <h1 className="text-[26px] font-[600] text-[#6850be] flex items-center gap-2">
        Performance section
        <InfoTooltip text="View and analyze employee and team performance metrics" />
      </h1>

      <div className="flex gap-3 my-[14px] mb-[22px]">
        <button className="px-[14px] py-1.5 rounded text-[13px] border border-[#ddd] bg-white cursor-pointer hover:bg-gray-50">
          Employee Performance
        </button>
        <button className="px-[14px] py-1.5 rounded text-[13px] border border-[#ddd] bg-white cursor-pointer hover:bg-gray-50">
          Trend & Growth Graph
        </button>
        <button className="px-[14px] py-1.5 rounded text-[13px] border border-[#ddd] bg-white cursor-pointer hover:bg-gray-50">
          AI suggestions
        </button>
      </div>

      <div className="flex gap-5 mb-5">
        <div className="flex flex-col gap-2.5 bg-white rounded-[10px] p-[18px] w-[220px] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
          <span className="text-[25px]">👥</span>
          <span className="text-[#666]">Total employees</span>
          <h3 className="text-[25px] font-[400] text-black">{validEmployees.length}</h3>
        </div>

        <div className="flex flex-col gap-2.5 bg-white rounded-[10px] p-[18px] w-[220px] shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
          <span className="text-[25px]">⭐</span>
          <span className="text-[#666]">Top performer</span>
          <h2 className="text-[20px] font-[400] text-[rgba(255,166,3,1)]">{topPerformer?.name || "-"}</h2>
        </div>
      </div>

      <div className="flex gap-5 mb-[22px]">
        <div>
          <label className="text-[12px] text-[#666]">Department</label>
          <select 
            onChange={(e) => setDepartment(e.target.value)}
            className="w-[200px] px-1.5 py-1.5 rounded text-[13px] border border-[#ddd] mt-1 cursor-pointer bg-white"
          >
            <option>All</option>
            {[...new Set(validEmployees.map(e => e.designation?.name))]
              .filter(Boolean)
              .map((d) => (
                <option key={d}>{d}</option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-[12px] text-[#666]">Score range</label>
          <select 
            onChange={(e) => setScoreRange(e.target.value)}
            className="w-[200px] px-1.5 py-1.5 rounded text-[13px] border border-[#ddd] mt-1 cursor-pointer bg-white"
          >
            <option value="All">All</option>
            <option value="above70">Above 70</option>
            <option value="40to70">40 - 70</option>
            <option value="below40">Below 40</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[22px] max-md:grid-cols-1 max-lg:grid-cols-2">
        {filtered.map((c) => (
          <div key={c.id} className="bg-gradient-to-br from-[#f4f1ff] to-white rounded-[12px] p-[18px] shadow-[0_10px_22px_rgba(0,0,0,0.08)]">
            <div className="flex gap-3 items-center">
              <img src={c.avatar} alt="" className="w-[42px] h-[42px] rounded-full" />
              <div>
                <h3 className="text-[14px] font-[500]">{c.name}</h3>
                <p className="text-[12px] text-[#666]">{c.profession}</p>
              </div>
            </div>

            <div className="flex justify-between mt-[18px]">
              <div>
                <div className="text-[28px] font-[600]">
                  {c.score}
                  <span className="text-[12px] text-[#777]">/100</span>
                </div>
              </div>

              {c.diff !== 0 && (
                <div className={`text-[12px] ${c.diff > 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {c.diff > 0 ? "+" : ""}
                  {c.diff}% from last time
                </div>
              )}
            </div>

            <div className="flex justify-between mt-[14px] text-[12px] text-[#666]">
              <div>
                <span className="block text-[12px]">Previous Score</span>
                <b>{c.prevScore ?? "-"}</b>
              </div>
              <div>
                <span className="block text-[12px]">Tenure</span>
                <b>{c.tenure}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

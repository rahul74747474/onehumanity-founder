import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { InfoTooltip } from "./InfoTooltip";

const API_PROJECTS = "api/v1/admin/getallproject";
const API_USERS = "api/v1/admin/getalluser";

const severityColor = {
  Critical: "#e53e3e",
  Warning: "#f59e0b",
  Minor: "#60a5fa",
};

function safeNumber(v) {
  return typeof v === "number" && !isNaN(v) ? v : 0;
}

function formatNumber(v) {
  if (!v && v !== 0) return "0";
  return v.toLocaleString();
}

export default function ProjectSuccessReports() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All Projects");
  const [ownerFilter, setOwnerFilter] = useState("All Owners");
  const [timeframe, setTimeframe] = useState("All Time");

  useEffect(() => {
    (async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          axios.get(`https://backonehf.onrender.com/${API_PROJECTS}`),
          axios.get(`https://backonehf.onrender.com/${API_USERS}`),
        ]);
        console.log(pRes.data.message);
        console.log(uRes.data.message);
        setProjects(pRes?.data?.message || pRes?.data || []);
        setUsers(uRes?.data?.message || uRes?.data || []);
      } catch (err) {
        console.warn("Failed to fetch from API — using fallback sample data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => {
      m[u._id || u.id] = u;
    });
    return m;
  }, [users]);

  const enriched = useMemo(() => {
    const now = new Date();
    return projects.map((p) => {
      const budget = safeNumber(p.budget || p.projectBudget || 0);
      const managerId = p.manager;
      const managerObj = userMap[managerId] || {};
      const members = (p.team?.assignedMembers || []).map((m) => {
        const u = userMap[m.userId] || {};
        return {
          ...m,
          ...u,
        };
      });

      const managerSalary = safeNumber(managerObj?.salary?.amount);
      const membersSalarySum = members.reduce((s, mm) => s + safeNumber(mm?.salary?.amount), 0);
      const budgetUsedAmount = managerSalary + membersSalarySum;
      const budgetUsedPercent = budget > 0 ? Math.round((budgetUsedAmount / budget) * 100) : 0;
      const budgetRemaining = Math.max(0, budget - budgetUsedAmount);

      const completion = safeNumber(p.progress?.percent ?? p.completionPercent ?? 0);

      const risks = Array.isArray(p.risks)
        ? p.risks.map((r) => ({
            ...r,
            severity: (r.severity || r.level || "Minor"),
            category: r.category || r.type || "General",
            raisedon: r.raisedon ? new Date(r.raisedon) : null,
            resolvedon: r.resolvedon ? new Date(r.resolvedon) : null,
          }))
        : [];

      let health = "Healthy";
      const hasCriticalOpen = risks.some((r) => r.severity === "Critical" && !r.resolvedon);
      if (hasCriticalOpen) health = "At Risk";
      else if (completion >= 80) health = "Healthy";
      else if (completion >= 50) health = "Warning";
      else health = "At Risk";

      return {
        ...p,
        budget,
        managerObj,
        members,
        budgetUsedAmount,
        budgetUsedPercent,
        budgetRemaining,
        completion,
        risks,
        health,
      };
    });
  }, [projects, userMap]);

  const filteredProjects = useMemo(() => {
    let arr = [...enriched];
    if (statusFilter !== "All Projects") {
      arr = arr.filter((p) => p.health === statusFilter);
    }
    if (ownerFilter !== "All Owners") {
      arr = arr.filter((p) => {
        const mid = p.manager || (p.manager?._id);
        return mid === ownerFilter;
      });
    }
    if (timeframe === "Last 30 days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 30);
      arr = arr.filter((p) => new Date(p.createdAt || p.timeline?.startDate || 0) >= cut);
    } else if (timeframe === "Last 90 days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 90);
      arr = arr.filter((p) => new Date(p.createdAt || p.timeline?.startDate || 0) >= cut);
    }
    return arr;
  }, [enriched, statusFilter, ownerFilter, timeframe]);

  const bottleneckData = useMemo(() => {
    const rows = [];
    const now = new Date();

    filteredProjects.forEach((p) => {
      p.risks.forEach((r) => {
        const title = r.title || r.category || "Unnamed Risk";
        const start = r.raisedon ? new Date(r.raisedon) : null;
        const end = r.resolvedon ? new Date(r.resolvedon) : now;

        if (!start) return;

        const delayDays = Math.max(
          0,
          Math.round((end - start) / (1000 * 60 * 60 * 24))
        );

        let severity = "Minor";
        if (delayDays >= 10) severity = "Critical";
        else if (delayDays >= 5) severity = "Warning";

        rows.push({
          title,
          delay: delayDays,
          Critical: severity === "Critical" ? delayDays : 0,
          Warning: severity === "Warning" ? delayDays : 0,
          Minor: severity === "Minor" ? delayDays : 0,
        });
      });
    });

    return rows.sort((a, b) => b.delay - a.delay);
  }, [filteredProjects]);

  const chartData = bottleneckData.map((d) => ({
    category: d.category,
    Critical: d.Critical,
    Warning: d.Warning,
    Minor: d.Minor,
  }));

  if (loading) {
    return <div className="px-7 py-7 bg-[#f7f8fb] min-h-screen text-[#111827]">Loading Projects...</div>;
  }

  return (
    <div className="px-7 py-7 bg-[#f7f8fb] min-h-screen text-[#111827] font-['Inter']">
      <div className="mb-[18px]">
        <h1 className="m-0 text-[28px] text-[rgba(104,80,190,1)] flex items-center gap-2">
          Project Success Reports
          <InfoTooltip text="Insights into project completion rates and bottlenecks" />
        </h1>
        <p className="mt-1.5 mb-3 text-[#6b7280] text-[14px]">
          Monitor project health, completion rates, and identify bottlenecks
        </p>

        <div className="flex gap-4 items-end flex-wrap mt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#6b7280]">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[200px] px-3 py-2.5 rounded text-[14px] border border-[#e6e9ef] bg-white outline-none"
            >
              <option>All Projects</option>
              <option>Healthy</option>
              <option>Warning</option>
              <option>At Risk</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#6b7280]">Project Owner/Manager</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="min-w-[200px] px-3 py-2.5 rounded text-[14px] border border-[#e6e9ef] bg-white outline-none"
            >
              <option>All Owners</option>
              {users.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#6b7280]">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="min-w-[200px] px-3 py-2.5 rounded text-[14px] border border-[#e6e9ef] bg-white outline-none"
            >
              <option>All Time</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[10px] shadow-[0_6px_20px_rgba(15,23,42,0.06)] mb-[18px] border border-[#eef2ff]">
        <div className="flex flex-col gap-0 px-5 py-5">
          <h3 className="m-0 text-[22px] font-[700] mb-0">Project Health Overview</h3>
          <p className="text-[14px] font-[400] text-[rgba(74,85,101,1)] m-0">Click on a project to view detailed information</p>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse text-[14px] min-w-[800px]">
            <thead>
              <tr>
                <th className="text-left px-2.5 py-3 text-[#6b7280] font-[600] text-[13px] border-b border-[#f1f5f9]">Project Name</th>
                <th className="text-left px-2.5 py-3 text-[#6b7280] font-[600] text-[13px] border-b border-[#f1f5f9]">Completion %</th>
                <th className="text-left px-2.5 py-3 text-[#6b7280] font-[600] text-[13px] border-b border-[#f1f5f9]">Budget Used</th>
                <th className="text-left px-2.5 py-3 text-[#6b7280] font-[600] text-[13px] border-b border-[#f1f5f9]">Est. Completion</th>
                <th className="text-left px-2.5 py-3 text-[#6b7280] font-[600] text-[13px] border-b border-[#f1f5f9]">Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const estCompletion = p.timeline?.endDate ? new Date(p.timeline.endDate) : null;
                return (
                  <tr key={p._id || p.id}>
                    <td className="px-2.5 py-3 border-b border-[#f7fafc] flex flex-col gap-1.5">
                      <div className="font-[600]">{p.projectname}</div>
                      <div className="text-[#6b7280] text-[13px]">{p.managerObj?.name || "—"}</div>
                    </td>

                    <td className="px-2.5 py-3 border-b border-[#f7fafc]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[160px] h-2 bg-[#eee] rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-lg"
                            style={{ width: `${Math.max(0, Math.min(100, p.progress.percent))}%` }}
                          />
                        </div>
                        <div className="min-w-[36px] font-[600] text-[13px] text-[#374151]">{p.progress.percent}%</div>
                      </div>
                    </td>

                    <td className="px-2.5 py-3 border-b border-[#f7fafc] flex flex-col">
                      <div className="font-[700] text-[rgba(104,78,190,1)]">{p.budgetUsedPercent}%</div>
                      <div className="text-[#6b7280] text-[13px]">
                        ${formatNumber(p.budgetUsedAmount)} of ${formatNumber(p.budget)}
                      </div>
                    </td>

                    <td className="px-2.5 py-3 border-b border-[#f7fafc]">
                      {estCompletion ? format(estCompletion, "MMM dd, yyyy") : "—"}
                    </td>

                    <td className="px-2.5 py-3 border-b border-[#f7fafc]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full inline-block ${
                            p.health === "Healthy"
                              ? "bg-[#10b981]"
                              : p.health === "Warning"
                              ? "bg-[#f59e0b]"
                              : "bg-[#ef4444]"
                          }`}
                        />
                        <span>{p.health}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[10px] px-[18px] py-[18px] pb-10 shadow-[0_6px_20px_rgba(15,23,42,0.06)] mb-[18px] border border-[#eef2ff]">
        <h3 className="m-0 text-[20px] mb-1.5">Top Bottlenecks Across All Projects</h3>
        <p className="text-[13px] text-[#6b7280] m-0 mb-3">Tasks and phases that exceeded their estimated duration</p>

        <div className="w-full overflow-y-auto pr-2.5" style={{ height: 400 }}>
          {chartData.length === 0 ? (
            <div className="text-[#6b7280] py-6 text-center">No risk/bottleneck data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                layout="vertical"
                data={bottleneckData}
                barGap={20}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" label={{ value: "Days Delayed", position: "bottom" }} />
                <YAxis dataKey="title" type="category" width={300} />
                <Tooltip />
                <Legend />

                <Bar dataKey="Critical" stackId="a" fill={severityColor.Critical} radius={[0, 8, 8, 0]} />
                <Bar dataKey="Warning" stackId="a" fill={severityColor.Warning} radius={[0, 8, 8, 0]} />
                <Bar dataKey="Minor" stackId="a" fill={severityColor.Minor} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

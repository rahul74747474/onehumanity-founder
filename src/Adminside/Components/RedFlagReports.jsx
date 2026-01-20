import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChartNoAxesCombined, CircleCheckBig, Clock, TriangleAlert } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

const API = `https://backonehf.onrender.com/api/v1/admin`;

const severityColors = {
  High: "rgba(239,68,68,1)",
  Medium: "rgba(255,179,51,1)",
  Low: "rgba(59,130,246,1)",
  Critical: "#9B1C1C",
};
const tableseverityColors = {
  High: "rgba(255, 226, 226, 1)",
  Medium: "rgba(254, 243, 198, 1)",
  Low: "rgba(219, 234, 254, 1)",
  Critical: "#FFD7D9",
};
const severitytext = {
  High: "rgba(193, 0, 7, 1)",
  Medium: "rgba(187, 77, 0, 1)",
  Low: "rgba(20, 71, 230, 1)",
  Critical: "#FF0000",
};
const border = {
  High: "rgba(193, 0, 7, 1)",
  Medium: "rgba(187, 77, 0, 1)",
  Low: "rgba(20, 71, 230, 1)",
  Critical: "#FF0000",
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const CustomLegend = ({ payload }) => {
  return (
    <div className="flex gap-4 justify-center mb-3 flex-wrap">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-1.5 text-[13px] text-[#334155] font-[500]">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{
              backgroundColor: entry.color,
              boxShadow: `0 0 0 3px ${entry.color}22`,
            }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
};

export default function RedFlagReports() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [preset, setPreset] = useState("Last 30 days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    (async () => {
      const [pr, us] = await Promise.all([
        axios.get(`${API}/getallproject`),
        axios.get(`${API}/getalluser`),
      ]);

      setProjects(pr.data.message || []);
      setUsers(us.data.message || []);
    })();
  }, []);

  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59);

    const start = new Date();
    if (preset === "Last 30 days") start.setDate(start.getDate() - 29);
    if (preset === "Last 90 days") start.setDate(start.getDate() - 89);

    start.setHours(0, 0, 0);

    setFromDate(start.toISOString().slice(0, 10));
    setToDate(end.toISOString().slice(0, 10));
  }, [preset]);

  const risks = useMemo(() => {
    const out = [];

    projects.forEach((p) => {
      if (!Array.isArray(p.risks)) return;

      p.risks.forEach((r) => {
        out.push({
          id: r._id,
          projectName: p.projectname,
          severity: cap(r.severity),
          type: r.category,
          status: r.status,
          raisedon: r.raisedon ? new Date(r.raisedon) : null,
          resolvedon: r.resolvedon ? new Date(r.resolvedon) : null,
          raisedby: r.raisedby,
        });
      });
    });

    return out.sort((a, b) => b.raisedon - a.raisedon);
  }, [projects]);

  const filtered = useMemo(() => {
    let arr = [...risks];

    if (fromDate) {
      const f = new Date(fromDate);
      arr = arr.filter((x) => x.raisedon >= f);
    }
    if (toDate) {
      const t = new Date(toDate);
      t.setHours(23, 59, 59);
      arr = arr.filter((x) => x.raisedon <= t);
    }

    if (severityFilter)
      arr = arr.filter((x) => x.severity.toLowerCase() === severityFilter.toLowerCase());

    if (typeFilter)
      arr = arr.filter((x) => x.type?.toLowerCase() === typeFilter.toLowerCase());

    return arr;
  }, [risks, severityFilter, typeFilter, fromDate, toDate]);

  const summary = useMemo(() => {
    const total = filtered.length;

    const bySeverity = filtered.reduce((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    const byStatus = filtered.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {});

    let totalHours = 0;
    let resolvedCount = 0;

    filtered.forEach((r) => {
      if (r.resolvedon && r.raisedon) {
        const diff = r.resolvedon - r.raisedon;
        if (diff > 0) {
          totalHours += diff / (1000 * 60 * 60);
          resolvedCount++;
        }
      }
    });

    const avg = resolvedCount ? Math.round(totalHours / resolvedCount) : 0;
    const resolvedPercent = (byStatus.Resolved / total) * 100;
    const openPercent = (byStatus.Raised / total) * 100;

    return { total, bySeverity, byStatus, avg, resolvedPercent, openPercent };
  }, [filtered]);

  const chartData = useMemo(() => {
    const map = {};

    filtered.forEach((r) => {
      const key = r.raisedon?.toISOString().slice(0, 10);
      if (!key) return;

      if (!map[key])
        map[key] = { date: key, High: 0, Medium: 0, Low: 0, Critical: 0 };

      map[key][r.severity]++;
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => (m[u._id] = u.name));
    return m;
  }, [users]);

  return (
    <div className="bg-[#F7F8FA] min-h-screen font-['Inter']">
      <div className="px-10 py-2.5 flex flex-col bg-white border-b border-[rgba(229,231,235,1)]">
        <h1 className="text-[28px] font-[700] text-[#6C59D1] mb-1.5 flex items-center gap-2">
          Red Flags Report
          <InfoTooltip text="Summary of performance risks and escalation history" />
        </h1>
        <p className="text-[14px] text-[#6B7280] mb-5">Track escalations, issues, and their resolution history</p>

        <div className="flex gap-6 mb-5.5 flex-wrap">
          <div className="flex flex-col w-[200px] gap-1.5">
            <label className="text-[12px]">Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2.5 rounded text-[14px] border border-[#E5E7EB] bg-white outline-none cursor-pointer">
              <option value="">All</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>

          <div className="flex flex-col w-[200px] gap-1.5">
            <label className="text-[12px]">Severity</label>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="px-3 py-2.5 rounded text-[14px] border border-[#E5E7EB] bg-white outline-none cursor-pointer">
              <option value="">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex flex-col w-1/2 gap-1.5">
            <label className="text-[12px]">Date Range</label>
            <div className="flex flex-wrap gap-2 flex-row">
              <input type="date" value={fromDate} onChange={(e) => { setPreset("custom"); setFromDate(e.target.value); }} className="px-3 py-2.5 rounded text-[14px] border border-[#E5E7EB] bg-white outline-none w-[200px]" />
              <input type="date" value={toDate} onChange={(e) => { setPreset("custom"); setToDate(e.target.value); }} className="px-3 py-2.5 rounded text-[14px] border border-[#E5E7EB] bg-white outline-none w-[200px]" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[500px] flex items-center px-5 py-5 gap-5 max-md:flex-col max-md:h-auto">
        <div className="bg-white w-1/2 h-full rounded-[14px] border border-[#eee] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-5 py-5 max-md:w-full">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-[rgba(255,226,226,1)] rounded-[10px]">
              <TriangleAlert size={22} color="red" />
            </div>
            <div>
              <h3 className="text-[18px] font-[600] pb-1.5">Escalation Overview</h3>
              <p className="text-[13px] text-[#6d6d6d]">Total risks raised in selected period</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-[18px]">
            <div className="px-[22px] py-[22px] rounded-[12px] bg-gradient-to-br from-[#efe7ff] to-[#d5c7ff] border border-[#d4c9ff]">
              <h4 className="text-[rgba(74,85,101,1)] text-[18px] font-[600]">Total Escalations</h4>
              <div className="text-[35px] font-[400] my-2.5">{summary.total}</div>
              <div className="text-[12px] text-[#777]">vs. previous period (0)</div>
            </div>

            <div className="flex flex-col items-start px-[22px] py-[22px] rounded-[12px] bg-[#fafafa] border border-[#e8e8e8]">
              <h4 className="text-[rgba(74,85,101,1)] text-[18px] font-[600] mb-2.5">By Severity</h4>
              <div className="w-full">
                <div className="flex justify-between mb-1.5 text-[14px]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-full" /> High
                  </div>
                  <span className="font-[600]">{summary.bySeverity.High || 0}</span>
                </div>
                <div className="flex justify-between mb-1.5 text-[14px]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full" /> Medium
                  </div>
                  <span className="font-[600]">{summary.bySeverity.Medium || 0}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 bg-[#3b82f6] rounded-full" /> Low
                  </div>
                  <span className="font-[600]">{summary.bySeverity.Low || 0}</span>
                </div>
              </div>
            </div>

            <div className="px-[22px] py-[22px] rounded-[12px] bg-[#fafafa] border border-[#e8e8e8]">
              <h4 className="text-[rgba(74,85,101,1)] text-[18px] font-[600] mb-2.5">By Status</h4>
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Open</span>
                <span className="font-[600]">{summary.byStatus.Raised}</span>
              </div>
              <div className="w-full h-1.5 rounded-[10px] bg-[#ddd] mb-3">
                <div className="h-full bg-[#ef4444] rounded-[10px]" style={{ width: `${summary.openPercent}%` }} />
              </div>
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Resolved</span>
                <span className="font-[600]">{summary.byStatus.Resolved}</span>
              </div>
              <div className="w-full h-1.5 rounded-[10px] bg-[#ddd]">
                <div className="h-full bg-[#10b981] rounded-[10px]" style={{ width: `${summary.resolvedPercent}%` }} />
              </div>
            </div>

            <div className="px-[22px] py-[22px] rounded-[12px] bg-[#fafafa] border border-[#e8e8e8]">
              <h4 className="text-[rgba(74,85,101,1)] text-[18px] font-[600] mb-2.5">Avg. Resolution Time</h4>
              <div className="text-[35px] font-[400]">
                {summary.avg} <span className="text-[12px] text-[#777]">Hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white w-1/2 h-full rounded-[14px] border border-[#eee] shadow-[0_2px_10px_rgba(0,0,0,0.04)] px-5 py-5 max-md:w-full">
          <div className="flex items-center gap-3 mb-[100px]">
            <div className="p-2.5 bg-[rgba(219,234,254,1)] rounded-[10px]">
              <ChartNoAxesCombined size={22} color="rgba(21,93,252,1)" />
            </div>
            <div>
              <h3 className="text-[18px] font-[600] pb-1.5">Escalation Trend</h3>
              <p className="text-[13px] text-[#6d6d6d]">Escalations over time by severity level</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={chartData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ position: "absolute", bottom: 250 }} content={<CustomLegend />} />
              <Tooltip />
              <Bar dataKey="High" fill={severityColors.High} stackId="a" />
              <Bar dataKey="Medium" fill={severityColors.Medium} stackId="a" />
              <Bar dataKey="Low" fill={severityColors.Low} stackId="a" />
              <Bar dataKey="Critical" fill={severityColors.Critical} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-[0px_4px_18px_rgba(0,0,0,0.06)] mx-5 mb-2.5 mt-0">
        <div className="flex flex-col px-5 py-5 gap-2.5">
          <h3 className="text-[20px] font-[400]">Escalation History Log</h3>
          <p className="text-[14px] font-[400] text-[rgba(74,85,101,1)]">Complete record of all escalations and their resolution status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[rgba(241,245,249,1)]">
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Date/Time</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Project</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Initiator</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Severity</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Type</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Status</th>
                <th className="text-[13px] px-2.5 py-3 border-b border-[#eef2f7] text-left">Resolution</th>
              </tr>
            </thead>

            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center px-2.5 py-5">No data found</td>
                </tr>
              ) : (
                pageData.map((r) => {
                  const res =
                    r.resolvedon && r.raisedon
                      ? Math.round((r.resolvedon - r.raisedon) / (1000 * 60 * 60)) + "h"
                      : "—";

                  return (
                    <tr key={r.id}>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">{r.raisedon?.toLocaleString()}</td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">{r.projectName}</td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">{userMap[r.raisedby] || "Unknown"}</td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">
                        <span className="px-2.25 py-0.75 text-[10px] rounded-full border" style={{ background: tableseverityColors[r.severity], color: severitytext[r.severity], borderColor: border[r.severity] }}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">{r.type}</td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">
                        {r.status === "Resolved" ? (
                          <div className="text-[12px] flex items-center gap-1.25 text-[rgba(0,130,54,1)]">
                            <CircleCheckBig size={16} />
                            {r.status}
                          </div>
                        ) : (
                          <div className="text-[12px] flex items-center gap-1.25 text-[rgba(193,0,7,1)]">
                            <Clock size={16} />
                            {r.status}
                          </div>
                        )}
                      </td>
                      <td className="px-1.5 py-3 text-[14px] border-b border-[#F3F3F6]">{res}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center text-[12px] items-center gap-2 mb-2.5 mt-4.5">
          <button disabled={page === 1} onClick={() => setPage(1)} className="px-3 py-1.5 rounded border border-[#E5E7EB] bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50">
            «
          </button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded border border-[#E5E7EB] bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50">
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded border border-[#E5E7EB] bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50">
            Next
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="px-3 py-1.5 rounded border border-[#E5E7EB] bg-white disabled:opacity-50 cursor-pointer hover:bg-gray-50">
            »
          </button>
        </div>
      </div>
    </div>
  );
}

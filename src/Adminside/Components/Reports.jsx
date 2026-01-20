import React, { useEffect, useState } from "react";
import {
  generateReportAPI,
  fetchReportsAPI
} from "../api/reports.api";
import dayjs from "dayjs";
import { InfoTooltip } from "./InfoTooltip";

export default function Reports() {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState("excel");
  const [options, setOptions] = useState({
    includeRawTasks: false,
    summaryOnly: false,
    employeeBreakdown: false,
    includeCharts: false
  });

  const [loading, setLoading] = useState(false);
  const [exports, setExports] = useState([]);

  const loadExports = async () => {
    const res = await fetchReportsAPI();
    setExports(res.data || []);
  };

  useEffect(() => {
    loadExports();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateReportAPI({
        type,
        from,
        to,
        format,
        options
      });
      await loadExports();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => {
         window.location.reload()
      }, (5000));
     
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-[rgba(104,80,190,1)] flex items-center gap-2">Reports
        <InfoTooltip text="Download reports in supported file formats"/>
      </h2>
      <p className="text-[#6b7280] mb-4">
        Generate and export reports for your organization
      </p>

      {/* ---------- Generate Card ---------- */}
      <div className="bg-white p-5 rounded-[10px] shadow-[0_0_0_1px_#e5e7eb] mb-6">
        <h4 className="mb-3 text-base font-semibold">Generate Report Export</h4>

        <label className="block mt-[14px] text-sm text-[#374151]">Report Type *</label>
        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#6d28d9]">
          <option value="">Select</option>
          <option value="tasks">Tasks</option>
          <option value="metrics">Metrics</option>
          <option value="performance">Employee Performance</option>
          <option value="employees">Employees</option>
          <option value="redflags">Red Flags</option>
        </select>

        <label className="block mt-[14px] text-sm text-[#374151]">Date Range *</label>
        <div className="flex gap-[10px]">
          <input type="date" onChange={e => setFrom(e.target.value)} className="w-full p-2 border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#6d28d9]" />
          <input type="date" onChange={e => setTo(e.target.value)} className="w-full p-2 border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#6d28d9]" />
        </div>

        <label className="block mt-[14px] text-sm text-[#374151]">Export Format *</label>
        <div className="flex gap-5 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={format === "excel"}
              onChange={() => setFormat("excel")}
            />
            Excel
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={format === "pdf"}
              onChange={() => setFormat("pdf")}
            />
            PDF
          </label>
        </div>

        <button
          className="mt-5 bg-[#6d28d9] text-white border-none py-[10px] px-4 rounded-md text-sm cursor-pointer hover:bg-[#5a23c4] disabled:opacity-60"
          disabled={loading}
          onClick={handleGenerate}
        >
          {loading ? "Generating..." : "Generate Export"}
        </button>
      </div>

      {/* ---------- Recent Exports ---------- */}
      <div className="bg-white p-5 rounded-[10px] shadow-[0_0_0_1px_#e5e7eb] mb-6">
        <h4 className="mb-3 text-base font-semibold">Recent Exports</h4>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 border-b border-[#e5e7eb]">File Name</th>
              <th className="text-left p-3 border-b border-[#e5e7eb]">Date Generated</th>
              <th className="text-left p-3 border-b border-[#e5e7eb]">Status</th>
              <th className="text-left p-3 border-b border-[#e5e7eb]">Action</th>
            </tr>
          </thead>
          <tbody>
            {exports.map(r => (
              <tr key={r._id}>
                <td className="text-left p-3 border-b border-[#e5e7eb]">
                  {r.type}-report-{dayjs(r.createdAt).format("YYYY-MM")}
                  .{r.format}
                </td>
                <td className="text-left p-3 border-b border-[#e5e7eb]">{dayjs(r.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td className="text-left p-3 border-b border-[#e5e7eb]">
                  <span
                    className={`px-[10px] py-1 rounded-full text-xs ${
                      r.status === "ready"
                        ? "bg-[#dcfce7] text-[#15803d]"
                        : "bg-[#e0e7ff] text-[#4338ca]"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="text-left p-3 border-b border-[#e5e7eb]">
                  {r.status === "ready" ? (
                    <a
                      href={`https://backonehf.onrender.com${r.fileUrl}`}
                      className="text-[#2563eb] no-underline hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    "Processing..."
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

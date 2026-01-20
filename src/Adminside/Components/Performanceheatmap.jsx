import React, { useEffect, useState } from "react";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";

const dateRanges = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
  { label: "Last 240 days", value: 240 }
];

// Color intensity levels
const COLORS = [
  "#F0FFF0", // very light
  "#A8E6A1",
  "#6ECB63",
  "#3FA34D",
  "#1E7A35", // dark
];

const PerformanceHeatmap = () => {
  const [reports, setReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [range, setRange] = useState(30);

  useEffect(() => {
    async function fetchData() {
      const res1 = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getreports`);
      const res2 = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`);
      setReports(res1.data.message);
      setEmployees(res2.data.message);
    }
    fetchData();
  }, []);

  // Filter reports by employee + time range
  const filteredReports = reports.filter(r => {
    const diff = (Date.now() - new Date(r.date)) / (1000 * 3600 * 24);
    if (diff > range) return false;
    if (!selectedEmp) return true;
    return r.user === selectedEmp;
  });

  // Count submissions per day
  const dateMap = {};
  filteredReports.forEach(rep => {
    const d = new Date(rep.date).toDateString();
    dateMap[d] = (dateMap[d] || 0) + rep.relatedtasks.length;
  });

  // Build last X days grid
  const daysArray = Array.from({ length: range }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (range - i - 1));
    const key = date.toDateString();
    const count = dateMap[key] || 0;

    let color = COLORS[0];
    if (count === 0) color = "transparent";
    else if (count === 1) color = COLORS[1];
    else if (count === 2) color = COLORS[2];
    else if (count <= 4) color = COLORS[3];
    else color = COLORS[4];

    return {
      date,
      count,
      color
    };
  });

  // Summary
  const totalExpected = range * (selectedEmp ? 1 : employees.length);
  const totalSubmitted = filteredReports.length;
  const missing = totalExpected - totalSubmitted;
  const percent =
    totalExpected === 0 ? 0 : Math.round((totalSubmitted / totalExpected) * 100);

  return (
    <div className="p-[30px]">
      <h1 className="text-[34px] font-black text-[#6b46c1] flex items-center gap-2">Performance score Heatmap
        <InfoTooltip text="Visual overview of performance scores across teams and individuals" />
      </h1>
      
      <p className="mt-[5px] text-[16px] text-[#757575]">
        Visual representation of team performance over time
      </p>

      {/* FILTERS */}
      <div className="flex gap-[15px] my-5">
        <select
          className="py-[10px] px-[15px] rounded-lg border border-[#ddd] text-[15px] outline-none bg-white cursor-pointer"
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <select
          className="py-[10px] px-[15px] rounded-lg border border-[#ddd] text-[15px] outline-none bg-white cursor-pointer"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          {dateRanges.map(r => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* HEATMAP */}
      <div className="bg-white p-[25px] rounded-[15px] shadow-[0px_4px_15px_rgba(0,0,0,0.07)]">
        <div className="grid gap-[6px] justify-center" style={{ gridTemplateColumns: 'repeat(30, 20px)' }}>
          {daysArray.map((day, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded transition-transform duration-200 hover:scale-125 cursor-pointer"
              style={{ 
                backgroundColor: day.color,
                border: day.count === 0 ? '2px solid #eaeaea' : 'none'
              }}
              title={`${day.date.toDateString()} — ${day.count} reports`}
            />
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-[#f5faff] mt-[30px] p-[30px] rounded-[15px] border border-[#e5e8ff]">
        <h2 className="text-[22px] font-bold text-[#6b46c1] mb-[15px]">
          Summary <span className="text-base font-normal">(Last {range} days)</span>
        </h2>

        <p className="text-[16px] my-[10px]">Average Submission Rate : <b>{percent}%</b></p>
        <p className="text-[16px] my-[10px]">Total Reports Expected : <b>{totalExpected}</b></p>
        <p className="text-[16px] my-[10px]">Total Reports Submitted : <b>{totalSubmitted}</b></p>
        <p className="text-[16px] my-[10px]">Missing Reports : <b>{missing}</b></p>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;

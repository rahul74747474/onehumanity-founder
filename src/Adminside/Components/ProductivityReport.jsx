import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { InfoTooltip } from "./InfoTooltip";

const ProductivityReport = () => {
  const [metrics, setMetrics] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);

  // =========================
  // DATA FETCHING
  // =========================
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getmetrics"
      );
      setMetrics(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getattendance"
      );
      setAttendance(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getalluser",
        { withCredentials: true }
      );
      setEmployees(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getalltask",
        { withCredentials: true }
      );
      setTasks(res.data.message || []);
    })();
  }, []);

  // =========================
  // DATE HELPERS (IST SAFE)
  // =========================
  const toISTDateKey = (date) =>
    new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

  const getISTWeekday = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata"
    });

  const getLast6DaysIST = () => {
    const days = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        key: toISTDateKey(d),
        label: getISTWeekday(d)
      });
    }
    return days;
  };

  const last6Days = getLast6DaysIST();

  // =========================
  // BAR CHART (METRICS)
  // =========================
  const barChartData = last6Days.map(d => {
    const m = metrics.find(
      x => toISTDateKey(x.date) === d.key
    );

    return {
      day: d.label,
      tasks: m?.tasksCompleted || 0
    };
  });

  // =========================
  // AREA CHART (ATTENDANCE)
  // =========================
  const attendanceByDate = attendance.reduce((acc, a) => {
    const key = toISTDateKey(a.date);
    acc[key] = (acc[key] || 0) + (a.timespent || 0);
    return acc;
  }, {});

  const lineChartData = last6Days.map(d => ({
    day: d.label,
    hours: Math.round((attendanceByDate[d.key] || 0) / 60)
  }));

  // =========================
  // TABLE DATA
  // =========================
  const minutesBetween = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return 0;
    return Math.round((e - s) / (1000 * 60));
  };

  const tableData = currentEmployees.map(emp => {
    const empTasks = tasks.filter(t =>
      String(t.assignedto) === String(emp._id)
    );

    const completedTasks = empTasks.filter(
      t => (t.status || "").toLowerCase() === "completed"
    );

    const totalMinutes = completedTasks.reduce(
      (sum, t) => sum + minutesBetween(t.createdAt, t.completedAt),
      0
    );

    const avgMinutes = completedTasks.length
      ? Math.round(totalMinutes / completedTasks.length)
      : 0;

    const avgTime =
      avgMinutes >= 60
        ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`
        : `${avgMinutes}m`;

    return {
      name: emp.name,
      role: emp.designation?.name || "No Role",
      assignedCount: empTasks.length,
      completedCount: completedTasks.length,
      avgTime: completedTasks.length ? avgTime : "-",
      score: emp.productivityScore ?? "88%"
    };
  });

  // =========================
  // JSX (TAILWIND STYLED)
  // =========================
  return (
    <div className="px-10 py-10 font-['Inter'] text-[#333]">
      <h1 className="text-[41px] font-[700] text-[rgba(104,78,185,1)] flex items-center gap-2">
        Productivity Report
        <InfoTooltip text="Detailed insights into individual and team productivity" />
      </h1>

      <p className="text-[28px] text-[rgba(174,174,174,1)] font-[600]">Company</p>

      <div className="flex gap-7 mt-[30px] max-md:flex-col">
        <div className="flex-1 bg-white px-[22px] py-[22px] rounded-[18px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#f3f4f6]">
          <h3 className="text-center text-[16px] mb-[18px] font-[600] text-[rgba(171,171,171,1)]">Average tasks completed per week</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData} barSize={50}>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis dataKey="day" tick={false} />
              <YAxis tick={false} />
              <Tooltip />
              <Bar
                dataKey="tasks"
                fill="#a78bfa"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 bg-white px-[22px] py-[22px] rounded-[18px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#f3f4f6]">
          <h3 className="text-center text-[16px] mb-[18px] font-[600] text-[rgba(171,171,171,1)]">Hours logged vs Output</h3>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={lineChartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6850BE" stopOpacity={1} />
                  <stop offset="100%" stopColor="#EBE4FF" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tick={false} />
              <YAxis tick={false} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="hours"
                stroke="transparent"
                fill="url(#colorHours)"
                fillOpacity={1}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white px-[25px] py-[25px] rounded-[18px] shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Name</th>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Role</th>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Tasks assigned</th>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Tasks done</th>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Avg. time/task</th>
              <th className="text-left text-[rgba(104,80,190,1)] pb-3 font-[600]">Productivity score</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="flex items-center gap-2.5 py-4 border-t border-[#f3f4f6]">
                  <span className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white text-[15px] flex items-center justify-center font-[600]">{row.name[0]}</span>
                  {row.name}
                </td>
                <td className="py-4 border-t border-[#f3f4f6]"><span className="bg-[#d1fae5] text-[#065f46] px-3 py-1.25 rounded-full text-[12px] font-[600]">{row.role}</span></td>
                <td className="py-4 border-t border-[#f3f4f6]">Tasks Assigned <span className="bg-[#a78bfa] px-2.5 py-1 rounded-full text-white text-[11px] ml-2">{row.assignedCount}</span></td>
                <td className="py-4 border-t border-[#f3f4f6]">Tasks Completed <span className="bg-[#a78bfa] px-2.5 py-1 rounded-full text-white text-[11px] ml-2">{row.completedCount}</span></td>
                <td className="py-4 border-t border-[#f3f4f6]">{row.avgTime}</td>
                <td className="py-4 border-t border-[#f3f4f6] text-[#10b981] font-[700]">{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex justify-center items-center gap-[15px]">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-[14px] py-1.5 bg-[#eee] rounded text-[14px] cursor-pointer border-none font-[600] transition-all duration-200 hover:bg-[#dcdcdc] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⬅ Prev
          </button>

          <span className="text-[14px] font-[700] text-[#444]">Page {currentPage}</span>

          <button
            disabled={indexOfLast >= employees.length}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-[14px] py-1.5 bg-[#eee] rounded text-[14px] cursor-pointer border-none font-[600] transition-all duration-200 hover:bg-[#dcdcdc] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductivityReport;

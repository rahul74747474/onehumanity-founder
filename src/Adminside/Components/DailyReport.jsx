import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { InfoTooltip } from "./InfoTooltip";

/* =========================
   DATE HELPERS (IST SAFE)
========================= */
const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const startOfTodayIST = () => {
  const d = new Date();
  const ist = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  ist.setHours(0, 0, 0, 0);
  return ist;
};

const getLastNDaysIST = (n) => {
  const out = [];
  const today = startOfTodayIST();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(toISTDateKey(d));
  }
  return out;
};

const makeWeekBuckets = (dates) => {
  const weeks = [];
  let idx = 1;

  for (let i = 0; i < dates.length; i += 7) {
    const chunk = dates.slice(i, i + 7);
    const start = chunk[0];
    const end = chunk[chunk.length - 1];

    weeks.push({
      label: `W${idx} (${start.slice(5)}→${end.slice(5)})`,
      dates: chunk,
    });
    idx++;
  }

  return weeks;
};

/* =========================
   COMPONENT
========================= */
export default function DailyReport() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [selectedUser, setSelectedUser] = useState("all");
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
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
      try {
        setLoading(true);
        const res = await axios.get(
          "https://backonehf.onrender.com/api/v1/admin/getalluser",
          { withCredentials: true }
        );
        setUsers(res.data.message || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://backonehf.onrender.com/api/v1/admin/getreports",
        { withCredentials: true }
      );
      setReports(res.data.message || []);
    })();
  }, []);

  /* =========================
     RANGE DATES
  ========================= */
  const rangeDatesArr = useMemo(
    () => getLastNDaysIST(rangeDays),
    [rangeDays]
  );

  /* =========================
     COMPANY LEVEL CHART
  ========================= */
  const companyChartData = useMemo(() => {
    const map = new Map();

    metrics.forEach((m) => {
      const key = toISTDateKey(m.date);
      map.set(key, m);
    });

    const expectedPerDay = users.length || 1;

    return rangeDatesArr.map((d) => {
      const m = map.get(d);
      const submitted = m?.reportsSubmitted || 0;
      const pct = expectedPerDay
        ? Math.round((submitted / expectedPerDay) * 100)
        : 0;

      return {
        date: d,
        submitted,
        expected: expectedPerDay,
        pct,
      };
    });
  }, [metrics, users, rangeDatesArr]);

  /* =========================
     EMPLOYEE WEEKLY CHART
  ========================= */
  const employeeWeeklyChartData = useMemo(() => {
    if (selectedUser === "all") return [];

    const userReports = reports.filter(
      (r) =>
        String(r.user) === String(selectedUser) &&
        rangeDatesArr.includes(toISTDateKey(r.date))
    );

    const weeks = makeWeekBuckets(rangeDatesArr);

    return weeks.map((w) => {
      const submitted = userReports.filter((r) =>
        w.dates.includes(toISTDateKey(r.date))
      ).length;

      const expected = w.dates.length;
      const pct = expected ? Math.round((submitted / expected) * 100) : 0;

      return {
        label: w.label,
        submitted,
        expected,
        pct,
      };
    });
  }, [selectedUser, reports, rangeDatesArr]);

  /* =========================
     CHART DATA (FINAL)
  ========================= */
  const chartData = useMemo(() => {
    if (selectedUser === "all") {
      return companyChartData.map((d) => ({
        name: d.date.slice(5),
        value: d.pct,
      }));
    }

    return employeeWeeklyChartData.map((w) => ({
      name: w.label,
      value: w.pct,
    }));
  }, [selectedUser, companyChartData, employeeWeeklyChartData]);

  /* =========================
     SUMMARY
  ========================= */
  const summary = useMemo(() => {
    const src =
      selectedUser === "all"
        ? companyChartData
        : employeeWeeklyChartData;

    const totalSubmitted = src.reduce((s, x) => s + x.submitted, 0);
    const totalExpected = src.reduce((s, x) => s + x.expected, 0);

    const avgPct = totalExpected
      ? Math.round((totalSubmitted / totalExpected) * 100)
      : 0;

    return {
      avgPct,
      totalSubmitted,
      totalExpected,
      missing: Math.max(0, totalExpected - totalSubmitted),
    };
  }, [selectedUser, companyChartData, employeeWeeklyChartData]);

  if (loading) {
    return (
      <div className="px-9 py-7 bg-[#fafafa] min-h-screen text-[#333]">
        <div className="py-10 text-center font-[600] text-[#666]">Loading...</div>
      </div>
    );
  }

  /* =========================
     JSX (TAILWIND STYLED)
  ========================= */
  return (
    <div className="px-9 py-7 bg-[#fafafa] min-h-screen text-[#333]">
      <h1 className="mb-5 text-[#6b46c1] text-[28px] font-[700] flex items-center gap-2">
        Daily Report Submission
        <InfoTooltip text="Trend of daily work report submissions over time" />
      </h1>

      <div className="flex items-center justify-between gap-4 mb-[18px]">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-1.5">
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-2.5 py-2 rounded-[10px] border border-[#e9e9e9] bg-white min-w-[200px] shadow-[0_4px_18px_rgba(12,12,12,0.03)] text-[14px] cursor-pointer"
            >
              <option value="all">All employees (company)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} — {u.designation?.name || "No role"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <select
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
              className="px-2.5 py-2 rounded-[10px] border border-[#e9e9e9] bg-white min-w-[200px] shadow-[0_4px_18px_rgba(12,12,12,0.03)] text-[14px] cursor-pointer"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[14px] px-[18px] py-[18px] shadow-[0_8px_28px_rgba(16,16,16,0.06)] mb-[18px] border border-[rgba(220,220,220,0.6)]">
        <div className="mb-2">
          <h3 className="m-0 text-[#333] font-[600] text-[16px] text-center">
            {selectedUser === "all"
              ? "[ Submission Rate (%) Over Time ]"
              : `Weekly submission rate for ${
                  users.find((u) => u._id === selectedUser)?.name || ""
                }`}
          </h3>
        </div>

        <div className="w-full" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6850BE" stopOpacity={1} />
                  <stop offset="100%" stopColor="#EBE4FF" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6850BE"
                fill="url(#grad)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 bg-gradient-to-b from-[#fbf8ff] to-[#f4efff] rounded-[12px] px-[18px] py-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_rgba(16,16,16,0.04)] border border-[rgba(200,185,255,0.25)]">
        <h3 className="m-0 mb-2 text-[#6b46c1] font-[700]">Summary (Last {rangeDays} days)</h3>
        <div className="flex gap-3 items-center pt-2">
          <div className="flex-1 text-[#6b6b6b]">
            <p className="my-2.5">Average Submission Rate :</p>
            <p className="my-2.5">Total Reports Expected :</p>
            <p className="my-2.5">Total Reports Submitted :</p>
            <p className="my-2.5">Missing Reports :</p>
          </div>
          <div className="w-[150px] text-right">
            <p className="my-2.5 font-[700] text-[#222] text-[16px]">{summary.avgPct}%</p>
            <p className="my-2.5 font-[700] text-[#222] text-[16px]">{summary.totalExpected}</p>
            <p className="my-2.5 font-[700] text-[#222] text-[16px]">{summary.totalSubmitted}</p>
            <p className="my-2.5 font-[700] text-[#222] text-[16px]">{summary.missing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

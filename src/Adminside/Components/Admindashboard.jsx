import React, { useEffect, useState, useMemo } from 'react'
import {
  UserPlus, Plus, Users, DollarSign,
  GraduationCap, FolderKanban,
  TriangleAlert, X, ChevronUp, ChevronDown
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tag } from "primereact/tag";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Createtaskmodal from './Createtaskmodal';
import { InfoTooltip } from './InfoTooltip';

/* ================= IST HELPERS ================= */
const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const getYesterdayISTKey = () => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  d.setDate(d.getDate() - 1);
  return toISTDateKey(d);
};

const getLast7DaysIST = () => {
  const days = [];
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  today.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      key: toISTDateKey(d),
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "Asia/Kolkata"
      })
    });
  }
  return days;
};

function Admindashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }, []);


  /* ================= STATES ================= */
  const [overlay, setoverlay] = useState(false);
  const [taskmodal, setTaskmodal] = useState(false);
  const [projects, setprojects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [redflags, setredflags] = useState([]);
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const fullName = `${firstName} ${lastName}`.trim();

  const [data, setData] = useState([]);
  const [activegraph, setActivegraph] = useState("monthly");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [user, setUser] = useState("");

  const [designation, setDesignation] = useState("");
const [salary, setSalary] = useState("");
const [aadhar, setAadhar] = useState("");
const [pan, setPan] = useState("");
const [accountNo, setAccountNo] = useState("");
const [ifsc, setIfsc] = useState("");
const [status, setStatus] = useState("Onboarding");

  const itemsPerPage = 5;
const handleactivepaid = () => {
  return employees?.filter(
    e => e.status === "Active & Paid"
  )?.length || 0;
};

const handleactiveunpaid = () => {
  return employees?.filter(
    e => e.status === "Active & Unpaid"
  )?.length || 0;
};


  useEffect(() => {
    axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`, { withCredentials: true })
      .then(res => setEmployees(res.data.message || []));
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get("https://backonehf.onrender.com/api/v1/admin/getuser", { withCredentials: true })
      console.log(response.data.message)
      setUser(response.data.message)
    })()
  }, []);

  useEffect(() => {
    axios.get(`https://backonehf.onrender.com/api/v1/admin/getallproject`)
      .then(res => setprojects(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://backonehf.onrender.com/api/v1/admin/getmetrics`)
      .then(res => setMetrics(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://backonehf.onrender.com/api/v1/admin/getredflags`)
      .then(res => setredflags(res.data.message || []));
  }, [employees]);

  const weeklyDynamicData = useMemo(() => {
    const days = getLast7DaysIST();
    return days.map(d => {
      const m = metrics.find(x => toISTDateKey(x.date) === d.key);
      return { name: d.label, value: m?.reportsSubmitted || 0 };
    });
  }, [metrics]);

  useEffect(() => {
    setData(weeklyDynamicData);
  }, [weeklyDynamicData]);

  const handleDaily = () => {
    setActivegraph("daily");
    setData(weeklyDynamicData);
  };
  const handleWeekly = () => {
    setActivegraph("weekly");
    setData(weeklyDynamicData);
  };
  const handleMonthly = () => {
    setActivegraph("monthly");
    setData(weeklyDynamicData);
  };

  /* ================= RED FLAGS ================= */
  const getYesterdayRedFlags = () => {
    const key = getYesterdayISTKey();
    return redflags.filter(r => toISTDateKey(r.date) === key);
  };

  const redflagdetail = (id) =>
    employees.find(e => e._id.toString() === id)?.name || "-";

  /* ================= PAGINATION ================= */
  const sortedEmployees = [...employees].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColorMap = {
    "Active & Paid": "bg-[rgba(220,252,231,1)] text-[rgba(0,130,54,1)]",
    "Active & Unpaid": "bg-[#fef3c7] text-[#92400e]",
    "Inactive": "bg-[#fee2e2] text-[#991b1b]",
    "Onboarding": "bg-[#e0e7ff] text-[#3730a3]",
  };

  const severityColorMap = {
    "high": "bg-[rgba(255,226,226,1)] text-[rgba(193,0,7,1)] border border-[rgba(255,201,201,1)]",
    "medium": "bg-[rgba(254,243,198,1)] text-[rgba(187,77,0,1)] border border-[rgba(254,230,133,1)]",
    "low": "bg-[rgba(219,234,254,1)] text-[rgba(20,71,230,1)] border border-[rgba(190,219,255,1)]",
  };

const handleaddu = async () => {
  try {
    setLoading(true);

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      password,

      status,

      designation: {
        name: designation || "Employee"
      },

      salary: {
        amount: Number(salary) || 0
      },

      documents: {
        aadhar: aadhar || "",
        pan: pan || ""
      },

      bankdetails: {
        accountno: accountNo || null,
        ifsc: ifsc || ""
      },

      onboarding: {
        status: "Incomplete"
      }
    };

    await axios.post(
      "http://localhost:5000/api/v1/admin/addemployee",
      payload,
      { withCredentials: true }
    );


    toast.success("Employee added successfully");
    setoverlay(false);

    // 🔄 Refresh employees
    const res = await axios.get(
      "https://backonehf.onrender.com/api/v1/admin/getalluser",
      { withCredentials: true }
    );
    setEmployees(res.data.message || []);

    // 🧹 reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setDesignation("");
    setSalary("");
    setAadhar("");
    setPan("");
    setAccountNo("");
    setIfsc("");

  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};



  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  /* ================= JSX ================= */
  return (
    <>
      <style>{`
        .dashboard-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dashboard-card:hover {
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
          border-color: currentColor;
        }
        .graph-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .graph-card:hover {
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }
        .red-flag-item {
          transition: all 0.2s ease-in-out;
        }
        .red-flag-item:hover {
          box-shadow: 0 8px 16px rgba(15, 23, 42, 0.06);
        }
        .table-row {
          transition: background-color 0.2s ease-in-out;
        }
        .table-row:hover {
          background-color: #f8fafc;
        }
        .btn-primary {
          transition: all 0.2s ease-in-out;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(104, 80, 190, 0.2);
        }
        .btn-secondary {
          transition: all 0.2s ease-in-out;
        }
        .btn-secondary:hover {
          background-color: #f3f4f6;
        }
      `}</style>
      <div className="w-full px-6 sm:px-4 py-6 sm:py-4 bg-gradient-to-b from-[#f7f8ff] via-[#f9f9ff] to-[#f8fafc] min-h-screen">
        <div className="flex justify-between items-center mb-6 gap-4 max-md:flex-col max-md:items-start">
          <div className="flex flex-col gap-2">
            <div className="text-[#6850BE] text-2xl sm:text-xl font-semibold">{getGreeting()}, {user?.name?.split(" ")[0]}!</div>
            <div className="text-[#45556C] text-sm">Here's what's happening today.</div>
          </div>
          <div className="flex items-center gap-3 sm:gap-2">
            <button
              className="btn-primary px-4 py-2.5 bg-[#6850BE] text-white font-medium text-sm rounded-lg border border-[#0000001A] flex items-center gap-2 cursor-pointer"
              onClick={() => { setoverlay(true) }}
            >
              <UserPlus size={16} /><span className="hidden sm:inline">Add Employee</span><span className="sm:hidden">Add</span>
            </button>
            <button
              className="btn-secondary px-4 py-2.5 bg-white text-black font-medium text-sm rounded-lg border border-[#E5E7EB] flex items-center gap-2 cursor-pointer"
              onClick={() => { setTaskmodal(true) }}
            >
              <Plus size={16} /><span className="hidden sm:inline">Assign Task</span><span className="sm:hidden">Task</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            data-aos="fade-up"
  className="dashboard-card bg-white/70 backdrop-blur-xl
  border border-white/40 rounded-2xl
  shadow-[0_8px_30px_rgba(104,80,190,0.08)]
  p-6 flex justify-between cursor-pointer
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(104,80,190,0.15)]"
            onClick={() => { navigate("/employees") }}
          >
            <div className="flex flex-col gap-3">
              <div className="text-[#45556C] text-xs flex items-center gap-1">
                Total Employees
                <InfoTooltip text="Total number of registered employees in the organization" />
              </div>
              <div className="text-[#0F172B] text-lg font-semibold">{employees?.length}</div>
            </div>
            <div className="w-10 h-10 bg-[rgba(0,82,204,0.08)] rounded-lg flex justify-center items-center text-[#6850BE]">
              <Users size={20} />
            </div>
          </div>

          {/* Card 2 */}
          <div
            data-aos="fade-up"
  className="dashboard-card bg-white/70 backdrop-blur-xl
  border border-white/40 rounded-2xl
  shadow-[0_8px_30px_rgba(104,80,190,0.08)]
  p-6 flex justify-between cursor-pointer
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(104,80,190,0.15)]" onClick={() =>
              navigate("/employees", {
                state: {
                  tab: "onboarding",
                  status: "Active & Paid"
                }
              })
            }
          >
            <div className="flex flex-col gap-3">
              <div className="text-[#45556C] text-xs flex items-center gap-1">
                Active & Paid
                <InfoTooltip text="Employees currently active and paid in the current cycle" />
              </div>
              <div className="text-[#0F172B] text-lg font-semibold">{handleactivepaid()}</div>
            </div>
            <div className="w-10 h-10 bg-[#E6F6F1] rounded-lg flex justify-center items-center text-[#00A63E]">
              <DollarSign size={20} />
            </div>
          </div>

          {/* Card 3 */}
          <div
           data-aos="fade-up"
  className="dashboard-card bg-white/70 backdrop-blur-xl
  border border-white/40 rounded-2xl
  shadow-[0_8px_30px_rgba(104,80,190,0.08)]
  p-6 flex justify-between cursor-pointer
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(104,80,190,0.15)]" onClick={() =>
              navigate("/employees", {
                state: {
                  status: "Active & UnPaid"
                }
              })
            }
          >
            <div className="flex flex-col gap-3">
              <div className="text-[#45556C] text-xs flex items-center gap-1">
                Active & Unpaid
                <InfoTooltip text="Employees currently active but pending payment status" />
              </div>
              <div className="text-[#0F172B] text-lg font-semibold">{handleactiveunpaid()}</div>
            </div>
            <div className="w-10 h-10 bg-[#FFF4E5] rounded-lg flex justify-center items-center text-[#FF7A00]">
              <GraduationCap size={20} />
            </div>
          </div>

          {/* Card 4 */}
          <div
data-aos="fade-up"
  className="dashboard-card bg-white/70 backdrop-blur-xl
  border border-white/40 rounded-2xl
  shadow-[0_8px_30px_rgba(104,80,190,0.08)]
  p-6 flex justify-between cursor-pointer
  transition-all duration-300
  hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(104,80,190,0.15)]"  onClick={() => { navigate("/projects") }}
          >
            <div className="flex flex-col gap-3">
              <div className="text-[#45556C] text-xs flex items-center gap-1">
                Total Projects
                <InfoTooltip text="Projects currently running with active tasks assigned" />
              </div>
              <div className="text-[#0F172B] text-lg font-semibold">{projects?.length}</div>
            </div>
            <div className="w-10 h-10 bg-[rgba(139,92,246,0.08)] rounded-lg flex justify-center items-center text-[#6850BE]">
              <FolderKanban size={20} />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-6 w-full max-md:flex-col">
          {/* Graph Left */}
          <div className="graph-card w-2/3 sm:w-full min-h-[350px] bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="border-b border-[#E2E8F0] flex items-center justify-between px-6 py-5">
              <div className="text-base text-[#0F172B] font-medium flex items-center gap-2">
                Company Report
                <InfoTooltip text="Consolidated view of company-wide productivity and activity" />
              </div>
            </div>

            {/* Horizontal scroll container */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="10%" stopColor="#7C3AED" stopOpacity={0.4} />
                        <stop offset="90%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9CA3AF" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#7C3AED"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>


          {/* Graph Right */}
         <div
  data-aos="fade-left"
  data-aos-delay="200"
  className="graph-card w-1/3 sm:w-full h-[350px]
  bg-white/70 backdrop-blur-xl border border-white/40
  rounded-2xl shadow-lg flex flex-col overflow-hidden"
>
            <div className="px-6 py-5 border-b border-[#E2E8F0] text-base text-[#0F172B] flex items-center gap-2">
              <TriangleAlert color='#FB2C36' size={20} />
              <span>Red Flags</span>
              <InfoTooltip text="Employees with missed reports, prolonged inactivity, or overdue tasks" />
            </div>

            <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
              {getYesterdayRedFlags().length === 0 ? (
                <div className="text-center py-8 text-[#45556C]">
                  🎉 No red flags detected yesterday
                </div>
              ) : (
                getYesterdayRedFlags().map((e, id) => (
                  <div
                    key={id}
                   className="red-flag-item w-full p-4 bg-white/60 backdrop-blur-md
border border-white/40 rounded-xl flex justify-between gap-3
transition-all duration-300 hover:shadow-md hover:-translate-y-[1px]"
onClick={() => navigate(`/employee/${e.userId}`)}
                  >
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="text-[#45556C] text-xs mb-1 truncate">
                        {redflagdetail(e?.userId?.toString())}
                      </div>
                      <div className="text-[#45556C] text-xs">
                        {new Date(e.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap flex items-center ${severityColorMap[e.severity]}`}>
                      {e.severity}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Table Container */}
       <div
  data-aos="fade-up"
  data-aos-delay="250"
  className="mt-6 bg-white/70 backdrop-blur-xl
  border border-white/40 rounded-2xl shadow-lg overflow-hidden"
>

          <div className="px-6 py-5 border-b border-[#E2E8F0]">
            <div className="text-lg text-[#0F172B] font-semibold">Recent Employees</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-[#f8fafc]">
                <tr className="border-b border-[#E2E8F0]">
                  <th
                    className="text-left px-6 py-4 text-sm font-semibold text-[#475569] cursor-pointer hover:bg-[#f1f5f9] transition-colors"
                    onClick={() =>
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                    }
                  >
                    Employee {sortOrder === "desc" ? "↓" : "↑"}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#475569]">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#475569]">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#475569]">Projects</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#475569]">Issues</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#475569]">Tasks</th>
                </tr>
              </thead>

              <tbody>
                {paginatedEmployees.map((row) => (
                  <tr key={row._id} data-aos="fade-up" data-aos-delay="50" className=" table-row border-b border-[#E2E8F0]" onClick={() => navigate(`/employee/${row._id}`)}>
                    <td className="px-6 py-4 text-sm text-[#0f172a]">{row.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1.5 rounded text-xs font-medium ${statusColorMap[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0f172a]">{row.role}</td>
                    <td className="px-6 py-4 text-sm text-[#0f172a]">{row.Projects?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-[#0f172a]">{row.issues || 0}</td>
                    <td className="px-6 py-4 text-sm text-[#0f172a]">{row.Tasks?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-center py-4 px-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-black cursor-pointer hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1.5 border rounded-lg text-sm cursor-pointer transition-colors ${currentPage === i + 1 ? 'bg-[#6850BE] text-white border-[#6850BE]' : 'border-[#e5e7eb] text-black hover:bg-gray-50'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-black cursor-pointer hover:bg-[#f3f4f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {overlay && (
  <div
    className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50"
    onClick={() => setoverlay(false)}
  >
    <div
      className="w-full max-w-3xl bg-white rounded-xl p-8 sm:p-6 relative font-sans max-h-[90vh] overflow-auto shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE */}
      <button
        className="absolute top-6 right-6 text-[#6d5bd0] hover:text-[#5a4099]"
        onClick={() => setoverlay(false)}
      >
        <X size={24} />
      </button>

      {/* TITLE */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[#e5e7eb]" />
        <h2 className="text-2xl text-[#6d5bd0] font-semibold whitespace-nowrap">
          Add Employee
        </h2>
        <div className="flex-1 h-px bg-[#e5e7eb]" />
      </div>

      <style>{`
        .form-input {
          transition: all 0.2s ease-in-out;
        }
        .form-input:focus {
          box-shadow: 0 0 0 3px rgba(109, 91, 208, 0.1);
          border-color: #6d5bd0;
        }
      `}</style>

      {/* ================= BASIC INFO ================= */}
      <p className="text-[#6d5bd0] font-semibold mb-4">Basic Information</p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-6">
        <input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
        <input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
      </div>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8] mb-6"
      />

      <input
        type="password"
        placeholder="Temporary Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8] mb-8"
      />

      {/* ================= EMPLOYMENT ================= */}
      <p className="text-[#6d5bd0] font-semibold mb-4">Employment Details</p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-8">
        <select
  value={designation}
  onChange={(e) => setDesignation(e.target.value)}
  className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8] bg-white"
>
  <option value="">Select Designation</option>
  <option value="Administrator">Administrator</option>
  <option value="Manager">Manager</option>
  <option value="HR">HR</option>
  <option value="Employee">Employee</option>
  <option value="Intern">Intern</option>
</select>

        <input
          type="number"
          placeholder="Monthly Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
      </div>

      {/* ================= DOCUMENTS ================= */}
      <p className="text-[#6d5bd0] font-semibold mb-4">Documents</p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-8">
        <input
          placeholder="Aadhar Number"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
        <input
          placeholder="PAN Number"
          value={pan}
          onChange={(e) => setPan(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
      </div>

      {/* ================= BANK ================= */}
      <p className="text-[#6d5bd0] font-semibold mb-4">Bank Details</p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-10">
        <input
          placeholder="Account Number"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
        <input
          placeholder="IFSC Code"
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value)}
          className="form-input w-full px-4 py-3 rounded-lg border-2 border-[#d5cde8]"
        />
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex justify-end">
        <button
          className="btn-primary bg-[#6d5bd0] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5a4099]"
          onClick={handleaddu}
        >
          {loading ? "Adding..." : "Save Employee →"}
        </button>
      </div>
    </div>
  </div>
)}


      {/* TASK MODAL */}
      {taskmodal && <Createtaskmodal modal={taskmodal} setModal={setTaskmodal} projects={projects} users={employees} />}
    </>
  );
}

export default Admindashboard;

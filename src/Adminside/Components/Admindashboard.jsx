import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  DollarSign,
  GraduationCap,
  FolderKanban,
  TriangleAlert,
  X,
  ChevronDown,
  Info,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Search,
  Plus
} from "lucide-react";
import {
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import { toast } from 'react-toastify';
import { useNavigate, MemoryRouter } from 'react-router-dom';

/**
 * ----------------------------------------------------------------------
 * DESIGN SYSTEM & UTILS
 * ----------------------------------------------------------------------
 */
const COLORS = {
  primary: '#33204C',
  primarySoft: '#ede9fe',
  border: '#ddd6fe',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  bg: '#f6f7fb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

// Mock Data for Fallback (Pre-API load)
const MOCK_GRAPH_DATA = [
  { name: "Mon", assigned: 18, completed: 14 },
  { name: "Tue", assigned: 22, completed: 17 },
  { name: "Wed", assigned: 15, completed: 15 },
  { name: "Thu", assigned: 20, completed: 13 },
  { name: "Fri", assigned: 16, completed: 12 },
  { name: "Sat", assigned: 10, completed: 8 },
  { name: "Sun", assigned: 6, completed: 5 },
];

const MOCK_RED_FLAGS = [
  { _id: "rf_001", employeeName: "Rohit Sharma", reason: "Daily report not submitted", severity: "high", type: "report", warningSent: false },
  { _id: "rf_002", employeeName: "Neha Verma", reason: "Task overdue by 2 days", severity: "medium", type: "task", warningSent: true },
  { _id: "rf_003", employeeName: "Aman Gupta", reason: "No activity logged", severity: "low", type: "attendance", warningSent: false },
];

const MOCK_REPORT_HISTORY = [
  { id: "e1", name: "Rohit Sharma", role: "Developer", history: [true, true, false, true, true, true, false, false, true, true] },
  { id: "e2", name: "Neha Verma", role: "Designer", history: [true, false, true, true, true, true, true, true, false, true] },
  { id: "e3", name: "Aman Gupta", role: "Intern", history: [false, false, true, true, false, true, true, false, true, true] },
];

/**
 * ----------------------------------------------------------------------
 * UI COMPONENTS
 * ----------------------------------------------------------------------
 */

const Card = ({ children, className = "" }) => (
  <div className={`bg-white/80 backdrop-blur-xl border border-[#ddd6fe]/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', onClick, className = "", disabled }) => {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-[#33204C] text-white hover:bg-[#2a1a40] shadow-md hover:shadow-lg",
    secondary: "bg-white text-gray-700 border border-[#ddd6fe] hover:bg-[#ede9fe] hover:text-[#33204C]",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

const StatCard = ({ label, value, icon: Icon, colorClass, subtext, onClick }) => (
  <Card className="p-5 flex items-center justify-between group cursor-pointer hover:-translate-y-1 relative overflow-hidden" >
    {/* Background decoration */}
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 ${colorClass}`} />

    <div className="flex items-center gap-4 relative z-10" onClick={onClick}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass.replace('bg-', 'bg-opacity-10 text-')} bg-opacity-10`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-0.5">{label}</p>
        <h3 className="text-2xl font-bold text-[#33204C]">{value}</h3>
      </div>
    </div>

    {subtext && (
      <div className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">
        {subtext}
      </div>
    )}
  </Card>
);

const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-1">
    <Info size={12} className="text-gray-400 hover:text-[#33204C] transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
    </div>
  </div>
);

/**
 * ----------------------------------------------------------------------
 * MODAL COMPONENT
 * ----------------------------------------------------------------------
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#33204C]/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
          <h3 className="text-lg font-bold text-[#33204C]">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 mb-4">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const StyledInput = (props) => (
  <input
    {...props}
    className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#33204C]/20 focus:border-[#33204C] block p-3 transition-all outline-none placeholder:text-gray-400 hover:border-[#ddd6fe]"
  />
);

const StyledSelect = (props) => (
  <div className="relative">
    <select
      {...props}
      className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-[#33204C]/20 focus:border-[#33204C] block p-3 appearance-none outline-none cursor-pointer hover:border-[#ddd6fe]"
    >
      {props.children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
  </div>
);

/**
 * ----------------------------------------------------------------------
 * DASHBOARD CONTENT COMPONENT (Logic Wrapper)
 * ----------------------------------------------------------------------
 */
function DashboardContent() {
  const navigate = useNavigate();

  // States
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [redflags, setRedflags] = useState(MOCK_RED_FLAGS);
  const [user, setUser] = useState({ name: 'Admin User' });
  const [loading, setLoading] = useState(false);

  // UI States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [graphData, setGraphData] = useState(MOCK_GRAPH_DATA);

  // Form States
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    designation: '', salary: '', aadhar: '', pan: '',
    accountNo: '', ifsc: ''
  });

  // Helpers
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleActivePaid = () => employees?.filter(e => e.status === "Active & Paid")?.length || 0;
  const handleActiveUnpaid = () => employees?.filter(e => e.status === "Active & Unpaid")?.length || 0;

  // Effects
  useEffect(() => {
    // Simulating data load with safer mock data
    const timer = setTimeout(() => {
      setEmployees(Array(15).fill({ status: 'Active & Paid' }));
      setProjects(Array(12).fill({ id: 1, name: 'Project' }));
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSendWarning = async (flagId) => {
    // API Call simulation
    // if (toast) toast.success("⚠️ Warning email sent successfully");
    setRedflags(prev => prev.map(f => f._id === flagId ? { ...f, warningSent: true } : f));
  };

  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // if (toast) toast.success("Employee added successfully");
      setIsAddUserOpen(false);
      setFormData({}); // Reset
    } catch (error) {
      // if (toast) toast.error("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 font-sans selection:bg-[#33204C] selection:text-white" style={{ backgroundColor: COLORS.bg }}>

      {/* 1. Header Section */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#ddd6fe] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div>
              <h1 className="text-2xl font-bold text-[#33204C] tracking-tight">
                Admin Overview
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Company performance and critical updates
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-[#ede9fe]/50 px-3 py-1.5 rounded-lg border border-[#ddd6fe]">
                <Calendar size={14} className="text-[#33204C]" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Employees"
            value={employees.length || 0}
            icon={Users}
            colorClass="bg-blue-600"
            subtext="+3 this week"
            onClick={() => navigate("/employees")}
          />
          <StatCard
            label="Active Tasks"
            value={handleActivePaid() || 0}
            icon={DollarSign}
            colorClass="bg-emerald-600"
            onClick={() => navigate("/employees", { state: { status: "Active & Paid" } })}
          />
          <StatCard
            label="Reports Submitted Today"
            value={handleActiveUnpaid() || 0}
            icon={GraduationCap}
            colorClass="bg-orange-500"
            subtext="Action needed"
            onClick={() => navigate("/employees", { state: { status: "Active & Unpaid" } })}
          />
          <StatCard
            label="Critical Flags"
            value={projects.length || 0}
            icon={FolderKanban}
            colorClass="bg-purple-600"
            onClick={() => navigate("/projects")}
          />
        </div>

        {/* 3. Main Chart Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Chart */}
          <Card className="w-full p-6 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#33204C] flex items-center gap-2">
                  Daily Task Report
                  <InfoTooltip text="Tasks assigned vs completed over the last 7 days" />
                </h3>
                <p className="text-sm text-gray-500">Performance Overview</p>
              </div>
              {/* Custom Legend */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#33204C]"></span> Assigned
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <span className="w-3 h-3 rounded-full bg-[#ddd6fe]"></span> Completed
                </div>
              </div>
            </div>

            <div className="flex-1 w-full h-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={graphData} barGap={8} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(51,32,76,0.03)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar
                    dataKey="assigned"
                    fill="#33204C"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#ddd6fe"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Red Flags Summary List */}
          <Card className="w-full p-0 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
              <h3 className="text-lg font-bold text-[#33204C] flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Critical Issues
              </h3>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{redflags.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <div className="col-span-3">Employee</div>
                <div className="col-span-5">Issue</div>
                <div className="col-span-2">Severity</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              {redflags.map((flag) => (
                <div
                  key={flag._id}
                  className="grid grid-cols-12 items-center gap-3 px-4 py-2.5 border border-red-100 bg-white rounded-lg hover:bg-red-50/40 transition"
                >
                  {/* Employee */}
                  <div className="col-span-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {flag.employeeName}
                    </p>
                    <p className="text-xs text-gray-500">{flag.type}</p>
                  </div>

                  {/* Reason */}
                  <div className="col-span-5 text-sm text-gray-600 truncate">
                    {flag.reason}
                  </div>

                  {/* Severity */}
                  <div className="col-span-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${flag.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {flag.severity}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => handleSendWarning(flag._id)}
                      disabled={flag.warningSent}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium ${flag.warningSent
                        ? "bg-gray-100 text-gray-400"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                    >
                      {flag.warningSent ? "Sent" : "Warn"}
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </Card>
        </div>

        {/* 4. Report Discipline Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-[#33204C]">Report Discipline</h3>
              <p className="text-sm text-gray-500">Submission consistency over the last 10 days</p>
            </div>
            <Button variant="secondary" className="text-xs h-8">View All Reports</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Consistency</th>
                  <th className="px-6 py-4 text-center">Missed</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_REPORT_HISTORY.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#33204C]">{row.name}</td>
                    <td className="px-6 py-4 text-gray-500">{row.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 justify-center">
                        {row.history.map((status, i) => (
                          <div
                            key={i}
                            className={`w-2 h-8 rounded-full ${status ? 'bg-emerald-200' : 'bg-red-200'} opacity-80`}
                            title={status ? 'Submitted' : 'Missed'}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.history.filter(x => !x).length > 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {row.history.filter(x => !x).length}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-[#33204C] p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <TriangleAlert size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </main>

      {/* 5. Add Employee Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Employee"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-[#33204C] font-semibold mb-4 flex items-center gap-2">
              <Users size={18} /> Basic Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="First Name">
                <StyledInput
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
              </InputGroup>
              <InputGroup label="Last Name">
                <StyledInput
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </InputGroup>
            </div>
            <InputGroup label="Email Address">
              <StyledInput
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </InputGroup>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-[#33204C] font-semibold mb-4 flex items-center gap-2">
              <FolderKanban size={18} /> Role & Salary
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Designation">
                <StyledSelect
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                >
                  <option value="">Select Role...</option>
                  <option value="Admin">Administrator</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                  <option value="Intern">Intern</option>
                </StyledSelect>
              </InputGroup>
              <InputGroup label="Monthly Salary (₹)">
                <StyledInput
                  type="number"
                  placeholder="0.00"
                  value={formData.salary}
                  onChange={e => setFormData({ ...formData, salary: e.target.value })}
                />
              </InputGroup>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-[#33204C] font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={18} /> Banking Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Account Number">
                <StyledInput
                  placeholder="XXXXXXXXXXXX"
                  value={formData.accountNo}
                  onChange={e => setFormData({ ...formData, accountNo: e.target.value })}
                />
              </InputGroup>
              <InputGroup label="IFSC Code">
                <StyledInput
                  placeholder="ABCD0001234"
                  value={formData.ifsc}
                  onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                />
              </InputGroup>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddEmployee} disabled={loading}>
              {loading ? "Adding..." : "Save Employee"}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

// Wrapper for preview environment to provide Router context
export default function Admindashboard() {
  return (
    <DashboardContent />
  );
}
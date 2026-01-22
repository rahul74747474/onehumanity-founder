import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  UserPlus,
  X,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

function CustomDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label;

  return (
    <div className="w-full relative">
      <div
        className={`w-full px-[18px] py-[14px] rounded-[25px] flex justify-between items-center text-[15px] cursor-pointer border-2 transition-colors ${
          open ? "border-[#7C3AED]" : "border-transparent"
        }`}
        style={{ background: "white", boxShadow: open ? "0 0 5px rgba(0,0,0,0.08)" : "0 0 5px rgba(0,0,0,0.08)" }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ color: "#555" }}>{selectedLabel}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {open && (
        <div
          className="absolute w-full top-[5px] bg-white rounded-[20px] overflow-hidden z-[99]"
          style={{ boxShadow: "0 0 12px rgba(0,0,0,0.12)" }}
        >
          {options.map((opt, i) => (
            <div
              key={i}
              className="px-[18px] py-[14px] border-b border-b-[#ececec] cursor-pointer text-[15px] text-[#333] hover:bg-[#f5f5ff] transition-colors last:border-b-0"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [overlay, setoverlay] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onboardingstatus, setonboardingstatus] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [designationFilter, setDesignationFilter] = useState("All Employees");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const [showDesignationDrop, setShowDesignationDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showRoleDrop, setShowRoleDrop] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [editOverlay, setEditOverlay] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const [manager, setManager] = useState("");
  const fullName = `${firstName} ${lastName}`.trim();

  const statusOptions = [
    "Onboarding",
    "Active & Paid",
    "Active & Unpaid",
    "Inactive",
  ];
  const statusOptionsFormatted = statusOptions.map((s) => ({
    label: s,
    value: s,
  }));
  const onboardingOptions = [
    { label: "Incomplete", value: "Incomplete" },
    { label: "In-Progress", value: "In-Progress" },
    { label: "Completed", value: "Completed" },
  ];

  const roleOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "QA",
    "UI/UX Designer",
    "Devops",
    "Manager",
  ];
  const roleOptionsFormatted = roleOptions.map((r) => ({
    label: r,
    value: r,
  }));

  useEffect(() => {
    if (location.state?.status) {
      setStatusFilter(location.state.status);
      setCurrentPage(1);
    }
  }, [location.state]);

  const handleManager = useMemo(() => {
    return employees
      .filter((emp) => emp.designation?.name === "Manager")
      .map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));
  }, [employees]);

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setManager(emp?.managerAssigned?._id || "");
    setonboardingstatus(emp?.onboarding?.status || "");
    setRole(emp.role || "");
    setStatus(emp.status || "");
    setEditOverlay(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await axios.put(
        `https://backonehf.onrender.com/api/v1/admin/updateemployee`,
        { id: selectedEmployee._id, manager, onboardingstatus, role, status },
        { withCredentials: true }
      );
      toast.success("Employee Updated Successfully");
      setEditOverlay(false);
      window.location.reload();
    } catch {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get(
        `https://backonehf.onrender.com/api/v1/admin/getalluser`,
        { withCredentials: true }
      );
      setEmployees(res.data.message || []);
      setLoadingData(false);
    };
    fetchEmployees();
  }, []);

  const handleaddu = async () => {
    try {
      setLoading(true);
      await axios.post(
        `https://backonehf.onrender.com/api/v1/admin/addemployee`,
        {
          name: fullName,
          email: email,
          password: password,
          dob: dob,
          gender: gender,
        },
        { withCredentials: true }
      );

      setoverlay(false);
      toast.success("Employees Added Successfully");
      window.location.reload();
    } catch {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      const matchesDesignation =
        designationFilter === "All Employees" ||
        (designationFilter === "All HRs" &&
          emp.designation?.name === "HR") ||
        (designationFilter === "All Admins" &&
          emp.designation?.name === "admin");

      const matchesStatus =
        statusFilter === "All Status" || emp.status === statusFilter;

      const matchesRole =
        roleFilter === "All Roles" || emp.role === roleFilter;

      return (
        matchesSearch &&
        matchesDesignation &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [employees, search, designationFilter, statusFilter, roleFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / perPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const mapStatus = (status) => {
    if (!status) return "";
    if (status.includes("Active")) return "active";
    if (status === "Inactive") return "inactive";
    if (status === "Onboarding") return "onboarding";
    return "";
  };

  const statusBg = (status) => {
    const map = {
      active: "bg-[#dcfce7] text-[#008236]",
      inactive: "bg-[#eceeef] text-black",
      onboarding: "bg-[#f3e9c9] text-[#c98b0a]",
    };
    return map[mapStatus(status)] || "";
  };

  const onboardingBg = (status) => {
    const map = {
      completed: "bg-[#e0e7ff] text-[#4338ca]",
      "in-progress": "bg-[#fff7cd] text-[#c98b0a]",
      incomplete: "bg-[#fde2e4] text-[#b83232]",
    };
    const key = (status || "").replace(" ", "-").toLowerCase();
    return map[key] || "";
  };

  return (
    <>
      <div className="relative px-[70px] py-[40px] bg-[#f6f7fb] min-h-screen font-inter animate-[pageEnter_0.55s_ease-out_both]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[26px] font-semibold mb-[10px]">Employees</h2>
            <p className="text-[14px] text-[#777]">
              Manage your team members and their details
            </p>
          </div>

          <button
            className="bg-[#7c3aed] text-white px-[18px] py-[10px] rounded-[8px] border-none flex items-center gap-[8px] cursor-pointer hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] transition-all active:scale-[0.96]"
            onClick={() => setoverlay(true)}
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>

        <div className="flex flex-col rounded-[10px] mt-[30px] bg-white border border-[#e2e8f0] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
          <div className="mt-[10px] flex gap-[12px] px-[20px] items-center mb-[10px]">
            {/* SEARCH */}
            <div className="bg-[#f8fafc] border border-[#e2e8f0] px-[14px] py-[10px] rounded-[10px] flex items-center gap-[8px] w-[55%]">
              <Search size={18} color="#666" />
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="border-none bg-transparent outline-none w-full text-[14px]"
              />
            </div>

            {/* DESIGNATION FILTER */}
            <div className="relative w-[15%]">
              <button
                className="w-full px-[16px] py-[10px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-[#333] cursor-pointer flex justify-between items-center gap-[6px]"
                onClick={() => {
                  setShowDesignationDrop((p) => !p);
                  setShowStatusDrop(false);
                  setShowRoleDrop(false);
                }}
              >
                {designationFilter} <ChevronDown size={16} />
              </button>

              {showDesignationDrop && (
                <div
                  className="absolute top-[45px] left-0 w-full bg-white rounded-[10px] z-[100] overflow-hidden"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
                >
                  {["All Employees", "All HRs", "All Admins"].map((opt) => (
                    <div
                      key={opt}
                      className="px-[18px] py-[14px] border-b border-b-[#ececec] cursor-pointer text-[15px] text-[#333] hover:bg-[#f5f5ff] last:border-b-0"
                      onClick={() => {
                        setDesignationFilter(opt);
                        setShowDesignationDrop(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STATUS FILTER */}
            <div className="relative w-[15%]">
              <button
                className="w-full px-[16px] py-[10px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-[#333] cursor-pointer flex justify-between items-center gap-[6px]"
                onClick={() => {
                  setShowStatusDrop((p) => !p);
                  setShowDesignationDrop(false);
                  setShowRoleDrop(false);
                }}
              >
                {statusFilter} <ChevronDown size={16} />
              </button>

              {showStatusDrop && (
                <div
                  className="absolute top-[45px] left-0 w-full bg-white rounded-[10px] z-[100] overflow-hidden"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
                >
                  {statusOptions.map((opt) => (
                    <div
                      key={opt}
                      className="px-[18px] py-[14px] border-b border-b-[#ececec] cursor-pointer text-[15px] text-[#333] hover:bg-[#f5f5ff] last:border-b-0"
                      onClick={() => {
                        setStatusFilter(opt);
                        setShowStatusDrop(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ROLE FILTER */}
            <div className="relative w-[15%]">
              <button
                className="w-full px-[16px] py-[10px] bg-[#f8fafc] border border-[#e2e8f0] rounded-[10px] text-[#333] cursor-pointer flex justify-between items-center gap-[6px]"
                onClick={() => {
                  setShowRoleDrop((p) => !p);
                  setShowDesignationDrop(false);
                  setShowStatusDrop(false);
                }}
              >
                {roleFilter} <ChevronDown size={16} />
              </button>

              {showRoleDrop && (
                <div
                  className="absolute top-[45px] left-0 w-full bg-white rounded-[10px] z-[100] overflow-hidden"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.12)" }}
                >
                  {roleOptions.map((opt) => (
                    <div
                      key={opt}
                      className="px-[18px] py-[14px] border-b border-b-[#ececec] cursor-pointer text-[15px] text-[#333] hover:bg-[#f5f5ff] last:border-b-0"
                      onClick={() => {
                        setRoleFilter(opt);
                        setShowRoleDrop(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TABLE */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-b-[#e2e8f0]">
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Name</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Email</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Manager</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Role</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Status</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Onboarding</th>
                <th className="text-left px-[12px] py-[12px] text-[13px] text-[#666] font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.map((emp, i) => {
                const initials = emp.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr
                    key={i}
                    className="border-t border-t-[#eee] hover:bg-[rgba(124,58,237,0.04)] transition-all hover:shadow-[0_8px_20px_rgba(124,58,237,0.08)]"
                  >
                    <td className="px-[12px] py-[14px] text-[14px]">
                      <div className="flex items-center gap-[10px]" onClick={() => navigate(`/employee/${emp._id}`)}>
                        <div className="w-[36px] h-[36px] bg-[#7c3aed] text-white rounded-full flex items-center justify-center text-[14px] font-bold">
                          {initials}
                        </div>
                        {emp.name}
                      </div>
                    </td>

                    <td className="px-[12px] py-[14px] text-[14px]">{emp.email}</td>
                    <td className="px-[12px] py-[14px] text-[14px]">
                      {employees.find((e) => e._id === emp.managerAssigned)
                        ?.name || "—"}
                    </td>
                    <td className="px-[12px] py-[14px] text-[14px]">
                      {emp.role}
                    </td>

                    <td className="px-[12px] py-[14px] text-[14px]">
                      <span
                        className={`px-[10px] py-[8px] rounded-[8px] text-[12px] font-medium inline-block ${statusBg(
                          emp.status
                        )}`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="px-[12px] py-[14px] text-[14px]">
                      <span
                        className={`px-[10px] py-[8px] rounded-[8px] text-[12px] font-medium inline-block ${onboardingBg(
                          emp.onboarding?.status
                        )}`}
                      >
                        {emp.onboarding?.status}
                      </span>
                    </td>

                    <td className="px-[12px] py-[14px] text-[14px]">
                      <MoreVertical
                        size={18}
                        className="cursor-pointer text-[#777] hover:text-[#7c3aed] transition-all hover:rotate-90 transform duration-200"
                        onClick={() => handleEdit(emp)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="border-t border-t-[#e2e8f0] flex items-center justify-between text-[14px] px-[10px] py-[10px]">
            <span>
              Showing {paginatedEmployees.length} of {filteredEmployees.length}
            </span>

            <div className="flex gap-[8px]">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-[12px] py-[6px] bg-white border border-[#ddd] rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-[12px] py-[6px] rounded-[6px] cursor-pointer transition-colors ${
                    currentPage === i + 1
                      ? "bg-[#7c3aed] text-white border-none font-semibold"
                      : "bg-white border border-[#ddd] hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-[12px] py-[6px] bg-white border border-[#ddd] rounded-[6px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {overlay && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.55)] flex justify-center items-center z-[999]"
          onClick={() => setoverlay(false)}
        >
          <div
            className="w-[600px] h-[600px] overflow-auto bg-gradient-to-br from-white to-[#e9d8fd] px-[40px] py-[30px] rounded-[22px] relative"
            style={{ boxShadow: "0px 4px 30px rgba(0,0,0,0.15)", animation: "pop 0.25s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE */}
            <button
              className="absolute top-[18px] right-[18px] bg-transparent border-none cursor-pointer text-[22px]"
              onClick={() => setoverlay(false)}
            >
              <X />
            </button>

            {/* TITLE */}
            <div className="flex items-center gap-[18px] mb-[34px]">
              <div className="flex-1 h-[2px] bg-[#805ad5]" />
              <h2 className="text-[28px] font-bold text-[#6d5bd0] whitespace-nowrap">
                Add Employee
              </h2>
              <div className="flex-1 h-[2px] bg-[#805ad5]" />
            </div>

            {/* BASIC DETAILS */}
            <div className="mb-[34px]">
              <p className="mt-[12px] text-[16px] font-semibold text-[#444] mb-[20px]">
                Basic Details
                <span style={{ color: "red", margin: "0px 5px" }}>*</span>:
              </p>

              <div className="grid grid-cols-2 gap-[26px] mb-[22px]">
                <div className="relative">
                  <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                    First name
                  </span>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                  />
                </div>

                <div className="relative">
                  <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                    Last name
                  </span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                  />
                </div>
              </div>

              <div className="mb-[22px] relative">
                <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                  email ID
                </span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                />
              </div>

              <div className="relative">
                <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                />
              </div>
            </div>

            {/* OTHER DETAILS */}
            <div className="mb-[34px]">
              <p className="mt-[12px] text-[16px] font-semibold text-[#444] mb-[20px]">
                Other Details
                <span style={{ color: "red", margin: "0px 5px" }}>*</span>:
              </p>

              <div className="grid grid-cols-2 gap-[26px] mb-[22px]">
                <div className="relative">
                  <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                    Date of birth
                  </span>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                  />
                </div>

                <div className="relative">
                  <span className="absolute top-[-9px] left-[20px] bg-white px-[6px] text-[12px] text-[#8b8b8b]">
                    Gender
                  </span>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-[18px] py-[14px] rounded-[16px] border-2 border-[#6d5bd0] outline-none text-[14px]"
                  >
                    <option></option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SAVE */}
            <div className="flex justify-end mt-[30px]">
              <button
                className="bg-[#6d5bd0] text-white px-[56px] py-[14px] rounded-[32px] text-[16px] font-bold border-none cursor-pointer hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] transition-all active:scale-[0.96]"
                onClick={handleaddu}
              >
                {loading ? "Adding..." : "Save →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOverlay && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex justify-center items-center z-[999]"
          onClick={() => setEditOverlay(false)}
        >
          <div
            className="w-[500px] h-[425px] overflow-auto bg-white rounded-[14px] px-[24px] py-[24px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-[18px] right-[22px] bg-transparent border-none cursor-pointer text-[22px]"
              onClick={() => setEditOverlay(false)}
            >
              <X size={22} />
            </button>

            <h2 className="text-[24px] font-bold text-[#262626] mb-[20px]">
              Edit Details :
            </h2>

            <div className="flex flex-col gap-[16px] mt-[20px]">
              <div className="bg-[#f1f6ff] rounded-[12px] p-[16px]">
                <CustomDropdown
                  label="Manager"
                  value={manager}
                  options={handleManager}
                  onChange={setManager}
                />
              </div>

              <div className="bg-[#f1f6ff] rounded-[12px] p-[16px]">
                <CustomDropdown
                  label="Role"
                  value={role}
                  options={roleOptionsFormatted}
                  onChange={setRole}
                />
              </div>

              <div className="bg-[#f1f6ff] rounded-[12px] p-[16px]">
                <CustomDropdown
                  label="Status"
                  value={status}
                  options={statusOptionsFormatted}
                  onChange={setStatus}
                />
              </div>

              <div className="bg-[#f1f6ff] rounded-[12px] p-[16px]">
                <CustomDropdown
                  label="Onboarding Status"
                  value={onboardingstatus}
                  options={onboardingOptions}
                  onChange={setonboardingstatus}
                />
              </div>
            </div>

            <button
              className="w-full mt-[24px] px-[24px] py-[12px] bg-[#6d5bd0] text-white border-none rounded-[14px] font-bold cursor-pointer hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] transition-all active:scale-[0.96]"
              onClick={handleUpdate}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeePage; 
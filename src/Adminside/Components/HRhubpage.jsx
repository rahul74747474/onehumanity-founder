import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useLocation } from "react-router";

export default function HRhubpage() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [active, setactive] = useState("onboarding");
  const [payrollFilter, setPayrollFilter] = useState("All");
  const [payrollPage, setPayrollPage] = useState(1);
  const location = useLocation();

  const pageSize = 10;
  const payrollPageSize = 10;

  useEffect(() => {
    if (!location.state) return;

    const { tab, status } = location.state;

    if (tab === "onboarding") {
      setactive("onboarding");
    }

    if (status) {
      setActiveFilter(status);
    }
  }, [location.state]);

  useEffect(() => {
    (async () => {
      const res = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`);
      setEmployees(res.data.message);
    })();
  }, []);

  const normalizeStatus = (s = "") => {
    const v = s.toLowerCase();
    if (v === "pending") return "Incomplete";
    if (v === "in progress" || v === "inprogress") return "In Progress";
    if (v === "completed") return "Completed";
    return "Incomplete";
  };

  const payrollEmployees = useMemo(() => {
    let data = employees.filter(
      (emp) => emp.status === "Active & Paid"
    );

    if (payrollFilter === "All") return data;

    return data.filter(
      (emp) =>
        (emp.salary?.paymentstatus || "Pending") === payrollFilter
    );
  }, [employees, payrollFilter]);

  const calculateWorkdays = (completedAt) => {
    if (!completedAt) return 0;
    const start = new Date(completedAt).getTime();
    const now = Date.now();
    return Math.max(
      0,
      Math.floor((now - start) / (1000 * 60 * 60 * 24))
    );
  };

  const filteredEmployees = useMemo(() => {
    if (activeFilter === "All") return employees;

    return employees.filter((emp) => {
      const rawStatus = emp?.onboarding?.status || "Pending";
      const status = normalizeStatus(rawStatus);
      return status === activeFilter;
    });
  }, [activeFilter, employees]);

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const payrollTotalPages = Math.ceil(
    payrollEmployees.length / payrollPageSize
  );

  const payrollPaginatedData = payrollEmployees.slice(
    (payrollPage - 1) * payrollPageSize,
    payrollPage * payrollPageSize
  );

  useEffect(() => {
    setPayrollPage(1);
  }, [payrollFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const statusColorMap = {
    "Completed": "bg-[rgba(220,252,231,1)] text-[#15803d]",
    "In Progress": "bg-[rgba(236,238,242,1)] text-[rgba(3,2,19,1)]",
    "Incomplete": "border border-[rgba(255,214,167,1)] text-[rgba(245,73,0,1)]",
  };

  const paymentStatusColorMap = {
    "Completed": "bg-[#dcfce7] text-[#166534]",
    "In Progress": "bg-[#e0e7ff] text-[#3730a3]",
    "Pending": "bg-[#fff7ed] text-[#9a3412]",
  };

  const completedBadgeClass = "bg-[#e0f2fe] text-[#0369a1] px-2.5 py-1 rounded-full text-[12px]";
  const pendingBadgeClass = "bg-[#fff7ed] text-[#9a3412] px-2.5 py-1 rounded-full text-[12px]";

  return (
    <div className="px-[50px] py-[30px] bg-[#f9fafb] min-h-screen font-['Inter']">
      <div>
        <h2 className="m-0 text-[24px] font-[600]">HR Hub</h2>
        <p className="mt-1 text-[#6b7280]">Manage onboarding, payroll, and employee documentation</p>
      </div>

      <div className="mt-5 flex gap-2.5 p-1 w-fit bg-white border border-[rgba(226,232,240,1)] rounded-[14px]">
        <button
          className={`px-4 py-2 rounded-lg border-none cursor-pointer ${
            active === "onboarding"
              ? "bg-[rgba(104,78,185,1)] text-white font-[600]"
              : "bg-white text-black"
          }`}
          onClick={() => { setactive("onboarding") }}
        >
          Onboarding Status
        </button>
        <button
          className={`px-4 py-2 rounded-lg border-none cursor-pointer ${
            active === "payroll"
              ? "bg-[rgba(104,78,185,1)] text-white font-[600]"
              : "bg-white text-black"
          }`}
          onClick={() => { setactive("payroll") }}
        >
          Payroll Checklist
        </button>
      </div>

      {active === "onboarding" ? (
        <>
          <div className="mt-5 flex gap-2.5">
            {["All", "Incomplete", "In Progress", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded text-[13px] cursor-pointer ${
                  activeFilter === f
                    ? "bg-[rgba(104,78,185,1)] text-white font-[600]"
                    : "bg-white border border-[rgba(0,0,0,0.1)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-[25px] bg-white px-5 py-5 rounded-[12px] border border-[#e5e7eb]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">NAME</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">JOINING DATE</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">STATUS</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">DOCUMENTS</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((emp, i) => {
                  const rawStatus = emp?.onboarding?.status || "Pending";
                  const status = normalizeStatus(rawStatus);

                  return (
                    <tr key={i}>
                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px] flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#6d5bd0] text-white font-[600] rounded-full flex justify-center items-center text-[13px]">
                          {emp.name?.charAt(0)}
                          {emp.name?.split(" ")[1]?.charAt(0)}
                        </div>
                        <span>{emp.name}</span>
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        {new Date(emp.updatedAt).toLocaleDateString("en-IN")}
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        <span className={`px-2.5 py-1 rounded-lg text-[12px] ${statusColorMap[status] || statusColorMap["Incomplete"]}`}>
                          {status}
                        </span>
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        {emp.documents?.aadhar && emp.documents?.pan ? (
                          <span className={completedBadgeClass}>Completed</span>
                        ) : (
                          <span className={pendingBadgeClass}>Pending</span>
                        )}
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        <button className="bg-none border-none cursor-pointer text-[18px]">⋮</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-center mt-5">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className="px-3 py-1.5 rounded text-[14px] border border-[#e5e7eb] bg-white cursor-pointer hover:bg-gray-100"
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1.5 rounded text-[14px] border cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-[#4f46e5] text-white"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className="px-3 py-1.5 rounded text-[14px] border border-[#e5e7eb] bg-white cursor-pointer hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <div className="flex gap-2.5">
            {["All", "Pending", "In Progress", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setPayrollFilter(f)}
                className={`px-3 py-1.5 rounded text-[13px] cursor-pointer ${
                  payrollFilter === f
                    ? "bg-[rgba(104,78,185,1)] text-white font-[600]"
                    : "bg-white border border-[rgba(0,0,0,0.1)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="mt-[25px] bg-white px-5 py-5 rounded-[12px] border border-[#e5e7eb]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">NAME</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">WORKDAYS</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">PAYMENT STATUS</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">SALARY</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">BANK DETAILS</th>
                  <th className="text-left text-[#6b7280] pb-3 text-[13px]">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {payrollPaginatedData.map((emp, i) => {
                  const workdays = calculateWorkdays(
                    emp.onboarding?.completedAt
                  );

                  return (
                    <tr key={i}>
                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px] flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-[#6d5bd0] text-white font-[600] rounded-full flex justify-center items-center text-[13px]">
                          {emp.name?.charAt(0)}
                          {emp.name?.split(" ")[1]?.charAt(0)}
                        </div>
                        <span>{emp.name}</span>
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">{workdays}</td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-[500] ${paymentStatusColorMap[emp.salary?.paymentstatus || "Pending"]}`}>
                          {emp.salary?.paymentstatus || "Pending"}
                        </span>
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        ₹{emp.salary?.amount?.toLocaleString("en-IN") || 0}
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        {emp.bankdetails?.ifsc &&
                        emp.bankdetails?.accountno ? (
                          <span className={completedBadgeClass}>
                            Completed
                          </span>
                        ) : (
                          <span className={pendingBadgeClass}>
                            Pending
                          </span>
                        )}
                      </td>

                      <td className="py-[14px] border-t border-[#f0f0f0] text-[14px]">
                        <button className="bg-none border-none cursor-pointer text-[18px]">⋮</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-center mt-5">
            <button
              className="px-3 py-1.5 rounded text-[14px] border border-[#e5e7eb] bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50"
              disabled={payrollPage === 1}
              onClick={() => setPayrollPage((p) => p - 1)}
            >
              ‹
            </button>

            {[...Array(payrollTotalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPayrollPage(index + 1)}
                className={`px-3 py-1.5 rounded text-[14px] cursor-pointer border ${
                  payrollPage === index + 1
                    ? "bg-[#4f46e5] text-white"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-3 py-1.5 rounded text-[14px] border border-[#e5e7eb] bg-white cursor-pointer hover:bg-gray-100 disabled:opacity-50"
              disabled={payrollPage === payrollTotalPages}
              onClick={() => setPayrollPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

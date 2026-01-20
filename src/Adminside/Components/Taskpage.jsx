import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Pencil, Trash, Search, ChevronLeft, ChevronRight, X, ChevronDown, Bell } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Createtaskmodal from "./Createtaskmodal";

const PAGE_SIZE = 5;

const formatDate = (d) => {
  if (!d) return "-";
  const dt = dayjs(d);
  if (!dt.isValid()) return "-";
  return dt.format("DD-MM-YY");
};

const priorityClass = (p) => {
  const map = {
    urgent: "text-[#7f1d1d]",
    high: "text-[#e11d48]",
    medium: "text-[#f59e0b]",
    low: "text-[#10b981]",
  };
  return map[(p || "").toLowerCase()] || "text-[#9ca3af]";
};

const priorityBg = (p) => {
  const map = {
    urgent: "bg-[#fee2e2]",
    high: "bg-[#fee2e2]",
    medium: "bg-[#fef3c7]",
    low: "bg-[#dcfce7]",
  };
  return map[(p || "").toLowerCase()] || "bg-[#f3f4f6]";
};

const statusClass = (s) => {
  const map = {
    completed: "text-[#16a34a] bg-[#dcfce7]",
    done: "text-[#16a34a] bg-[#dcfce7]",
    "in progress": "text-[#0ea5e9] bg-[#cffafe]",
    inprogress: "text-[#0ea5e9] bg-[#cffafe]",
    pending: "text-[#6b7280] bg-[#f3f4f6]",
  };
  return map[(s || "").toLowerCase()] || "text-[#6b7280] bg-[#f3f4f6]";
};

const Taskpage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [taskmodal, setTaskmodal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    linkedproject: "",
    description: "",
    status: "",
    priority: "",
    employeeid: "",
    dueAt: "",
  });

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // fetch all data
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [tRes, uRes, pRes] = await Promise.all([
          axios.get(
            `https://backonehf.onrender.com/api/v1/admin/getalltask`,
            { withCredentials: true }
          ),
          axios.get(
            `https://backonehf.onrender.com/api/v1/admin/getalluser`,
            { withCredentials: true }
          ),
          axios.get(
            `https://backonehf.onrender.com/api/v1/admin/getallproject`,
            { withCredentials: true }
          ),
        ]);

        if (!mounted) return;

        setTasks(tRes.data.message || tRes.data || []);
        setUsers(uRes.data.message || uRes.data || []);
        setProjects(pRes.data.message || pRes.data || []);
      } catch (err) {
        console.error("Fetch failed", err);
        toast.error("Failed to load task manager data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  const enriched = useMemo(() => {
    const uMap = new Map(users.map((u) => [String(u._id), u]));
    const pMap = new Map(projects.map((p) => [String(p._id), p]));
    return tasks.map((t) => {
      const assigned = uMap.get(String(t.assignedto)) || null;
      const project = pMap.get(String(t.projectId)) || null;
      return {
        ...t,
        assigned,
        project,
      };
    });
  }, [tasks, users, projects]);

  const filtered = useMemo(() => {
    let data = enriched;

    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((t) => {
        const title = (t.title || "").toLowerCase();
        const assignee = (t.assigned?.name || "").toLowerCase();
        const project = (t.project?.projectname || "").toLowerCase();

        return (
          title.includes(q) ||
          assignee.includes(q) ||
          project.includes(q)
        );
      });
    }

    if (statusFilter !== "All") {
      data = data.filter(
        (t) =>
          (t.status || "").toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    if (priorityFilter !== "All") {
      data = data.filter(
        (t) =>
          (t.priority || "").toLowerCase() ===
          priorityFilter.toLowerCase()
      );
    }

    if (projectFilter !== "All") {
      data = data.filter((t) => t.project?._id === projectFilter);
    }

    return data;
  }, [enriched, query, statusFilter, priorityFilter, projectFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setForm({
      employeeid: task.assignedto || "",
      priority: task.priority || "",
      status: task.status || "",
      dueAt: task.dueAt ? dayjs(task.dueAt).format("YYYY-MM-DD") : "",
    });
    setEditModal(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}" ?`)) return;
    try {
      await axios.delete(
        `https://backonehf.onrender.com/api/v1/admin/deletetask/${task._id}`,
        { withCredentials: true }
      );
      setTasks((prev) => prev.filter((t) => String(t._id) !== String(task._id)));
      toast.success("Task deleted");
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };

  const inProgressCount = tasks.filter(
    (t) => (t.status || "").toLowerCase() === "in progress"
  ).length;

  const completedTodayCount = tasks.filter((t) => {
    return t.status === "Completed";
  }).length;

  const pendingCount = tasks.filter(
    (t) => (t.status || "").toLowerCase() === "pending"
  ).length;

  function InfoTooltip({ text }) {
    return (
      <span className="relative inline-flex items-center ml-[10px] cursor-pointer">
        <span className="w-[16px] h-[16px] rounded-full bg-[#e5e7eb] text-[#374151] text-[11px] font-bold flex items-center justify-center">
          i
        </span>
        <span className="fixed bg-[rgba(72,76,86,0.8)] text-white px-[10px] py-[8px] rounded-[6px] text-[12px] max-w-[220px] leading-[1.4] opacity-0 pointer-events-none transition-opacity duration-100 ease-in z-[99999] group-hover:opacity-100">
          {text}
        </span>
      </span>
    );
  }

  return (
    <>
      <div className="px-[26px] py-[22px] bg-[#f7f8fc] min-h-screen font-inter">
        <div className="w-full flex items-center justify-between mb-[30px]">
          <h1 className="text-[28px] font-bold text-[#6d5bd0]">Task Manager</h1>
          <button
            className="px-[12px] py-[8px] bg-[#6850BE] text-white font-medium text-[13.3px] rounded-[8px] border border-[#0000001A] flex items-center gap-[8px] cursor-pointer"
            onClick={() => {
              setTaskmodal(true);
            }}
          >
            Assign Task
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-4 gap-[18px] mt-[18px]">
          {/* TOTAL TASKS */}
          <div className="h-[118px] rounded-[16px] px-[20px] flex justify-between items-center bg-white relative overflow-hidden border-l-[10px] border-l-[#7658d7] shadow-[0px_4px_13.9px_0px_rgba(199,181,255,1)] border-t border-t-[#a78aff] border-b border-b-[#a78aff] border-r border-r-[#a78aff]" style={{ background: "#fbf9ff" }}>
            <div className="flex flex-col">
              <p className="text-[14px] text-[#9ca3af] m-0">
                Total Tasks <InfoTooltip text="Total number of tasks created across all projects" />
              </p>
              <h2 className="text-[36px] font-bold mt-[6px] leading-[1] text-[#7c3aed]">
                {tasks?.length}
              </h2>
            </div>
            <div className="w-[118px] h-[116px] rounded-[10px]">
              <img src="./task1.png" alt="/" height="100%" width="100%" />
            </div>
          </div>

          {/* IN PROGRESS */}
          <div
            className="h-[118px] rounded-[16px] px-[20px] flex justify-between items-center bg-white relative overflow-hidden border-l-[10px] border-l-[#31a524] border-r-[10px] border-r-[#31a524] shadow-[0px_4px_13.9px_0px_rgba(133,194,127,1)] border-t border-t-[#31a524] border-b border-b-[#31a524]"
            style={{ background: "#effff8" }}
          >
            <div className="flex flex-col">
              <p className="text-[14px] text-[#9ca3af] m-0">
                In Progress <InfoTooltip text="Tasks currently being worked on and not completed" />
              </p>
              <h2 className="text-[36px] font-bold mt-[6px] leading-[1] text-[#22c55e]">
                {inProgressCount}
              </h2>
            </div>
            <div className="absolute top-0 right-[14px] h-full w-[70px] pointer-events-none">
              <span
                className="absolute top-0 w-[10px] bg-gradient-to-b from-[#6AD56A] to-[rgba(106,213,106,0.3)] rounded-b-[10px]"
                style={{ right: "0", height: "85%" }}
              />
              <span
                className="absolute top-0 w-[10px] bg-gradient-to-b from-[#6AD56A] to-[rgba(106,213,106,0.3)] rounded-b-[10px]"
                style={{ right: "20px", height: "60%" }}
              />
              <span
                className="absolute top-0 right-[40px] w-[10px] bg-gradient-to-b from-[#6AD56A] to-[rgba(106,213,106,0.3)] rounded-b-[10px]"
                style={{ height: "40%" }}
              />
            </div>
          </div>

          {/* COMPLETED */}
          <div
            className="h-[118px] rounded-[16px] px-[20px] flex justify-between items-center bg-white relative overflow-hidden border-l-[10px] border-l-[#ffab51] shadow-[0px_4px_13.9px_0px_rgba(191,121,22,1)] border-t border-t-[#ffab51] border-b border-b-[#ffab51] border-r border-r-[#ffab51]"
            style={{ background: "#fcf9e6" }}
          >
            <div className="flex flex-col">
              <p className="text-[14px] text-[#9ca3af] m-0">
                Completed <InfoTooltip text="Tasks that have been completed" />
              </p>
              <h2 className="text-[36px] font-bold mt-[6px] leading-[1] text-[#f97316]">
                {completedTodayCount}
              </h2>
            </div>
            <div className="w-[118px] h-[116px] rounded-[10px]">
              <img src="./task4.png" alt="/" height="100%" width="100%" />
            </div>
          </div>

          {/* PENDING */}
          <div
            className="h-[118px] rounded-[16px] px-[20px] flex justify-between items-center bg-white relative overflow-hidden border-l-[10px] border-l-[#d95562] shadow-[0px_4px_13.9px_0px_rgba(185,58,71,1)] border-t border-t-[#d95562] border-b border-b-[#d95562] border-r border-r-[#d95562]"
            style={{ background: "#fdf9ff" }}
          >
            <div className="flex flex-col">
              <p className="text-[14px] text-[#9ca3af] m-0">
                Pending <InfoTooltip text="Tasks that have passed their assigned deadline" />
              </p>
              <h2 className="text-[36px] font-bold mt-[6px] leading-[1] text-[#ef4444]">
                {pendingCount}
              </h2>
            </div>
            <div className="w-[118px] h-[116px] rounded-[10px]">
              <img src="./task3.png" alt="/" height="100%" width="100%" />
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[10px] shadow-[0_6px_18px_rgba(5,6,15,0.03)] overflow-auto mt-[40px]">
          <div className="flex items-center justify-between px-[20px] py-[20px] pb-[10px]">
            <h2 className="text-[18px] font-semibold text-[#111827]">Task Status</h2>

            <div className="flex gap-[12px] items-center">
              {/* SEARCH */}
              <input
                type="text"
                placeholder="Search tasks"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-[220px] px-[12px] py-[10px] rounded-[8px] border border-[#e5e5e5] bg-[#f1f5f9] text-[13px] outline-none"
              />

              {/* STATUS FILTER */}
              <select
                className="px-[12px] py-[10px] rounded-[8px] border border-[#e5e5e5] bg-white text-[13px] cursor-pointer"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              {/* PRIORITY FILTER */}
              <select
                className="px-[12px] py-[10px] rounded-[8px] border border-[#e5e5e5] bg-white text-[13px] cursor-pointer"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>

              {/* PROJECT FILTER */}
              <select
                className="px-[12px] py-[10px] rounded-[8px] border border-[#e5e5e5] bg-white text-[13px] cursor-pointer"
                value={projectFilter}
                onChange={(e) => {
                  setProjectFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectname}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#f1f5f9] border-b border-b-[#eef2f7]">
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]" style={{ width: "40px" }} />
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Task Title</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Assignee</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Priority</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Status</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Deadline</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]">Project</th>
                <th className="text-left font-semibold bg-[#f1f5f9] px-[10px] py-[12px] text-[13px] border-b border-b-[#eef2f7]" style={{ width: "110px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-[40px] text-[#6b7280] px-[10px]">
                    Loading...
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-[40px] text-[#6b7280] px-[10px]">
                    No tasks found
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row._id} className="border-b border-b-[#f3f4f6] hover:bg-[#fafafa] transition-colors">
                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      <input type="checkbox" />
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      <div className="font-bold max-w-[320px] overflow-hidden text-ellipsis">
                        {row.title}
                      </div>
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      <div className="flex gap-[10px] items-center">
                        <img
                          src={
                            row.assigned?.profilepicture ||
                            `https://i.pravatar.cc/40?u=${
                              row.assigned?._id || row.assignedto
                            }`
                          }
                          alt="avatar"
                          className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white shadow-[0_2px_8px_rgba(8,9,22,0.06)]"
                        />
                        <div>
                          <div className="font-bold text-[14px]">
                            {row.assigned?.name || "—"}
                          </div>
                          <div className="text-[12px] text-[#6b7280]">
                            {row.assigned?.designation?.name || "No Role"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      <div
                        className={`inline-block px-[10px] py-[6px] rounded-full font-bold text-[13px] ${priorityBg(
                          row.priority
                        )} ${priorityClass(row.priority)}`}
                      >
                        {row.priority || "—"}
                      </div>
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      <div
                        className={`inline-block px-[10px] py-[6px] rounded-[6px] font-bold text-[13px] ${statusClass(
                          row.status
                        )}`}
                      >
                        {row.status || "Pending"}
                      </div>
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      {formatDate(row.dueAt)}
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6]">
                      {row.project?.projectname || "—"}
                    </td>

                    <td className="px-[10px] py-[12px] text-[14px] text-[#0f172b] align-middle border-b border-b-[#f3f4f6] flex gap-[8px] justify-center">
                      <button
                        className="bg-[#eef2ff] border-none px-[8px] py-[8px] rounded-[8px] cursor-pointer"
                        title="Edit"
                        onClick={() => handleEdit(row)}
                      >
                        <Pencil size={16} color="black" fill="black" />
                      </button>
                      <button
                        className="bg-[#fff1f2] border-none px-[8px] py-[8px] rounded-[8px] cursor-pointer"
                        title="Delete"
                        onClick={() => handleDelete(row)}
                      >
                        <Trash size={16} color="red" fill="red" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center px-[6px] py-[14px] mt-[10px]">
          <div className="text-[13px] text-[#6b7280]">
            Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, total)} of {total} tasks
          </div>
          <div className="flex items-center gap-[8px]">
            <button
              className="border border-[#e5e7eb] bg-white rounded-[8px] px-[6px] py-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft />
            </button>

            <div className="flex gap-[6px]">
              {Array.from({ length: totalPages }).map((_, i) => {
                const idx = i + 1;
                return (
                  <button
                    key={idx}
                    className={`min-w-[32px] h-[32px] rounded-[6px] border-none cursor-pointer text-[14px] ${
                      page === idx
                        ? "bg-[#6d5bd0] text-white font-bold"
                        : "bg-transparent"
                    }`}
                    onClick={() => setPage(idx)}
                  >
                    {idx}
                  </button>
                );
              })}
            </div>

            <button
              className="border border-[#e5e7eb] bg-white rounded-[8px] px-[6px] py-[6px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {modal && (
        <Createtaskmodal modal={modal} setModal={setModal} projects={projects} users={users} />
      )}

      {editModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.45)] flex justify-center items-center z-[999]"
          onClick={() => setEditModal(false)}
        >
          <div
            className="w-[420px] bg-gradient-to-br from-white to-[#e0d8ff] rounded-[20px] px-[28px] py-[28px] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-[14px] right-[14px] bg-transparent border-none cursor-pointer text-[24px]"
              onClick={() => setEditModal(false)}
            >
              <X />
            </button>

            <h2 className="text-center text-[24px] text-[rgba(104,78,185,1)] mb-[22px] font-semibold">
              Edit Details
            </h2>

            {/* ASSIGNEE */}
            <select
              className="w-full px-[16px] py-[14px] rounded-[10px] border border-[rgba(0,0,0,0.27)] bg-white mb-[14px] outline-none text-[14px]"
              value={form.employeeid}
              onChange={(e) => setForm({ ...form, employeeid: e.target.value })}
            >
              <option value="">Assignee</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            {/* PRIORITY */}
            <select
              className="w-full px-[16px] py-[14px] rounded-[10px] border border-[rgba(0,0,0,0.27)] bg-white mb-[14px] outline-none text-[14px]"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="">Priority</option>
              {["Low", "Medium", "High", "Urgent"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {/* STATUS */}
            <select
              className="w-full px-[16px] py-[14px] rounded-[10px] border border-[rgba(0,0,0,0.27)] bg-white mb-[14px] outline-none text-[14px]"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Status</option>
              {["To Do", "Pending", "In Progress", "Completed"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* DEADLINE */}
            <input
              type="date"
              className="w-full px-[16px] py-[14px] rounded-[10px] border border-[rgba(0,0,0,0.27)] bg-white mb-[14px] outline-none text-[14px]"
              value={form.dueAt}
              onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
            />

            <button
              className="block mx-auto mt-[18px] w-[140px] px-[20px] py-[12px] rounded-full bg-[#6d5bd0] text-white font-bold border-none cursor-pointer text-[14px]"
              onClick={async () => {
                try {
                  await axios.put(
                    `https://backonehf.onrender.com/api/v1/admin/updatetask/${selectedTask._id}`,
                    form,
                    { withCredentials: true }
                  );
                  toast.success("Task updated");
                  setEditModal(false);
                  window.location.reload();
                } catch (err) {
                  toast.error("Update failed");
                }
              }}
            >
              Save →
            </button>
          </div>
        </div>
      )}

      {taskmodal && (
        <Createtaskmodal
          modal={taskmodal}
          setModal={setTaskmodal}
          projects={projects}
          users={users}
        />
      )}
    </>
  );
};

export default Taskpage;

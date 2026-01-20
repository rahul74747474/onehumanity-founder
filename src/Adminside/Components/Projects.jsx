import React, { useMemo, useState, useEffect, useRef } from "react";
import { Plus, Edit2, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const todayDateOnly = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDate = (v) => {
  if (!v) return null;
  try {
    const raw = typeof v === "string" ? v : v?.$date ?? v;
    const dt = new Date(raw);
    if (isNaN(dt)) return null;
    dt.setHours(0, 0, 0, 0);
    return dt;
  } catch {
    return null;
  }
};

const safeId = (id) => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  return String(id);
};

const avatarUrl = (uid) => {
  const id = safeId(uid).slice(0, 8);
  return `https://i.pravatar.cc/40?u=${id}`;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [range, setRange] = useState(30);
  const [showModal, setShowModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [team, setTeam] = useState([]);
  const navigate = useNavigate();
  const roles = ["Frontend Developer", "Backend Developer", "UI/UX Designer", "QA Tester", "DevOps", "Product Manager"];

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getallproject`);
        setProjects(res.data.message || []);
      } catch (err) {
        console.log("Error fetching projects:", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`);
        setEmployees(res.data.message || []);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    })();
  }, []);

  const filterByRange = (p) => {
    const start = parseDate(p.timeline?.startDate);
    if (!start) return false;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - range);
    daysAgo.setHours(0, 0, 0, 0);
    return start >= daysAgo;
  };

  const today = todayDateOnly();

  const categorized = useMemo(() => {
    const active = [];
    const upcoming = [];
    const overdue = [];
    const completed = [];

    for (const p of projects.filter(filterByRange)) {
      const status = p.progress?.status;
      const start = parseDate(p.timeline?.startDate);
      const end = parseDate(p.timeline?.endDate);

      if (status === "Completed") {
        completed.push(p);
      } else if (status === "Ongoing") {
        active.push(p);
      } else if (status === "Pending") {
        if (start && start > today) {
          upcoming.push(p);
        } else if (end && end < today) {
          overdue.push(p);
        } else {
          active.push(p);
        }
      } else {
        active.push(p);
      }
    }

    return { active, upcoming, overdue, completed };
  }, [projects, today]);

  const formatRange = (p) => {
    const s = parseDate(p.timeline?.startDate);
    const e = parseDate(p.timeline?.endDate);
    if (!s || !e) return "";
    const opt = { month: "short", day: "numeric" };
    return `${s.toLocaleDateString(undefined, opt)} to ${e.toLocaleDateString(undefined, opt)}`;
  };

  const avatarStack = (p) => {
    const members = p.team?.assignedMembers || [];
    return members.slice(0, 4).map((member, i) => {
      const userId = member?.userId ?? member;
      const user = employees.find((u) => String(u._id) === String(userId));
      return (
        <img key={i} src={user?.profilepicture ? user.profilepicture : avatarUrl(userId)} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white" style={{ marginLeft: i > 0 ? -12 : 0, zIndex: 10 - i }} />
      );
    });
  };

  const roleSelectRef = useRef(null);

  useEffect(() => {
    (async function loadUsers() {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`, { withCredentials: true });
        setEmployees(res.data.message || []);
      } catch (e) {
        console.error("Failed to fetch employees", e);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedMember && roleSelectRef.current) {
      roleSelectRef.current.focus();
    }
  }, [selectedMember]);

  const addPair = () => {
    if (!selectedMember || !selectedRole) return;
    if (team.some((t) => t.userId === selectedMember)) {
      setSelectedMember("");
      setSelectedRole("");
      return;
    }
    setTeam((t) => [...t, { userId: selectedMember, role: selectedRole }]);
    setSelectedMember("");
    setSelectedRole("");
  };

  const removePair = (userId) => {
    setTeam((t) => t.filter((x) => x.userId !== userId));
  };

  const pickEmployeeQuick = (userId) => {
    if (team.some((t) => t.userId === userId)) return;
    setSelectedMember(userId);
    setTimeout(() => {
      if (roleSelectRef.current) roleSelectRef.current.focus();
    }, 10);
  };

  const handleCreateProject = async () => {
    const payload = {
      projectname: projectName,
      description,
      startdate: startDate,
      enddate: endDate,
      manager: managerId || null,
      team: team,
      progress: { percent: 0, status: "Pending" },
      risks: [],
    };

    try {
      setLoadingUsers(true);
      const res = await axios.post(`https://backonehf.onrender.com/api/v1/admin/addproject`, payload, { withCredentials: true });
      toast.success("Project Added Successfully");
      navigate("/projects");
      window.location.reload();
    } catch (err) {
      console.error("Create project failed", err);
      toast.error("Create failed - check console");
    } finally {
      setLoadingUsers(false);
    }
  };

  const managers = employees.filter((e) => e.designation.name === "Manager" || e.role?.toLowerCase()?.includes("manager"));
  const isSelected = (userId) => team.some((t) => t.userId === userId);

  const CompactCard = ({ p }) => (
    <div className="flex justify-between items-center bg-white px-3 py-1 rounded-[10px] mb-2">
      <div className="flex gap-3 items-center">
        <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#5b21b6] to-[#7c3aed] shadow-[inset_0_2px_6px_rgba(255,255,255,0.08)]" />
        <div className="font-[600] text-[#302b45]">{p.projectname}</div>
      </div>
      <div className="bg-white px-2 py-1.5 rounded-[10px] text-[#302b45] font-[600]">{p.team?.assignedMembers?.length || 0}</div>
    </div>
  );

  const ProjectCard = ({ p }) => {
    const percent = p.progress?.percent ?? 0;
    const riskCount = p.risks?.length || 0;

    return (
      <div className="bg-gradient-to-br from-[#faf7ff] to-white rounded-[14px] px-[18px] py-[20px] shadow-[0_6px_20px_rgba(124,58,237,0.1)] border border-[#ede6fb] cursor-pointer hover:shadow-[0_10px_24px_rgba(124,58,237,0.1)] transition-all">
        <div className="flex justify-between items-start mb-[12px]">
          <div className="flex-1">
            <div className="text-[16px] font-[600] text-[#1f2937] mb-1">{p.projectname}</div>
            <div className="text-[13px] text-[#6b7280]">{p.description}</div>
          </div>
          <span className="px-2.5 py-1 bg-[#ede6fb] text-[#7c3aed] text-[12px] font-[600] rounded-full">
            {p.progress?.status === "Ongoing" ? "On Track" : p.progress?.status === "Completed" ? "Completed" : "Pending"}
          </span>
        </div>

        <div className="text-[13px] text-[#6b7280] mb-2">Progress</div>
        <div className="flex items-center gap-2 mb-[12px]">
          <div className="flex-1 h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9]" style={{ width: `${Math.min(100, percent)}%` }} />
          </div>
          <div className="text-[12px] font-[600] text-[#374151]">{percent}%</div>
        </div>

        {riskCount > 0 && <div className="text-[12px] text-[#ef4444] font-[600] mb-2">{riskCount} Risk</div>}

        <div className="flex items-center justify-between">
          <div className="flex items-center">{avatarStack(p)}</div>
          <div className="text-[12px] text-[#6b7280]">{formatRange(p)}</div>
        </div>

        <button className="mt-3 w-full text-[14px] text-[#7c3aed] font-[600] hover:bg-[#ede6fb] py-2 rounded-lg transition-all" onClick={() => navigate(`/projects/${p._id}`)}>
          View Details
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="px-[34px] py-7 bg-gradient-to-b from-white to-[#faf7ff] min-h-screen font-['Inter']">
        <div className="flex justify-between items-center mb-[18px]">
          <div>
            <h1 className="text-[28px] font-[700] text-[rgba(104,80,190,1)] m-0 mb-1.5">Projects</h1>
            <select value={range} onChange={(e) => setRange(Number(e.target.value))} className="bg-[rgba(104,80,190,1)] text-white border-none rounded text-[14px] px-3 py-2 font-[600] cursor-pointer hover:bg-[#6d28d9] transition-colors">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          <button className="bg-[#6f2fe0] text-white border-none px-3.5 py-2.5 rounded-[10px] flex gap-2 items-center cursor-pointer font-[600] shadow-[0_6px_20px_rgba(124,58,237,0.12)] hover:bg-[#5a2ab8] transition-all" onClick={() => setShowModal(true)}>
            <Plus size={14} /> Add Project
          </button>
        </div>

        <div className="flex gap-[18px] mb-6 max-md:flex-col">
          <div className="flex-1 rounded-[10px] bg-white border-[5px] border-white shadow-[1px_8px_25.2px_-4px_rgba(0,0,0,0.25)] px-2.5 py-2.5">
            <h3 className="text-[#7C3AED] text-[16px] font-[700] m-0 mb-2.5">Active Projects</h3>
            <div className="bg-[rgba(175,167,206,0.36)] px-3 py-3 rounded-[14px] shadow-[0_6px_18px_rgba(15,23,42,0.06)] min-h-[68px]">
              {categorized.active.map((p, i) => <CompactCard key={i} p={p} />)}
            </div>
          </div>

          <div className="flex-1 rounded-[10px] bg-white border-[5px] border-white shadow-[1px_8px_25.2px_-4px_rgba(0,0,0,0.25)] px-2.5 py-2.5">
            <h3 className="text-[#7C3AED] text-[16px] font-[700] m-0 mb-2.5">Upcoming</h3>
            <div className="bg-[rgba(175,167,206,0.36)] px-3 py-3 rounded-[14px] shadow-[0_6px_18px_rgba(15,23,42,0.06)] min-h-[68px]">
              {categorized.upcoming.map((p, i) => <CompactCard key={i} p={p} />)}
            </div>
          </div>

          <div className="flex-1 rounded-[10px] bg-white border-[5px] border-white shadow-[1px_8px_25.2px_-4px_rgba(0,0,0,0.25)] px-2.5 py-2.5">
            <h3 className="text-[#7C3AED] text-[16px] font-[700] m-0 mb-2.5">Overdue</h3>
            <div className="bg-[rgba(175,167,206,0.36)] px-3 py-3 rounded-[14px] shadow-[0_6px_18px_rgba(15,23,42,0.06)] min-h-[68px]">
              {categorized.overdue.map((p, i) => <CompactCard key={i} p={p} />)}
            </div>
          </div>
        </div>

        <section className="mt-7 bg-white border border-white px-[18px] py-[18px] rounded-[16px] shadow-[4px_7px_51.8px_5px_rgba(0,0,0,0.25)]">
          <h2 className="text-[#6850BE] text-[22px] font-[600] m-0 mb-4">All Projects</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
            {projects.map((p, i) => <ProjectCard key={i} p={p} />)}
          </div>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-[999]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[16px] p-7 w-[960px] max-w-[90vw] max-h-[90vh] overflow-auto flex gap-7 flex-col md:flex-row" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1">
              <h3 className="text-[20px] font-[600] text-[#1f2937] mb-5">Create a new project:</h3>

              <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Project Name <span className="text-red-600 ml-1">*</span></label>
              <input className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] mb-4 outline-none" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" />

              <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Project Manager <span className="text-red-600 ml-1">*</span></label>
              <select className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] mb-4 outline-none cursor-pointer" value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                <option value="">Select Manager</option>
                {managers.map((m) => <option key={m._id} value={m._id}>{m.name} ({m.designation.name})</option>)}
              </select>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Project Duration <span className="text-red-600 ml-1">*</span></label>
                  <input type="date" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">&nbsp;</label>
                  <input type="date" className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Assign Team Members <span className="text-red-600 ml-1">*</span></label>
                  <select className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] outline-none cursor-pointer" value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}>
                    <option value="">Select employee</option>
                    {employees.map((emp) => <option key={emp._id} value={emp._id} disabled={isSelected(emp._id)}>{emp.name} — {emp?.designation?.name || "No Role"}</option>)}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Role <span className="text-red-600 ml-1">*</span></label>
                  <select ref={roleSelectRef} className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] outline-none cursor-pointer disabled:opacity-50" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} disabled={!selectedMember}>
                    <option value="">Select role</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              <button className="w-full mb-4 bg-[#7c3aed] text-white px-3 py-2.5 rounded-lg cursor-pointer font-[600] disabled:opacity-50 hover:bg-[#6d28d9]" disabled={!selectedMember || !selectedRole} onClick={addPair}>
                Add
              </button>

              <label className="block text-[12px] font-[600] text-[#6b7280] mb-2">Description <span className="text-red-600 ml-1">*</span></label>
              <textarea className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] mb-4 outline-none min-h-[100px] resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project description..." />

              <div className="flex gap-2 flex-wrap mb-6">
                {team.map((t) => {
                  const emp = employees.find((e) => e._id === t.userId);
                  return (
                    <div key={t.userId} className="flex items-center gap-2 bg-[#ede6fb] px-3 py-2 rounded-full">
                      <img src={emp?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`} alt="" className="w-6 h-6 rounded-full" />
                      <div className="flex flex-col">
                        <div className="text-[12px] font-[600]">{emp?.name || "Unknown"}</div>
                        <div className="text-[11px] text-[#6b7280]">{t.role}</div>
                      </div>
                      <button className="bg-none border-none cursor-pointer text-[#9ca3af] hover:text-[#374151]" onClick={() => removePair(t.userId)}>
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-white border border-[#e5e7eb] px-4 py-2.5 rounded-lg cursor-pointer font-[600] hover:bg-gray-50" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="flex-1 bg-[#7c3aed] text-white px-4 py-2.5 rounded-lg cursor-pointer font-[600] hover:bg-[#6d28d9]" onClick={handleCreateProject}>
                  {loadingUsers ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            <div className="flex-1 max-md:hidden">
              <input className="w-full px-3 py-2.5 border border-[#e5e7eb] rounded-lg text-[14px] mb-4 outline-none" placeholder="Search..." />
              <div className="max-h-[400px] overflow-y-auto">
                {loadingUsers ? (
                  <div className="text-[14px] text-[#6b7280]">Loading employees...</div>
                ) : (
                  employees.map((emp) => (
                    <div key={emp._id} className={`flex gap-3 items-center px-3 py-3 rounded-lg cursor-pointer mb-2 transition-all ${isSelected(emp._id) ? "opacity-50 bg-gray-100" : "hover:bg-gray-50"}`} onClick={() => pickEmployeeQuick(emp._id)}>
                      <img src={emp.profilepicture || `https://i.pravatar.cc/40?u=${emp._id}`} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="font-[600] text-[14px]">{emp.name}</div>
                        <div className="text-[12px] text-[#6b7280]">{emp.designation.name}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;

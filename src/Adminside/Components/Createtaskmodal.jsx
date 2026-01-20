import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Createtaskmodal = ({ modal, setModal, projects, users }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const employeeUsers = users.filter(
  u => u.designation?.name !== "Administrator"
);


  const [form, setForm] = useState({
    title: "",
    linkedproject: "",
    description: "",
    priority: "",
    employeeid: "",
    dueAt: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(
        "https://backonehf.onrender.com/api/v1/admin/assigntask",
        form,
        { withCredentials: true }
      );
      toast.success("Task Assigned Successfully");
      navigate("/tasks");
      window.location.reload()
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] grid place-items-center z-50" onClick={() => setModal(false)}>
      <style>{`
        .task-input, .task-select, .task-textarea {
          transition: all 0.2s ease-in-out;
          background-color: #ffffff;
          border-color: #e5e7eb;
        }
        .task-input:focus, .task-select:focus, .task-textarea:focus {
          box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
          border-color: #6d28d9;
        }
      `}</style>
      <div className="w-full max-w-xl rounded-xl bg-white p-8 sm:p-6 overflow-hidden shadow-lg" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="mb-8 sm:mb-6">
          <h2 className="text-2xl sm:text-xl font-semibold text-[#6d28d9]">Create & Assign Task</h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 mb-6">

  {/* TITLE */}
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">Title *</label>
    <input
      name="title"
      placeholder="Enter task title"
      value={form.title}
      onChange={handleChange}
      className="task-input px-4 py-2.5 rounded-lg border outline-none text-sm"
    />
  </div>

  {/* PROJECT */}
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">Project</label>
    <select
      name="linkedproject"
      value={form.linkedproject}
      onChange={handleChange}
      className="task-select px-4 py-2.5 rounded-lg border outline-none text-sm"
    >
      <option value="">Select project</option>
      {projects.map((p) => (
        <option key={p._id} value={p._id}>
          {p.projectname}
        </option>
      ))}
    </select>
  </div>

  {/* DESCRIPTION */}
  <div className="flex flex-col col-span-2">
    <label className="mb-2 text-sm font-medium text-gray-700">Description *</label>
    <textarea
      name="description"
      placeholder="Describe the task clearly..."
      value={form.description}
      onChange={handleChange}
      className="task-textarea px-4 py-2.5 rounded-lg border outline-none text-sm resize-none h-24"
    />
  </div>

  {/* PRIORITY */}
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">Priority *</label>
    <select
      name="priority"
      value={form.priority}
      onChange={handleChange}
      className="task-select px-4 py-2.5 rounded-lg border outline-none text-sm"
    >
      <option value="">Select priority</option>
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
      <option>Urgent</option>
    </select>
  </div>

  {/* ASSIGN TO */}
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">Assign To *</label>
    <select
      name="employeeid"
      value={form.employeeid}
      onChange={handleChange}
      className="task-select px-4 py-2.5 rounded-lg border outline-none text-sm"
    >
      <option value="">Select employee</option>
      {employeeUsers.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
    </select>
  </div>

  {/* DUE DATE */}
  <div className="flex flex-col">
    <label className="mb-2 text-sm font-medium text-gray-700">Due Date *</label>
    <input
      name="dueAt"
      value={form.dueAt}
      onChange={handleChange}
      type="date"
      className="task-input px-4 py-2.5 rounded-lg border outline-none text-sm"
    />
  </div>
        </div>


        {/* USER PREVIEW */}
        {form.employeeid && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#f3e8ff] to-white rounded-lg border border-[#e5e7eb]">
            {employeeUsers
              .filter(u => u._id === form.employeeid)
              .map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={u.profilepicture || "https://i.pravatar.cc/100"}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-600">{u.designation?.name}</p>
                  </div>
                </div>
              ))}
          </div>
        )}


        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <button
            onClick={() => setModal(false)}
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#6d28d9] text-white rounded-lg text-sm font-medium cursor-pointer border-none hover:bg-[#5a23c4] transition-colors"
          >
            {loading ? "Assigning..." : "Done →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createtaskmodal;

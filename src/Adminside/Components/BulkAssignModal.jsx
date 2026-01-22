import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BulkAssignModal = ({ modal, setModal, roles }) => {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchemployees = async () => {
      try {
        const response = await axios.get(
          `https://backonehf.onrender.com/api/v1/admin/getalluser`,
          { withCredentials: true }
        );
        setUsers(response.data.message);
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };

    fetchemployees();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? u.role === filterDept : true;
    return matchesSearch && matchesDept;
  });

  const toggleUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      const remaining = selectedUsers.filter(
        (id) => !filteredUsers.some((u) => u._id === id)
      );
      setSelectedUsers(remaining);
      setSelectAll(false);
    } else {
      const newSelections = [
        ...new Set([...selectedUsers, ...filteredUsers.map((u) => u._id)]),
      ];
      setSelectedUsers(newSelections);
      setSelectAll(true);
    }
  };

  useEffect(() => {
    const allFilteredSelected = filteredUsers.every((u) =>
      selectedUsers.includes(u._id)
    );
    setSelectAll(allFilteredSelected);
  }, [selectedUsers, filteredUsers]);

  const assignRole = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Select at least one user");
      return;
    }

    try {
        console.log(selectedRole)
        console.log(selectedUsers)
      await axios.post(
        `https://backonehf.onrender.com/api/v1/admin/assignrole`,
        { role: selectedRole, users: selectedUsers },
        { withCredentials: true }
      );

      toast.success("Role assigned successfully!");
      setModal(false);
      window.location.reload()
    } catch (err) {
      toast.error("Error assigning role");
      console.log(err.message);
    }
  };

  if (!modal) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center z-50">
      <style>{`
        .bulk-input, .bulk-select {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          background: rgba(255, 255, 255, 0.5);
          border-color: rgba(104, 80, 190, 0.2);
        }
        .bulk-input:hover, .bulk-select:hover {
          border-color: rgba(104, 80, 190, 0.4);
        }
        .bulk-input:focus, .bulk-select:focus {
          box-shadow: 0 0 0 3px rgba(104, 80, 190, 0.1);
          border-color: #6850BE;
          background: rgba(255, 255, 255, 0.7);
          outline: none;
        }
        .user-item {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .user-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(104, 80, 190, 0.1);
          border-color: rgba(104, 80, 190, 0.3);
          background: rgba(104, 80, 190, 0.03);
        }
        .user-item.selected {
          background: linear-gradient(135deg, rgba(104, 80, 190, 0.08) 0%, rgba(104, 80, 190, 0.03) 100%);
          border-color: rgba(104, 80, 190, 0.4);
        }
      `}</style>
      <div className="modal-animate bg-white/85 backdrop-blur-2xl w-full max-w-4xl h-[88vh] rounded-[20px] p-8 sm:p-6 flex flex-col relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/30">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl sm:text-lg font-bold text-[#333]">Bulk Role Assignment</h2>
          <button className="bg-none border-none cursor-pointer text-[#999] hover:text-[#6850BE] transition-colors p-1 -mr-1" onClick={() => setModal(false)}>
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-[#666] mb-6">
          Select and assign a role to multiple people at once
        </p>

        {/* SEARCH + FILTER GRID */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-6">
          <div>
            <label className="text-xs font-bold text-[#666] block mb-2 uppercase tracking-[0.5px]">Search Users</label>
            <input
              className="bulk-input w-full px-4 py-3 rounded-lg border outline-none text-sm"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className="text-xs font-bold text-[#666] block mb-2 mt-4 uppercase tracking-[0.5px]">Assign Role</label>
            <select
              className="bulk-select w-full px-4 py-3 rounded-lg border outline-none text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.rolename}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#666] block mb-2 uppercase tracking-[0.5px]">Filter by Role</label>
            <select
              className="bulk-select w-full px-4 py-3 rounded-lg border outline-none text-sm"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All roles...</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="QA">QA</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className="h-px bg-[rgba(104,80,190,0.1)]"></div>

        {/* SELECT ALL */}
        <div className="flex items-center gap-3 my-4 text-sm font-medium">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
            className="cursor-pointer w-4 h-4 accent-[#6850BE]"
          />
          <label className="cursor-pointer text-[#333]">Select All ({filteredUsers.length} users)</label>
        </div>

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-[#999]">No users found</div>
          ) : (
            filteredUsers.map((emp) => (
              <div
                key={emp._id}
                className={`user-item flex items-center gap-4 py-3 px-4 rounded-lg border mb-2 cursor-pointer transition-all ${
                  selectedUsers.includes(emp._id)
                    ? "selected"
                    : "border-[rgba(104,80,190,0.1)] bg-white/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(emp._id)}
                  onChange={() => toggleUser(emp._id)}
                  className="cursor-pointer w-4 h-4 accent-[#6850BE]"
                />

                <img
                  src={
                    emp.profilepicture ||
                    `https://i.pravatar.cc/150?u=${emp._id}`
                  }
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-medium text-sm text-[#333]">{emp.name}</div>
                  <div className="text-xs text-[#999]">{emp.role}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[rgba(104,80,190,0.1)]">
          <button
            className="px-4 py-2 border border-[rgba(104,80,190,0.2)] rounded-lg text-sm font-medium cursor-pointer text-[#666] hover:bg-[rgba(104,80,190,0.05)] transition-colors"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#684EB9] to-[#6850BE] text-white rounded-lg text-sm font-medium cursor-pointer hover:shadow-[0_8px_24px_rgba(104,80,190,0.35)] transition-all"
            onClick={assignRole}
          >
            Assign Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignModal;

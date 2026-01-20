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
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
      <style>{`
        .bulk-input, .bulk-select {
          transition: all 0.2s ease-in-out;
        }
        .bulk-input:focus, .bulk-select:focus {
          box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.1);
          border-color: #7b61ff;
        }
        .user-item {
          transition: all 0.2s ease-in-out;
        }
        .user-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      `}</style>
      <div className="bg-white w-full max-w-4xl h-[88vh] rounded-xl p-8 sm:p-6 flex flex-col relative overflow-hidden shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl sm:text-lg font-semibold text-gray-900">Bulk Role Assignment</h2>
          <button className="bg-none border-none cursor-pointer text-gray-500 hover:text-gray-700 transition-colors p-1 -mr-1" onClick={() => setModal(false)}>
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Select and assign a role to multiple people at once
        </p>

        {/* SEARCH + FILTER GRID */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Search Users</label>
            <input
              className="bulk-input w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] outline-none text-sm"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className="text-sm font-medium text-gray-700 block mb-2 mt-4">Assign Role</label>
            <select
              className="bulk-select w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] outline-none text-sm"
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
            <label className="text-sm font-medium text-gray-700 block mb-2">Filter by Role</label>
            <select
              className="bulk-select w-full px-4 py-2.5 rounded-lg border border-[#e5e7eb] outline-none text-sm"
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

        <div className="h-px bg-[#e5e7eb]"></div>

        {/* SELECT ALL */}
        <div className="flex items-center gap-3 my-4 text-sm font-medium">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
            className="cursor-pointer w-4 h-4"
          />
          <label className="cursor-pointer text-gray-700">Select All ({filteredUsers.length} users)</label>
        </div>

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto pr-2 mb-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            filteredUsers.map((emp) => (
              <div
                key={emp._id}
                className={`user-item flex items-center gap-4 py-3 px-4 rounded-lg border mb-2 cursor-pointer ${
                  selectedUsers.includes(emp._id)
                    ? "border-[#7b61ff] bg-[#f8f6ff]"
                    : "border-[#e5e7eb] bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(emp._id)}
                  onChange={() => toggleUser(emp._id)}
                  className="cursor-pointer w-4 h-4"
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
                  <div className="font-medium text-sm text-gray-900">{emp.name}</div>
                  <div className="text-xs text-gray-500">{emp.role}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
          <button
            className="px-4 py-2 border border-[#e5e7eb] rounded-lg text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-[#7b61ff] text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-[#6b52dd] transition-colors"
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

import React, { useEffect, useState } from "react";
import { Search, Pencil, Users, ShieldCheck, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import BulkAssignModal from "./BulkAssignModal";
import { InfoTooltip } from "./InfoTooltip";

const Rolepage = () => {
  const [roles, setRole] = useState([]);
  const [users, setusers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [roleid, setroleid] = useState("");
  const [details, setDetails] = useState("");

  const [eroleName, seteRoleName] = useState("");
  const [edetails, seteDetails] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await axios.get(
        `https://backonehf.onrender.com/api/v1/admin/getroles`
      );
      setRole(res.data.message);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(
        `https://backonehf.onrender.com/api/v1/admin/getalluser`,
        { withCredentials: true }
      );
      setusers(res.data.message);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  const handlecreate = async () => {
    try {
      setSubmitting(true);
      await axios.post(
        `https://backonehf.onrender.com/api/v1/admin/createrole`,
        { rolename: roleName, details },
        { withCredentials: true }
      );
      toast.success("Role Added Successfully");
      setShowModal(false);
      fetchRoles();
    } catch {
      toast.error("Role not Created Successfully");
    } finally {
      setSubmitting(false);
    }
  };

  const handleupdate = async () => {
    try {
      setSubmitting(true);
      await axios.put(
        `https://backonehf.onrender.com/api/v1/admin/updaterole`,
        {
          roleid,
          rolename: eroleName,
          details: edetails,
          users: selectedUsers,
        },
        { withCredentials: true }
      );
      toast.success("Role Updated Successfully");
      setEditModal(false);
      fetchRoles();
      fetchUsers();
    } catch {
      toast.error("Role not Updated Successfully");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredRoles = roles.filter((role) =>
    role.rolename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarForRole = (name) => {
    const map = {
      Administrator: "👨‍💼",
      Manager: "🧑‍💼",
      HR: "👩‍💼",
      Employee: "👨‍🔧",
      Intern: "🎓",
    };
    return map[name] || "📌";
  };

  const handledelete = async (id) => {
    if (!window.confirm(`Delete Role "${eroleName}" ?`)) return;
    try {
      const response = await axios.delete(`https://backonehf.onrender.com/api/v1/admin/deleterole/${id}`,
        { withCredentials: true }
      );
      console.log(response);
      toast.success("Role Deleted Successfully");
      window.location.reload();
    } catch (error) {
      toast.error("Role Cannot be deleted");
    }
  };

  return (
    <>
      <div className="w-full px-[30px] py-[25px] font-['Inter']">
        <div className="flex flex-col gap-2.5 md:flex-row md:justify-between md:items-flex-start md:flex-wrap">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[32px] font-[700] text-[rgba(104,80,190,1)] flex items-center gap-2">
              Role management
              <InfoTooltip text="Manage user roles and control system access levels" />
            </h1>

            <div className="relative w-[320px]">
              <Search size={18} className="absolute top-2.5 left-2.5 text-[#999]" />
              <input
                className="w-full h-[38px] bg-[rgba(241,245,249,1)] rounded text-[14px] border border-[#dcdcdc] pl-[35px] outline-none"
                placeholder="Search role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 bg-[rgba(241,245,249,1)] px-2.5 py-2.5 rounded h-fit">
            <button className="h-[30px] px-[14px] rounded text-[10px] text-white bg-[rgba(104,80,190,1)] border border-[#c9c9c9] cursor-pointer hover:bg-[#5a4099]">
              Permission Configuration
            </button>
            <button
              className="h-[30px] px-[14px] rounded text-[10px] text-white bg-[rgba(104,80,190,1)] border-none cursor-pointer hover:bg-[#5a4099]"
              onClick={() => setBulkModal(true)}
            >
              Bulk Assign
            </button>
            <button
              className="h-[30px] px-[14px] rounded text-[10px] text-white bg-[rgba(104,80,190,1)] border-none cursor-pointer hover:bg-[#5a4099]"
              onClick={() => setShowModal(true)}
            >
              Create role
            </button>
          </div>
        </div>

        {loadingRoles ? (
          <p className="text-center mt-10">Loading roles...</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[22px] mt-[25px]">
            {filteredRoles.map((role) => (
              <div
                key={role._id}
                className="w-full h-auto bg-radial-gradient px-[22px] py-[18px] rounded-[12px] shadow-[0_3px_14px_rgba(0,0,0,0.08)] border border-[#eee] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(0,0,0,0.12)]"
                style={{
                  background: "radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #F9F5FF 100%)"
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="text-[24px]">
                      {getAvatarForRole(role.rolename)}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-[600] text-[#333] m-0">{role.rolename}</h3>
                      <p className="text-[14px] text-[#6b7280] m-0">
                        {role.details?.length > 60
                          ? role.details.slice(0, 60) + "..."
                          : role.details}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-t border-[#e5e7eb] my-3" />

                <div className="flex gap-4 text-[14px]">
                  <div className="flex items-center gap-2 text-[#6b7280] cursor-pointer hover:text-[#6850BE]">
                    <Users size={16} /> {role?.users?.length || 0} users
                  </div>
                  <div className="flex items-center gap-2 text-green-600 cursor-pointer hover:text-green-700">
                    <ShieldCheck size={16} /> {role.permissions || 48} permissions
                  </div>
                  <div
                    className="flex items-center gap-2 text-green-600 cursor-pointer hover:text-green-700"
                    onClick={() => {
                      seteRoleName(role.rolename);
                      seteDetails(role.details);
                      setroleid(role._id);

                      const assigned = users
                        .filter((u) => u.roleid === role._id)
                        .map((u) => u._id);

                      setSelectedUsers(assigned);
                      setEditModal(true);
                    }}
                  >
                    <Pencil size={16} /> Edit
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[999]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[12px] p-[28px] w-[420px] max-w-[90vw] shadow-[0_10px_30px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-[600] text-[#333]">Create New Role</h2>
              <button
                className="bg-none border-none text-[24px] cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <label className="block text-[12px] font-[600] text-[#666] mb-2">Role Name</label>
            <input
              className="w-full px-3 py-2 border border-[#dcdcdc] rounded text-[14px] mb-4 outline-none"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />

            <label className="block text-[12px] font-[600] text-[#666] mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#dcdcdc] rounded text-[14px] mb-4 outline-none min-h-[100px]"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />

            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border border-[#dcdcdc] rounded text-[14px] cursor-pointer hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[rgba(104,80,190,1)] text-white rounded text-[14px] cursor-pointer hover:bg-[#5a4099] disabled:opacity-50"
                disabled={submitting}
                onClick={handlecreate}
              >
                {submitting ? "Creating..." : "Create role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[999]" onClick={() => setEditModal(false)}>
          <div className="bg-white rounded-[12px] p-[28px] w-[480px] max-w-[90vw] max-h-[90vh] overflow-auto shadow-[0_10px_30px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] font-[600] text-[#333]">Update Role</h2>
              <button
                className="px-3 py-1.5 bg-[#ef4444] text-white rounded text-[12px] cursor-pointer hover:bg-red-600"
                onClick={() => handledelete(roleid)}
              >
                Delete
              </button>
            </div>

            <label className="block text-[12px] font-[600] text-[#666] mb-2">Role Name</label>
            <input
              className="w-full px-3 py-2 border border-[#dcdcdc] rounded text-[14px] mb-4 outline-none"
              value={eroleName}
              onChange={(e) => seteRoleName(e.target.value)}
            />

            <label className="block text-[12px] font-[600] text-[#666] mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-[#dcdcdc] rounded text-[14px] mb-4 outline-none min-h-[100px]"
              value={edetails}
              onChange={(e) => seteDetails(e.target.value)}
            />

            <label className="block text-[12px] font-[600] text-[#666] mb-2">Assign Users</label>

            {loadingUsers ? (
              <p className="text-[14px] text-[#666]">Loading users...</p>
            ) : (
              <div className="flex flex-col gap-2 mb-4 max-h-[200px] overflow-auto">
                {users
                  .filter((u) => u.roleid === roleid)
                  .map((user) => (
                    <div key={user._id} className="flex items-center gap-3 p-2 border border-[#f0f0f0] rounded">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                      />
                      <div>
                        <strong className="text-[14px]">{user.name}</strong>
                        <p className="text-[12px] text-[#6b7280]">{user.designation?.name || ""}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border border-[#dcdcdc] rounded text-[14px] cursor-pointer hover:bg-gray-50"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[rgba(104,80,190,1)] text-white rounded text-[14px] cursor-pointer hover:bg-[#5a4099] disabled:opacity-50"
                disabled={submitting}
                onClick={handleupdate}
              >
                {submitting ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkModal && (
        <BulkAssignModal
          modal={bulkModal}
          setModal={setBulkModal}
          roles={roles}
        />
      )}
    </>
  );
};

export default Rolepage;

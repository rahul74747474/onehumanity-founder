import React, { useEffect, useState, useRef } from "react";
import { Search, Pencil, Users, ShieldCheck, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useScrollAnimation, useStaggerAnimation } from "../../hooks/useScrollAnimation";
import BulkAssignModal from "./BulkAssignModal";
import { InfoTooltip } from "./InfoTooltip";

const Rolepage = () => {
  const [roles, setRole] = useState([]);
  const [users, setusers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);

  const headerRef = useRef(null);
  const rolesGridRef = useRef(null);
  useScrollAnimation({ threshold: 0.15 });
  useStaggerAnimation(rolesGridRef, 100);

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
      <style>{`
      .modal-animate {
  animation: scaleIn 0.25s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.scroll-animate {
  opacity: 1 !important;
  transform: none !important;
}


        .role-card-premium {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }
        .role-card-premium::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 80%);
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }
        .role-card-premium:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(104, 80, 190, 0.2), 0 0 30px rgba(104, 80, 190, 0.1);
          border-color: rgba(104, 80, 190, 0.4);
        }
        .role-card-premium:hover::after {
          opacity: 1;
        }
        .premium-button {
        transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
          transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(135deg, #684EB9 0%, #6850BE 100%);
          box-shadow: 0 4px 12px rgba(104, 80, 190, 0.25);
        }
        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(104, 80, 190, 0.35);
        }
        .premium-button:active {
          transform: scale(0.98);
        }
        @media (max-width: 768px) {
          .role-card-premium:hover {
            transform: none;
          }
        }
      `}</style>
      <div
        className="w-full px-[30px] py-[25px] font-['Inter']
  bg-gradient-to-br from-[#f6f7ff] via-white to-[#faf8ff]
  min-h-screen animate-[fadeIn_.4s_ease]"
      >

        <div
          ref={headerRef}
          className="flex flex-col gap-2.5 md:flex-row md:justify-between
  sticky top-4 z-30 bg-white/70 backdrop-blur-xl
  p-4 rounded-2xl shadow border border-white/40
  scroll-animate"
        >
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[32px] font-[700] text-[rgba(104,80,190,1)] flex items-center gap-2">
              Role management
              <InfoTooltip text="Manage user roles and control system access levels" />
            </h1>

            <div className="relative w-[320px]">
              <Search size={18} className="absolute top-2.5 left-2.5 text-[#999]" />
              <input
                className="w-full h-[40px] bg-[rgba(241,245,249,1)] rounded-lg text-[14px] border border-[#dcdcdc] pl-[35px] outline-none transition-all duration-200 hover:border-[#bbb] focus:border-[#6850BE] focus:shadow-[0_0_0_3px_rgba(104,80,190,0.1)]"
                placeholder="Search role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 bg-[rgba(241,245,249,1)] px-3 py-3 rounded-xl h-fit">
            <button className="h-[34px] px-[16px] rounded-lg text-[11px] text-white premium-button border-none cursor-pointer">
              Permission Configuration
            </button>
            <button
              className="h-[34px] px-[16px] rounded-lg text-[11px] text-white premium-button border-none cursor-pointer"
              onClick={() => setBulkModal(true)}
            >
              Bulk Assign
            </button>
            <button
              className="h-[34px] px-[16px] rounded-lg text-[11px] text-white premium-button border-none cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              Create role
            </button>
          </div>
        </div>
        {loadingRoles ? (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[160px] rounded-2xl bg-slate-200/70 animate-pulse"
              />
            ))}
          </div>
        ) : (

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[24px] mt-[30px]" ref={rolesGridRef}>
            {filteredRoles.map((role) => (
              <div
                key={role._id}
                data-aos="zoom-in"
  className="role-card-premium scroll-animate w-full h-auto px-[24px] py-[20px]
  rounded-[16px] shadow-lg border border-[#f0e6ff] group"style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, #FAF7FF 100%)"
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <div className="text-[28px] flex-shrink-0">
                      {getAvatarForRole(role.rolename)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-[600] text-[#333] m-0">{role.rolename}</h3>
                      <p className="text-[14px] text-[#6b7280] m-0 line-clamp-2">
                        {role.details?.length > 60
                          ? role.details.slice(0, 60) + "..."
                          : role.details}
                      </p>
                    </div>
                  </div>
                </div>

                <hr className="border-t border-[#e8deff] my-4" />

                <div className="flex gap-4 text-[13px] flex-wrap">
                  <div className="flex items-center gap-2 text-[#6b7280] transition-colors duration-200 hover:text-[#6850BE]">
                    <Users size={16} className="flex-shrink-0" /> {role?.users?.length || 0} users
                  </div>
                  <div className="flex items-center gap-2 text-[#059669] transition-colors duration-200 hover:text-[#047857]">
                    <ShieldCheck size={16} className="flex-shrink-0" /> {role.permissions || 48} perms
                  </div>
                  <button
                   className="flex items-center gap-2 text-[#6850BE]
  opacity-0 group-hover:opacity-100 transition-all duration-200
  cursor-pointer hover:text-[#5a4099] hover:font-medium" onClick={() => {
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
                    <Pencil size={16} className="flex-shrink-0" /> Edit
                  </button>
                </div>
              </div>
            ))}
            {filteredRoles.length === 0 && (
  <div className="col-span-full text-center py-20 text-slate-500">
    <ShieldCheck size={48} className="mx-auto mb-4 opacity-40" />
    <p className="text-lg font-medium">No roles found</p>
    <p className="text-sm">Try changing search keywords</p>
  </div>
)}

          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-[999]" onClick={() => setShowModal(false)}>
          <div className="modal-animate bg-white/80 backdrop-blur-2xl rounded-[20px] p-[32px] w-[420px] max-w-[90vw] shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-[700] text-[#333]">Create New Role</h2>
              <button
                className="bg-none border-none text-[24px] cursor-pointer hover:text-[#6850BE] transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <label className="block text-[12px] font-[700] text-[#666] mb-2 uppercase tracking-[0.5px]">Role Name</label>
            <input
              className="w-full px-4 py-3 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] mb-4 outline-none bg-white/50 transition-all hover:border-[rgba(104,80,190,0.4)] focus:border-[#6850BE] focus:shadow-[0_0_0_3px_rgba(104,80,190,0.1)]"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Senior Manager"
            />

            <label className="block text-[12px] font-[700] text-[#666] mb-2 uppercase tracking-[0.5px]">Description</label>
            <textarea
              className="w-full px-4 py-3 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] mb-6 outline-none bg-white/50 transition-all hover:border-[rgba(104,80,190,0.4)] focus:border-[#6850BE] focus:shadow-[0_0_0_3px_rgba(104,80,190,0.1)] min-h-[100px] resize-none"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the role and its responsibilities..."
            />

            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] cursor-pointer hover:bg-[rgba(104,80,190,0.05)] transition-all"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 premium-button text-white rounded-lg text-[14px] cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-[999]" onClick={() => setEditModal(false)}>
          <div className="modal-animate bg-white/80 backdrop-blur-2xl rounded-[20px] p-[32px] w-[480px] max-w-[90vw] max-h-[90vh] overflow-auto shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/30" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-[700] text-[#333]">Update Role</h2>
              <button
                className="premium-button px-3 py-2 text-white rounded-lg text-[12px] cursor-pointer"
                onClick={() => handledelete(roleid)}
              >
                Delete
              </button>
            </div>

            <label className="block text-[12px] font-[700] text-[#666] mb-2 uppercase tracking-[0.5px]">Role Name</label>
            <input
              className="w-full px-4 py-3 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] mb-4 outline-none bg-white/50 transition-all hover:border-[rgba(104,80,190,0.4)] focus:border-[#6850BE] focus:shadow-[0_0_0_3px_rgba(104,80,190,0.1)]"
              value={eroleName}
              onChange={(e) => seteRoleName(e.target.value)}
            />

            <label className="block text-[12px] font-[700] text-[#666] mb-2 uppercase tracking-[0.5px]">Description</label>
            <textarea
              className="w-full px-4 py-3 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] mb-4 outline-none bg-white/50 transition-all hover:border-[rgba(104,80,190,0.4)] focus:border-[#6850BE] focus:shadow-[0_0_0_3px_rgba(104,80,190,0.1)] min-h-[100px] resize-none"
              value={edetails}
              onChange={(e) => seteDetails(e.target.value)}
            />

            <label className="block text-[12px] font-[700] text-[#666] mb-3 uppercase tracking-[0.5px]">Assign Users</label>

            {loadingUsers ? (
              <p className="text-[14px] text-[#666] mb-4">Loading users...</p>
            ) : (
              <div className="flex flex-col gap-2 mb-6 max-h-[200px] overflow-auto">
                {users
                  .filter((u) => u.roleid === roleid)
                  .map((user) => (
                    <div key={user._id} className="flex items-center gap-3 p-3 border border-[rgba(104,80,190,0.1)] rounded-lg hover:bg-[rgba(104,80,190,0.05)] transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                        className="cursor-pointer"
                      />
                      <div className="flex-1">
                        <strong className="text-[14px] text-[#333]">{user.name}</strong>
                        <p className="text-[12px] text-[#6b7280]">{user.designation?.name || ""}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 border border-[rgba(104,80,190,0.2)] rounded-lg text-[14px] cursor-pointer hover:bg-[rgba(104,80,190,0.05)] transition-all"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 premium-button text-white rounded-lg text-[14px] cursor-pointer disabled:opacity-50"
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

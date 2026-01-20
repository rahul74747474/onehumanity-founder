import React, { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, Users, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { InfoTooltip } from "./InfoTooltip";

export default function Announcementpage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General Announcement");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Employees");
  const [priority, setPriority] = useState("High");
  const [channels, setChannels] = useState({ banner: true, email: false, push: false });
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [teamsOverlayOpen, setTeamsOverlayOpen] = useState(false);
  const [peopleOverlayOpen, setPeopleOverlayOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");

  const [active, setActive] = useState("create");
  const [announcements, setAnnouncements] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishStep, setPublishStep] = useState("");

  const [redFlags, setRedFlags] = useState([]);
  const [filteredRedFlags, setFilteredRedFlags] = useState([]);
  const [activeTab, setActiveTab] = useState("All Issues");
  const [selectedRecipients, setSelectedRecipients] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getroles`);
        if (r?.data?.message) setTeams(r.data.message);
      } catch (e) {
        console.log("roles fetch error", e.message);
      }
    })();

    (async () => {
      try {
        const r = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getalluser`, { withCredentials: true });
        if (r?.data?.message) setEmployees(r.data.message);
      } catch (e) {
        console.log("users fetch error", e.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getannouncements`);
        if (r?.data?.message) setAnnouncements(r.data.message);
      } catch (e) {
        console.log("announcements fetch error", e.message);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://backonehf.onrender.com/api/v1/admin/getredflags`, { withCredentials: true });
        const today = new Date().toISOString().split("T")[0];
        const todays = (r?.data?.message || []).filter((f) => {
          const flagDate = new Date(f.date).toISOString().split("T")[0];
          return flagDate === today;
        });
        setRedFlags(todays);
      } catch (e) {
        console.log("redflags fetch error", e.message);
      }
    })();
  }, []);

  const filteredCounts = {
    "All Issues": redFlags.length,
    "Missed Report": redFlags.filter((f) => f.type.includes("Missed Report")).length,
    "Low Performance": redFlags.filter((f) => f.type.includes("Low Performance")).length,
    "Inactive User": redFlags.filter((f) => f.type.includes("Inactive User")).length,
  };

  useEffect(() => {
    if (activeTab === "All Issues") setFilteredRedFlags(redFlags);
    else setFilteredRedFlags(redFlags.filter((f) => {
      if (activeTab === "Missed Report") return f.type.includes("Missed Report");
      if (activeTab === "Low Performance") return f.type.includes("Low Performance");
      if (activeTab === "Inactive User") return f.type.includes("Inactive User");
      return false;
    }));
  }, [activeTab, redFlags]);

  const toggleTeamSelect = (id) => setSelectedTeams((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const togglePersonSelect = (id) => setSelectedPeople((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleRecipientSelect = (id) => setSelectedRecipients((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const handleSelectAll = () => {
    const ids = filteredRedFlags.map((f) => f.userId);
    setSelectedRecipients(ids);
  };

  const handlePublish = async () => {
    if (!title || !message) {
      toast.error("Title and message required");
      return;
    }

    const payload = {
      title,
      type,
      message,
      audience,
      selectedTeams,
      selectedPeople,
      priority,
      channels,
      scheduledAt: scheduleLater ? scheduledAt : null,
    };

    try {
      setPublishing(true);
      setPublishStep("Finding users");
      await new Promise(r => setTimeout(r, 700));
      setPublishStep("Extracting mail IDs");
      await new Promise(r => setTimeout(r, 700));
      setPublishStep("Sending emails");

      const r = await axios.post(
        `https://backonehf.onrender.com/api/v1/admin/announcement`,
        payload,
        { withCredentials: true }
      );

      setPublishStep("Announcement published");
      toast.success("Announcement Created");

      setTimeout(() => {
        setPublishing(false);
        setPublishStep("");
        setTitle("");
        setMessage("");
        setAudience("All Employees");
        setSelectedTeams([]);
        setSelectedPeople([]);
        setScheduleLater(false);
        setScheduledAt("");
      }, 900);

    } catch (e) {
      setPublishing(false);
      setPublishStep("");
      toast.error("Could not create announcement");
    } finally {
      window.location.reload();
    }
  };

  const getAudienceCount = (a) => {
    const teamsCount = (a?.includeTeams || []).length;
    const usersCount = (a?.includeUsers || []).length;
    return Math.max(1, teamsCount + usersCount);
  };

  const filteredTeams = useMemo(
    () => teams.filter((t) => String(t.rolename || "").toLowerCase().includes(teamSearch.toLowerCase())),
    [teams, teamSearch]
  );
  const filteredPeople = useMemo(
    () => employees.filter((u) => String(u.name || "").toLowerCase().includes(peopleSearch.toLowerCase())),
    [employees, peopleSearch]
  );

  return (
    <div className="font-['Inter'] text-[#111827] bg-[rgba(249,250,251,1)]">
      <div className="w-full px-7 py-7 bg-white border-b border-[rgba(229,231,235,1)]">
        <h1 className="m-0 text-[#5b2db6] text-[22px] font-[700] flex items-center gap-2">
          Announcements & Broadcast
          <InfoTooltip text="Create and manage organization-wide communications" />
        </h1>
        <p className="text-[#6b7280] text-[13px] mt-1.5">Create and manage company-wide communications, team updates, and targeted notifications</p>

        <div className="flex gap-10 mt-5 border-b border-[rgba(229,231,235,1)] pb-5">
          <span
            className={`text-[16px] font-[400] cursor-pointer pb-5 border-b-2 ${active === "create" ? "text-[#5b2db6] border-b-[rgba(104,78,185,1)]" : "text-[#9CA3AF]"}`}
            onClick={() => setActive("create")}
          >
            + Create Announcement
          </span>
          <span
            className={`text-[16px] font-[400] cursor-pointer pb-5 border-b-2 ${active === "history" ? "text-[#5b2db6] border-b-[rgba(104,78,185,1)]" : "text-[#9CA3AF]"}`}
            onClick={() => setActive("history")}
          >
            Archive & History
          </span>
          <span
            className={`text-[16px] font-[400] cursor-pointer pb-5 border-b-2 ${active === "target" ? "text-[#5b2db6] border-b-[rgba(104,78,185,1)]" : "text-[#9CA3AF]"}`}
            onClick={() => setActive("target")}
          >
            Targeted Notifications
          </span>
        </div>
      </div>

      {active === "create" && (
        <div className="mx-[18px] mt-[18px] rounded-[10px] bg-white border border-[#eef2f7] px-5 py-5 shadow-[0_6px_20px_rgba(99,102,241,0.03)]">
          <div>
            <h2 className="m-0 text-[18px] text-[#111827]">Create New Announcement</h2>
            <div className="text-[#6b7280] text-[13px] mt-2">Compose and schedule announcements, updates, or targeted communications</div>
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Communication Type</label>
            <div className="flex gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="checkbox" checked={type === "General Announcement"} onChange={() => setType("General Announcement")} />
                General Announcement
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="checkbox" checked={type === "Warning/Inquiry"} onChange={() => setType("Warning/Inquiry")} />
                Warning/Inquiry
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="checkbox" checked={type === "Motivational"} onChange={() => setType("Motivational")} />
                Motivational
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Title <span className="text-red-600 ml-1">*</span></label>
            <input className="w-full px-3 py-2.5 rounded-[10px] border border-[#e6e9ef] bg-white outline-none text-[14px]" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter announcement title" />
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Message <span className="text-red-600 ml-1">*</span></label>
            <textarea className="w-full px-3 py-3 rounded-[10px] border border-[#e6e9ef] bg-white outline-none text-[14px] min-h-[110px]" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." />
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Audience Group</label>
            <div className="flex gap-3 flex-wrap items-center">
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="aud" checked={audience === "All Employees"} onChange={() => setAudience("All Employees")} />
                <div>All Employees</div>
              </label>

              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="aud" checked={audience === "Specific Teams"} onChange={() => setAudience("Specific Teams")} />
                <div>
                  Specific Teams
                  {audience === "Specific Teams" && <button className="ml-3 px-2.5 py-1.5 text-[13px] border border-[#ddd] rounded-lg bg-transparent cursor-pointer hover:bg-gray-50" onClick={() => setTeamsOverlayOpen(true)}>Select Teams</button>}
                </div>
              </label>

              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="aud" checked={audience === "Individual Recipients"} onChange={() => setAudience("Individual Recipients")} />
                <div>
                  Individual Recipients
                  {audience === "Individual Recipients" && <button className="ml-3 px-2.5 py-1.5 text-[13px] border border-[#ddd] rounded-lg bg-transparent cursor-pointer hover:bg-gray-50" onClick={() => setPeopleOverlayOpen(true)}>Select People</button>}
                </div>
              </label>
            </div>

            <div className="flex gap-2 flex-wrap mt-2.5">
              {selectedTeams.map((id) => {
                const t = teams.find((x) => x._id === id);
                return <div key={id} className="bg-[#f6f0ff] text-[#5b2db6] px-2.5 py-1.5 rounded-full text-[13px]">{t?.rolename}</div>;
              })}
              {selectedPeople.map((id) => {
                const p = employees.find((x) => x._id === id);
                return <div key={id} className="bg-[#f6f0ff] text-[#5b2db6] px-2.5 py-1.5 rounded-full text-[13px]">{p?.name}</div>;
              })}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Priority Level</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="priority" checked={priority === "High"} onChange={() => setPriority("High")} />
                High
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="priority" checked={priority === "Medium"} onChange={() => setPriority("Medium")} />
                Medium
              </label>
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="radio" name="priority" checked={priority === "Low"} onChange={() => setPriority("Low")} />
                Low
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Delivery Channels</label>
            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2.5 bg-[#fafafa] rounded-[10px] px-3 py-3 border border-[#f1f3f7]">
                <input type="checkbox" checked={channels.banner} onChange={() => setChannels((c) => ({ ...c, banner: !c.banner }))} />
                <div>
                  <div className="font-[600] text-[#111827]">Dashboard Banner</div>
                  <div className="text-[12px] text-[#6b7280] mt-1">Display as a prominent banner on the main dashboard</div>
                </div>
              </label>
              <label className="flex items-start gap-2.5 bg-[#fafafa] rounded-[10px] px-3 py-3 border border-[#f1f3f7]">
                <input type="checkbox" checked={channels.email} onChange={() => setChannels((c) => ({ ...c, email: !c.email }))} />
                <div>
                  <div className="font-[600] text-[#111827]">Email Notification</div>
                  <div className="text-[12px] text-[#6b7280] mt-1">Send email to all recipients</div>
                </div>
              </label>
              <label className="flex items-start gap-2.5 bg-[#fafafa] rounded-[10px] px-3 py-3 border border-[#f1f3f7]">
                <input type="checkbox" checked={channels.push} onChange={() => setChannels((c) => ({ ...c, push: !c.push }))} />
                <div>
                  <div className="font-[600] text-[#111827]">In-App Push Notification</div>
                  <div className="text-[12px] text-[#6b7280] mt-1">Real-time push notifications within the app (coming soon)</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[#374151] font-[600] text-[13px] mb-2">Schedule</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-[14px] text-[#374151]">
                <input type="checkbox" checked={scheduleLater} onChange={() => setScheduleLater((s) => !s)} />
                Schedule for later
              </label>
              {scheduleLater && <input className="px-3 py-2 border border-[#6d5bd0] rounded-lg text-[14px] outline-none" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />}
            </div>
          </div>

          <div className="flex justify-between items-center mt-7 pt-5 border-t border-[rgba(229,231,235,1)]">
            <button
              className="px-[18px] py-2.5 bg-white border border-[#e6e9ef] rounded-lg cursor-pointer text-[14px] hover:bg-gray-50"
              onClick={() => {
                setTitle("");
                setMessage("");
                setType("General Announcement");
                setAudience("All Employees");
                setSelectedTeams([]);
                setSelectedPeople([]);
                setPriority("High");
                setChannels({ banner: true, email: false, push: false });
                setScheduleLater(false);
                setScheduledAt("");
              }}
            >
              Reset
            </button>
            <button
              className="px-[18px] py-2.5 bg-[#6b2db6] text-white rounded-lg cursor-pointer text-[14px] font-[600] hover:bg-[#5a25a0]"
              onClick={handlePublish}
            >
              Publish Announcement
            </button>
          </div>
        </div>
      )}

      {active === "history" && (
        <div className="px-5 py-5">
          <h2 className="text-[20px] font-[600]">Announcement Archive & History</h2>
          <p className="text-[14px] text-[#777] mt-1">View and track all previous announcements and their engagement metrics</p>

          {announcements.map((a, i) => (
            <div key={i} className="bg-white px-5 py-5 rounded-[10px] border border-[#ececec] mt-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[18px] font-[600] m-0">{a.title}</h3>
                  <div className="flex gap-2.5 mt-1.5">
                    <span className={`px-2.5 py-1.5 rounded-full text-[12px] font-[500] ${a.priority === "High" ? "bg-[#ffe3e3] text-[#d9534f]" : a.priority === "Medium" ? "bg-[#fff4d2] text-[#a67500]" : "bg-[#d9ecff] text-[#0062cc]"}`}>{a.priority}</span>
                    <span className="px-2.5 py-1.5 rounded-full text-[12px] font-[500] bg-[#eaffea] text-[#29a45e]">Published</span>
                    <span className="px-2.5 py-1.5 rounded-full text-[12px] font-[500] bg-[#e4eaff] text-[#3a57e8]">{a.type}</span>
                  </div>
                </div>

                <div className="text-right w-[80px]">
                  <div className="text-[16px] font-[700]">
                    {a.readby}/{getAudienceCount(a.audience)}
                  </div>
                  <div className="bg-[#e6e6e6] h-1.5 mt-1 rounded-full overflow-hidden">
                    <div className="h-full bg-[#33cc66]" style={{ width: `${(a.readby / getAudienceCount(a.audience)) * 100}%` }} />
                  </div>
                  <div className="text-[12px] text-[#777] mt-1">Read</div>
                </div>
              </div>

              <p className="mt-5 text-[14px] text-[#444]">{a.details}</p>

              <div className="flex gap-5 mt-3 text-[14px] text-[#555]">
                <span className="flex items-center gap-2"><Calendar size={16} />{new Date(a.createdon || a.createdAt).toLocaleString("en-IN")}</span>
                <span className="flex items-center gap-2"><Users size={16} />{a.audience?.name || "All Employees"}</span>
                {a.scheduledon && <span className="flex items-center gap-2 text-[#3a57e8] font-[500]"><Clock size={16} />Scheduled: {new Date(a.scheduledon).toLocaleString("en-IN")}</span>}
              </div>

              <div className="flex justify-between items-center mt-7 pt-3 border-t border-[rgba(229,231,235,1)]">
                <div className="text-[14px]">Channels: {(a.channels || []).map((c, idx) => <span key={idx} className="bg-[#f3f3f3] px-2.5 py-1.5 rounded text-[12px] border border-[#ddd] ml-2">{c}</span>)}</div>
                <div className="text-[13px] text-[#666]">By {a.scheduledby || "System"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {active === "target" && (
        <div className="px-5 py-5">
          <div className="bg-[#fff9e6] border border-[#fde2a7] px-3.5 py-3.5 rounded-[12px] flex gap-3 items-start mb-3.5">
            <span className="text-[22px] mr-2">⚠️</span>
            <div>
              <p className="text-[rgba(123,51,6,1)] font-[400] text-[16px] m-0">Targeted Notifications for Red-Flag Users</p>
              <p className="text-[rgba(187,77,0,1)] font-[400] text-[14px] mt-1.5 m-0">Send warning or inquiry messages to users requiring attention. This feature supports both disciplinary and motivational communication.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 mb-3.5 bg-white border border-[rgba(229,231,235,1)] px-[25px] py-[25px] rounded-[10px]">
            <h4 className="m-0">Filter Red-Flag Users</h4>
            <div className="flex gap-2.5 items-center flex-wrap">
              {["All Issues", "Missed Report", "Low Performance", "Inactive User"].map((tab) => (
                <div
                  key={tab}
                  className={`px-3.5 py-2 rounded-[10px] text-[13px] cursor-pointer ${activeTab === tab ? "bg-[rgba(104,80,190,1)] text-white" : "bg-[#e3e4e5] text-[rgba(54,65,83,1)]"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab} ({filteredCounts[tab] || 0})
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-3 font-[700] text-[#111827]">
            <span>Select Recipients</span>
            <button className="bg-transparent border-none text-[#6b7280] cursor-pointer font-[600] hover:text-[#3b82f6]" onClick={handleSelectAll}>
              Select All
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredRedFlags.length === 0 ? (
              <div className="px-7.5 py-7.5 text-center text-[#9ca3af] border border-dashed border-[#f1f5f9] bg-white rounded-[10px]">
                No issues found for today.
              </div>
            ) : (
              filteredRedFlags.map((rf) => {
                const user = employees.find((u) => String(u._id) === String(rf.userId));
                return (
                  <div key={rf._id} className="bg-white border border-[#eef2f6] rounded-[10px] px-3.5 py-3 flex gap-3 items-start">
                    <input
                      type="checkbox"
                      className="mt-1.5"
                      checked={selectedRecipients.includes(rf.userId)}
                      onChange={() => toggleRecipientSelect(rf.userId)}
                    />
                    <img src={user?.profilepicture || `https://i.pravatar.cc/48?u=${rf.userId}`} alt="" className="w-11 h-11 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-[700] text-[#111827]">{user?.name || "Unknown"}</div>
                      <div className="text-[#6b7280] text-[13px] mt-1">{user?.designation?.name || "No Role Assigned"}</div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[12px] px-2 py-1 rounded-lg ${rf.severity?.toLowerCase() === "high" ? "bg-[#ffecec] text-[#b91c1c]" : rf.severity?.toLowerCase() === "medium" ? "bg-[#fff7e6] text-[#b76e00]" : "bg-[#e6f7ea] text-[#0b7a40]"}`}>
                          {rf.severity?.toUpperCase()}
                        </span>
                        {rf.type?.map((t, idx) => (
                          <span key={idx} className="text-[12px] px-2 py-1 rounded-lg bg-[#f3f4f6] text-[#374151]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {teamsOverlayOpen && (
        <div className="fixed inset-0 bg-[rgba(15,23,42,0.35)] flex items-center justify-center z-[1000]" onClick={() => setTeamsOverlayOpen(false)}>
          <div className="bg-white rounded-[12px] px-4 py-3.5 w-[600px] max-w-[92%] shadow-[0_12px_30px_rgba(2,6,23,0.18)] border border-[#eef2f7]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="text-[18px]">Select Teams</h3>
              <button className="bg-transparent border-none cursor-pointer text-[16px]" onClick={() => setTeamsOverlayOpen(false)}><X size={16} /></button>
            </div>

            <input
              className="w-full px-2.5 py-2.5 rounded-lg border border-[#eee] mb-2.5 text-[15px] outline-none"
              placeholder="Search teams..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
            />

            <div className="max-h-[300px] overflow-auto px-1.5 flex flex-col gap-2">
              {filteredTeams.map((t) => (
                <label key={t._id} className="flex gap-2.5 items-center px-2.5 py-2.5 rounded-lg bg-white border border-[#f3f4f6]">
                  <input type="checkbox" checked={selectedTeams.includes(t._id)} onChange={() => toggleTeamSelect(t._id)} />
                  <div>{t.rolename}</div>
                </label>
              ))}
            </div>

            <div className="flex justify-between gap-2 mt-3 pt-3 border-t border-[#eef2f6]">
              <button className="bg-white border border-[#eef2f6] px-3.5 py-2.5 rounded-lg cursor-pointer text-[14px]" onClick={() => setSelectedTeams([])}>
                Clear
              </button>
              <button
                className="bg-[#6d28d9] text-white px-3.5 py-2.5 rounded-lg cursor-pointer text-[14px] hover:bg-[#5a20b8]"
                onClick={() => setTeamsOverlayOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {peopleOverlayOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-[999]" onClick={() => setPeopleOverlayOpen(false)}>
          <div className="bg-white rounded-[14px] px-5 py-5 w-[420px] max-w-[92%] max-h-[85vh] overflow-auto flex flex-col shadow-[0_12px_30px_rgba(2,6,23,0.18)]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center text-[18px] font-[600] mb-2.5">
              <span>Select Recipients</span>
              <button className="bg-transparent border-none text-[22px] cursor-pointer" onClick={() => setPeopleOverlayOpen(false)}>×</button>
            </div>

            <input
              type="text"
              className="w-full px-3 py-3 rounded-[10px] border border-[#ddd] mb-3 text-[15px] outline-none"
              placeholder="Search people..."
              value={peopleSearch}
              onChange={(e) => setPeopleSearch(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto flex flex-col gap-2">
              {filteredPeople.map((user) => (
                <label key={user._id} className="flex items-center px-3 py-3 mb-2.5 border-b border-[rgba(229,231,235,1)] rounded-[12px] bg-[#fafafa] cursor-pointer gap-3 hover:bg-[#f0f0f0]">
                  <input type="checkbox" className="w-[18px] h-[18px]" checked={selectedPeople.includes(user._id)} onChange={() => togglePersonSelect(user._id)} />
                  <img src={user.profilepicture || `https://i.pravatar.cc/48?u=${user._id}`} className="w-11 h-11 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <div className="text-[16px] font-[600]">{user.name}</div>
                    <div className="text-[13px] text-[#6d6d6d]">{user.role}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between items-center gap-2 mt-3 pt-3 border-t border-[#bbb]">
              <button className="px-[18px] py-2.5 rounded-[10px] border border-[#bbb] bg-white cursor-pointer" onClick={() => setSelectedPeople([])}>
                Clear
              </button>
              <button
                className="px-[18px] py-2.5 rounded-[10px] bg-[#6c3aed] text-white border-none cursor-pointer hover:bg-[#5a2fb8]"
                onClick={() => setPeopleOverlayOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {publishing && (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.75)] backdrop-blur z-[9999] flex items-center justify-center">
          <div className="bg-white px-9 py-7 rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.12)] text-center min-w-[260px]">
            <div className="flex justify-center gap-2 mb-3.5">
              <span className="w-2.5 h-2.5 bg-[#6850BE] rounded-full animate-bounce" style={{ animationDelay: "-0.32s" }} />
              <span className="w-2.5 h-2.5 bg-[#6850BE] rounded-full animate-bounce" style={{ animationDelay: "-0.16s" }} />
              <span className="w-2.5 h-2.5 bg-[#6850BE] rounded-full animate-bounce" />
            </div>
            <p className="text-[14px] font-[500] text-[#444]">{publishStep}...</p>
          </div>
        </div>
      )}
    </div>
  );
}

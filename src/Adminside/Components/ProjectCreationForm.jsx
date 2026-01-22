import React, { useState } from 'react';
import {
    Calendar,
    User,
    Users,
    FileText,
    Search,
    Plus,
    X,
    Briefcase,
    ChevronDown,
    Layout,
    Clock,
    CheckCircle2
} from 'lucide-react';

const ProjectCreationForm = ({ onNext, onCancel }) => {
    // State for form fields
    const [formData, setFormData] = useState({
        projectName: '',
        projectManager: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    // Mock data for people
    const people = [
        { id: 1, name: 'Aarav Mehta', role: 'Administrator', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        { id: 2, name: 'Saksham Saxena', role: 'Product Owner', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 3, name: 'Sarah Chen', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024e' },
        { id: 4, name: 'Mike Ross', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026025d' },
    ];

    // State for team selection
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [selectedRole, setSelectedRole] = useState('Developer');
    const [teamMembers, setTeamMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMember = () => {
        if (!selectedMemberId) return;

        const person = people.find(p => p.id === parseInt(selectedMemberId));
        if (person && !teamMembers.find(m => m.id === person.id)) {
            setTeamMembers([...teamMembers, { ...person, projectRole: selectedRole }]);
            setSelectedMemberId(''); // Reset selection
        }
    };

    const removeMember = (id) => {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', { ...formData, teamMembers });
        // Add logic to submit to backend
    };

    return (
       <div
  className="bg-transparent p-4 md:p-8"
  onClick={(e) => e.stopPropagation()}
>


            {/* Main Container */}
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: The Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">

                        {/* Form Header */}
                        <div className="bg-white px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
                                <p className="text-slate-500 text-sm mt-1">Fill in the details to kickstart your new initiative.</p>
                            </div>
                            <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                <Layout size={20} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">

                            {/* Section 1: Project Details */}
                            <div className="space-y-6">
                                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Project Details</h2>

                                {/* Project Name */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Project Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Briefcase size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formData.projectName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Website Redesign Q1"
                                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Project Manager */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Project Manager <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <select
                                            name="projectManager"
                                            value={formData.projectManager}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="">Select a manager</option>
                                            {people.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                            <ChevronDown size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Duration Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Calendar size={18} />
                                            </div>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-600"
                                            />
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            End Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Clock size={18} />
                                            </div>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 my-8"></div>

                            {/* Section 2: Team Assignment */}
                            <div className="space-y-6">
                                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Team & Roles</h2>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    {/* Select Member */}
                                    <div className="md:col-span-5 group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Assign Member
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <Users size={18} />
                                            </div>
                                            <select
                                                value={selectedMemberId}
                                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                                className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="">Select employee</option>
                                                {people.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Select Role */}
                                    <div className="md:col-span-5 group">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Assign Role
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                <CheckCircle2 size={18} />
                                            </div>
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="Developer">Developer</option>
                                                <option value="Designer">Designer</option>
                                                <option value="QA Engineer">QA Engineer</option>
                                                <option value="Product Owner">Product Owner</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                                <ChevronDown size={16} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <div className="md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={handleAddMember}
                                            disabled={!selectedMemberId}
                                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                        >
                                            <Plus size={20} />
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Selected Members List (Mini View) */}
                                {teamMembers.length > 0 && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Added Members</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {teamMembers.map((member) => (
                                                <div key={member.id} className="flex items-center gap-3 bg-white pl-2 pr-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                                                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-slate-700">{member.name}</span>
                                                        <span className="text-[10px] text-indigo-500 font-medium">{member.projectRole}</span>
                                                    </div>
                                                    <button onClick={() => removeMember(member.id)} className="ml-1 text-slate-400 hover:text-red-500 transition-colors">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-100 my-8"></div>

                            {/* Section 3: Description */}
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Description
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <FileText size={18} />
                                        </div>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            placeholder="Describe the project scope, goals, and key deliverables..."
                                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="px-6 py-2.5 border border-slate-200 rounded-lg"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={onNext}
                                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-lg"
                                >
                                    Continue →
                                </button>
                            </div>


                        </form>
                    </div>
                </div>

                {/* Right Column: Search & Info */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Search Card */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search people..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Search size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Directory Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col max-h-[400px]">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-700">Directory</h3>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {people
                                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((person) => (
                                    <div key={person.id} className="group flex items-center p-3 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer border border-transparent hover:border-indigo-100">
                                        <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{person.name}</p>
                                            <p className="text-xs text-slate-500">{person.role}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedMemberId(person.id);
                                                // Optional: Scroll to form or highlight form
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-indigo-600 bg-white rounded-lg shadow-sm transition-all"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Selected Summary Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl shadow-indigo-200 text-white p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10 blur-xl"></div>

                        <h3 className="font-semibold text-lg mb-4 relative z-10">Project Summary</h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-indigo-100 text-sm">
                                <span>Team Members</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-white font-medium">{teamMembers.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-indigo-100 text-sm">
                                <span>Duration</span>
                                <span className="font-medium text-white">
                                    {formData.startDate && formData.endDate
                                        ? `${Math.round((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} Days`
                                        : 'Not set'}
                                </span>
                            </div>
                        </div>

                        {teamMembers.length > 0 ? (
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <p className="text-xs text-indigo-200 mb-2">Team Lead</p>
                                <div className="flex items-center gap-2">
                                    <img src={teamMembers[0].avatar} className="w-8 h-8 rounded-full border-2 border-indigo-500" />
                                    <span className="text-sm font-medium">{teamMembers[0].name}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 pt-4 border-t border-white/20">
                                <p className="text-xs text-indigo-200 italic">No members added yet</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectCreationForm;
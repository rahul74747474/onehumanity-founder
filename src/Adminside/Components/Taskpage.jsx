import React, { useState, useEffect, useMemo, useRef } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  ChevronDown,
  LayoutList,
  LayoutDashboard,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  MessageSquare,
  X,
  AlignLeft,
  CheckSquare,
  ArrowRight,
  MoreVertical,
  Flag
} from 'lucide-react';

/**
 * ----------------------------------------------------------------------
 * DESIGN SYSTEM CONSTANTS
 * ----------------------------------------------------------------------
 */
const COLORS = {
  primary: '#33204C',
  primarySoft: '#ede9fe',
  border: '#ddd6fe',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  bg: '#f6f7fb',
};

/**
 * ----------------------------------------------------------------------
 * MOCK DATA
 * ----------------------------------------------------------------------
 */
const USERS = [
  { id: 1, name: 'Alex Morgan', avatar: 'AM', color: 'bg-blue-600' },
  { id: 2, name: 'Sarah Chen', avatar: 'SC', color: 'bg-emerald-600' },
  { id: 3, name: 'James Wilson', avatar: 'JW', color: 'bg-indigo-600' },
  { id: 4, name: 'Emily R.', avatar: 'ER', color: 'bg-purple-600' },
];

const INITIAL_TASKS = [
  {
    id: 'T-101',
    title: 'Design System Update v2.0',
    description: 'Update the core typography and color palette to match the new brand guidelines.',
    status: 'In Progress',
    priority: 'High',
    assignee: USERS[0],
    dueDate: '2023-11-15',
    progress: 45,
    comments: 3,
    attachments: 2,
    createdAt: '2023-11-01',
    // timeline: [
    //   { id: 1, type: 'created', date: '2 days ago', user: 'Admin' },
    //   { id: 2, type: 'comment', date: '1 day ago', user: 'Alex Morgan', text: 'Started working on the typography tokens.' }
    // ]
  },
  {
    id: 'T-102',
    title: 'Q4 Marketing Campaign Assets',
    description: 'Create social media banners and email templates for the upcoming holiday season.',
    status: 'Blocked',
    priority: 'Medium',
    assignee: USERS[1],
    dueDate: '2023-11-20',
    progress: 0,
    comments: 0,
    attachments: 0,
    createdAt: '2023-11-02',
    // timeline: [{ id: 1, type: 'created', date: '5 hours ago', user: 'Admin' }]
  },
  {
    id: 'T-103',
    title: 'Fix Navigation Bug on Mobile',
    description: 'Menu does not collapse when clicking outside on iOS Safari.',
    status: 'Blocked',
    priority: 'High',
    assignee: USERS[2],
    dueDate: '2023-11-10',
    progress: 20,
    comments: 8,
    attachments: 1,
    createdAt: '2023-10-28',
    // timeline: [{ id: 1, type: 'status_change', date: '1 hour ago', user: 'James Wilson', from: 'In Progress', to: 'Blocked' }]
  },
  {
    id: 'T-104',
    title: 'Client Onboarding Flow',
    description: 'Implement the new 4-step wizard for new enterprise clients.',
    status: 'Done',
    priority: 'Low',
    assignee: USERS[3],
    dueDate: '2023-10-30',
    progress: 100,
    comments: 12,
    attachments: 4,
    createdAt: '2023-10-15',
    // timeline: [{ id: 1, type: 'completed', date: 'Yesterday', user: 'Emily R.' }]
  },
  {
    id: 'T-105',
    title: 'Update API Documentation',
    description: 'Reflect the changes made in the last release regarding the User endpoints.',
    status: 'In Progress',
    priority: 'Medium',
    assignee: USERS[0],
    dueDate: '2023-11-25',
    progress: 60,
    comments: 1,
    attachments: 0,
    createdAt: '2023-11-05',
    // timeline: []
  },
];

/**
 * ----------------------------------------------------------------------
 * UI ATOMS & UTILITIES
 * ----------------------------------------------------------------------
 */

const Button = ({ children, variant = 'primary', icon: Icon, onClick, className = '' }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: `text-white shadow-md hover:shadow-lg hover:-translate-y-0.5`, // Color applied via style prop or standard class for dynamic hex
    secondary: `bg-white text-gray-700 border border-[${COLORS.border}] hover:bg-[#f8fafc] shadow-sm hover:border-[#c4b5fd]`,
    ghost: "text-gray-500 hover:text-[#33204C] hover:bg-[#ede9fe]/50",
  };

  // Handling custom primary color specifically
  const style = variant === 'primary' ? { backgroundColor: COLORS.primary } : {};

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} style={style}>
      {Icon && <Icon size={18} strokeWidth={2.5} />}
      {children}
    </button>
  );
};

const Badge = ({ children, type = 'status', value }) => {
  const statusStyles = {
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-100',
    'Blocked': 'bg-red-50 text-red-700 border-red-100',
    'Done': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  const priorityStyles = {
    'High': 'bg-orange-50 text-orange-700 border-orange-100',
    'Medium': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'Low': 'bg-slate-50 text-slate-600 border-slate-100',
  };

  const style = type === 'status'
    ? statusStyles[value] || statusStyles['Todo']
    : priorityStyles[value] || priorityStyles['Low'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${style}`}>
      {children || value}
    </span>
  );
};

const Avatar = ({ user, size = 'sm' }) => {
  if (!user) return <div className="w-8 h-8 rounded-full bg-gray-200" />;

  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div className={`${sizeClass} rounded-full ${user.color} text-white flex items-center justify-center font-bold ring-2 ring-white shadow-sm`}>
      {user.avatar}
    </div>
  );
};

const CustomSelect = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-2xl text-sm font-medium text-gray-700 hover:bg-[#f9fafb] transition-all duration-200 ${isOpen ? 'ring-2 ring-[#ddd6fe] border-[#33204C]' : `border-[${COLORS.border}]`}`}
        style={{ borderColor: isOpen ? COLORS.primary : COLORS.border }}
      >
        <span className="text-gray-400 font-normal">{label}:</span>
        <span className="text-[#33204C]">{value}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#ddd6fe] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#ede9fe] hover:text-[#33204C] cursor-pointer transition-colors flex items-center justify-between group"
            >
              {opt}
              {value === opt && <CheckCircle2 size={14} className="text-[#33204C]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ value }) => (
  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
    <div
      className="h-full bg-[#33204C] transition-all duration-500 rounded-full"
      style={{ width: `${value}%` }}
    />
  </div>
);

/**
 * ----------------------------------------------------------------------
 * DRAWER COMPONENT (Add/Edit)
 * ----------------------------------------------------------------------
 */
const TaskDrawer = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState(task || {
    title: '', description: '', priority: 'Medium', assignee: USERS[0]
  });

  useEffect(() => {
    if (task) setFormData(task);
  }, [task]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col animate-in slide-in-from-right">

        {/* Drawer Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
          <div>
            <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              {task ? `Task ${task.id}` : 'New Task'}
            </span>
            <h2 className="text-2xl font-bold text-[#33204C] mt-1">
              {task ? 'Edit Task Details' : 'Create New Task'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xl font-semibold placeholder:text-gray-300 border-none focus:ring-0 p-0 text-gray-900"
            />
            <textarea
              placeholder="Add a description..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full h-24 text-gray-600 placeholder:text-gray-400 border-none focus:ring-0 p-0 resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-6 p-6 bg-[#f6f7fb] rounded-2xl border border-[#ddd6fe]/50">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-white border-gray-200 rounded-lg text-sm focus:ring-[#33204C] focus:border-[#33204C]"
              >
                {['In Progress', 'Blocked', 'Done'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-white border-gray-200 rounded-lg text-sm focus:ring-[#33204C] focus:border-[#33204C]"
              >
                {['Low', 'Medium', 'High'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Assignee</label>

              <CustomSelect
                label="Assign to"
                value={formData.assignee?.name || 'Select'}
                options={USERS.map(u => u.name)}
                onChange={(name) => {
                  const user = USERS.find(u => u.name === name);
                  setFormData({ ...formData, assignee: user });
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Due Date</label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-700 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave(formData)}>Save Changes</Button>
        </div>

      </div>
    </>
  );
};

/**
 * ----------------------------------------------------------------------
 * TASK CARD COMPONENTS
 * ----------------------------------------------------------------------
 */

const TaskListRow = ({ task, onClick }) => (
  <div
    onClick={onClick}
    className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white rounded-2xl border border-[#ddd6fe]/60 shadow-sm hover:shadow-lg hover:border-[#ddd6fe] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer mb-3"
  >
    {/* Left: Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-mono text-gray-400">#{task.id}</span>
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#33204C] transition-colors">{task.title}</h3>
      </div>
      <p className="text-sm text-gray-500 truncate max-w-md">{task.description}</p>
    </div>

    {/* Middle: Meta */}
    <div className="flex items-center gap-4 w-full sm:w-auto mt-3 sm:mt-0">
      <Badge value={task.priority} type="priority" />
      <Badge value={task.status} type="status" />

      <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 w-24">
        <Calendar size={14} />
        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </div>

      <div className="hidden lg:block w-24">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>
        <ProgressBar value={task.progress} />
      </div>

      <Avatar user={task.assignee} />

      <button className="p-2 text-gray-400 hover:text-[#33204C] hover:bg-[#ede9fe] rounded-lg transition-colors opacity-0 group-hover:opacity-100">
        <MoreHorizontal size={18} />
      </button>
    </div>
  </div>
);

const TaskBoardCard = ({ task, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-2xl border border-[#ddd6fe]/60 shadow-sm hover:shadow-md hover:border-[#ddd6fe] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-3 group"
  >
    <div className="flex justify-between items-start">
      <Badge value={task.priority} type="priority" />
      <button className="text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal size={16} />
      </button>
    </div>

    <div>
      <h4 className="font-semibold text-gray-900 leading-tight mb-1 group-hover:text-[#33204C] transition-colors">{task.title}</h4>
      <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
    </div>

    {task.progress > 0 && (
      <div className="w-full">
        <ProgressBar value={task.progress} />
      </div>
    )}

    <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
      <div className="flex items-center gap-3 text-gray-400">
        {(task.comments > 0 || task.attachments > 0) && (
          <div className="flex gap-2 text-xs">
            {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare size={12} /> {task.comments}</span>}
            {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip size={12} /> {task.attachments}</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {task.dueDate && (
          <span className={`text-xs font-medium ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
            {new Date(task.dueDate).getDate()}
          </span>
        )}
        <Avatar user={task.assignee} size="sm" />
      </div>
    </div>
  </div>
);

/**
 * ----------------------------------------------------------------------
 * STAT CARD COMPONENT
 * ----------------------------------------------------------------------
 */
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white p-5 rounded-2xl border border-[#ddd6fe]/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group cursor-default">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

/**
 * ----------------------------------------------------------------------
 * MAIN PAGE COMPONENT
 * ----------------------------------------------------------------------
 */
const TaskPage = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('All');

  // Stats Logic
  const stats = useMemo(() => ({
    total: tasks.length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length,
    dueToday: tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length,
    completed: Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) || 0
  }), [tasks]);

  // Filter Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchPriority = filterPriority === 'All' || task.priority === filterPriority;
      const matchAssignee = filterAssignee === 'All' || task.assignee.name === filterAssignee;
      return matchSearch && matchStatus && matchPriority && matchAssignee;
    });
  }, [tasks, searchQuery, filterStatus, filterPriority, filterAssignee]);

  // Handlers
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null); // New task
    setIsDrawerOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (selectedTask) {
      // Update existing
      setTasks(tasks.map(t => t.id === taskData.id ? taskData : t));
    } else {
      // Create new
      const newTask = {
        ...taskData,
        id: `T-${100 + tasks.length + 1}`,
        progress: 0,
        comments: 0,
        attachments: 0,
        createdAt: new Date().toISOString(),
        timeline: [{ id: 1, type: 'created', date: 'Just now', user: 'You' }]
      };
      setTasks([newTask, ...tasks]);
    }
    setIsDrawerOpen(false);
  };

  return (
    <div className={`min-h-screen pb-20 font-sans selection:bg-[#33204C] selection:text-white`} style={{ backgroundColor: COLORS.bg }}>

      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#ddd6fe] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-[#33204C] tracking-tight flex items-center gap-3">
                Tasks
                <span className="bg-[#ede9fe] text-[#33204C] text-xs px-2.5 py-1 rounded-full border border-[#ddd6fe] font-bold">
                  {tasks.length}
                </span>
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Manage, assign and track work across the team</p>
            </div>
            <Button variant="primary" icon={Plus} onClick={handleCreateTask}>Create Task</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* 2. Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={LayoutList} label="Total Tasks" value={stats.total} colorClass="bg-blue-500" />
          <StatCard icon={AlertCircle} label="Overdue" value={stats.overdue} colorClass="bg-red-500" />
          <StatCard icon={Calendar} label="Due Today" value={stats.dueToday} colorClass="bg-orange-500" />
          <StatCard icon={CheckCircle2} label="Completion" value={`${stats.completed}%`} colorClass="bg-emerald-500" />
        </div>

        {/* 3. Filter & Controls Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#ddd6fe]/60 flex flex-col xl:flex-row gap-4 justify-between items-center sticky top-24 z-40">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto overflow-visible pb-2 md:pb-0 no-scrollbar items-center">
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#33204C] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f6f7fb] border-none rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#33204C]/10 placeholder:text-gray-400 transition-all"
              />
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block mx-1"></div>

            <div className="flex gap-2 w-full md:w-auto">
              <CustomSelect label="Status" value={filterStatus} options={['All', 'In Progress', 'Blocked', 'Done']} onChange={setFilterStatus} />
              <CustomSelect label="Priority" value={filterPriority} options={['All', 'High', 'Medium', 'Low']} onChange={setFilterPriority} />
              <CustomSelect label="Assignee" value={filterAssignee} options={['All', ...USERS.map(u => u.name)]} onChange={setFilterAssignee} />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-[#f6f7fb] p-1 rounded-xl border border-gray-200/50">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-[#33204C] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutList size={16} /> List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'board' ? 'bg-white text-[#33204C] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutDashboard size={16} /> Board
            </button>
          </div>
        </div>

        {/* 4. Task Views */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#ddd6fe]">
            <div className="bg-[#ede9fe] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="text-[#33204C]" size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#33204C]">No tasks found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">There are no tasks matching your filters. Try adjusting them or create a new task to get started.</p>
            <Button variant="primary" className="mt-6" icon={Plus} onClick={handleCreateTask}>Create New Task</Button>
          </div>
        ) : (
          <>
            {viewMode === 'list' && (
              <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {filteredTasks.map(task => (
                  <TaskListRow key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                ))}
              </div>
            )}

            {viewMode === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full overflow-x-auto pb-4 animate-in fade-in zoom-in-95 duration-500">
                {['In Progress', 'Blocked', 'Done'].map(status => (
                  <div key={status} className="flex flex-col h-full bg-[#f8fafc] rounded-2xl p-3 border border-gray-200/60">
                    <div className="flex items-center justify-between px-2 mb-4">
                      <h4 className="font-bold text-gray-700 flex items-center gap-2">
                        {status}
                        <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{filteredTasks.filter(t => t.status === status).length}</span>
                      </h4>
                      <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                    </div>
                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar px-1">
                      {filteredTasks.filter(t => t.status === status).map(task => (
                        <TaskBoardCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
                      ))}
                      {filteredTasks.filter(t => t.status === status).length === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs font-medium italic">
                          Empty
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </main>

      <TaskDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskPage;
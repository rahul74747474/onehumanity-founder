import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Briefcase,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutGrid,
  List
} from 'lucide-react';

/**
 * ----------------------------------------------------------------------
 * MOCK DATA
 * ----------------------------------------------------------------------
 * Realistic data to populate the dashboard.
 */
const MOCK_EMPLOYEES = [
  { id: 1, firstName: 'Alex', lastName: 'Morgan', email: 'alex.m@company.com', role: 'Product Manager', designation: 'Admin', status: 'Active', performance: 92, tasks: 14, avatar: 'AM' },
  { id: 2, firstName: 'Sarah', lastName: 'Chen', email: 'sarah.c@company.com', role: 'Senior Developer', designation: 'Employee', status: 'Onboarding', performance: 65, tasks: 4, avatar: 'SC' },
  { id: 3, firstName: 'James', lastName: 'Wilson', email: 'j.wilson@company.com', role: 'UX Designer', designation: 'Employee', status: 'Active', performance: 88, tasks: 21, avatar: 'JW' },
  { id: 4, firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@company.com', role: 'QA Engineer', designation: 'QA', status: 'Inactive', performance: 0, tasks: 0, avatar: 'ER' },
  { id: 5, firstName: 'Michael', lastName: 'Chang', email: 'm.chang@company.com', role: 'Frontend Dev', designation: 'Employee', status: 'Active', performance: 78, tasks: 12, avatar: 'MC' },
  { id: 6, firstName: 'Lisa', lastName: 'Park', email: 'lisa.p@company.com', role: 'HR Manager', designation: 'HR', status: 'Active', performance: 95, tasks: 8, avatar: 'LP' },
  { id: 7, firstName: 'David', lastName: 'Kim', email: 'david.k@company.com', role: 'Backend Dev', designation: 'Employee', status: 'Onboarding', performance: 45, tasks: 6, avatar: 'DK' },
  { id: 8, firstName: 'Rachel', lastName: 'Green', email: 'r.green@company.com', role: 'Marketing Lead', designation: 'Employee', status: 'Active', performance: 82, tasks: 19, avatar: 'RG' },
];

const THEME = {
  primary: '#33204C',       // purple-600
  primaryDark: '#5b21b6',   // purple-800
  bgSoft: '#f6f7fb',
  card: '#ffffff',
  text: '#111827',
  textMuted: '#6b7280',
  borderSoft: '#e5e7eb',
  ring: 'rgba(124,58,237,0.25)',
};

/**
 * ----------------------------------------------------------------------
 * UI PRIMITIVES
 * ----------------------------------------------------------------------
 * Small, reusable atomic components ensuring consistent design language.
 */

const Button = ({ children, variant = 'primary', icon: Icon, onClick, className = '' }) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
  primary: `
    bg-[#33204C] text-white
    hover:bg-[#3f2a5e]
    shadow-lg hover:shadow-[0_12px_30px_rgba(51,32,76,0.45)]
    focus:ring-[#33204C]/30
  `,
  secondary: `
    bg-white text-[#33204C]
    border border-[#33204C]/20
    hover:bg-[#33204C]/5
    shadow-sm hover:shadow-md
    focus:ring-[#33204C]/20
  `,
  ghost: `
    text-[#33204C]
    hover:bg-[#33204C]/10
  `,
  danger: `
    bg-red-50 text-red-600
    hover:bg-red-100
    focus:ring-red-200
  `
};


  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const Badge = ({ status }) => {
  const styles = {
    Active: "bg-purple-100 text-purple-800 border border-purple-200",
    Onboarding: "bg-purple-50 text-purple-700 border border-purple-200",
    Inactive: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  const icons = {
    Active: CheckCircle2,
    Onboarding: Clock,
    Inactive: AlertCircle,
  };

  const Icon = icons[status] || CheckCircle2;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status]}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
};



const Avatar = ({ initials, size = 'md' }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white`}>
      {initials}
    </div>
  );
};

const ProgressBar = ({ value }) => {
  // Determine color based on value
  const getColor = (v) => {
    if (v >= 90) return 'bg-emerald-500';
    if (v >= 70) return 'bg-indigo-500';
    if (v >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500">Performance</span>
        <span className="text-xs font-bold text-gray-700">{value}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 block p-2.5 transition-all duration-200 outline-none placeholder:text-gray-400 ${Icon ? 'pl-10' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const Select = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-[#33204C] uppercase tracking-wider ml-1">
        {label}
      </label>
    )}

    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className="
          w-full
          bg-[#33204C]/5
          border border-[#33204C]/20
          text-[#33204C]
          text-sm font-medium
          rounded-xl
          focus:ring-2 focus:ring-[#33204C]/30
          focus:border-[#33204C]
          block p-2.5 pr-8
          appearance-none
          transition-all duration-200
          outline-none cursor-pointer
        "
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <ChevronDown
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-[#33204C]/70
          pointer-events-none
          group-hover:text-[#33204C]
          transition-colors
        "
        size={16}
      />
    </div>
  </div>
);


/**
 * ----------------------------------------------------------------------
 * MODAL COMPONENT
 * ----------------------------------------------------------------------
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
     <div
  className="relative rounded-2xl shadow-2xl w-full max-w-md p-6 border animate-in fade-in zoom-in-95 duration-300"
  style={{
    background: THEME.card,
    borderColor: THEME.borderSoft
  }}
>   <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

/**
 * ----------------------------------------------------------------------
 * MAIN DASHBOARD COMPONENT
 * ----------------------------------------------------------------------
 */
const EmployeePage = () => {
  // State
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRole, setFilterRole] = useState('All');
  const [filterDesignation, setFilterDesignation] = useState('All');

  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Product Manager',
    status: 'Active',
    designation: 'Employee'
  });

  // Simulate loading on mount
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Filter Logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;
      const matchesRole = filterRole === 'All' || emp.role === filterRole;
      const matchesDesignation = filterDesignation === 'All' || emp.designation === filterDesignation;

      return matchesSearch && matchesStatus && matchesRole && matchesDesignation;
    });
  }, [employees, searchQuery, filterStatus, filterRole, filterDesignation]);

  // Handlers
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const id = employees.length + 1;
    const initials = `${newEmployee.firstName[0]}${newEmployee.lastName[0]}`;
    const toAdd = { 
      id, 
      ...newEmployee, 
      avatar: initials.toUpperCase(), 
      performance: 0, 
      tasks: 0 
    };
    
    setEmployees([toAdd, ...employees]);
    setIsAddModalOpen(false);
    setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Product Manager',
        status: 'Active',
        designation: 'Employee'
    }); // Reset form
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    setEmployees(employees.map(emp => 
      emp.id === selectedEmployee.id ? selectedEmployee : emp
    ));
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const deleteEmployee = (id) => {
     // A realistic app would confirm first
     setEmployees(employees.filter(e => e.id !== id));
     setIsEditModalOpen(false);
  };

  return (
   <div
  className="min-h-screen text-gray-900 font-sans pb-20"
  style={{ background: THEME.bgSoft }}
>
  
      {/* 1. Header Section */}
<header
  className="sticky top-0 z-30 backdrop-blur-xl"
  style={{
    background: 'rgba(255,255,255,0.85)',
    borderBottom: `1px solid ${THEME.borderSoft}`
  }}
>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Employees
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full border border-gray-200 font-medium">
                  {employees.length}
                </span>
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">Manage team access, performance, and reports</p>
            </div>
            
            <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add Employee
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 2. Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between transition-all hover:shadow-md duration-300">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[rgba(124,58,237,0.25)]
focus:border-[#7c3aed] placeholder:text-gray-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="h-8 w-px bg-gray-200 hidden md:block mx-1"></div>
            
            <FilterDropdown 
              label="Status" 
              value={filterStatus} 
              options={['All', 'Active', 'Onboarding', 'Inactive']} 
              onChange={setFilterStatus} 
            />
            <FilterDropdown 
              label="Role" 
              value={filterRole} 
              options={['All', 'Product Manager', 'Senior Developer', 'UX Designer', 'Frontend Dev']} 
              onChange={setFilterRole} 
            />
             <FilterDropdown 
              label="Type" 
              value={filterDesignation} 
              options={['All', 'Admin', 'Employee', 'HR', 'QA']} 
              onChange={setFilterDesignation} 
            />
          </div>
        </div>

        {/* 3. Employees List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No employees found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => {setSearchQuery(''); setFilterStatus('All'); setFilterRole('All');}}
              className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEmployees.map((employee, index) => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee} 
                index={index}
                onEdit={() => openEditModal(employee)}
              />
            ))}
          </div>
        )}

        {/* 5. Pagination (Visual Only) */}
        {!isLoading && filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200/60">
                <span className="text-sm text-gray-500 font-medium">
                    Showing <span className="text-gray-900 font-bold">{filteredEmployees.length}</span> of {employees.length} employees
                </span>
                <div className="flex gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50" disabled>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-900 text-white shadow-md hover:bg-gray-800 transition-colors">
                        1
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
                        2
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors">
                        3
                    </button>
                     <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Add Employee Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Employee"
      >
        <form onSubmit={handleAddEmployee} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    label="First Name" 
                    placeholder="e.g. Jane" 
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    icon={User}
                />
                 <Input 
                    label="Last Name" 
                    placeholder="e.g. Doe" 
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                />
            </div>
            
            <Input 
                label="Email Address" 
                type="email" 
                placeholder="jane@company.com" 
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                icon={Mail}
            />

            <div className="grid grid-cols-2 gap-4">
                <Select 
                    label="Role"
                    options={['Product Manager', 'Senior Developer', 'UX Designer', 'Frontend Dev', 'QA Engineer', 'Marketing Lead']}
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                />
                <Select 
                    label="Designation"
                    options={['Employee', 'Admin', 'HR', 'QA']}
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>Cancel</Button>
                <Button type="submit">Create Profile</Button>
            </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Employee"
      >
        {selectedEmployee && (
             <form onSubmit={handleEditEmployee} className="space-y-5">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <Avatar initials={selectedEmployee.avatar} size="lg" />
                     <div>
                         <h4 className="font-bold text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</h4>
                         <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                     </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Select 
                        label="Status"
                        options={['Active', 'Onboarding', 'Inactive']}
                        value={selectedEmployee.status}
                        onChange={(e) => setSelectedEmployee({...selectedEmployee, status: e.target.value})}
                    />
                    <Select 
                        label="Role"
                        options={['Product Manager', 'Senior Developer', 'UX Designer', 'Frontend Dev', 'QA Engineer']}
                        value={selectedEmployee.role}
                        onChange={(e) => setSelectedEmployee({...selectedEmployee, role: e.target.value})}
                    />
                </div>

                <div className="pt-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">Performance Score</label>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedEmployee.performance} 
                        onChange={(e) => setSelectedEmployee({...selectedEmployee, performance: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Needs Improvement</span>
                        <span className="font-bold text-gray-900">{selectedEmployee.performance}%</span>
                        <span>Excellent</span>
                    </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-6">
                    <button 
                        type="button" 
                        onClick={() => deleteEmployee(selectedEmployee.id)}
                        className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                    >
                        Delete User
                    </button>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={(e) => { e.preventDefault(); setIsEditModalOpen(false); }}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </div>
            </form>
        )}
      </Modal>

    </div>
  );
};

/**
 * ----------------------------------------------------------------------
 * HELPER SUB-COMPONENTS
 * ----------------------------------------------------------------------
 */

const FilterDropdown = ({ label, value, options, onChange }) => (
  <div className="relative group">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        appearance-none
        bg-[#33204C]/5
        border border-[#33204C]/20
        hover:border-[#33204C]/40
        text-[#33204C]
        text-sm font-semibold
        rounded-xl
        pl-4 pr-9 py-2.5
        cursor-pointer
        focus:outline-none
        focus:ring-2 focus:ring-[#33204C]/30
        transition-all duration-200
        min-w-[140px]
      "
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt === 'All' ? `${label}: All` : opt}
        </option>
      ))}
    </select>

    {/* Chevron */}
    <ChevronDown
      className="
        absolute right-3 top-1/2 -translate-y-1/2
        text-[#33204C]/70
        pointer-events-none
        group-hover:text-[#33204C]
        transition-colors
      "
      size={16}
    />
  </div>
);


const EmployeeCard = ({ employee, index, onEdit }) => (
  <div 
    className="group bg-white rounded-2xl p-5 border border-gray-100/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#ddd6fe] hover:shadow-[0_10px_30px_rgba(124,58,237,0.12)]
 transition-all duration-300 cursor-pointer ease-out"
    style={{ animationDelay: `${index * 50}ms` }}
    onClick={onEdit}
  >
    <div className="flex items-center justify-between gap-6">
      
      {/* 1. Identity */}
      <div className="flex items-center gap-4 min-w-[200px] flex-1">
        <div className="relative">
            <Avatar initials={employee.avatar} />
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full`}></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{employee.firstName} {employee.lastName}</h3>
          <p className="text-xs text-gray-500 font-medium">{employee.email}</p>
        </div>
      </div>

      {/* 2. Role & Designation */}
      <div className="hidden md:flex flex-col w-48">
        <span className="text-sm font-semibold text-gray-700">{employee.role}</span>
        <span className="text-xs text-gray-400">{employee.designation}</span>
      </div>

      {/* 3. Status Pill */}
      <div className="w-32 hidden sm:flex">
        <Badge status={employee.status} />
      </div>

      {/* 4. Performance Bar */}
      <div className="w-48 hidden lg:block">
        <ProgressBar value={employee.performance} />
      </div>

      {/* 5. Tasks Count */}
      <div className="w-20 hidden xl:flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{employee.tasks}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Tasks</span>
      </div>

      {/* 6. Actions */}
      <div className="flex items-center justify-end w-10">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

    </div>
  </div>
);

export default EmployeePage;
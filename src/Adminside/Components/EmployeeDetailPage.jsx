import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, User, DollarSign, Clock, Zap, FileText, Activity } from 'lucide-react';
import axios from 'axios';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        'https://backonehf.onrender.com/api/v1/admin/getalluser',
        { withCredentials: true }
      );

      const emp = response.data.message.find(
        e => String(e._id) === String(id)
      );

      if (emp) setEmployee(emp);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployee();
}, [id]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-12 bg-slate-200 rounded-lg skeleton mb-6" />
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-[14px] skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <div className="card-base text-center py-12">
            <p className="text-slate-600">Employee not found</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'inactive':
        return 'bg-slate-100 text-slate-700';
      case 'on leave':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const calculateTenure = (joiningDate) => {
    if (!joiningDate) return 'N/A';
    const joining = new Date(joiningDate);
    const now = new Date();
    const months = (now.getFullYear() - joining.getFullYear()) * 12 + (now.getMonth() - joining.getMonth());
    return `${Math.floor(months / 12)}y ${months % 12}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </motion.button>

        {/* Page Title */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {employee.name}
          </h1>
          <p className="text-slate-600">
            Employees &gt; <span className="text-slate-900 font-medium">{employee.name}</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants} className="card-base">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-xl font-bold">
                  {employee.name?.charAt(0)?.toUpperCase() || 'E'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                  <p className="text-slate-600">{employee.designation?.name || 'Role Not Assigned'}</p>
                  <p className="text-sm text-slate-500 mt-1">ID: {employee.empid}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge-status ${getStatusColor(employee.status)}`}>
                  {employee.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              {employee.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Email</p>
                    <p className="text-slate-900 font-medium">{employee.email}</p>
                  </div>
                </div>
              )}
              {employee.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Phone</p>
                    <p className="text-slate-900 font-medium">{employee.phone}</p>
                  </div>
                </div>
              )}
              {employee.location && (
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-slate-400" />
                  <div className="text-sm">
                    <p className="text-slate-500">Location</p>
                    <p className="text-slate-900 font-medium">{employee.location}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div variants={itemVariants} className="flex gap-2 border-b border-slate-200">
            {['overview', 'employment', 'payroll', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'border-violet-600 text-violet-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Employment Details Card */}
              <div className="card-base">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Employment Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Role</p>
                    <p className="text-slate-900 font-medium">{employee.designation?.name || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Department</p>
                    <p className="text-slate-900 font-medium">{employee.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Manager</p>
                    <p className="text-slate-900 font-medium">{employee.manager || 'Not Assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Joining Date</p>
                    <p className="text-slate-900 font-medium">
                      {employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Tenure</p>
                    <p className="text-slate-900 font-medium">{calculateTenure(employee.joiningDate)}</p>
                  </div>
                </div>
              </div>

              {/* Performance Snapshot Card */}
              <div className="card-base">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Performance Snapshot</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-slate-500">Performance Score</p>
                      <span className="text-xl font-bold gradient-text">8.5/10</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Last Active</p>
                    <p className="text-slate-900 font-medium">
                      {employee.lastActiveAt
                        ? new Date(employee.lastActiveAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="text-slate-900 font-medium">{employee.status || 'Active'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'employment' && (
            <motion.div
              key="employment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="card-base">
                <div className="flex items-center gap-2 mb-6">
                  <FileText size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Documents & Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Aadhar Number</p>
                    <p className="text-slate-900 font-medium">{employee.aadharNumber || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">PAN Number</p>
                    <p className="text-slate-900 font-medium">{employee.panNumber || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Bank Account</p>
                    <p className="text-slate-900 font-medium">{employee.bankAccount || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Onboarding Status</p>
                    <span className="badge-status active">Completed</span>
                  </div>
                </div>
              </div>

              <div className="card-base">
                <div className="flex items-center gap-2 mb-6">
                  <User size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Date of Birth</p>
                    <p className="text-slate-900 font-medium">{employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Gender</p>
                    <p className="text-slate-900 font-medium">{employee.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Address</p>
                    <p className="text-slate-900 font-medium">{employee.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-base">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Salary & Payroll</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Monthly Salary</p>
                    <p className="text-2xl font-bold gradient-text">₹{employee.salary?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Payment Status</p>
                    <span className="badge-status active">Paid</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Bank Account</p>
                    <p className="text-slate-900 font-medium">{employee.bankAccount || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Last Payment Date</p>
                    <p className="text-slate-900 font-medium">-</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-4">Monthly Breakdown</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500">Base Salary</p>
                      <p className="text-slate-900 font-semibold mt-1">₹{(employee.salary * 0.7)?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500">Allowances</p>
                      <p className="text-slate-900 font-semibold mt-1">₹{(employee.salary * 0.2)?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500">Deductions</p>
                      <p className="text-slate-900 font-semibold mt-1">₹{(employee.salary * 0.1)?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-base">
                <div className="flex items-center gap-2 mb-6">
                  <Activity size={20} className="text-violet-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Clock size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">Login Activity</p>
                      <p className="text-sm text-slate-500">Last active today</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-slate-500">
                    <p>No additional activity data available</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetail;

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../src/Adminside/Components/Navbar";
import Login from "../src/Adminside/Components/Login";
import Admindashboard from "../src/Adminside/Components/Admindashboard";
import EmployeePage from "../src/Adminside/Components/EmployeePage";
import Projects from "../src/Adminside/Components/Projects";
import Taskpage from "../src/Adminside/Components/Taskpage";
import HRhubpage from "../src/Adminside/Components/HRhubpage";
import SelectPosition from "../src/Adminside/Components/Entrypage";

/* 🔽 Missing imports added */
import EmployeeDetail from "./Adminside/Components/EmployeeDetailPage";
import Rolepage from "../src/Adminside/Components/Rolepage";
import Announcementpage from "../src/Adminside/Components/Announcementpage";
import Performance from "../src/Adminside/Components/Performance";
import ProductivityReport from "../src/Adminside/Components/ProductivityReport";
import DailyReport from "../src/Adminside/Components/DailyReport";
import PerformanceHeatmap from "../src/Adminside/Components/Performanceheatmap";
import RedFlagsReport from "../src/Adminside/Components/RedFlagReports";
import ProjectSuccessReports from "../src/Adminside/Components/ProjectSuccessReports";
import SLAComplianceDashboard from "../src/Adminside/Components/SLApage";
import Reports from "../src/Adminside/Components/Reports";

/* ---------- LAYOUT ---------- */
function Layout({ children }) {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login", "/employeelogin"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<SelectPosition />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Admindashboard />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Taskpage />} />
            <Route path="/hr" element={<HRhubpage />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/role" element={<Rolepage />} />
            <Route path="/announcement" element={<Announcementpage />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/reports1" element={<ProductivityReport />} />
            <Route path="/daily-report-submission" element={<DailyReport />} />
            <Route path="/heatmap" element={<PerformanceHeatmap />} />
            <Route path="/redreport" element={<RedFlagsReport />} />
            <Route path="/project-success" element={<ProjectSuccessReports />} />
            <Route path="/task-analytics" element={<SLAComplianceDashboard />} />
            <Route path="/data-export" element={<Reports />} />
          </Routes>
        </Layout>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;

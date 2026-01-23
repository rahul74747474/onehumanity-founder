import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Adminside/Components/Navbar";
import Login from "./Adminside/Components/Login";
import Admindashboard from "./Adminside/Components/Admindashboard";
import EmployeePage from "./Adminside/Components/EmployeePage";
import EmployeeDetail from "./Adminside/Components/EmployeeDetailPage";
import Projects from "./Adminside/Components/Projects";
import Taskpage from "./Adminside/Components/Taskpage";
import HRhubpage from "./Adminside/Components/HRhubpage";
import SelectPosition from "./Adminside/Components/Entrypage";
import Rolepage from "./Adminside/Components/Rolepage";
import Announcementpage from "./Adminside/Components/Announcementpage";
import Performance from "./Adminside/Components/Performance";

function Layout({ children }) {
  const location = useLocation();
  const hide = ["/", "/login", "/employeelogin"].includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#f6f7fb]">
      {!hide && <Navbar />}

      <main
        className={`flex-1 transition-all duration-300 ${
          !hide ? "ml-[100px]" : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
}


export default function App() {
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<SelectPosition />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Admindashboard />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/employee/:id" element={<EmployeeDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Taskpage />} />
            <Route path="/hr" element={<HRhubpage />} />
            <Route path="/role" element={<Rolepage />} />
            <Route path="/announcement" element={<Announcementpage />} />
            <Route path="/performance" element={<Performance />} />
          </Routes>
        </Layout>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

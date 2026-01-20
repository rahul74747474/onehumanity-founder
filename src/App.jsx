
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

/* ---------- LAYOUT (Navbar control yahin hoga) ---------- */
function Layout({ children }) {
  const location = useLocation();

  const hideNavbarRoutes = ["/","/login","/employeelogin"];
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
            <Route path="/" element={<SelectPosition/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Admindashboard />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Taskpage />} />
            <Route path="/hr" element={<HRhubpage />} />
          </Routes>
        </Layout>
      </Router>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;

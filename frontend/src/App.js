import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./AdminDashboard";
import FacultyDashboard from "./FacultyDashboard";
import StudentDashboard from "./StudentDashboard";

function App() {
  const role = localStorage.getItem("role");

  return (
    <div style={appContainer}>

      <div style={content}>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<LoginWrapper />} />
          <Route path="/register" element={<Register />} />

          {/* Role Based Routes */}
          <Route
            path="/admin"
            element={role === "admin" ? <AdminDashboardWrapper /> : <Navigate to="/" />}
          />

          <Route
            path="/faculty"
            element={role === "faculty" ? <FacultyDashboardWrapper /> : <Navigate to="/" />}
          />

          <Route
            path="/student"
            element={role === "student" ? <StudentDashboardWrapper /> : <Navigate to="/" />}
          />

        </Routes>
      </div>

      {/* GLOBAL FOOTER */}
      <footer style={footer}>
        © {new Date().getFullYear()} UCMS • Built by Ramesh
      </footer>

    </div>
  );
}

/* Wrappers */

function LoginWrapper() {
  const role = localStorage.getItem("role");

  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "faculty") return <Navigate to="/faculty" />;
  if (role === "student") return <Navigate to="/student" />;

  return <Login />;
}

function AdminDashboardWrapper() {
  return <AdminDashboard logout={logout} />;
}

function FacultyDashboardWrapper() {
  return <FacultyDashboard logout={logout} />;
}

function StudentDashboardWrapper() {
  return <StudentDashboard logout={logout} />;
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

/* Layout Styles */

const appContainer = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column"
};

const content = {
  flex: 1
};

const footer = {
  textAlign: "center",
  padding: "14px",
  background: "#0f172a",
  color: "white",
  fontSize: "13px",
  letterSpacing: "0.5px"
};

export default App;

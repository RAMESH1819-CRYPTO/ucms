import React, { useState } from "react";
import axios from "axios";
import bg from "./assets/bg.jpg";

function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student"
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post("http://localhost:5000/register", form);
      setMessage("Registration successful. Wait for admin approval.");
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div style={{ ...container, backgroundImage: `url(${bg})` }}>
      <div style={overlay}>
        <div style={card}>
          <h2 style={title}>UCMS Portal</h2>
          <p style={subtitle}>Create your account</p>

          {error && <div style={errorBox}>{error}</div>}
          {message && <div style={successBox}>{message}</div>}

          {!message && (
            <form onSubmit={handleRegister}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                style={input}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                style={input}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={input}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>

              <button type="submit" style={button}>
                Register
              </button>
            </form>
          )}

          <p style={linkText}>
            Already have an account?{" "}
            <span
              style={link}
              onClick={() => window.location.href = "/"}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  height: "100vh",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const overlay = {
  background: "rgba(0,0,0,0.55)",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const card = {
  width: "380px",
  padding: "40px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  color: "white"
};

const title = {
  marginBottom: "5px",
  fontWeight: "600"
};

const subtitle = {
  marginBottom: "25px",
  fontSize: "14px",
  opacity: 0.85
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.3)",
  background: "rgba(255,255,255,0.2)",
  color: "white",
  fontSize: "14px",
  outline: "none"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#1f4ed8",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "10px"
};

const errorBox = {
  background: "rgba(255,0,0,0.2)",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px"
};

const successBox = {
  background: "rgba(0,255,0,0.2)",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px"
};

const linkText = {
  marginTop: "20px",
  fontSize: "14px",
  textAlign: "center"
};

const link = {
  color: "#4ea8ff",
  cursor: "pointer",
  fontWeight: "600"
};

export default Register;

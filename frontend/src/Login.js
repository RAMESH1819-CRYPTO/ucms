import React, { useState } from "react";
import axios from "axios";
import bg from "./assets/bg.jpg";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "admin") window.location.href = "/admin";
      else if (res.data.role === "faculty") window.location.href = "/faculty";
      else window.location.href = "/student";

    } catch (err) {
      setError(err.response?.data || "Login failed");
    }
  };

  return (
    <div style={{ ...container, backgroundImage: `url(${bg})` }}>
      <div style={overlay}>
        <div style={card}>
          <h2 style={title}>UCMS Portal</h2>
          <p style={subtitle}>Sign in to continue</p>

          {error && <div style={errorBox}>{error}</div>}

          <form onSubmit={handleLogin}>
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

            <button type="submit" style={button}>
              Login
            </button>
          </form>

          <p style={linkText}>
            New user?{" "}
            <span
              style={link}
              onClick={() => window.location.href = "/register"}
            >
              Create account
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
  width: "360px",
  background: "rgba(255,255,255,0.95)",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  backdropFilter: "blur(8px)"
};

const title = {
  marginBottom: "5px",
  fontWeight: "600",
  color: "#1a1a1a"
};

const subtitle = {
  marginBottom: "25px",
  color: "#666",
  fontSize: "14px"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #dcdcdc",
  fontSize: "14px"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#1f4ed8",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  cursor: "pointer"
};

const errorBox = {
  background: "#fdecea",
  color: "#b91c1c",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  fontSize: "14px"
};

const linkText = {
  marginTop: "20px",
  fontSize: "14px",
  textAlign: "center"
};

const link = {
  color: "#1f4ed8",
  cursor: "pointer",
  fontWeight: "600"
};

export default Login;

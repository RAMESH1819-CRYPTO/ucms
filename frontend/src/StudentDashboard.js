import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard({ logout }) {
  const token = localStorage.getItem("token");

  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    const res = await axios.get("http://localhost:5000/my-attendance", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setAttendance(res.data);

    if (res.data.length > 0) {
      setStudentName(res.data[0].student_name);
    }
  };

  const total = attendance.length;
  const presentCount = attendance.filter(a => a.status === "present").length;
  const percentage = total > 0 ? ((presentCount / total) * 100).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#1e1e2f",
        color: "white",
        padding: "20px"
      }}>
        <h3>Student Panel</h3>
        <hr style={{ borderColor: "#444" }} />

        <div style={{ marginBottom: "10px" }}>
          Welcome
        </div>

        <hr style={{ borderColor: "#444" }} />

        <button onClick={logout} style={{
          marginTop: "20px",
          width: "100%",
          padding: "8px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        padding: "30px",
        background: "#f4f6f9"
      }}>

        <h2>Student Dashboard</h2>

        {/* Student Info Card */}
        <div style={cardStyle}>
          <h3>{studentName}</h3>
          <p><strong>Roll Number:</strong> {token ? "ID-" + JSON.parse(atob(token.split('.')[1])).id : ""}</p>
          <p><strong>Total Classes:</strong> {total}</p>
          <p><strong>Attendance %:</strong> {percentage}%</p>
        </div>

        {/* Attendance Table */}
        <div style={{ marginTop: "30px" }}>
          <h3>My Attendance</h3>

          {attendance.length === 0 ? (
            <p>No attendance records</p>
          ) : (
            <table style={tableStyle}>
              <thead style={{ background: "#ddd" }}>
                <tr>
                  <th>Class</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, index) => (
                  <tr key={index}>
                    <td>{a.class_name}</td>
                    <td style={{ color: a.status === "present" ? "green" : "red" }}>
                      {a.status}
                    </td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

/* Styles */

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  width: "300px"
};

const tableStyle = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse"
};

export default StudentDashboard;

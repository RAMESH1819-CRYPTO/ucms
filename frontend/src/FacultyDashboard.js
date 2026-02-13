import React, { useEffect, useState } from "react";
import axios from "axios";

function FacultyDashboard({ logout }) {
  const token = localStorage.getItem("token");

  const [section, setSection] = useState("classes");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get("http://localhost:5000/my-classes", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setClasses(res.data);
  };

  const fetchStudents = async (classId) => {
    const res = await axios.get(
      `http://localhost:5000/class-students/${classId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setStudents(res.data);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    fetchStudents(classId);
  };

  const markAttendance = async (studentId, status) => {
    await axios.post(
      "http://localhost:5000/mark-attendance",
      {
        student_id: studentId,
        class_id: selectedClass,
        status: status
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Attendance marked");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "220px",
        background: "#1e1e2f",
        color: "white",
        padding: "20px"
      }}>
        <h3>Faculty Panel</h3>
        <hr style={{ borderColor: "#444" }} />

        <div style={menuItem(section==="classes")} onClick={()=>setSection("classes")}>
          Classes
        </div>

        <div style={menuItem(section==="attendance")} onClick={()=>setSection("attendance")}>
          Attendance
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

        <h2 style={{ marginBottom: "20px" }}>
          {section.toUpperCase()}
        </h2>

        {/* CLASSES */}
        {section === "classes" && (
          <>
            {classes.length === 0 ? (
              <p>No classes assigned</p>
            ) : (
              classes.map(c => (
                <div key={c.id} style={cardStyle}>
                  {c.name}
                </div>
              ))
            )}
          </>
        )}

        {/* ATTENDANCE */}
        {section === "attendance" && (
          <>
            <h4>Select Class</h4>

            <select onChange={handleClassChange} style={selectStyle}>
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {students.length > 0 && (
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Present</th>
                    <th>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td>{s.email}</td>
                      <td>
                        <button
                          style={btnGreen}
                          onClick={() => markAttendance(s.id, "present")}
                        >
                          Present
                        </button>
                      </td>
                      <td>
                        <button
                          style={btnRed}
                          onClick={() => markAttendance(s.id, "absent")}
                        >
                          Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

      </div>
    </div>
  );
}

/* Styles */

const menuItem = (active) => ({
  padding: "10px",
  marginBottom: "10px",
  cursor: "pointer",
  background: active ? "#333" : "transparent",
  borderRadius: "5px"
});

const cardStyle = {
  background: "white",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const btnGreen = {
  background: "green",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px"
};

const btnRed = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px"
};

const selectStyle = {
  padding: "8px",
  marginBottom: "20px",
  borderRadius: "5px"
};

const tableStyle = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse"
};

export default FacultyDashboard;

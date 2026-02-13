import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard({ logout }) {
  const token = localStorage.getItem("token");

  const [section, setSection] = useState("requests");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const p = await axios.get("http://localhost:5000/pending-users",{headers:{Authorization:`Bearer ${token}`}});
    const s = await axios.get("http://localhost:5000/students",{headers:{Authorization:`Bearer ${token}`}});
    const c = await axios.get("http://localhost:5000/classes",{headers:{Authorization:`Bearer ${token}`}});
    const a = await axios.get("http://localhost:5000/all-attendance",{headers:{Authorization:`Bearer ${token}`}});
    setPendingUsers(p.data);
    setStudents(s.data);
    setClasses(c.data);
    setAttendance(a.data);
  };

  const approveUser = async (id) => {
    await axios.post(`http://localhost:5000/approve-user/${id}`,{}, {headers:{Authorization:`Bearer ${token}`}});
    fetchAll();
  };

  const rejectUser = async (id) => {
    await axios.delete(`http://localhost:5000/reject-user/${id}`,{headers:{Authorization:`Bearer ${token}`}});
    fetchAll();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/delete-user/${id}`,{headers:{Authorization:`Bearer ${token}`}});
    fetchAll();
  };

  const completeClass = async (id) => {
    await axios.put(`http://localhost:5000/complete-class/${id}`,{}, {headers:{Authorization:`Bearer ${token}`}});
    fetchAll();
  };

  const assignStudent = async () => {
    if (!selectedClass || !selectedStudent) {
      alert("Select class and student");
      return;
    }

    await axios.post(
      "http://localhost:5000/assign-student",
      { class_id: selectedClass, student_id: selectedStudent },
      { headers:{Authorization:`Bearer ${token}`} }
    );

    fetchAll();
  };

  const updateAttendance = async (id, status) => {
    await axios.put(
      `http://localhost:5000/edit-attendance/${id}`,
      { status },
      { headers:{Authorization:`Bearer ${token}`} }
    );
    fetchAll();
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
        <h3>Admin Panel</h3>
        <hr style={{ borderColor: "#444" }} />

        <div style={menuItem(section==="requests")} onClick={()=>setSection("requests")}>Requests</div>
        <div style={menuItem(section==="students")} onClick={()=>setSection("students")}>Students</div>
        <div style={menuItem(section==="classes")} onClick={()=>setSection("classes")}>Classes</div>
        <div style={menuItem(section==="attendance")} onClick={()=>setSection("attendance")}>Attendance</div>

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

        <h2 style={{ marginBottom: "20px" }}>{section.toUpperCase()}</h2>

        {/* REQUESTS */}
        {section === "requests" && pendingUsers.map(u => (
          <Card key={u.id}>
            {u.email} ({u.role})
            <div>
              <button style={btnGreen} onClick={()=>approveUser(u.id)}>Approve</button>
              <button style={btnRed} onClick={()=>rejectUser(u.id)}>Reject</button>
            </div>
          </Card>
        ))}

        {/* STUDENTS */}
        {section === "students" && students.map(s => (
          <Card key={s.id}>
            {s.email}
            <button style={btnRed} onClick={()=>deleteUser(s.id)}>Remove</button>
          </Card>
        ))}

        {/* CLASSES */}
        {section === "classes" && (
          <>
            {classes.map(c => (
              <Card key={c.id}>
                {c.name}
                <button style={btnRed} onClick={()=>completeClass(c.id)}>Complete</button>
              </Card>
            ))}

            <div style={{ marginTop: "30px" }}>
              <h4>Assign Student</h4>

              <select onChange={(e)=>setSelectedClass(e.target.value)} style={selectStyle}>
                <option value="">Select Class</option>
                {classes.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select onChange={(e)=>setSelectedStudent(e.target.value)} style={selectStyle}>
                <option value="">Select Student</option>
                {students.map(s=><option key={s.id} value={s.id}>{s.email}</option>)}
              </select>

              <button style={btnBlue} onClick={assignStudent}>Assign</button>
            </div>
          </>
        )}

        {/* ATTENDANCE */}
        {section === "attendance" && (
          <table style={{ width: "100%", background: "white", borderCollapse: "collapse" }}>
            <thead style={{ background: "#ddd" }}>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id}>
                  <td>{a.student_name}</td>
                  <td>{a.class_name}</td>
                  <td>{a.status}</td>
                  <td>
                    <button style={btnGreen} onClick={()=>updateAttendance(a.id,"present")}>Present</button>
                    <button style={btnRed} onClick={()=>updateAttendance(a.id,"absent")}>Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

/* Reusable Components & Styles */

const Card = ({ children }) => (
  <div style={{
    background: "white",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }}>
    {children}
  </div>
);

const menuItem = (active) => ({
  padding: "10px",
  marginBottom: "10px",
  cursor: "pointer",
  background: active ? "#333" : "transparent",
  borderRadius: "5px"
});

const btnGreen = {
  background: "green",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginLeft: "5px",
  borderRadius: "5px"
};

const btnRed = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 10px",
  marginLeft: "5px",
  borderRadius: "5px"
};

const btnBlue = {
  background: "blue",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "5px",
  marginLeft: "10px"
};

const selectStyle = {
  padding: "8px",
  marginRight: "10px",
  borderRadius: "5px"
};

export default AdminDashboard;

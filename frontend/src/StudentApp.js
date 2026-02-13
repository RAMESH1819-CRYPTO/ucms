import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentApp({ setIsLoggedIn }) {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    year: ""
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/students", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStudent = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/students", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchStudents();

      setForm({
        name: "",
        email: "",
        phone: "",
        course: "",
        year: ""
      });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f2f2f2", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>UCMS - Student Management</h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);
            }}
            style={{
              padding: "8px 15px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        <h3 style={{ marginTop: "20px" }}>Add Student</h3>

        <form onSubmit={addStudent} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
          <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required />
          <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
          
          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              padding: "8px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Add Student
          </button>
        </form>

        <h3 style={{ marginTop: "30px" }}>Student List</h3>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#ddd" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Course</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={tdStyle}>{student.id}</td>
                <td style={tdStyle}>{student.name}</td>
                <td style={tdStyle}>{student.email}</td>
                <td style={tdStyle}>{student.phone}</td>
                <td style={tdStyle}>{student.course}</td>
                <td style={tdStyle}>{student.year}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => deleteStudent(student.id)}
                    style={{
                      padding: "5px 10px",
                      background: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid black",
  padding: "8px"
};

const tdStyle = {
  border: "1px solid black",
  padding: "8px",
  textAlign: "center"
};

export default StudentApp;

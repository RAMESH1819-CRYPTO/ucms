const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "MY_SECRET_KEY";

// ================= DATABASE =================

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ramvaishu2218@",
  database: "ucms_db",
  port: 3306
});

db.connect(err => {
  if (err) console.log("DB Error:", err);
  else console.log("MySQL Connected");
});

// ================= MIDDLEWARE =================

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

function role(r) {
  return (req, res, next) => {
    if (req.user.role !== r) return res.status(403).send("Access denied");
    next();
  };
}

// ================= REGISTER =================

app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email,password,role,isApproved) VALUES (?,?,?,false)",
    [email, hash, role],
    err => {
      if (err) return res.status(500).send("User exists");
      res.send("Wait for approval");
    }
  );
});

// ================= LOGIN =================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, r) => {
    if (r.length === 0) return res.status(400).send("User not found");

    const user = r[0];

    if (!user.isApproved) return res.status(403).send("Not approved");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
    res.json({ token, role: user.role });
  });
});

// ================= ADMIN =================

// Pending users
app.get("/pending-users", auth, role("admin"), (req, res) => {
  db.query("SELECT id,email,role FROM users WHERE isApproved=false", (e, r) => res.json(r));
});

// Approve
app.post("/approve-user/:id", auth, role("admin"), (req, res) => {
  db.query("UPDATE users SET isApproved=true WHERE id=?", [req.params.id], () => res.send("Approved"));
});

// Reject
app.delete("/reject-user/:id", auth, role("admin"), (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], () => res.send("Rejected"));
});

// Delete user
app.delete("/delete-user/:id", auth, role("admin"), (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], () => res.send("Deleted"));
});

// View students
app.get("/students", auth, role("admin"), (req, res) => {
  db.query("SELECT id,email FROM users WHERE role='student' AND isApproved=true", (e,r)=>res.json(r));
});

// View faculty
app.get("/faculty", auth, role("admin"), (req, res) => {
  db.query("SELECT id,email FROM users WHERE role='faculty' AND isApproved=true", (e,r)=>res.json(r));
});

// ================= CLASSES =================

// Create class
app.post("/create-class", auth, role("admin"), (req,res)=>{
  const { name, faculty_id } = req.body;
  db.query("INSERT INTO classes (name,faculty_id,status) VALUES (?,?, 'active')",
    [name,faculty_id],
    ()=>res.send("Class created"));
});

// Get active classes (Admin)
app.get("/classes", auth, role("admin"), (req,res)=>{
  db.query("SELECT * FROM classes WHERE status='active'",
    (e,r)=>res.json(r));
});

// Complete class
app.put("/complete-class/:id", auth, role("admin"), (req,res)=>{
  db.query("UPDATE classes SET status='completed' WHERE id=?",
    [req.params.id],
    ()=>res.send("Class completed"));
});

// Assign student
app.post("/assign-student", auth, role("admin"), (req,res)=>{
  const { class_id, student_id } = req.body;
  db.query("INSERT INTO class_students (class_id,student_id) VALUES (?,?)",
    [class_id,student_id],
    ()=>res.send("Assigned"));
});

// ================= FACULTY =================

// Faculty get their classes
app.get("/my-classes", auth, role("faculty"), (req,res)=>{
  db.query("SELECT * FROM classes WHERE faculty_id=? AND status='active'",
    [req.user.id],
    (e,r)=>res.json(r));
});

// Faculty get students of class
app.get("/class-students/:classId", auth, role("faculty"), (req,res)=>{
  db.query(
    `SELECT u.id,u.email
     FROM class_students cs
     JOIN users u ON cs.student_id=u.id
     WHERE cs.class_id=?`,
    [req.params.classId],
    (e,r)=>res.json(r)
  );
});

// Mark attendance
app.post("/mark-attendance", auth, role("faculty"), (req,res)=>{
  const { student_id, class_id, status } = req.body;

  db.query(
    "INSERT INTO attendance (student_id,class_id,status) VALUES (?,?,?)",
    [student_id,class_id,status],
    (err)=>{
      if (err) return res.status(500).send("Attendance error");
      res.send("Attendance marked");
    }
  );
});

// ================= STUDENT =================

app.get("/my-attendance", auth, role("student"), (req,res)=>{
  db.query(
    `SELECT u.email student_name,
            c.name class_name,
            a.status,
            a.date
     FROM attendance a
     JOIN users u ON a.student_id=u.id
     JOIN classes c ON a.class_id=c.id
     WHERE a.student_id=?`,
    [req.user.id],
    (e,r)=>res.json(r)
  );
});

// ================= ADMIN VIEW + EDIT ATTENDANCE =================

app.get("/all-attendance", auth, role("admin"), (req,res)=>{
  db.query(
    `SELECT a.id,
            u.email student_name,
            c.name class_name,
            a.status,
            a.date
     FROM attendance a
     JOIN users u ON a.student_id=u.id
     JOIN classes c ON a.class_id=c.id`,
    (e,r)=>res.json(r)
  );
});

app.put("/edit-attendance/:id", auth, role("admin"), (req,res)=>{
  db.query("UPDATE attendance SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    ()=>res.send("Updated"));
});

app.listen(5000,()=>console.log("Server running on port 5000"));

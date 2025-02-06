const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors")

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "system_support",
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save files in "uploads" directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  // File filter for validation
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"), false);
    }
  };
  
  // Multer middleware
  const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max file size 2MB
    fileFilter,
  }).single("attachments"); // Accept only one file

// 🚀 Customer submits a complaint with a single file upload
app.post("/api/complaint", (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      const { name, customerPaymentNumber, companyPaymentNumber, contactNumber, subject, details } = req.body;
      const attachments = req.file ? req.file.filename : null; // Single file handling
  
      if (!name || !customerPaymentNumber || !companyPaymentNumber || !contactNumber || !subject || !details) {
        return res.status(400).json({ error: "All fields are required except attachment." });
      }
  
      // Check if companyPaymentNumber exists in the users table
      db.query("SELECT number FROM users WHERE number = ?", [companyPaymentNumber], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error: " + err.message });
        const priority = results.length > 0 ? "Low" : "High";
  
        // Insert into complaints table
        db.query(
          "INSERT INTO complaints (name, customerPaymentNumber, companyPaymentNumber, contactNumber, subject, details, attachments, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [name, customerPaymentNumber, companyPaymentNumber, contactNumber, subject, details, attachments, priority],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Database error: " + err.message });
  
            res.status(201).json({ message: "Complaint submitted successfully!", complaintId: result.insertId });
          }
        );
      });
    });
  });
  

// 🛠 Admin API: Create a User
app.post("/api/admin/user", (req, res) => {
  const { serialNumber, number, status } = req.body;
  if (!serialNumber || !number || !status) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.query("INSERT INTO users (serialNumber, number, status) VALUES (?, ?, ?)", [serialNumber, number, status], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User created successfully!", userId: result.insertId });
  });
});

// 📜 Admin API: Get All Users
app.get("/api/admin/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// ✏️ Admin API: Edit User
app.put("/api/admin/user/:id", (req, res) => {
  const { serialNumber, number, status } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE users SET serialNumber = ?, number = ?, status = ? WHERE id = ?",
    [serialNumber, number, status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "User updated successfully!" });
    }
  );
});

// ❌ Admin API: Delete User
app.delete("/api/admin/user/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "User deleted successfully!" });
  });
});

// 📢 Admin API: Get All Complaints
app.get("/api/admin/complaints", (req, res) => {
  db.query("SELECT * FROM complaints", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

// 🗑 Admin API: Delete Complaints Older than 3 Days if Resolved
app.delete("/api/admin/complaints/cleanup", (req, res) => {
  db.query("DELETE FROM complaints WHERE createdAt < NOW() - INTERVAL 3 DAY", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Old complaints deleted successfully!" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

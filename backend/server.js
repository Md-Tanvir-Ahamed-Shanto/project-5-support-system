const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const cors = require("cors")
const config = require("./config/config");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

const db = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
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

      // Check if the user already has a pending complaint
      db.query(
          "SELECT status FROM complaints WHERE customerPaymentNumber = ? ORDER BY id DESC LIMIT 1",
          [customerPaymentNumber],
          (err, results) => {
              if (err) return res.status(500).json({ error: "Database error: " + err.message });

              // If there is a pending complaint, prevent duplicate submission
              if (results.length > 0 && results[0].status === "pending") {
                  return res.status(400).json({ error: "এই বিষয়ে আপনার ইতিমধ্যেই একটি অভিযোগ বিচারাধীন রয়েছে। এটি সমাধান না হওয়া পর্যন্ত অপেক্ষা করুন।" });
              }

              // Determine priority based on companyPaymentNumber existence
              db.query("SELECT number FROM users WHERE number = ?", [companyPaymentNumber], (err, companyResults) => {
                  if (err) return res.status(500).json({ error: "Database error: " + err.message });
                  const priority = companyResults.length > 0 ? "Low" : "High";

                  // Insert the complaint into the database
                  db.query(
                      "INSERT INTO complaints (name, customerPaymentNumber, companyPaymentNumber, contactNumber, subject, details, attachments, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')",
                      [name, customerPaymentNumber, companyPaymentNumber, contactNumber, subject, details, attachments, priority],
                      (err, result) => {
                          if (err) return res.status(500).json({ error: "Database error: " + err.message });

                          res.status(201).json({ message: "Complaint submitted successfully!", complaintId: result.insertId });
                      }
                  );
              });
          }
      );
  });
});

app.get("/api/tickets/stats", (req, res) => {
  db.query(
      `SELECT 
          COUNT(*) AS totalTickets,
          SUM(CASE WHEN status = 'Solved' THEN 1 ELSE 0 END) AS solvedTickets,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingTickets,
          SUM(CASE WHEN companyPaymentNumber IN (SELECT number FROM users) THEN 1 ELSE 0 END) AS matchedTickets,
          SUM(CASE WHEN companyPaymentNumber NOT IN (SELECT number FROM users) THEN 1 ELSE 0 END) AS unmatchedTickets,
          SUM(CASE WHEN customerPaymentNumber IN (SELECT customerPaymentNumber FROM complaints GROUP BY customerPaymentNumber, subject HAVING COUNT(*) > 1) THEN 1 ELSE 0 END) AS repetitiveReports
      FROM complaints`,
      (err, results) => {
          if (err) {
              return res.status(500).json({ error: "Database error: " + err.message });
          }
          res.status(200).json(results[0]);
      }
  );
});


// 🛠 Admin API: Create a User
app.post("/api/admin/user", (req, res) => {
  const { serialNumber, number, status , comments } = req.body;
  if (!serialNumber || !number || !status) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.query("INSERT INTO users (serialNumber, number, status, comments) VALUES (?, ?, ?, ?)", [serialNumber, number, status, comments], (err, result) => {
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
  const { serialNumber, number, status, comments } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE users SET serialNumber = ?, number = ?,comments = ?, status = ? WHERE id = ?",
    [serialNumber, number ,comments, status, id],
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
  db.query("SELECT * FROM complaints ORDER BY createdAt DESC", (err, results) => {
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

// 🚀 Update Complaint Status (Pending or Solved)
app.put("/api/admin/complaint/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "solved"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Use 'pending' or 'solved'." });
  }

  db.query(
    "UPDATE complaints SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Complaint not found!" });
      }

      res.json({ message: `Complaint status updated to '${status}' successfully!` });
    }
  );
});

// 🚀 Delete a Complaint (Ticket)
app.delete("/api/admin/complaints/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM complaints WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Complaint not found!" });
    }

    res.json({ message: "Complaint deleted successfully!" });
  });
});

// bulk delete complaints
app.delete("/api/admin/complaints", (req, res) => {
  const { ids } = req.body;

  db.query("DELETE FROM complaints WHERE id IN (?)", [ids], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Complaint not found!" });
    }

    res.json({ message: "Complaint bulk deleted successfully!" });
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Backend: Express with MySQL
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'support_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Validate 11-digit phone number
const isValidPhone = (number) => /^\d{11}$/.test(number);

// Add User (Admin Dashboard)
app.post('/admin/add-user', (req, res) => {
    const { phone } = req.body;
    if (!isValidPhone(phone)) return res.status(400).json({ error: 'Invalid phone number' });
    
    db.query('INSERT INTO users (phone) VALUES (?)', [phone], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User added successfully' });
    });
});

// Submit Complaint (Customer Dashboard)
app.post('/customer/complaint', (req, res) => {
    const { name, sending_number, from_number, description } = req.body;
    if (!isValidPhone(sending_number) || !isValidPhone(from_number)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    db.query('INSERT INTO complaints (name, sending_number, from_number, description) VALUES (?, ?, ?, ?)',
        [name, sending_number, from_number, description],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Complaint submitted successfully' });
        }
    );
});

// Get Complaints (Admin Dashboard)
app.get('/admin/complaints', (req, res) => {
    db.query('SELECT * FROM complaints', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.query('SELECT phone FROM users', (err, users) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const userPhones = users.map(u => u.phone);
            const categorizedComplaints = {
                high_priority: [],
                low_priority: []
            };
            
            results.forEach(complaint => {
                if (userPhones.includes(complaint.sending_number)) {
                    categorizedComplaints.low_priority.push(complaint);
                } else {
                    categorizedComplaints.high_priority.push(complaint);
                }
            });
            res.json(categorizedComplaints);
        });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

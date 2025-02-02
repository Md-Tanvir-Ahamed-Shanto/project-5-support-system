// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'support_system'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Database setup
const setupDatabase = async () => {
  // Users table
  await db.promise().query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      phone_number VARCHAR(15) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tickets table
  await db.promise().query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      sending_number VARCHAR(15) NOT NULL,
      from_number VARCHAR(15) NOT NULL,
      description TEXT NOT NULL,
      priority ENUM('high', 'low') NOT NULL,
      status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

setupDatabase();

app.use(cors());
app.use(express.json());

// Admin Routes
app.post('/api/admin/users', async (req, res) => {
  const { phoneNumber } = req.body;
  
  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  try {
    await db.promise().query('INSERT INTO users (phone_number) VALUES (?)', [phoneNumber]);
    res.json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

app.get('/api/admin/tickets/:priority', async (req, res) => {
  const { priority } = req.params;
  try {
    const [tickets] = await db.promise().query(
      'SELECT * FROM tickets WHERE priority = ? ORDER BY created_at DESC',
      [priority]
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
});

// Customer Routes
app.post('/api/tickets', async (req, res) => {
  const { name, sendingNumber, fromNumber, description } = req.body;

  const phoneRegex = /^\d{11}$/;
  if (!phoneRegex.test(sendingNumber) || !phoneRegex.test(fromNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  try {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE phone_number = ?',
      [sendingNumber]
    );
    
    const priority = users.length > 0 ? 'low' : 'high';

    await db.promise().query(
      'INSERT INTO tickets (name, sending_number, from_number, description, priority) VALUES (?, ?, ?, ?, ?)',
      [name, sendingNumber, fromNumber, description, priority]
    );
    
    res.json({ message: 'Ticket submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error submitting ticket' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
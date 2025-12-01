const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Serve frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// ---------------- DATABASE ----------------
const db = new sqlite3.Database(path.join(__dirname, 'exam.db'), (err) => {
    if (err) console.error(err.message);
    else console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        roll_no TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        capacity INTEGER
    )`);

    // New table to store seating assignments
    db.run(`CREATE TABLE IF NOT EXISTS seating (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        room_id INTEGER,
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(room_id) REFERENCES rooms(id)
    )`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------- AUTH ----------------
app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("All fields required");

    db.run(`INSERT INTO users(username, password) VALUES(?, ?)`, [username, password], function (err) {
        if (err) return res.status(500).send("User already exists.");
        res.send({ message: "Signup successful" });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err) return res.status(500).send(err.message);
        if (!row) return res.status(400).send("Invalid credentials");
        res.send({ message: "Login successful" });
    });
});

// ---------------- STUDENTS ----------------
app.post('/api/students', (req, res) => {
    const { name, roll_no } = req.body;
    if (!name || !roll_no) return res.status(400).send('All fields required');

    db.run(`INSERT INTO students(name, roll_no) VALUES(?, ?)`, [name, roll_no], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send({ id: this.lastID, name, roll_no });
    });
});

app.get('/api/students', (req, res) => {
    db.all(`SELECT * FROM students`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// ---------------- EXAMS ----------------
app.post('/api/exams', (req, res) => {
    const { name, date } = req.body;
    if (!name || !date) return res.status(400).json({ error: 'All fields required' });

    db.run(`INSERT INTO exams(name, date) VALUES(?, ?)`, [name, date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, date });
    });
});

app.get('/api/exams', (req, res) => {
    db.all(`SELECT * FROM exams`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/exams/:id', (req, res) => {
    const examId = req.params.id;
    db.run(`DELETE FROM exams WHERE id = ?`, [examId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Exam not found' });
        res.json({ message: 'Exam deleted successfully', id: examId });
    });
});

// ---------------- ROOMS ----------------
app.post('/api/rooms', (req, res) => {
    const { name, capacity } = req.body;
    if (!name || !capacity) return res.status(400).send('All fields required');

    db.run(`INSERT INTO rooms(name, capacity) VALUES(?, ?)`, [name, capacity], function (err) {
        if (err) return res.status(500).send(err.message);
        res.send({ id: this.lastID, name, capacity });
    });
});

app.get('/api/rooms', (req, res) => {
    db.all(`SELECT * FROM rooms`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// ---------------- SEATING GENERATOR ----------------
app.get('/api/seating', (req, res) => {
    db.all(`SELECT * FROM students`, [], (err, students) => {
        if (err) return res.status(500).send(err.message);

        db.all(`SELECT * FROM rooms`, [], (err, rooms) => {
            if (err) return res.status(500).send(err.message);

            let seating = [];
            let roomIndex = 0, seatCount = 0;

            students.forEach(student => {
                if (rooms.length === 0) return;
                let room = rooms[roomIndex];
                seating.push({ 
                    student: {
                        id: student.id,
                        name: student.name,
                        roll_no: student.roll_no,
                        section: student.section || ''
                    },
                    room: room.name
                });
                seatCount++;
                if (seatCount >= room.capacity) { roomIndex++; seatCount = 0; }
            });

            res.json(seating);
        });
    });
});


// Get seating with student and room info
app.get('/api/seating', (req, res) => {
    const query = `
        SELECT seating.id, students.id as student_id, students.name, students.roll_no,
               rooms.id as room_id, rooms.name as room_name
        FROM seating
        LEFT JOIN students ON seating.student_id = students.id
        LEFT JOIN rooms ON seating.room_id = rooms.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // map to same format as before
        const seating = rows.map(r => ({
            id: r.id,
            student: { id: r.student_id, name: r.name, roll_no: r.roll_no },
            room: r.room_name
        }));
        res.json(seating);
    });
});

// DELETE seating for a student (optional: just remove from seating arrangement, not DB)
app.delete('/api/seating/:id', (req, res) => {
    const studentId = req.params.id;

    // Since seating is generated dynamically, you can't "delete" it permanently
    // You could delete student from DB to simulate removal
    db.run(`DELETE FROM students WHERE id = ?`, [studentId], function(err){
        if(err) return res.status(500).json({ error: err.message });
        if(this.changes === 0) return res.status(404).json({ error: "Student not found" });
        res.json({ message: "Student removed successfully" });
    });
});


// ---------------- START SERVER ----------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

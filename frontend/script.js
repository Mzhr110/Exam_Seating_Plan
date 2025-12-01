const API_URL = 'http://localhost:3000/api';

// --- EXAMS ---
async function addExam(name, date) {
    try {
        const res = await fetch(`${API_URL}/exams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, date })
        });
        const data = await res.json();
        if (res.status !== 200) alert('Error: ' + (data.error || 'Unknown error'));
        return data;
    } catch (err) {
        console.error('Add exam fetch error:', err);
    }
}

async function getExams() {
    try {
        const res = await fetch(`${API_URL}/exams`);
        const data = await res.json();
        if (res.status !== 200) alert('Error: ' + (data.error || 'Unknown error'));
        return data;
    } catch (err) {
        console.error('Get exams fetch error:', err);
        return [];
    }
}

async function deleteExam(id) {
    try {
        const res = await fetch(`${API_URL}/exams/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.status !== 200) alert('Delete error: ' + (data.error || 'Unknown error'));
        else alert(data.message);
    } catch (err) {
        console.error('Delete exam fetch error:', err);
    }
}

// --- STUDENTS ---
async function addStudent(name, roll_no) {
    const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, roll_no })
    });
    return res.json();
}

async function getStudents() {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
}

// --- ROOMS ---
async function addRoom(name, capacity) {
    const res = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, capacity })
    });
    return res.json();
}

async function getRooms() {
    const res = await fetch(`${API_URL}/rooms`);
    return res.json();
}

// --- SEATING ---
async function getSeating() {
    const res = await fetch(`${API_URL}/seating`);
    return res.json();
}

// NEW: Delete seating
async function deleteSeating(id) {
    try {
        const res = await fetch(`${API_URL}/seating/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.status !== 200) alert('Seating delete error: ' + (data.error || 'Unknown error'));
        else {
            alert(data.message);
            loadSeatingLayout(); // reload seating after delete
        }
    } catch (err) {
        console.error('Delete seating fetch error:', err);
    }
}

// --- AUTH ---
function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => alert(data.message));
}

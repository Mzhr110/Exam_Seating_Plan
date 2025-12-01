# 📘 Exam Seating System

A web-based system to manage students, rooms, exams, and automatically generate seating plans.
Built with **HTML/CSS/JS (frontend)** and **Node.js + Express + SQLite (backend)**.

---

## 🚀 Features

### ✅ Authentication

* User **Signup**
* User **Login**
* Secure passwords using **bcrypt**
* JWT-based authentication

### 🎓 Student Management

* Add new students
* View student list
* Delete student

### 🏫 Room Management

* Add rooms and seating capacity
* View room list

### 📝 Exam Management

* Create exams
* View exam list
* Delete exam

### 🪑 Automatic Seating Plan

* Auto-assign students to rooms based on capacity
* Display the generated seating arrangement

---

## 📁 Project Structure

```
exam-seating/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── exam.db
│   └── (other backend files)
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── students.html
    ├── rooms.html
    ├── exams.html
    ├── seating.html
    ├── style.css
    ├── script.js
    └── auth.js
```

---

## 🛠️ Installation Guide

### 1️⃣ Install Dependencies

Open PowerShell inside the **backend** folder:

```
cd backend
npm install
```

### 2️⃣ Start Backend Server

```
node server.js
```

You should see:

```
Server running at http://localhost:3000
Connected to SQLite database.
```

### 3️⃣ Open Frontend

Open any page in the `frontend` folder such as:

```
login.html
signup.html
index.html
```

OR if static hosting is enabled:

```
http://localhost:3000/login.html
http://localhost:3000/index.html
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint    | Description |
| ------ | ----------- | ----------- |
| POST   | /api/signup | User signup |
| POST   | /api/login  | User login  |

### Students

| Method | Endpoint      | Description |
| ------ | ------------- | ----------- |
| GET    | /api/students | Get all     |
| POST   | /api/students | Add student |

### Rooms

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| GET    | /api/rooms | Get all     |
| POST   | /api/rooms | Add room    |

### Exams

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| GET    | /api/exams | Get all     |
| POST   | /api/exams | Add exam    |

### Seating Plan

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| GET    | /api/seating | Generate seating |

---

## 🧑‍💻 Author

Mazhar Abbas

Hamayun Junaid

---

## Youtube Link
https://youtu.be/HV7EFWmlUr0?si=aM-s7uiBoU-1lZ9w

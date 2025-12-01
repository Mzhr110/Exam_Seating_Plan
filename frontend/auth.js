const API = "http://localhost:3000/api";

// SIGNUP
function signup() {
    const username = document.getElementById("su_user").value;
    const password = document.getElementById("su_pass").value;

    fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(alert);
}

// LOGIN
function login() {
    const username = document.getElementById("lo_user").value;
    const password = document.getElementById("lo_pass").value;

    fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        if (msg.includes("successful"))
            window.location.href = "index.html"; 
    });
}

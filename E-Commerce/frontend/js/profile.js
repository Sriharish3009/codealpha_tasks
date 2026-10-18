const loggedIn = localStorage.getItem("loggedIn");
const username = localStorage.getItem("username");

if (loggedIn !== "true" || !username) {
    window.location.href = "login.html";
}

document.getElementById("profile-username").textContent = username;

function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");

    window.location.href = "login.html";
}
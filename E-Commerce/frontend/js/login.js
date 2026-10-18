const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/products/login/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = "Login successful! 🎉";
            loginMessage.style.color = "green";

            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("username", username);

            
            window.location.href = "index.html";
            

        } else {
            loginMessage.textContent =
                data.error || "Invalid username or password.";

            loginMessage.style.color = "red";
        }

    } catch (error) {
        console.error("Login error:", error);

        loginMessage.textContent =
            "Unable to connect to the server.";

        loginMessage.style.color = "red";
    }
});
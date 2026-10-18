const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/products/register/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            registerMessage.textContent =
                "Registration successful! 🎉";

            registerMessage.style.color = "green";

            registerForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            registerMessage.textContent =
                data.error || "Registration failed.";

            registerMessage.style.color = "red";
        }

    } catch (error) {
        console.error("Registration error:", error);

        registerMessage.textContent =
            "Unable to connect to the server.";

        registerMessage.style.color = "red";
    }
});
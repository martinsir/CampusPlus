document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed.");

    // DOM Elements
    const loginForm = document.getElementById("login-form");
    const loginButton = document.getElementById("login-button");
    const usernameInput = document.getElementById("brugernavn");
    const passwordInput = document.getElementById("kodeord");

    /**
     * Enables or disables the login button based on input validation.
     */
    const validateLoginForm = () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Enable the login button if both fields have values
        loginButton.disabled = username === "" || password === "";
    };

    // Attach input event listeners for real-time validation
    usernameInput.addEventListener("input", validateLoginForm);
    passwordInput.addEventListener("input", validateLoginForm);

    // Validate the login form on page load
    validateLoginForm();

    /**
     * Handles login form submission.
     */
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Login form submitted");

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            // Send login data to the server
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Login failed:", errorResponse.error || "Unknown error");
                throw new Error(errorResponse.error || "Login failed");
            }

            // Successful login
            const result = await response.json();
            console.log("Login successful:", result);

            // Save user details to localStorage for further use
            localStorage.setItem("token", result.token);
            localStorage.setItem("role", result.role);

            // Redirect or load the main content
            showMainContent();
        } catch (error) {
            console.error("Error during login:", error.message);
            alert(`Login failed: ${error.message}`);
        }
    });

    /**
     * Displays the main content after a successful login.
     */
    const showMainContent = () => {
        document.getElementById("login-page").style.display = "none";
        document.getElementById("content").style.display = "block";
        console.log("Main content displayed");
    };
});

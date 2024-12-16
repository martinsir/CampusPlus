document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed.");

    // DOM Elements
    const loginForm = document.getElementById("login-form");
    const passwordInput = document.getElementById("register-kodeord");
    const registerButton = document.getElementById("register-button");
    const passwordRequirementsContainer = document.createElement("div");

    // Add password requirements UI
    passwordRequirementsContainer.id = "password-requirements";
    const requirements = {
        length: { text: "At least 8 characters", valid: false },
        uppercase: { text: "At least 1 uppercase letter", valid: false },
        number: { text: "At least 1 number", valid: false },
        special: { text: "At least 1 special character", valid: false },
    };

    // Attach password requirements dynamically
    if (!document.getElementById("password-requirements")) {
        passwordRequirementsContainer.innerHTML = `
            <ul>
                ${Object.entries(requirements)
                    .map(([key, req]) => `<li id="${key}-req" class="invalid">${req.text}</li>`)
                    .join("")}
            </ul>`;
        passwordInput.parentElement.appendChild(passwordRequirementsContainer);
    }

    /**
     * Updates the password requirements UI dynamically.
     */
    const updatePasswordUI = () => {
        Object.entries(requirements).forEach(([key, req]) => {
            const element = document.getElementById(`${key}-req`);
            if (req.valid) {
                element.classList.add("valid");
                element.classList.remove("invalid");
            } else {
                element.classList.add("invalid");
                element.classList.remove("valid");
            }
        });
    };

    /**
     * Validates the password in real-time.
     */
    const validatePassword = () => {
        const password = passwordInput.value;

        // Validate against password requirements
        requirements.length.valid = password.length >= 8;
        requirements.uppercase.valid = /[A-Z]/.test(password);
        requirements.number.valid = /\d/.test(password);
        requirements.special.valid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        updatePasswordUI();

        // Enable register button only if all requirements are valid
        registerButton.disabled = !Object.values(requirements).every((req) => req.valid);
    };

    // Attach input event listener for real-time validation
    passwordInput.addEventListener("input", validatePassword);

    /**
     * Handles login form submission.
     */
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Login form submitted");

        const email = loginForm.elements["brugernavn"].value.trim();
        const password = loginForm.elements["kodeord"].value.trim();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Login failed:", errorResponse.error || "Unknown error");
                throw new Error(errorResponse.error || "Login failed");
            }

            const result = await response.json();
            console.log("Login successful:", result);
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
        document.getElementById("register-page").style.display = "none";
        document.getElementById("content").style.display = "block";
        console.log("Main content displayed");
    };

    // Initialize password validation on load
    validatePassword();
});

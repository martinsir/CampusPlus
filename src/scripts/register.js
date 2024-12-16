document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const registerLink = document.getElementById("register-link");
    const backToLoginLink = document.getElementById("back-to-login");
    const registerButton = document.getElementById("register-button");
    const passwordInput = document.getElementById("register-kodeord");
    const confirmPasswordInput = document.getElementById("register-bekræft-kodeord");
    const passwordRequirementsContainer = document.createElement("div");

    // Password Requirements Object
    const requirements = {
        length: { text: "At least 8 characters", valid: false },
        uppercase: { text: "At least 1 uppercase letter", valid: false },
        number: { text: "At least 1 number", valid: false },
        special: { text: "At least 1 special character", valid: false },
    };

    // Prevent duplicating the password requirements UI
    if (!document.getElementById("password-requirements")) {
        passwordRequirementsContainer.id = "password-requirements";
        passwordRequirementsContainer.innerHTML = `
            <ul>
                ${Object.entries(requirements)
                    .map(
                        ([key, req]) => `<li id="${key}-req" class="invalid">${req.text}</li>`
                    )
                    .join("")}
            </ul>
        `;
        passwordInput.parentElement.appendChild(passwordRequirementsContainer);
    }

    /**
     * Update password validation UI dynamically.
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
     * Validate password in real-time.
     */
    const validatePassword = () => {
        const password = passwordInput.value;

        requirements.length.valid = password.length >= 8;
        requirements.uppercase.valid = /[A-Z]/.test(password);
        requirements.number.valid = /\d/.test(password);
        requirements.special.valid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        updatePasswordUI();

        const allRequirementsMet = Object.values(requirements).every((req) => req.valid);
        const passwordsMatch = password === confirmPasswordInput.value;

        // Enable register button only if all requirements are met and passwords match
        registerButton.disabled = !(allRequirementsMet && passwordsMatch);
    };

    // Attach password validation listeners
    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validatePassword);

    /**
     * Handle navigation to the registration page.
     */
    registerLink.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Navigating to Register Page");
        document.getElementById("login-page").style.display = "none";
        document.getElementById("register-page").style.display = "block";
    });

    /**
     * Handle navigation back to the login page.
     */
    backToLoginLink.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Navigating back to Login Page");
        document.getElementById("register-page").style.display = "none";
        document.getElementById("login-page").style.display = "block";
    });

    /**
     * Handle registration form submission.
     */
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Registration form submitted");

        const name = document.getElementById("register-brugernavn").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = passwordInput.value.trim();
        const phoneNumber = document.getElementById("register-phone").value || null;
        const role = document.getElementById("register-role").value;
        const schoolId = parseInt(document.getElementById("register-school").value, 10);

        const userData = { name, email, password, role, phoneNumber, schoolId };

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Registration failed:", errorResponse.error || "Unknown error");
                throw new Error(errorResponse.error || "Registration failed");
            }

            const result = await response.json();
            console.log("Registration successful:", result);
            alert("Registration successful! You can now log in.");
            backToLoginLink.click(); // Navigate back to login page
        } catch (error) {
            console.error("Error during registration:", error.message);
            alert(error.message);
        }
    });

    // Validate password requirements on load
    validatePassword();
});

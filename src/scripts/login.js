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

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Loading...";

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                if (response.status === 401 || response.status === 403) {
                    alert("Invalid credentials or session expired. Please log in again.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                }
                console.error("Login failed:", errorResponse.error || "Unknown error");
                throw new Error(errorResponse.error || "Login failed");
            }

            const result = await response.json();
            console.log("Login successful:", result);

            localStorage.setItem("token", result.token);
            localStorage.setItem("role", result.role);

            // Redirect or load the main content
            if (result.role === "admin") {
                window.location.href = "/admin-dashboard";
            } else {
                showMainContent();
            }
        } catch (error) {
            console.error("Error during login:", error.message);
            alert(`Login failed: ${error.message}`);
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Login";
        }
    });

    /**
     * Displays the main content and hides the login page after login.
     */
    const showMainContent = () => {
        console.log("Showing main content...");
    
        // Hide the login page and form
        const loginPage = document.getElementById("login-page");
        if (loginPage) {
            loginPage.style.display = "none"; // Hides login page completely
            console.log("Login page hidden.");
        }
    
        // Hide the "Fortsæt som gæst" button
        const guestButton = document.getElementById("guest-button");
        if (guestButton) {
            guestButton.style.display = "none"; // Hides the button completely
            console.log('"Fortsæt som gæst" button hidden.');
        }
    
        // Show the video container
        const videoContainer = document.querySelector(".video-container");
        if (videoContainer) {
            videoContainer.style.display = ""; // Restore default display (CSS-controlled)
            console.log("Video container shown.");
        }
    
        // Show the content container
        const contentContainer = document.querySelector(".content-container");
        if (contentContainer) {
            contentContainer.style.display = ""; // Restore default display (CSS-controlled)
            console.log("Content container shown.");
    
            // Ensure all content boxes follow the CSS layout
            const contentBoxes = contentContainer.querySelectorAll('[class^="content-box"]');
            contentBoxes.forEach((box) => {
                box.style.display = ""; // Restore default display (CSS-controlled)
                console.log(`Content box "${box.className}" shown.`);
            });
        }
    
        // Show the bottom navigation
        const bottomNav = document.querySelector(".bottom-nav");
        if (bottomNav) {
            bottomNav.style.display = ""; // Restore default display (CSS-controlled)
            console.log("Bottom navigation shown.");
        }
    
        // Ensure correct stylesheets are enabled
        const loginStylesheet = document.getElementById("login-stylesheet");
        if (loginStylesheet) {
            loginStylesheet.disabled = true; // Disable login styles
            console.log("Login stylesheet disabled.");
        }
        const mainStylesheet = document.getElementById("main-stylesheet");
        if (mainStylesheet) {
            mainStylesheet.disabled = false; // Enable main content styles
            console.log("Main stylesheet enabled.");
        }
        const bottomNavStylesheet = document.getElementById("bottom-nav-stylesheet");
        if (bottomNavStylesheet) {
            bottomNavStylesheet.disabled = false; // Enable bottom nav styles
            console.log("Bottom navigation stylesheet enabled.");
        }
    
        console.log("Main content displayed.");
    };
    
    
});

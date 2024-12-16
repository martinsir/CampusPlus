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
    
        // Variables
        const loginPage = document.getElementById("login-page");
        const loginForm = document.getElementById("login-form");
        const guestButton = document.getElementById("guest-button");
        const videoContainer = document.querySelector(".video-container");
        const contentContainer = document.querySelector(".content-container");
        const contentBoxes = document.querySelectorAll('[class^="content-box"]');
        const bottomNav = document.querySelector(".bottom-nav");
        const mainContent = document.getElementById("content");
    
        const loginStylesheet = document.getElementById("login-stylesheet");
        const mainStylesheet = document.getElementById("main-stylesheet");
        const bottomNavStylesheet = document.getElementById("bottom-nav-stylesheet");
    
        // 1. Hide the login page and login form
        if (loginPage) {
            loginPage.style.display = "none";
            console.log("Login page hidden.");
        }
        if (loginForm) {
            loginForm.style.display = "none";
            console.log("Login form hidden.");
        }
    
        // 2. Hide the "Fortsæt som gæst" button
        if (guestButton) {
            guestButton.style.display = "none";
            console.log('"Fortsæt som gæst" button hidden.');
        }
    
        // 3. Show the video container
        if (videoContainer) {
            videoContainer.style.display = ""; // Restore CSS default
            console.log("Video container shown.");
        }
    
        // 4. Show the content container
        if (contentContainer) {
            contentContainer.style.display = ""; // Restore CSS default
            console.log("Content container shown.");
        }
    
        // 5. Show all content boxes
        if (contentBoxes.length > 0) {
            contentBoxes.forEach((box) => {
                box.style.display = ""; // Restore CSS default
                console.log(`Content box "${box.className}" shown.`);
            });
        } else {
            console.warn("No content boxes found.");
        }
    
        // 6. Show the #content (Main Content)
        if (mainContent) {
            mainContent.style.display = ""; // Restore CSS default
            console.log("Main content section shown.");
        } else {
            console.warn("#content not found.");
        }
    
        // 7. Show the bottom navigation
        if (bottomNav) {
            bottomNav.style.display = ""; // Restore CSS default
            console.log("Bottom navigation shown.");
        }
    
        // 8. Enable the correct stylesheets
        if (loginStylesheet) {
            loginStylesheet.disabled = true; // Disable login stylesheet
            console.log("Login stylesheet disabled.");
        }
        if (mainStylesheet) {
            mainStylesheet.disabled = false; // Enable main stylesheet
            console.log("Main stylesheet enabled.");
        }
        if (bottomNavStylesheet) {
            bottomNavStylesheet.disabled = false; // Enable bottom nav stylesheet
            console.log("Bottom navigation stylesheet enabled.");
        }
    
        console.log("Main content displayed successfully.");
    };
    
    
});

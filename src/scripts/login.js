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
 /**
 * Displays the main content and hides the login page after login.
 */
const showMainContent = () => {
    // Hide the entire login page
    const loginPage = document.getElementById("login-page");
    if (loginPage) {
        loginPage.style.display = "none"; // Hide the login page
    }

    // Show the main content container
    const contentContainer = document.querySelector(".content-container");
    if (contentContainer) {
        contentContainer.style.display = "flex: 1 1 calc(33.333% - 40px) "; // Show main content
    } 
    const contentBoxes = document.querySelectorAll('[class^="content-box"]');
    contentBoxes.forEach((box) => {
        box.style.display = "flex: 1 1 calc(33.333% - 40px)"; // Ensure content-box is visible
    });
    
    const VidContainer = document.getElementById(".video-container ");
    if (VidContainer) {
        VidContainer.style.display = "flex: 1 1 100%"; // Show main content
    }



    // Show the bottom navigation
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) {
        bottomNav.style.display = "flex"; // Show bottom navigation
    }

    // Update stylesheets
    const loginStylesheet = document.getElementById("login-stylesheet");
    if (loginStylesheet) {
        loginStylesheet.disabled = true; // Disable login styles
    }
    const bottomNavStylesheet = document.getElementById("bottom-nav-stylesheet");
    if (bottomNavStylesheet) {
        bottomNavStylesheet.disabled = false; // Enable bottom-nav styles
    }
    const mainStyles = document.getElementById("main-stylesheet");
    if (mainStyles) {
        mainStyles.disabled = false; // Enable bottom-nav styles
    }


    console.log("Main content and navigation displayed. Login page hidden.");
};

    
});

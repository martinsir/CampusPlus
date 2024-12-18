import { apiRequest } from "./utils/api.js";
import { saveToken } from "./utils/auth.js";
import { showMainContent, loadTemplate } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Login script initialized");

  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const loginButton = document.getElementById("login-button");
  const usernameInput = document.getElementById("brugernavn");
  const passwordInput = document.getElementById("kodeord");
  const guestButton = document.getElementById("guest-button");

  // Validate required elements
  if (
    !loginForm ||
    !loginButton ||
    !usernameInput ||
    !passwordInput ||
    !guestButton
  ) {
    console.error("Login elements not found in DOM");
    return;
  }

  /**
   * Form Validation Logic
   */
  const validateLoginForm = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    loginButton.disabled = username === "" || password === "";
    console.log(
      `Login form validation: ${loginButton.disabled ? "Invalid" : "Valid"}`
    );
  };

  usernameInput.addEventListener("input", validateLoginForm);
  passwordInput.addEventListener("input", validateLoginForm);
  validateLoginForm(); // Initial validation

  /**
   * Login Form Submission Handler
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
      const result = await apiRequest(
        `${import.meta.env.VITE_API_URL}/login`,
        "POST",
        {
          username,
          password,
        }
      );
      console.log("Login successful:", result);

      // Save token and role
      saveToken(result.token);
      localStorage.setItem("role", result.role);

      loadRoleSpecificContent(result.role); // Load role-specific content
    } catch (error) {
      console.error("Error during login:", error.message);
      alert(`Login failed: ${error.message}`);
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  });

  /**
   * Guest Login Logic
   */
  guestButton.addEventListener("click", () => {
    console.log("Guest login triggered");
    sessionStorage.setItem("userRole", "guest");
    loadRoleSpecificContent("Guest");
  });

  /**
   * Load role-specific content by template or direct DOM updates.
   */
  const loadRoleSpecificContent = async (role) => {
    console.log(`Loading content for role: ${role}`);

    try {
      switch (role) {
        case "Teacher":
          await loadTemplate("templates/teacher-section.html", "app");
          console.log("Teacher-specific content loaded.");
          break;
        case "Student":
          await loadTemplate("templates/student-section.html", "app");
          console.log("Student-specific content loaded.");
          break;
        case "Guest":
          await loadTemplate("templates/guest-section.html", "app");
          console.log("Guest-specific content loaded.");
          break;
        default:
          console.error("Unknown role:", role);
          return;
      }

      // Show the main content for all roles
      showMainContent();
    } catch (error) {
      console.error(`Failed to load content for role ${role}:`, error.message);
    }
  };
});

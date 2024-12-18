import { apiRequest } from "./utils/api.js";
import { saveToken } from "./utils/auth.js";
import { showMainContent, validateLoginForm } from "./utils/ui.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Main application initialized.");

  const apiUrl = import.meta.env.VITE_API_URL;

  /**
   * Dynamically load external scripts from `scripts.html`.
   */
  const loadScripts = async () => {
    try {
      const response = await fetch("/templates/scripts.html"); // Ensure correct path
      if (!response.ok) throw new Error("Failed to load scripts.html");

      const scriptsHtml = await response.text();
      const scriptsPlaceholder = document.createElement("div");
      scriptsPlaceholder.innerHTML = scriptsHtml;
      document.body.appendChild(scriptsPlaceholder);

      console.log("Scripts loaded successfully.");
    } catch (error) {
      console.error("Error loading scripts:", error.message);
    }
  };

  await loadScripts(); // Load external scripts

  /**
   * Perform a health check on the API.
   */
  try {
    const healthResponse = await apiRequest(`${apiUrl}`);
    console.log("API health check successful:", healthResponse);
  } catch (error) {
    console.error("API health check failed:", error.message);
  }

  /**
   * Dynamically load templates based on the user's role.
   */
  const loadTemplate = async (templatePath, containerId) => {
    try {
      const response = await fetch(templatePath);
      if (!response.ok)
        throw new Error(`Failed to load template: ${templatePath}`);

      const html = await response.text();
      const container = document.getElementById(containerId);

      if (!container) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
      }

      container.innerHTML = html;
      console.log(`Template loaded successfully from ${templatePath}`);
    } catch (error) {
      console.error(
        `Error loading template from ${templatePath}:`,
        error.message
      );
    }
  };

  /**
   * Load role-specific content by dynamically fetching templates.
   */
  const loadRoleSpecificContent = (role) => {
    console.log(`Loading content for role: ${role}`);
    switch (role) {
      case "Teacher":
        loadTemplate("templates/teacher-section.html", "app");
        break;
      case "Student":
        loadTemplate("templates/student-section.html", "app");
        break;
      case "Guest":
        loadTemplate("templates/guest-section.html", "app");
        break;
      default:
        console.error("Unknown role:", role);
    }
  };

  // Attach Login Form Logic
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("brugernavn");
  const passwordInput = document.getElementById("kodeord");
  const loginButton = document.getElementById("login-button");

  if (loginForm && usernameInput && passwordInput && loginButton) {
    usernameInput.addEventListener("input", () =>
      validateLoginForm(usernameInput, passwordInput, loginButton)
    );
    passwordInput.addEventListener("input", () =>
      validateLoginForm(usernameInput, passwordInput, loginButton)
    );
    validateLoginForm(usernameInput, passwordInput, loginButton); // Initial validation

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
        const result = await apiRequest(`${apiUrl}/login`, "POST", {
          username,
          password,
        });
        console.log("Login successful:", result);

        // Save token and role
        saveToken(result.token);
        localStorage.setItem("role", result.role);

        loadRoleSpecificContent(result.role); // Load role-based content
      } catch (error) {
        console.error("Login error:", error.message);
        alert(`Login failed: ${error.message}`);
      } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
      }
    });
  }

  // Guest Login Logic
  const guestButton = document.getElementById("guest-button");
  if (guestButton) {
    guestButton.addEventListener("click", () => {
      console.log("Guest login triggered");
      sessionStorage.setItem("userRole", "guest");
      loadRoleSpecificContent("Guest");
    });
  }
});

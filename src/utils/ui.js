// utils/ui.js

/**
 * Displays the main content and hides the login page.
 */
export const showMainContent = () => {
  console.log("Showing main content...");

  // DOM Elements
  const elementsToHide = ["login-page", "guest-button"];
  const elementsToShow = [
    "video-container",
    "content-container",
    "content",
    "header-container",
    "mobile-nav",
  ];

  // Stylesheets
  const stylesheetsToEnable = [
    "main-stylesheet",
    "bottom-nav-stylesheet",
    "header-stylesheet",
  ];
  const stylesheetsToDisable = ["login-stylesheet"];

  // Hide elements
  elementsToHide.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.style.display = "none";
  });

  // Show elements
  elementsToShow.forEach((id) => {
    const element = document.getElementById(id);
    if (element) element.style.display = ""; // Restore default display
  });

  // Update stylesheets
  stylesheetsToEnable.forEach((id) => {
    const stylesheet = document.getElementById(id);
    if (stylesheet) stylesheet.disabled = false;
  });

  stylesheetsToDisable.forEach((id) => {
    const stylesheet = document.getElementById(id);
    if (stylesheet) stylesheet.disabled = true;
  });

  console.log("Main content displayed.");
};

/**
 * Validates the login form and enables/disables the login button.
 * @param {HTMLInputElement} usernameInput - The username input field.
 * @param {HTMLInputElement} passwordInput - The password input field.
 * @param {HTMLButtonElement} loginButton - The login button.
 */
export const validateLoginForm = (
  usernameInput,
  passwordInput,
  loginButton
) => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  loginButton.disabled = username === "" || password === "";
};

/**
 * Dynamically loads an HTML template into a specified container.
 * @param {string} templatePath - The path to the HTML template.
 * @param {string} containerId - The ID of the container to load the template into.
 */
export const loadTemplate = async (templatePath, containerId) => {
  try {
    const response = await fetch(templatePath);
    if (!response.ok)
      throw new Error(`Failed to fetch template: ${templatePath}`);

    const html = await response.text();
    const container = document.getElementById(containerId);

    if (container) {
      container.innerHTML = html;
      console.log(`Template loaded into #${containerId} from ${templatePath}`);
    } else {
      console.error(`Container with ID ${containerId} not found.`);
    }
  } catch (error) {
    console.error(`Error loading template: ${error.message}`);
  }
};

/**
 * Toggles visibility of a given element by ID.
 * @param {string} elementId - The ID of the element to toggle.
 * @param {boolean} isVisible - Whether the element should be visible.
 */
export const toggleVisibility = (elementId, isVisible) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = isVisible ? "" : "none";
    console.log(
      `Element #${elementId} is now ${isVisible ? "visible" : "hidden"}.`
    );
  } else {
    console.error(`Element with ID ${elementId} not found.`);
  }
};

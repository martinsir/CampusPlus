document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const guestButton = document.getElementById("guest-button");
  const loginForm = document.getElementById("login-form");
  const loginPage = document.getElementById("login-page");

  /**
   * Renders the header HTML.
   */
  const renderHeader = () => `
    <header class="roshni-header">
      <button class="hamburger" id="menu-button">
        <div class="bar"></div>
      </button>
    </header>
  `;

  /**
   * Initializes the header and its functionality.
   */
  const loadHeader = () => {
    if (!headerContainer) {
      console.error("Header container not found");
      return;
    }

    headerContainer.innerHTML = renderHeader(); // Render header
    headerContainer.style.display = "flex"; // Show the header
    console.log("Header loaded and displayed.");

    // Hamburger menu functionality
    const menuButton = document.getElementById("menu-button");
    const mobileNav = document.getElementById("mobile-nav");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("is-active");
        console.log("Mobile navigation toggled.");
      });
    } else {
      console.warn("Menu button or mobile navigation not found.");
    }
  };

  /**
   * Shows the header after guest login or successful login.
   */
  const showHeader = () => {
    loadHeader(); // Load the header
    if (loginPage) loginPage.style.display = "none"; // Hide the login page
  };

  // Show header when "Fortsæt som gæst" is clicked
  if (guestButton) {
    guestButton.addEventListener("click", () => {
      console.log("Guest login triggered. Showing header...");
      showHeader();
    });
  }

  // Show header after successful login
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission for this example
      console.log("Login successful. Showing header...");
      showHeader();
    });
  }
});

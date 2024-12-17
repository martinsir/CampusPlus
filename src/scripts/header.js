document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  const guestButton = document.getElementById("guest-button");
  const loginForm = document.getElementById("login-form");
  const loginPage = document.getElementById("login-page");

  // Function to initialize the header
  const loadHeader = () => {
    if (headerContainer) {
      headerContainer.innerHTML = `
          <header class="roshni-header">
           
            <button class="hamburger" id="menu-button">
              <div class="bar"></div>

            </button>
          </header>
        `;
      headerContainer.style.display = "flex"; // Show the header
      console.log("Header loaded and displayed.");

      // Initialize hamburger functionality
      const menuButton = document.getElementById("menu-button");
      const mobileNav = document.getElementById("mobile-nav");

      if (menuButton && mobileNav) {
        menuButton.addEventListener("click", () => {
          mobileNav.classList.toggle("is-active");
          console.log("Mobile navigation toggled.");
        });
      }
    }
  };

  // Show the header when "Fortsæt som gæst" is clicked
  if (guestButton) {
    guestButton.addEventListener("click", () => {
      loadHeader(); // Load the header
      loginPage.style.display = "none"; // Hide the login page
    });
  }

  // Show the header after successful login
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent form submission for this example
      console.log("Login successful. Showing header...");
      loadHeader(); // Load the header
      loginPage.style.display = "none"; // Hide the login page
    });
  }
});

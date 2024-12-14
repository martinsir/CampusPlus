document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const guestButton = document.getElementById("guest-button");
  
    // Handle login form submission
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const username = document.getElementById("brugernavn").value;
        const password = document.getElementById("kodeord").value;
  
        if (username === "admin" && password === "admin") {
          console.log("Login successful");
          showMainContent();
        } else {
          alert("Ugyldigt brugernavn eller kodeord.");
        }
      });
    }
  
    // Handle guest login
    if (guestButton) {
      guestButton.addEventListener("click", () => {
        alert("Du er logget ind som gæst. Begrænset adgang aktiveret.");
  
        // Hide the bottom navigation bar styles
        const bottomNavStylesheet = document.getElementById("bottom-nav-stylesheet");
        if (bottomNavStylesheet) {
          bottomNavStylesheet.remove();
          console.log("Bottom navigation bar disabled for guest.");
        }
  
        // Call function to show the main content
        showMainContent();
      });
    }
  
    // Utility to remove login stylesheet dynamically
    function removeLoginStylesheet() {
      const loginStylesheet = document.getElementById("login-stylesheet");
      if (loginStylesheet) loginStylesheet.remove();
    }
  
    // Show main content
    function showMainContent() {
      // Hide splash screen
      const splashScreen = document.getElementById("splash");
      if (splashScreen) splashScreen.style.display = "none";
  
      // Hide login page
      const loginPage = document.getElementById("login-page");
      if (loginPage) loginPage.style.display = "none";
  
      // Remove login stylesheet
      removeLoginStylesheet();
  
      // Show main content
      const mainContent = document.getElementById("content");
      const videoContainer = document.querySelector(".video-container");
      const contentContainer = document.querySelector(".content-container");
  
      if (mainContent) mainContent.style.display = "block";
      if (videoContainer) videoContainer.style.display = "block";
      if (contentContainer) contentContainer.style.display = "block";
  
      console.log("Main content displayed.");
    }
  });
  
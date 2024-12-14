document.addEventListener("DOMContentLoaded", () => {
    const loginPage = document.getElementById("login-page");
    const registerPage = document.getElementById("register-page");
    const backToLogin = document.getElementById("back-to-login");
    const registerLink = document.querySelector(".register a");
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
  
    // Show registration page
    if (registerLink) {
      registerLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginPage.style.display = "none";
        registerPage.style.display = "block";
      });
    }
  
    // Go back to login page
    if (backToLogin) {
      backToLogin.addEventListener("click", (event) => {
        event.preventDefault();
        registerPage.style.display = "none";
        loginPage.style.display = "block";
      });
    }
  
    // Handle registration form submission
    if (registerForm) {
      registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
  
        const username = document.getElementById("register-brugernavn").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-kodeord").value;
        const confirmPassword = document.getElementById("register-bekræft-kodeord").value;
  
        if (password !== confirmPassword) {
          alert("Kodeordene matcher ikke. Prøv igen.");
          return;
        }
  
        // Mock API call for registration
        console.log("Registering user:", { username, email, password });
  
        // Redirect to login after successful registration
        alert("Registrering fuldført. Log venligst ind.");
        registerPage.style.display = "none";
        loginPage.style.display = "block";
      });
    }
  
    // Handle login form submission
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const username = document.getElementById("brugernavn").value;
      const password = document.getElementById("kodeord").value;
  
      if (username === "admin" && password === "admin") {
        alert("Login successful");
        showMainContent();
      } else {
        alert("Ugyldigt brugernavn eller kodeord.");
      }
    });
  });
  
  // Function to show the main content
  function showMainContent() {
    const loginPage = document.getElementById("login-page");
    const registerPage = document.getElementById("register-page");
    const mainContent = document.getElementById("content");
  
    if (loginPage) loginPage.style.display = "none";
    if (registerPage) registerPage.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
  
    console.log("Main content displayed.");
  }
  
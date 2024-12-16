import "./splash.js";
import "./login.js";
import "./bottom-nav.js";


document.addEventListener("DOMContentLoaded", async () => {
  console.log("Main application initialized.");

  try {
    const response = await fetch("/api");
    console.log("API response:", await response.json());
  } catch (error) {
    console.error("Global initialization error:", error);
  }
});

import "./splash.js";
import "./login.js";
import "./bottom-nav.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Main application initialized.");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}`);
    const data = await response.json();
    console.log("API response:", data);
  } catch (error) {
    console.error("Global initialization error:", error);
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
  
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        console.log(`Navigating to ${item.getAttribute("href")}`);
      });
    });
  });
  
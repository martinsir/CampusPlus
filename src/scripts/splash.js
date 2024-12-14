import { gsap } from "gsap";

document.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.getElementById("splash");
  const loginPage = document.getElementById("login-page");

  // GSAP Animation for Splash
  const timeline = gsap.timeline({
    onComplete: () => {
      splashScreen.style.display = "none"; // Hide splash
      loginPage.style.display = "block"; // Show login page
    },
  });

  timeline.to("#splash-logo", {
    rotation: 360,
    duration: 1.5,
    scale: 1.2,
    ease: "power1.inOut",
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Ticket Button Logic (Existing)
  const ticketButton = document.getElementById("ticket-button");

  if (ticketButton) {
    ticketButton.addEventListener("click", () => {
      console.log("Ticket button clicked - dispatching event...");
      document.dispatchEvent(new Event("open-ticket-modal"));
    });
  }

  // Map Button Logic
  const mapButton = document.getElementById("map-button"); // Map button
  const mapModal = document.getElementById("map-modal"); // Map modal container
  const closeMapButton = document.getElementById("close-map-modal"); // Close button

  // Function to show the map modal
  const openMapModal = () => {
    mapModal.style.display = "flex"; // Use flex for centering
  };

  // Event Listeners
  if (mapButton) {
    mapButton.addEventListener("click", (e) => {
      e.preventDefault();
      openMapModal();
    });
  }

  // Function to hide the map modal
  const closeMapModal = () => {
    mapModal.style.display = "none";
  };

  if (closeMapButton) {
    closeMapButton.addEventListener("click", closeMapModal);
  }

  // Optional: Close modal when clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === mapModal) {
      closeMapModal();
    }
  });
});

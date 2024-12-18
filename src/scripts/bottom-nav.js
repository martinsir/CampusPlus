document.addEventListener("DOMContentLoaded", () => {
  console.log("Bottom navigation initialized.");

  // DOM Elements
  const ticketButton = document.getElementById("ticket-button");
  const mapButton = document.getElementById("map-button");
  const mapModal = document.getElementById("map-modal");
  const closeMapButton = document.getElementById("close-map-modal");

  /**
   * Shows the map modal.
   */
  const openMapModal = () => {
    if (mapModal) {
      mapModal.style.display = "flex"; // Use flex for centering
      console.log("Map modal opened.");
    } else {
      console.warn("Map modal not found.");
    }
  };

  /**
   * Hides the map modal.
   */
  const closeMapModal = () => {
    if (mapModal) {
      mapModal.style.display = "none";
      console.log("Map modal closed.");
    } else {
      console.warn("Map modal not found.");
    }
  };

  // Attach event listener for the ticket button
  if (ticketButton) {
    ticketButton.addEventListener("click", () => {
      console.log(
        "Ticket button clicked - dispatching 'open-ticket-modal' event."
      );
      document.dispatchEvent(new Event("open-ticket-modal"));
    });
  } else {
    console.warn("Ticket button not found.");
  }

  // Attach event listener for the map button
  if (mapButton) {
    mapButton.addEventListener("click", (e) => {
      e.preventDefault();
      openMapModal();
    });
  } else {
    console.warn("Map button not found.");
  }

  // Attach event listener for the close button in the map modal
  if (closeMapButton) {
    closeMapButton.addEventListener("click", closeMapModal);
  } else {
    console.warn("Close map button not found.");
  }

  // Close modal when clicking outside the modal content
  if (mapModal) {
    window.addEventListener("click", (e) => {
      if (e.target === mapModal) {
        closeMapModal();
      }
    });
  }
});

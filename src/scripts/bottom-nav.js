document.addEventListener("DOMContentLoaded", () => {
  const ticketButton = document.getElementById("ticket-button");

  if (ticketButton) {
    ticketButton.addEventListener("click", () => {
      console.log("Ticket button clicked - dispatching event...");
      document.dispatchEvent(new Event("open-ticket-modal"));
    });
  }
});

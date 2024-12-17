document.addEventListener("DOMContentLoaded", () => {
  console.log("Bottom navigation and ticket functionality initialized.");

  const ticketButton = document.getElementById("ticket-button");
  const ticketStatus = document.getElementById("ticket-status");

  // Simulated ticket state
  const ticketState = {
    hasPurchased: false,
    eligibleForFreeTicket: true,
  };

  // Update button text and functionality
  const updateTicketButton = () => {
    if (ticketState.hasPurchased) {
      ticketStatus.textContent = "Din Billet";
      ticketButton.onclick = () => alert("Du har allerede en billet!");
    } else if (ticketState.eligibleForFreeTicket) {
      ticketStatus.textContent = "Hent Billet";
      ticketButton.onclick = claimTicket;
    } else {
      ticketStatus.textContent = "Køb Billet";
      ticketButton.onclick = buyTicket;
    }
  };

  // Claim free ticket
  const claimTicket = () => {
    console.log("Processing free ticket claim...");
    setTimeout(() => {
      alert("Du har succesfuldt hentet din billet!");
      ticketState.hasPurchased = true;
      updateTicketButton();
    }, 1000);
  };

  // Buy ticket
  const buyTicket = () => {
    console.log("Redirecting to buy ticket...");
    window.location.href = "/buy-ticket"; // Replace with the actual buy ticket URL
  };

  // Initialize button on load
  updateTicketButton();
});

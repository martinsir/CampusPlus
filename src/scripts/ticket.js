document.addEventListener("DOMContentLoaded", () => {
  const ticketButton = document.getElementById("ticket-button");
  const bulkModal = document.getElementById("bulk-ticket-modal");
  const closeModalButton = document.getElementById("close-modal");
  const confirmBulkPurchase = document.getElementById("confirm-bulk-purchase");
  const ticketDisplay = document.getElementById("ticket-display");

  // Helper: Show Element
  const showElement = (element) => {
    element.style.display = "flex";
    element.classList.remove("hidden");
    element.classList.add("visible");
  };

  // Helper: Hide Element
  const hideElement = (element) => {
    element.style.display = "none";
    element.classList.remove("visible");
    element.classList.add("hidden");
  };

  /**
   * Generates a random 6-character invitation code.
   */
  const generateInvitationCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  /**
   * Generates a QR code URL using the invitation code.
   */
  const generateQRCodeURL = (data) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;

  /**
   * Displays the ticket modal with the ticket details.
   */
  const displayTicketModal = (ticketDetails) => {
    const qrImageURL = generateQRCodeURL(ticketDetails.invitationCode);

    ticketDisplay.innerHTML = `
    <div class="ticket">
      <h3>Din Billet</h3>
      <p><strong>Navn:</strong> ${ticketDetails.name}</p>
      <p><strong>Skole:</strong> ${ticketDetails.school}</p>
      <p><strong>Antal Billetter:</strong> ${ticketDetails.ticketAmount}</p>
      <p><strong>Invitation Kode:</strong> ${ticketDetails.invitationCode}</p>
      <p><strong>Billet-ID:</strong> ${ticketDetails.ticketID}</p>
      <div>
        <img src="${qrImageURL}" alt="QR Code" class="qr-image" />
      </div>
      <button id="close-ticket-modal">Luk</button>
    </div>
  `;

    showElement(ticketDisplay);

    // Close button functionality
    document
      .getElementById("close-ticket-modal")
      .addEventListener("click", () => hideElement(ticketDisplay));
  };

  /**
   * Displays an invoice confirmation modal.
   */
  const displayInvoiceModal = (ticketDetails) => {
    const invoiceModal = document.createElement("div");
    invoiceModal.classList.add("invoice-message");
    invoiceModal.innerHTML = `
      <div class="modal-content">
        <h3>Faktura tilsendt via mail</h3>
        <p>Tjek venligst din indbakke for yderligere detaljer.</p>
        <button id="close-invoice-modal">Luk</button>
      </div>
    `;
    document.body.appendChild(invoiceModal);

    // Close Invoice Modal
    document
      .getElementById("close-invoice-modal")
      .addEventListener("click", () => {
        invoiceModal.remove();
        // After closing invoice, save the ticket but don't show it immediately
      });
  };

  /**
   * Saves ticket details to localStorage and shows the invoice modal.
   */
  const handleBulkPurchase = () => {
    const ticketAmount = document.getElementById("ticket-amount").value;

    const ticketDetails = {
      name: "Lærer Navn",
      school: "Zealand Business School",
      ticketAmount: ticketAmount,
      invitationCode: generateInvitationCode(),
      ticketID: `TKT-${Math.floor(Math.random() * 1000000)}`,
    };

    localStorage.setItem("ticket", JSON.stringify(ticketDetails));
    hideElement(bulkModal);
    displayInvoiceModal(ticketDetails); // Show the invoice modal
  };

  /**
   * Opens the "Buy Ticket" modal.
   */
  const openBulkModal = () => showElement(bulkModal);

  /**
   * Closes the "Buy Ticket" modal.
   */
  const closeModal = () => hideElement(bulkModal);

  /**
   * Handles the ticket button click.
   */
  const handleTicketButtonClick = () => {
    const storedTicket = JSON.parse(localStorage.getItem("ticket"));

    if (storedTicket) {
      // Show the ticket if it exists
      displayTicketModal(storedTicket);
    } else {
      // Open the bulk ticket modal if no ticket exists
      openBulkModal();
    }
  };

  // Event Listeners
  ticketButton?.addEventListener("click", handleTicketButtonClick);
  confirmBulkPurchase?.addEventListener("click", handleBulkPurchase);
  closeModalButton?.addEventListener("click", closeModal);

  // Ensure hidden state is applied after JS runs
  hideElement(ticketDisplay);
  hideElement(bulkModal);
});

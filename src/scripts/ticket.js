document.addEventListener("DOMContentLoaded", () => {
    console.log("Ticket system initialized.");
  
    const confirmBulkButton = document.getElementById("confirm-bulk-purchase");
    const closeModalButton = document.getElementById("close-modal");
    const modal = document.getElementById("bulk-ticket-modal");
  
    /**
     * Opens the bulk ticket modal.
     */
    const openModal = () => {
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("visible");
        console.log("Bulk ticket modal opened.");
      }
    };
  
    /**
     * Closes the bulk ticket modal.
     */
    const closeModal = () => {
      if (modal) {
        modal.classList.remove("visible");
        modal.classList.add("hidden");
        console.log("Bulk ticket modal closed.");
      }
    };
  
    /**
     * Handles bulk ticket confirmation and displays the invoice message.
     */
    const handleBulkConfirmation = () => {
      closeModal(); // Hide the bulk ticket modal
  
      // Show the confirmation message
      const invoiceMessage = document.createElement("div");
      invoiceMessage.classList.add("invoice-message");
      invoiceMessage.innerHTML = `
        <div class="modal-content">
          <h3>Faktura tilsendt via mail</h3>
          <p>Tjek venligst din indbakke for yderligere detaljer.</p>
          <button id="close-invoice">Luk</button>
        </div>
      `;
  
      // Append the confirmation message to the body
      document.body.appendChild(invoiceMessage);
  
      // Close the message when clicking the button
      document.getElementById("close-invoice").addEventListener("click", () => {
        invoiceMessage.remove();
        console.log("Invoice message closed.");
      });
    };
  
    // Event Listeners for buttons inside the modal
    if (confirmBulkButton) {
      confirmBulkButton.addEventListener("click", handleBulkConfirmation);
    }
    if (closeModalButton) {
      closeModalButton.addEventListener("click", closeModal);
    }
  
    // Listen for the custom event to open the modal
    document.addEventListener("open-ticket-modal", openModal);
  });
  
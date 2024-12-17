document.addEventListener("DOMContentLoaded", () => {
    console.log("Bottom navigation and ticket functionality initialized.");
  
    const ticketButton = document.getElementById("ticket-button");
    const ticketStatus = document.getElementById("ticket-status");
    const ticketDisplay = document.getElementById("ticket-display");
    const ticketId = document.getElementById("ticket-id");
    const ticketName = document.getElementById("ticket-name");
    const ticketSchool = document.getElementById("ticket-school");
    const ticketRole = document.getElementById("ticket-role");
    const ticketZone = document.getElementById("ticket-zone");
  
    // Simulated user data
    const userData = {
      name: "Martin Hansen",
      school: "Zealand Business School",
      role: "Studerende",
    };
  
    // Available zones with corresponding colors
    const zones = [
      { name: "Grøn", color: "green" },
      { name: "Rød", color: "red" },
      { name: "Blå", color: "blue" },
      { name: "Lyserød", color: "pink" },
      { name: "Gul", color: "yellow" },
    ];
  
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
        generateTicket();
        updateTicketButton();
      }, 1000);
    };
  
    // Buy ticket: Generate a dummy ticket and display it
    const buyTicket = () => {
      console.log("Generating dummy ticket...");
      generateTicket();
      ticketState.hasPurchased = true; // Mark ticket as purchased
      updateTicketButton();
    };
  
    // Generate ticket data and display it
    const generateTicket = () => {
      const generatedTicketId = Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
      const randomZone = zones[Math.floor(Math.random() * zones.length)]; // Random zone
  
      // Update ticket information
      ticketId.textContent = generatedTicketId;
      ticketName.textContent = userData.name;
      ticketSchool.textContent = userData.school;
      ticketRole.textContent = userData.role;
      ticketZone.textContent = randomZone.name;
      ticketZone.style.backgroundColor = randomZone.color;
  
      // Show the ticket display
      ticketDisplay.style.display = "block";
      console.log("Dummy ticket generated:", {
        id: generatedTicketId,
        name: userData.name,
        school: userData.school,
        role: userData.role,
        zone: randomZone,
      });
    };
  
    // Initialize button on load
    updateTicketButton();
  });
  
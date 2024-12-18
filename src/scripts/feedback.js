//used in student-section
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const submitFeedbackButton = document.getElementById("submit-feedback");
  const feedbackTextInput = document.getElementById("feedback-text");
  const feedbackRatingSelect = document.getElementById("feedback-rating");

  if (!submitFeedbackButton || !feedbackTextInput || !feedbackRatingSelect) {
    console.error("Feedback form elements not found in DOM");
    return;
  }

  /**
   * Submit feedback to the backend.
   */
  const submitFeedback = async () => {
    const feedbackText = feedbackTextInput.value.trim();
    const rating = parseInt(feedbackRatingSelect.value, 10);
    const classId = 1; // Replace with dynamic class ID if necessary

    // Validate fields
    if (!feedbackText || isNaN(rating)) {
      alert("Please provide feedback text and a valid rating.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token exists
        },
        body: JSON.stringify({ classId, feedbackText, rating }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Feedback submission failed");
      }

      // Success Feedback
      alert("Feedback submitted successfully!");
      console.log("Feedback ID:", result.evaluationId);

      // Reset form after submission
      feedbackTextInput.value = "";
      feedbackRatingSelect.value = "";
    } catch (error) {
      console.error("Error submitting feedback:", error.message);
      alert("Error submitting feedback. Please try again.");
    }
  };

  // Attach event listener to the feedback button
  submitFeedbackButton.addEventListener("click", submitFeedback);
});

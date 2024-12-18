// Populate Classes on Page Load
const populateClasses = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/classes`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch classes.");

    const { classes } = await response.json();
    const classDropdown = document.getElementById("class-id");

    if (classDropdown) {
      classDropdown.innerHTML = classes
        .map(
          (cls) => `<option value="${cls.ClassID}">${cls.ClassName}</option>`
        )
        .join("");
    } else {
      console.warn("Class dropdown element not found.");
    }
  } catch (error) {
    console.error("Error fetching classes:", error.message);
    alert("Unable to fetch classes. Please try again.");
  }
};

// Populate Students When Class Changes
const populateStudents = async (classId) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/students?classId=${classId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch students.");

    const students = await response.json();
    const studentListContainer = document.getElementById("student-list");

    if (studentListContainer) {
      studentListContainer.innerHTML = students
        .map(
          (student) =>
            `<label><input type="checkbox" class="student-checkbox" value="${student.id}" /> ${student.name}</label>`
        )
        .join("");
    } else {
      console.warn("Student list container not found.");
    }
  } catch (error) {
    console.error("Error fetching students:", error.message);
    alert("Unable to fetch students. Please try again.");
  }
};

// Create Group Logic
const createGroup = async () => {
  const groupName = document.getElementById("group-name")?.value.trim();
  const classId = document.getElementById("class-id")?.value;
  const selectedStudentIds = [
    ...document.querySelectorAll(".student-checkbox:checked"),
  ].map((checkbox) => checkbox.value);

  if (!groupName || selectedStudentIds.length !== 5) {
    alert("Please provide a group name and select exactly 5 students.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        classId,
        groupName,
        students: selectedStudentIds,
      }),
    });

    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Failed to create the group.");

    alert("Group created successfully!");
    console.log("Group ID:", result.groupId);

    // Optional: Refresh group data or clear the form
  } catch (error) {
    console.error("Error creating group:", error.message);
    alert("Error creating group. Please try again.");
  }
};

// Initialize Event Listeners
const initializeEventListeners = () => {
  document
    .getElementById("class-id")
    ?.addEventListener("change", (event) =>
      populateStudents(event.target.value)
    );

  document
    .getElementById("create-group-btn")
    ?.addEventListener("click", createGroup);
};

// Initialize Page
const initializePage = () => {
  console.log("Initializing classes page...");
  populateClasses(); // Populate classes on page load
  initializeEventListeners(); // Attach event listeners
};

// Call initialization on page load
document.addEventListener("DOMContentLoaded", initializePage);

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const registerLink = document.getElementById("register-link");
  const backToLoginLink = document.getElementById("back-to-login");
  const registerButton = document.getElementById("register-button");
  const passwordInput = document.getElementById("register-kodeord");
  const confirmPasswordInput = document.getElementById(
    "register-bekræft-kodeord"
  );
  const passwordRequirementsContainer = document.createElement("div");

  // Password Requirements Object
  const requirements = {
    length: { text: "At least 8 characters", valid: false },
    uppercase: { text: "At least 1 uppercase letter", valid: false },
    number: { text: "At least 1 number", valid: false },
    special: { text: "At least 1 special character", valid: false },
  };

  // Prevent duplicating the password requirements UI
  if (!document.getElementById("password-requirements")) {
    passwordRequirementsContainer.id = "password-requirements";
    passwordRequirementsContainer.innerHTML = `
            <ul>
                ${Object.entries(requirements)
                  .map(
                    ([key, req]) =>
                      `<li id="${key}-req" class="invalid">${req.text}</li>`
                  )
                  .join("")}
            </ul>
        `;
    passwordInput.parentElement.appendChild(passwordRequirementsContainer);
  }

  /**
   * Update password validation UI dynamically.
   */
  const updatePasswordUI = () => {
    Object.entries(requirements).forEach(([key, req]) => {
      const element = document.getElementById(`${key}-req`);
      if (req.valid) {
        element.classList.add("valid");
        element.classList.remove("invalid");
      } else {
        element.classList.add("invalid");
        element.classList.remove("valid");
      }
    });
  };

  /**
   * Validate password in real-time.
   */
  const validatePassword = () => {
    const password = passwordInput.value;

    requirements.length.valid = password.length >= 8;
    requirements.uppercase.valid = /[A-Z]/.test(password);
    requirements.number.valid = /\d/.test(password);
    requirements.special.valid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    updatePasswordUI();

    const allRequirementsMet = Object.values(requirements).every(
      (req) => req.valid
    );
    const passwordsMatch = password === confirmPasswordInput.value;

    // Enable register button only if all requirements are met and passwords match
    registerButton.disabled = !(allRequirementsMet && passwordsMatch);
  };

  // Attach password validation listeners
  passwordInput.addEventListener("input", validatePassword);
  confirmPasswordInput.addEventListener("input", validatePassword);

  /**
   * Handle navigation to the registration page.
   */
  registerLink.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Navigating to Register Page");
    document.getElementById("login-page").style.display = "none";
    document.getElementById("register-page").style.display = "block";
  });

  /**
   * Handle navigation back to the login page.
   */
  backToLoginLink.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Navigating back to Login Page");
    document.getElementById("register-page").style.display = "none";
    document.getElementById("login-page").style.display = "block";
  });

  /**
   * Handle registration form submission.
   */
  // Register Route
  router.post("/register", async (req, res) => {
    const { name, email, password, role, phoneNumber, schoolId } = req.body;

    console.log("Incoming registration data:", req.body);

    // Validate Required Fields
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Name, email, password, and role are required" });
    }

    // Validate Password Strength
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters, include one uppercase letter, one number, and one special character.",
      });
    }

    // Validate Role
    const allowedRoles = ["admin", "user", "teacher"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    try {
      const db = await connectToDatabase();
      console.log("[DEBUG] Connected to the database.");

      const sanitizedEmail = email.trim().toLowerCase();

      // Check if Email Already Exists
      const [existingUser] = await db.query(
        "SELECT * FROM Users WHERE Email = ?;",
        [sanitizedEmail]
      );
      if (existingUser.length > 0) {
        console.warn("[WARN] Email already registered:", sanitizedEmail);
        return res.status(400).json({ error: "Email is already registered" });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert New User
      const [result] = await db.query(
        "INSERT INTO Users (Name, Email, Password, Role, PhoneNumber, SchoolID) VALUES (?, ?, ?, ?, ?, ?);",
        [
          name,
          sanitizedEmail,
          hashedPassword,
          role,
          phoneNumber || null,
          schoolId || null,
        ]
      );

      console.log("[DEBUG] User successfully registered:", result.insertId);

      // Generate JWT Token
      const token = jwt.sign(
        { id: result.insertId, role, email: sanitizedEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Send Success Response
      res.status(201).json({
        message: "User registered successfully",
        userId: result.insertId,
        name,
        email: sanitizedEmail,
        role,
        token,
      });
    } catch (error) {
      console.error("[ERROR] Registration failed:", error.message || error);
      res.status(500).json({ error: "Server error during registration" });
    }
  });

  // Validate password requirements on load
  validatePassword();
});
